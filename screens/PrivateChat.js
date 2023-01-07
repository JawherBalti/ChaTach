import {
  Keyboard,
  TextInput,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  FlatList,
} from "react-native";
import React, { useLayoutEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { Avatar } from "react-native-elements";
import { db, auth } from "../firebase";
import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import HeaderRight from "../components/HeaderRight";
import HeaderLeft from "../components/HeaderLeft";
import { color } from "react-native-elements/dist/helpers";

const PrivateChat = ({ navigation, route }) => {
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
      query(collection(db, "privateMessages"), orderBy("timestamp", "desc")),
      (snapshot) => {
        setMessages(
          snapshot.docs
            .map((doc) => ({
              id: doc.id,
              data: doc.data(),
            }))
            .filter(
              (message) =>
                (message.data.senderEmail === auth.currentUser.email &&
                  message.data.recieverEmail === route.params.data.email) ||
                (message.data.senderEmail === route.params.data.email &&
                  message.data.recieverEmail === auth.currentUser.email)
            )
        );
      }
    );
    return unsub;
  }, []);

  const sendMessage = async () => {
    Keyboard.dismiss();

    addDoc(collection(db, "privateMessages"), {
      timestamp: serverTimestamp(),
      message: input,
      displayName: auth.currentUser.displayName,
      photoURL: auth.currentUser.photoURL,
      senderEmail: auth.currentUser.email,
      recieverEmail: route.params.data.email,
    });

    setInput("");
  };

  return (
    <View style={styles.container}>
      <View style={styles.chatHeader}>
        <Text style={styles.headerText}>
          You are chatting with {route.params.data.displayName}
        </Text>
      </View>

      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <>
          <FlatList
            data={messages}
            keyExtractor={(item) => item.data.timestamp}
            renderItem={(data) =>
              data.item.data.senderEmail === auth.currentUser.email ? (
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
                      {new Date(data.item.data.timestamp.seconds * 1000)
                        .getHours()
                        .toString()
                        .padStart(2, "0") +
                        ":" +
                        new Date(data.item.data.timestamp.seconds * 1000)
                          .getMinutes()
                          .toString()
                          .padStart(2, "0")}
                    </Text>
                  ) : null}
                </>
              ) : (
                <View key={data.item.data.id} style={styles.recieverContainer}>
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

export default PrivateChat;

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
    margin: 15,
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
