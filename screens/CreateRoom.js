import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useLayoutEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import HeaderLeft from "../components/HeaderLeft";
import HeaderRight from "../components/HeaderRight";
import Spinner from "react-native-loading-spinner-overlay";
import { createRoom } from "../utils";

const CreateRoom = ({ navigation }) => {
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "",
      headerStyle: { backgroundColor: "#fff" },
      headerTitleStyle: { color: "#000" },
      headerTintColor: "#000",
      headerRight: () => <HeaderRight navigation={navigation} />,
      headerLeft: () => <HeaderLeft navigation={navigation} />,
    });
  }, [navigation]);

  return (
    <View style={styles.container}>
      {isLoading && <Spinner visible={isLoading} color="#ffffff" />}
      <Text style={styles.text}>Create a new Room</Text>
      <View style={styles.input}>
        <Ionicons name="ios-create" size={20} color="#001e2b" />

        <TextInput
          style={styles.textInput}
          placeholderTextColor="grey"
          placeholder="Enter a room name"
          value={input}
          onChangeText={(text) => setInput(text)}
          onSubmitEditing={() => createRoom(setIsLoading, input, navigation)}
        />
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() => createRoom(setIsLoading, input, navigation)}
      >
        <Ionicons name="md-add-circle" size={20} color="#001e2b" />

        <Text style={styles.btnText}>Create a new Room</Text>
      </TouchableOpacity>
    </View>
  );
};

export default CreateRoom;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: "#001e2b",
    flex: 1,
  },
  text: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 25,
    marginBottom: 50,
    marginTop: 80,
  },
  input: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
    width: "80%",
  },
  textInput: {
    color: "#001E2B",
    marginLeft: 10,
    width: "90%",
    fontSize: 15,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#00ed64",
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#ffffff",
    width: "80%",
  },
  btnText: {
    color: "#001e2b",
    marginLeft: 5,
  },
});
