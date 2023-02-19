import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useLayoutEffect, useState, useEffect } from "react";
import { Avatar, ListItem } from "react-native-elements";
import { auth } from "../firebase";
import { Ionicons } from "@expo/vector-icons";
import { getPrivateMessages, getUserAdmin, manageUser } from "../utils";
import { useRoute } from "@react-navigation/native";
import LastMessage from "./LastMessage";

const UsersList = ({ id, data, enterPrivateChat, navigation }) => {
  const [messages, setMessages] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const route = useRoute();

  useEffect(() => {
    if (auth?.currentUser) {
      getUserAdmin(setIsAdmin);
      getPrivateMessages(setIsLoading, setMessages, route, data);
    }
  }, []);

  return (
    <ListItem
      onPress={() => enterPrivateChat(id, data, navigation)}
      key={id}
      containerStyle={styles.usersList}
      bottomDivider
    >
      <View style={styles.avatar}>
        <Avatar
          rounded
          source={{
            uri: data.photoURL,
          }}
        />
        <View
          style={[
            styles.status,
            {
              backgroundColor: data.online ? "#00ed64" : "#dc3545",
            },
          ]}
        ></View>
      </View>
      <LastMessage messages={messages} data={data} />

      {messages.length > 0 &&
      messages?.[0]?.data.senderEmail !== auth?.currentUser?.email &&
      !messages?.[0]?.data.isRead ? (
        <Text style={styles.msgNotification}>New</Text>
      ) : null}
      {isAdmin && (
        <TouchableOpacity
          style={[
            styles.btn,
            {
              backgroundColor: "#00ed64",
            },
          ]}
          onPress={() => manageUser(id, data, navigation)}
        >
          <Ionicons name="settings" size={17} color="#001e2b" />

          <Text style={styles.btnText}>Manage</Text>
        </TouchableOpacity>
      )}
    </ListItem>
  );
};

export default UsersList;

const styles = StyleSheet.create({
  avatar: {
    position: "relative",
  },
  status: {
    position: "absolute",
    height: 10,
    width: 10,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: "#ffffff",
    top: "60%",
    left: "65%",
  },
  msgNotification: {
    color: "#ffffff",
    borderRadius: 8,
    backgroundColor: "#dc3545",
    padding: 3,
    fontSize: 10,
    borderWidth: 1,
    borderColor: "#ffffff",
  },
  btn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    borderWidth: 1,
    borderColor: "#ffffff",
    padding: 8,
    borderRadius: 5,
    width: "30%",
    textAlign: "center",
  },
  btnText: {
    color: "#001e2b",
  },
  usersList: {
    backgroundColor: "#001E2B",
    padding: 10,
  },
});
