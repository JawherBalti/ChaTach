import { View, Text } from "react-native";
import React from "react";
import { StyleSheet } from "react-native";
import { Dimensions } from "react-native";
import { TouchableOpacity } from "react-native";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { arrayRemove, arrayUnion, doc, updateDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import { ListItem } from "react-native-elements";
import { useEffect } from "react";

const BlockModal = ({ user, changeModalState, navigation }) => {
  const [blockedBy, setBlockedBy] = useState([]);

  useEffect(() => {
    setBlockedBy(user.blockedBy);
  }, []);

  const handleBlock = () => {
    updateDoc(doc(db, "users", user.id), {
      blockedBy: arrayUnion(auth.currentUser.email),
    });
    changeModalState(false);
    navigation.navigate("Home");
  };

  const handleUnblock = () => {
    updateDoc(doc(db, "users", user.id), {
      blockedBy: arrayRemove(auth.currentUser.email),
    });
    changeModalState(false);
    navigation.navigate("Home");
  };

  return (
    <View style={styles.modal}>
      <View style={styles.modalContainer}>
        {user.blockedBy.includes(auth.currentUser.email) ? (
          <ListItem.Subtitle
            style={styles.modalTitle}
            ellipsizeMode="tail"
            numberOfLines={2}
          >
            You are unblocking {user.displayName}.
          </ListItem.Subtitle>
        ) : (
          <ListItem.Subtitle
            style={styles.modalTitle}
            ellipsizeMode="tail"
            numberOfLines={2}
          >
            You are blocking {user.displayName}.
          </ListItem.Subtitle>
        )}

        {user.blockedBy.includes(auth.currentUser.email) ? (
          <Text style={styles.modalHeader}>
            If you unblock a user, you will start recieving messages from them!
          </Text>
        ) : (
          <Text style={styles.modalHeader}>
            If you block a user, you will not recieve messages from them!
          </Text>
        )}

        <View style={styles.btns}>
          <TouchableOpacity
            style={styles.cancelBtn}
            onPress={() => changeModalState(false)}
          >
            <Ionicons name="close-circle" size={18} color="#001e2b" />
            <Text>Cancel</Text>
          </TouchableOpacity>
          {user.blockedBy.includes(auth.currentUser.email) ? (
            <TouchableOpacity style={styles.submitBtn} onPress={handleUnblock}>
              <Ionicons name="remove-circle" size={15} color="#001e2b" />
              <Text>Unblock</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.submitBtn} onPress={handleBlock}>
              <Ionicons name="remove-circle" size={15} color="#001e2b" />
              <Text>Block</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

export default BlockModal;

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
