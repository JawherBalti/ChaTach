import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { StatusBar } from "expo-status-bar";
import { auth } from "../firebase";

const HeaderLeft = ({ navigation }) => {
  return (
    <View style={styles.headerLeft}>
      <StatusBar style="dark" />
      {auth?.currentUser ? (
        <TouchableOpacity onPress={() => navigation.navigate("Home")}>
          <Text style={styles.text}>ChaTach</Text>
        </TouchableOpacity>
      ) : (
        <Text style={styles.text}>ChaTach</Text>
      )}
    </View>
  );
};

export default HeaderLeft;

const styles = StyleSheet.create({
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  text: {
    color: "#001e2b",
  },
});
