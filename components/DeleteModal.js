import { View, Text } from "react-native";
import React from "react";
import { StyleSheet } from "react-native";
import { Dimensions } from "react-native";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase";
import { ListItem } from "react-native-elements";

const DeleteModal = ({ room, changeModalState, navigation }) => {
  const handleRemoveRoom = () => {
    const roomRef = doc(db, "publicMessages", room.id);

    deleteDoc(roomRef)
      .then(() => {
        navigation.navigate("Home");
      })
      .catch((err) => alert("Could not delete room!"));
  };

  return (
    <View style={styles.modal}>
      <View style={styles.modalContainer}>
        <ListItem.Subtitle
          style={styles.modalTitle}
          ellipsizeMode="tail"
          numberOfLines={2}
        >
          Delete the room {room.chatName}?
        </ListItem.Subtitle>
        <Text style={styles.modalHeader}>
          The room and all it's messages will be deleted permanantly!
        </Text>
        <View style={styles.btns}>
          <TouchableOpacity
            style={styles.cancelBtn}
            onPress={() => changeModalState(false)}
          >
            <Ionicons name="close-circle" size={15} color="#001e2b" />
            <Text>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.submitBtn} onPress={handleRemoveRoom}>
            <Ionicons name="remove-circle" size={15} color="#001e2b" />
            <Text>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default DeleteModal;

const styles = StyleSheet.create({
  modal: {
    position: "absolute",
    alignItems: "center",
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
    backgroundColor: "#4343434a",
    color: "#ffffff",
    zIndex: 99,
  },
  modalContainer: {
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#001e2b",
    width: (Dimensions.get("window").width * 7) / 8,
    height: (Dimensions.get("window").height * 1) / 2,
    marginTop: 70,
    padding: 15,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#ffffff",
  },
  modalTitle: {
    color: "#ffffff",
    fontSize: 25,
    marginBottom: 25,
    textAlign: "center",
  },
  modalHeader: {
    color: "#ffffff",
    fontSize: 20,
    marginBottom: 25,
    textAlign: "center",
  },
  radioBtns: {
    justifyContent: "flex-start",
    flex: 1,
  },
  radioBtn: {
    flexDirection: "row",
    alignItems: "center",
  },
  radioText: {
    color: "#ffffff",
    fontSize: 15,
  },
  btns: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  submitBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    backgroundColor: "#00ed64",
    color: "#001e2b",
    width: 95,
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#ffffff",
  },
  cancelBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    backgroundColor: "#ffffff",
    color: "#001e2b",
    width: 85,
    padding: 10,
    borderRadius: 5,
  },
});
