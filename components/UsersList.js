import { StyleSheet, View } from "react-native";
import React, { useLayoutEffect, useState } from "react";
import { Avatar, ListItem } from "react-native-elements";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { auth, db } from "../firebase";

const UsersList = ({ id, data, enterPrivateChat }) => {
  const [chatMessages, setChatMessages] = useState([]);

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

  usersList: { backgroundColor: "#001E2B", padding: 10 },
  userName: { fontWeight: "800", color: "#ffffff" },
  lastMsg: { fontSize: 10, color: "#c7c7c7", width: "100%" },
});
