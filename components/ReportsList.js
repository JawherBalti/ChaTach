import { View, Text, StyleSheet } from "react-native";
import React from "react";
import { Avatar, ListItem } from "react-native-elements";

const ReportsList = ({ id, data }) => {
  return (
    <ListItem
      // onPress={() => enterChat(id, data.chatName)}
      key={id}
      containerStyle={styles.reportsList}
      bottomDivider
    >
      <Avatar
        rounded
        source={{
          uri:
            data.reporterAvatar ||
            "https://www.pngmart.com/files/22/User-Avatar-Profile-PNG-Isolated-Transparent-HD-Photo.png",
        }}
      />
      <ListItem.Content>
        <ListItem.Title style={styles.reporterName}>
          {data.reporter}
        </ListItem.Title>
        <ListItem.Subtitle
          style={styles.reportReason}
          ellipsizeMode="tail"
          numberOfLines={1}
        >
          reported {data.reporeted} for {data.reportReason}
        </ListItem.Subtitle>
      </ListItem.Content>
      <Text style={styles.timestamp}>
        {new Date(data.timestamp.seconds * 1000).toISOString().substring(0, 10)}
      </Text>
    </ListItem>
  );
};

export default ReportsList;

const styles = StyleSheet.create({
  reportsList: {
    backgroundColor: "#001E2B",
    padding: 10,
  },
  reporterName: {
    fontWeight: "800",
    color: "#ffffff",
  },
  reportReason: {
    fontSize: 10,
    color: "#c7c7c7",
    width: "100%",
  },
  timestamp: {
    color: "#ffffff",
    fontSize: 10,
  },
});
