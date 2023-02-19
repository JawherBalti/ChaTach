import { Text, StyleSheet } from "react-native";
import React from "react";

const Day = ({ date }) => {
  return (
    <Text style={styles.date}>{new Date(date * 1000).toDateString()}</Text>
  );
};

export default Day;

const styles = StyleSheet.create({
  date: {
    color: "#ffffff",
    marginLeft: 20,
    margin: 20,
    marginTop: 0,
    fontSize: 10,
  },
});
