import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useLayoutEffect, useState, useEffect } from "react";
import { Avatar, ListItem } from "react-native-elements";
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";
import { auth, db } from "../firebase";
import { Ionicons } from "@expo/vector-icons";

const UsersList = ({ id, data, enterPrivateChat, allUsers }) => {
  const [chatMessages, setChatMessages] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isBanned, setIsBanned] = useState(data.isBanned);

  useLayoutEffect(() => {
    const unsub = onSnapshot(
      query(collection(db, "privateMessages"), orderBy("timestamp", "desc")),
      (snapshot) => {
        setChatMessages(
          snapshot.docs
            .map((doc) => ({
              id: doc.id,
              data: doc.data(),
            }))
            .filter(
              (message) =>
                (message.data.senderEmail === auth.currentUser.email &&
                  message.data.recieverEmail === data.email) ||
                (message.data.senderEmail === data.email &&
                  message.data.recieverEmail === auth.currentUser.email)
            )
        );
      }
    );
    return unsub;
  }, []);

  useEffect(() => {
    getUserAdmin();
  }, []);

  const getUserAdmin = async () => {
    const userRef = doc(db, "users", auth.currentUser.uid);
    const userSnap = await getDoc(userRef);
    setIsAdmin(userSnap.data().isAdmin);
  };

  const banUser = () => {
    updateDoc(doc(db, "users", data.id), {
      isBanned: true,
    });
    setIsBanned(true);
  };
  const unbanUser = () => {
    updateDoc(doc(db, "users", data.id), {
      isBanned: false,
    });
    setIsBanned(false);
  };

  return (
    <ListItem
      onPress={() => enterPrivateChat(id, data)}
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
      <ListItem.Content>
        <ListItem.Title style={styles.userName}>
          {data.displayName}
        </ListItem.Title>
        {chatMessages.length > 0 ? (
          <ListItem.Subtitle
            style={styles.lastMsg}
            ellipsizeMode="tail"
            numberOfLines={1}
          >
            {chatMessages?.[0]?.data.displayName} :{" "}
            {chatMessages?.[0]?.data.message}
          </ListItem.Subtitle>
        ) : (
          <ListItem.Subtitle style={styles.lastMsg}>
            No messages with this user
          </ListItem.Subtitle>
        )}
      </ListItem.Content>
      {chatMessages.length > 0 &&
      chatMessages?.[0]?.data.senderEmail !== auth.currentUser.email &&
      !chatMessages?.[0]?.data.isRead ? (
        <Text style={styles.msgNotification}>New</Text>
      ) : null}
      {isAdmin ? (
        !isBanned ? (
          <TouchableOpacity
            style={[
              styles.btn,
              {
                backgroundColor: "#00ed64",
              },
            ]}
            onPress={banUser}
          >
            <Ionicons name="lock-closed" size={17} color="#001e2b" />

            <Text style={styles.btnText}>Ban</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[
              styles.btn,
              {
                backgroundColor: "#00ed64",
              },
            ]}
            onPress={unbanUser}
          >
            <Ionicons name="lock-open" size={17} color="#001e2b" />

            <Text style={styles.btnText}>Unban</Text>
          </TouchableOpacity>
        )
      ) : null}
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
    width: 75,
    textAlign: "center",
  },
  btnText: {
    color: "#001e2b",
  },

  usersList: { backgroundColor: "#001E2B", padding: 10 },
  userName: { fontWeight: "800", color: "#ffffff" },
  lastMsg: { fontSize: 10, color: "#c7c7c7", width: "100%" },
});
