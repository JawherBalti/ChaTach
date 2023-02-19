import { View, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";

const SendMessage = ({
  input,
  setInput,
  sendMessage,
  showEmojis,
  setShowEmojis,
  setImage,
  setImagePreview,
  pickImage,
  route,
}) => {
  return (
    <>
      <View style={styles.inputContainer}>
        <View style={styles.input}>
          <Ionicons name="chatbubbles-outline" size={20} color="#001e2b" />

          <TextInput
            style={styles.textInput}
            placeholder="Send a message..."
            value={input}
            onChangeText={(text) => setInput(text)}
            onSubmitEditing={() => sendMessage(input, setInput, route)}
          />
          <View style={styles.inputActions}>
            <TouchableOpacity onPress={() => setShowEmojis(!showEmojis)}>
              <Ionicons name="happy-outline" size={20} color="#001e2b" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => pickImage(setImage, setImagePreview, route)}
            >
              <Ionicons name="image-outline" size={20} color="#001e2b" />
            </TouchableOpacity>
          </View>
        </View>
        <TouchableOpacity
          activeOpacity={0.5}
          onPress={() => sendMessage(input, setInput, route)}
          style={styles.sendBtn}
        >
          <Ionicons name="send" size={25} color="#001e2b" />
        </TouchableOpacity>
      </View>
    </>
  );
};

export default SendMessage;

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    padding: 15,
  },
  inputActions: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    width: "30%",
  },
  input: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ececec",
    bottom: 0,
    height: 40,
    flex: 1,
    marginRight: 15,
    padding: 10,
    borderRadius: 10,
  },
  textInput: {
    color: "#001e2b",
    marginLeft: 5,
    width: "65%",
    fontSize: 12,
  },
  sendBtn: {
    backgroundColor: "#00ed64",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#fff",
    padding: 5,
  },
});
