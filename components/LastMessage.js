import { View, Image, StyleSheet } from "react-native";
import React from "react";
import { ListItem } from "react-native-elements";

const LastMessage = ({ messages, data }) => {
  return (
    <ListItem.Content>
      <ListItem.Title style={styles.roomName}>
        {data?.chatName ? data.chatName : data.displayName}
      </ListItem.Title>
      {messages?.length > 0 ? (
        messages?.[0].data?.message?.slice(-4) === ".png" ? (
          <View style={styles.lastMsgContainer}>
            <ListItem.Subtitle
              style={styles.lastMsg}
              ellipsizeMode="tail"
              numberOfLines={1}
            >
              {messages?.[0]?.data && messages?.[0]?.data?.displayName} :
            </ListItem.Subtitle>
            <Image
              source={{
                uri: messages?.[0]?.data?.message,
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
            {messages?.[0]?.data?.displayName}: {messages?.[0]?.data?.message}
          </ListItem.Subtitle>
        )
      ) : (
        <ListItem.Subtitle style={styles.lastMsg}>
          No messages
        </ListItem.Subtitle>
      )}
    </ListItem.Content>
  );
};

export default LastMessage;

const styles = StyleSheet.create({
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
});
