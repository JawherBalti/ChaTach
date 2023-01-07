import { StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import { ListItem, Avatar } from "react-native-elements";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "../firebase";

const RoomsList = ({ id, data, enterChat }) => {
  const [chatMessages, setChatMessages] = useState([]);

  useEffect(() => {
    const unsub = onSnapshot(
      query(
        collection(db, "chats", id, "messages"),
        orderBy("timestamp", "desc")
      ),
      (snapshot) => {
        setChatMessages(snapshot.docs.map((doc) => doc.data()));
      }
    );
    return unsub;
  }, []);

  return (
    <ListItem
      onPress={() => enterChat(id, data.chatName)}
      key={id}
      containerStyle={styles.roomsList}
      bottomDivider
    >
      <Avatar
        rounded
        source={{
          uri:
            chatMessages[0]?.photoURL ||
            "https://www.pngmart.com/files/22/User-Avatar-Profile-PNG-Isolated-Transparent-HD-Photo.png",
        }}
      />
      <ListItem.Content>
        <ListItem.Title style={styles.roomName}>{data.chatName}</ListItem.Title>
        {chatMessages.length > 0 ? (
          <ListItem.Subtitle
            style={styles.lastMsg}
            ellipsizeMode="tail"
            numberOfLines={1}
          >
            {chatMessages?.[0]?.displayName} : {chatMessages?.[0]?.message}
          </ListItem.Subtitle>
        ) : (
          <ListItem.Subtitle style={styles.lastMsg}>
            No messages in this room
          </ListItem.Subtitle>
        )}
      </ListItem.Content>
    </ListItem>
  );
};

export default RoomsList;

const styles = StyleSheet.create({
  roomsList: { backgroundColor: "#001E2B", padding: 10 },
  roomName: { fontWeight: "800", color: "#ffffff" },
  lastMsg: { fontSize: 10, color: "#c7c7c7", width: "100%" },
});
