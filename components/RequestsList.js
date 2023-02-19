import { Text, StyleSheet } from "react-native";
import React from "react";
import { Avatar, ListItem } from "react-native-elements";

const RequestsList = ({ id, data, navigation }) => {
  return (
    <ListItem
      onPress={() =>
        navigation.navigate("UnbanRequest", {
          id: id,
          data: data,
        })
      }
      key={id}
      containerStyle={styles.requestsList}
      bottomDivider
    >
      <Avatar
        rounded
        source={{
          uri:
            data.photoUrl ||
            "https://icon-library.com/images/no-user-image-icon/no-user-image-icon-27.jpg",
        }}
      />
      <ListItem.Content>
        <ListItem.Title style={styles.requesterName}>
          {data.displayName}
        </ListItem.Title>
        <ListItem.Subtitle
          style={styles.request}
          ellipsizeMode="tail"
          numberOfLines={1}
        >
          {data.request}
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

export default RequestsList;

const styles = StyleSheet.create({
  requestsList: {
    backgroundColor: "#001E2B",
    padding: 10,
  },
  requesterName: {
    fontWeight: "800",
    color: "#ffffff",
  },
  request: {
    fontSize: 10,
    color: "#c7c7c7",
    width: "100%",
  },
  timestamp: {
    color: "#ffffff",
    fontSize: 10,
  },
});
