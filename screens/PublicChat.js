import {
  Keyboard,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import React, { useLayoutEffect, useState } from "react";
import { Avatar } from "react-native-elements";
import { Ionicons } from "@expo/vector-icons";
import { db, auth } from "../firebase";
import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import HeaderRight from "../components/HeaderRight";
import HeaderLeft from "../components/HeaderLeft";

const PublicChat = ({ navigation, route }) => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "",
      headerStyle: { backgroundColor: "#fff" },
      headerRight: () => <HeaderRight navigation={navigation} />,
      headerLeft: () => <HeaderLeft navigation={navigation} />,
    });
  }, [navigation]);

  useLayoutEffect(() => {
    const unsub = onSnapshot(
      query(
        collection(db, "chats", route.params.id, "messages"),
        orderBy("timestamp", "desc")
      ),
      (snapshot) => {
        setMessages(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            data: doc.data(),
          }))
        );
      }
    );
    return unsub;
  }, []);

  const sendMessage = async () => {
    Keyboard.dismiss();

    addDoc(collection(doc(db, "chats", route.params.id), "messages"), {
      timestamp: serverTimestamp(),
      message: input,
      displayName: auth.currentUser.displayName,
      email: auth.currentUser.email,
      photoURL: auth.currentUser.photoURL,
    });
    setInput("");
  };

  return (
    <View style={styles.container}>
      <View style={styles.chatHeader}>
        <Text style={styles.headerText}>
          welcome to {route.params.chatName}
        </Text>
      </View>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <>
          <FlatList
            data={messages}
            keyExtractor={(item) => item.data.timestamp}
            renderItem={(data) =>
              data.item.data.email === auth.currentUser.email ? (
                <>
                  <View key={data.item.data.timestamp} style={styles.sender}>
                    <Avatar
                      rounded
                      size={30}
                      style={styles.avatar}
                      source={{ uri: data.item.data.photoURL }}
                    />
                    <Text style={styles.senderText}>
                      {data.item.data.message}
                    </Text>
                  </View>
                  {data.item.data.timestamp ? (
                    <Text style={styles.timestamp}>
                      {new Date(data.item?.data?.timestamp.seconds * 1000)
                        .toISOString()
                        .substring(0, 10) + "  "}
                      {new Date(data.item?.data?.timestamp?.seconds * 1000)
                        .getHours()
                        .toString()
                        .padStart(2, "0") +
                        ":" +
                        new Date(data.item?.data?.timestamp?.seconds * 1000)
                          .getMinutes()
                          .toString()
                          .padStart(2, "0")}
                    </Text>
                  ) : null}
                </>
              ) : (
                <View key={data.item.data.id} style={styles.recieverContainer}>
                  <Text style={styles.recieverName}>
                    {data.item.data.displayName}
                  </Text>
                  <View style={styles.reciever}>
                    <Avatar
                      rounded
                      size={30}
                      style={styles.avatar}
                      source={{ uri: data.item.data.photoURL }}
                    />
                    <Text style={styles.recieverText}>
                      {data.item.data.message}
                    </Text>
                  </View>
                  {data.item.data.timestamp ? (
                    <Text style={styles.timestamp}>
                      {new Date(data.item?.data?.timestamp.seconds * 1000)
                        .toISOString()
                        .substring(0, 10) + "  "}
                      {new Date(data.item?.data?.timestamp?.seconds * 1000)
                        .getHours()
                        .toString()
                        .padStart(2, "0") +
                        ":" +
                        new Date(data.item?.data?.timestamp?.seconds * 1000)
                          .getMinutes()
                          .toString()
                          .padStart(2, "0")}
                    </Text>
                  ) : null}
                </View>
              )
            }
          />
          <View style={styles.inputContainer}>
            <View style={styles.input}>
              <Ionicons name="chatbubbles-outline" size={20} color="#001e2b" />

              <TextInput
                value={input}
                onChangeText={(text) => setInput(text)}
                onSubmitEditing={sendMessage}
                style={styles.textInput}
                placeholder="Send a message..."
              />
            </View>

            <TouchableOpacity
              activeOpacity={0.5}
              onPress={sendMessage}
              style={styles.sendBtn}
            >
              <Ionicons name="send" size={25} color="#001e2b" />
            </TouchableOpacity>
          </View>
        </>
      </TouchableWithoutFeedback>
    </View>
  );
};

export default PublicChat;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#001E2B",
  },
  chatHeader: {
    justifyContent: "center",
    backgroundColor: "#ffffff",
    height: "10%",
    padding: 15,
  },
  headerText: {
    color: "#001e2b",
  },
  recieverContainer: {
    alignSelf: "flex-end",
    alignItems: "flex-end",
  },
  reciever: {
    padding: 15,
    backgroundColor: "#ececec",
    borderRadius: 20,
    marginRight: 15,
    marginBottom: 20,
    maxWidth: "80%",
    position: "relative",
  },
  sender: {
    padding: 15,
    backgroundColor: "#164d64",
    alignSelf: "flex-start",
    borderRadius: 20,
    margin: 15,
    maxWidth: "80%",
    position: "relative",
  },
  senderText: {
    color: "white",
    fontWeight: "500",
  },
  recieverText: {
    color: "black",
    fontWeight: "500",
  },
  recieverName: {
    fontSize: 10,
    color: "#fff",
    marginRight: 20,
    marginBottom: 10,
    marginTop: 10,
  },
  avatar: {
    position: "absolute",
    bottom: -15,
    right: -5,
    height: 30,
    width: 30,
  },
  timestamp: {
    color: "#fff",
    marginLeft: 20,
    margin: 20,
    marginTop: 0,
    fontSize: 10,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    padding: 15,
  },
  input: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ececec",
    bottom: 0,
    height: 40,
    flex: 1,
    marginRight: 15,
    padding: 10,
    borderRadius: 10,
  },
  textInput: {
    color: "#001e2b",
    marginLeft: 5,
    width: "90%",
    fontSize: 12,
  },
  sendBtn: {
    backgroundColor: "#00ed64",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#fff",
    padding: 5,
  },
});
