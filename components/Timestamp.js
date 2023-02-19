import { StyleSheet, Text } from "react-native";
import React from "react";

const Timestamp = ({ timestamp, color }) => {
  return (
    <Text style={[styles.timestamp, { color: color }]}>
      {new Date(timestamp * 1000).getHours().toString().padStart(2, "0") +
        ":" +
        new Date(timestamp * 1000).getMinutes().toString().padStart(2, "0")}
    </Text>
  );
};

export default Timestamp;

const styles = StyleSheet.create({
  timestamp: {
    fontSize: 8,
  },
});
