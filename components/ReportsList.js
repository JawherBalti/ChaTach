import { Text, StyleSheet } from "react-native";
import React from "react";
import { Avatar, ListItem } from "react-native-elements";

const ReportsList = ({ id, data, navigation }) => {
  return (
    <ListItem
      onPress={() =>
        navigation.navigate("Report", {
          id: id,
          data: data,
        })
      }
      key={id}
      containerStyle={styles.reportsList}
      bottomDivider
    >
      <Avatar
        rounded
        source={{
          uri:
            data?.reporterAvatar ||
            "https://icon-library.com/images/no-user-image-icon/no-user-image-icon-27.jpg",
        }}
      />
      <ListItem.Content>
        <ListItem.Title style={styles.reporterName}>
          {data?.reporter}
        </ListItem.Title>
        <ListItem.Subtitle
          style={styles.reportReason}
          ellipsizeMode="tail"
          numberOfLines={1}
        >
          reported {data?.reported} for {data?.reportReason}
        </ListItem.Subtitle>
      </ListItem.Content>
      {data?.timestamp && (
        <Text style={styles.timestamp}>
          {new Date(data?.timestamp?.seconds * 1000)
            .toISOString()
            .substring(0, 10)}
        </Text>
      )}
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
