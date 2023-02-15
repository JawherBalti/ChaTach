import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useLayoutEffect, useState } from "react";
import { db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";
import { Ionicons } from "@expo/vector-icons";
import HeaderLeft from "../components/HeaderLeft";
import HeaderRight from "../components/HeaderRight";
import Spinner from "react-native-loading-spinner-overlay";

const CreateRoom = ({ navigation }) => {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

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

  const createRoom = async () => {
    setLoading(false);
    if (input) {
      setLoading(true);
      try {
        const doc = await addDoc(collection(db, "publicMessages"), {
          chatName: input,
        });
        if (doc) {
          navigation.goBack();
        }
      } catch (err) {
        alert(err);
      }
    } else {
      setLoading(false);

      alert("Room name cannot be empty!");
    }
  };

  return (
    <View style={styles.container}>
      {loading && <Spinner visible={loading} color="#ffffff" />}
      <Text style={styles.text}>Create a new Room</Text>
      <View style={styles.input}>
        <Ionicons name="ios-create" size={20} color="#001e2b" />

        <TextInput
          style={styles.textInput}
          placeholderTextColor="grey"
          placeholder="Enter a room name"
          value={input}
          onChangeText={(text) => setInput(text)}
          onSubmitEditing={createRoom}
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={createRoom}>
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
