import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { Avatar } from "react-native-elements";
import Day from "./Day";
import Timestamp from "./Timestamp";

const Reciever = ({ recieverData, route }) => {
  return (
    <View key={recieverData.id} style={styles.recieverContainer}>
      <View
        style={[
          styles.reciever,
          route?.name === "PublicChat"
            ? {
                paddingBottom: 10,
                paddingRight: 10,
                paddingLeft: 10,
              }
            : { padding: 10 },
        ]}
      >
        {route?.name === "PublicChat" && (
          <Text style={styles.recieverName}>{recieverData.displayName}</Text>
        )}
        <Avatar
          rounded
          size={30}
          style={styles.avatar}
          source={{ uri: recieverData.photoURL }}
        />
        {recieverData.message.slice(-4) === ".png" ? (
          <Image
            style={styles.imageMsg}
            source={{
              uri: recieverData.message,
            }}
          />
        ) : (
          <Text style={styles.recieverText}>{recieverData.message}</Text>
        )}
        {recieverData.timestamp ? (
          <Timestamp
            timestamp={recieverData.timestamp?.seconds}
            color="#001e2b"
          />
        ) : null}
      </View>
      {recieverData.timestamp ? (
        <Day date={recieverData.timestamp?.seconds} />
      ) : null}
    </View>
  );
};

export default Reciever;

const styles = StyleSheet.create({
  recieverContainer: {
    alignSelf: "flex-end",
    alignItems: "flex-end",
  },
  reciever: {
    backgroundColor: "#ececec",
    borderRadius: 20,
    marginRight: 15,
    marginBottom: 20,
    marginTop: 10,
    maxWidth: "80%",
    position: "relative",
  },
  avatar: {
    position: "absolute",
    bottom: -15,
    right: -5,
    height: 30,
    width: 30,
  },
  imageMsg: {
    width: 200,
    height: 150,
    borderRadius: 15,
    margin: 5,
  },
  recieverText: {
    color: "#001e2b",
    fontWeight: "500",
  },
  recieverName: {
    fontSize: 8,
    color: "#001e2b",
    paddingTop: 5,
    paddingRight: 15,
  },
});
