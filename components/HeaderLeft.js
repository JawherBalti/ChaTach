import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { StatusBar } from "expo-status-bar";
import { auth } from "../firebase";

const HeaderLeft = ({ navigation }) => {
  return (
    <View style={styles.headerLeft}>
      <StatusBar style="dark" />
      {auth?.currentUser ? (
        <TouchableOpacity onPress={() => navigation.navigate("Home")}>
          <Image
            style={{
              width: 100,
              height: 30,
            }}
            source={require("../assets/logo.png")}
          />
        </TouchableOpacity>
      ) : (
        <Image
          style={{
            width: 100,
            height: 30,
          }}
          source={require("../assets/logo.png")}
        />
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
