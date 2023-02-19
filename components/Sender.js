import { View, Text, StyleSheet, Image } from "react-native";
import React from "react";
import { Avatar } from "react-native-elements";
import Timestamp from "./Timestamp";

const Sender = ({ senderData }) => {
  return (
    <View key={senderData.timestamp} style={styles.sender}>
      <Avatar
        rounded
        size={30}
        style={styles.avatar}
        source={{ uri: senderData.photoURL || senderData.photoUrl }}
      />
      {senderData?.message?.slice(-4) === ".png" ? (
        <Image
          style={styles.imageMsg}
          source={{
            uri: senderData.message,
          }}
        />
      ) : (
        <Text style={styles.senderText}>
          {senderData.message || senderData.request}
        </Text>
      )}
      {senderData.timestamp ? (
        <Timestamp timestamp={senderData.timestamp?.seconds} color="#ffffff" />
      ) : null}
    </View>
  );
};

export default Sender;

const styles = StyleSheet.create({
  sender: {
    paddingBottom: 5,
    paddingTop: 10,
    paddingLeft: 10,
    paddingRight: 25,
    backgroundColor: "#164d64",
    alignSelf: "flex-start",
    borderRadius: 20,
    margin: 15,
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
  senderText: {
    color: "#ffffff",
    fontWeight: "500",
    marginBottom: 5,
  },
});
