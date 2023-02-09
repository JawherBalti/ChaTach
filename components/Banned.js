import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";

const Banned = () => {
  const sendRequest = () => {};

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        This account has been banned! You can send an unban request to our
        moderator.
      </Text>
      <Image
        style={{
          width: 250,
          height: 250,
        }}
        source={require("../assets/banned.gif")}
      />
      <TouchableOpacity style={styles.button} onPress={sendRequest}>
        <Ionicons name="warning" size={20} color="#001e2b" />
        <Text style={styles.btnText}>Unban request</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: Dimensions.get("window").height,
    alignItems: "center",
    backgroundColor: "#001E2B",
  },
  title: {
    textAlign: "center",
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 20,
    marginTop: 50,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "80%",
    padding: 10,
    backgroundColor: "#00ed64",
    borderColor: "#ffffff",
    borderWidth: 1,
    borderRadius: 5,
  },
  btnText: {
    marginLeft: 5,
  },
});

export default Banned;
