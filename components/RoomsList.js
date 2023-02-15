import { Image, StyleSheet, View } from "react-native";
import React, { useEffect, useState } from "react";
import { ListItem, Avatar } from "react-native-elements";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "../firebase";

const RoomsList = ({ id, data, enterChat }) => {
  const [chatMessages, setChatMessages] = useState([]);

  useEffect(() => {
    const unsub = onSnapshot(
      query(
        collection(db, "publicMessages", id, "messages"),
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
            "https://icon-library.com/images/no-user-image-icon/no-user-image-icon-27.jpg",
        }}
      />
      <ListItem.Content>
        <ListItem.Title style={styles.roomName}>{data.chatName}</ListItem.Title>
        {chatMessages.length > 0 ? (
          chatMessages?.[0].message.slice(-4) === ".png" ? (
            <View style={styles.lastMsgContainer}>
              <ListItem.Subtitle
                style={styles.lastMsg}
                ellipsizeMode="tail"
                numberOfLines={1}
              >
                {chatMessages?.[0]?.displayName} :{" "}
              </ListItem.Subtitle>
              <Image
                source={{
                  uri: chatMessages?.[0]?.message,
                }}
                style={styles.lastMsgPreview}
              />
            </View>
          ) : (
            <ListItem.Subtitle
              style={styles.lastMsg}
              ellipsizeMode="tail"
              numberOfLines={1}
            >
              {chatMessages?.[0]?.displayName} : {chatMessages?.[0]?.message}
            </ListItem.Subtitle>
          )
        ) : (
          <ListItem.Subtitle style={styles.lastMsg}>
            No messages in this room
          </ListItem.Subtitle>
        )}
      </ListItem.Content>
      {/* {chatMessages.length > 0 &&
      chatMessages?.[0]?.email !== auth.currentUser.email &&
      !chatMessages?.[0]?.isRead ? (
        <Text style={styles.msgNotification}>New</Text>
      ) : null} */}
    </ListItem>
  );
};

export default RoomsList;

const styles = StyleSheet.create({
  roomsList: {
    backgroundColor: "#001E2B",
    padding: 10,
  },
  roomName: {
    fontWeight: "800",
    color: "#ffffff",
  },
  lastMsgContainer: {
    flexDirection: "row",
    width: "25%",
  },
  lastMsgPreview: {
    width: 25,
    height: 15,
    borderRadius: 5,
  },
  lastMsg: {
    fontSize: 10,
    color: "#c7c7c7",
    width: "100%",
  },
  // msgNotification: {
  //   color: "#ffffff",
  //   borderRadius: 8,
  //   backgroundColor: "#dc3545",
  //   padding: 3,
  //   fontSize: 10,
  //   borderWidth: 1,
  //   borderColor: "#ffffff",
  // },
});
