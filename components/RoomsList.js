import { StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import { ListItem, Avatar } from "react-native-elements";
import { getPublicMessages } from "../utils";
import LastMessage from "./LastMessage";

const RoomsList = ({ id, data, enterChat, navigation }) => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    getPublicMessages(setIsLoading, setMessages, id);
  }, []);

  return (
    <ListItem
      onPress={() => enterChat(id, data.chatName, navigation)}
      key={id}
      containerStyle={styles.roomsList}
      bottomDivider
    >
      <Avatar
        rounded
        source={{
          uri:
            messages[0]?.data?.photoURL ||
            "https://icon-library.com/images/no-user-image-icon/no-user-image-icon-27.jpg",
        }}
      />
      <LastMessage messages={messages} data={data} />
    </ListItem>
  );
};

export default RoomsList;

const styles = StyleSheet.create({
  roomsList: {
    backgroundColor: "#001E2B",
    padding: 10,
  },
});
