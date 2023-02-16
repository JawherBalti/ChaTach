import {
  View,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";
import React, { useLayoutEffect } from "react";
import HeaderLeft from "../components/HeaderLeft";
import HeaderRight from "../components/HeaderRight";
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { db } from "../firebase";
import { ListItem, Avatar } from "react-native-elements";
import { useState } from "react";
import Spinner from "react-native-loading-spinner-overlay";
import { Ionicons } from "@expo/vector-icons";

const Report = ({ navigation, route }) => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "",
      headerStyle: { backgroundColor: "#fff" },
      headerTitleStyle: { color: "#000" },
      headerTintColor: "#000",
      headerRight: () => <HeaderRight navigation={navigation} />,
      headerLeft: () => <HeaderLeft navigation={navigation} />,
    });
  }, [navigation]);

  useLayoutEffect(() => {
    setIsLoading(true);
    const unsub = onSnapshot(
      query(collection(db, "privateMessages"), orderBy("timestamp", "desc")),
      (snapshot) => {
        const allMessages = snapshot.docs
          .map((doc) => ({
            data: doc.data(),
          }))
          .filter(
            (message) =>
              message.data.senderEmail === route.params.data.reportedEmail
          );

        setMessages(allMessages);
        setIsLoading(false);
      }
    );
    return unsub;
  }, []);

  const handleDeleteReport = () => {
    const reportRef = doc(db, "reports", route.params.id);
    deleteDoc(reportRef)
      .then(() => {
        navigation.navigate("Moderation");
      })
      .catch((err) => alert("Could not delete report!"));
  };

  return (
    <View style={styles.container}>
      {isLoading && <Spinner visible={isLoading} color="#ffffff" />}
      <View style={styles.chatHeader}>
        <ListItem.Subtitle
          style={styles.headerText}
          ellipsizeMode="tail"
          numberOfLines={1}
        >
          Messages sent by {route.params.data.reported}
        </ListItem.Subtitle>
        <TouchableOpacity onPress={handleDeleteReport}>
          <Ionicons name="remove-circle-outline" size={20} color="#001e2b" />
        </TouchableOpacity>
      </View>

      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <FlatList
          data={messages}
          keyExtractor={(item) => new Date(item?.data?.timestamp * 1000)}
          renderItem={(data) => (
            <>
              <View
                key={new Date(data?.item?.data?.timestamp * 1000)}
                style={styles.sender}
              >
                <Avatar
                  rounded
                  size={30}
                  style={styles.avatar}
                  source={{ uri: data.item.data.photoURL }}
                />
                {data.item.data.message.slice(-4) === ".png" ? (
                  <Image
                    style={styles.imageMsg}
                    source={{
                      uri: data.item.data.message,
                    }}
                  />
                ) : (
                  <Text style={styles.senderText}>
                    {data.item.data.message}
                  </Text>
                )}

                {data?.item?.data?.timestamp ? (
                  <Text
                    style={[
                      styles.timestamp,
                      { color: "#ffffff", paddingRight: 5 },
                    ]}
                  >
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
              {data.item.data.timestamp ? (
                <Text style={styles.date}>
                  {new Date(data.item?.data?.timestamp?.seconds * 1000)
                    .toISOString()
                    .substring(0, 10)}
                </Text>
              ) : null}
            </>
          )}
        />
      </TouchableWithoutFeedback>
      <Text style={styles.reportReason}>
        This user has been reported by {route.params.data.reporter} for{" "}
        {route.params.data.reportReason}
      </Text>
    </View>
  );
};

export default Report;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#001E2B",
    zIndex: 50,
  },
  chatHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#ffffff",
    height: "10%",
    padding: 10,
  },
  headerText: {
    color: "#001e2b",
    width: "70%",
  },
  sender: {
    paddingBottom: 5,
    paddingTop: 10,
    paddingLeft: 10,
    paddingRight: 25,
    backgroundColor: "#164d64",
    alignSelf: "flex-start",
    borderRadius: 20,
    margin: 15,
    maxWidth: "80%",
    position: "relative",
  },
  imageMsg: {
    width: 200,
    height: 150,
    borderRadius: 15,
    margin: 5,
  },
  senderText: {
    color: "white",
    fontWeight: "500",
    marginBottom: 5,
  },
  avatar: {
    position: "absolute",
    bottom: -15,
    right: -5,
    height: 30,
    width: 30,
  },
  date: {
    color: "#ffffff",
    marginLeft: 20,
    margin: 20,
    marginTop: 0,
    fontSize: 10,
  },
  timestamp: {
    fontSize: 8,
  },
  reportReason: {
    color: "#ffffff",
    textAlign: "center",
    padding: 10,
  },
});
