import {
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { RadioButton } from "react-native-paper";
import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { sendReport } from "../utils";

const ReportModal = ({ user, changeModalState }) => {
  const [selectedValue, setSelectedValue] = useState("Bullying or Harrassment");

  return (
    <View style={styles.modal}>
      <View style={styles.modalContainer}>
        <Text style={styles.modalTitle}>
          You are reporting {user.displayName}.
        </Text>
        <Text style={styles.modalHeader}>
          Why are you submitting this report?
        </Text>
        <View style={styles.radioBtns}>
          <View style={styles.radioBtn}>
            <RadioButton
              color="#00ed64"
              value="Bullying or Harrassment"
              status={
                selectedValue === "Bullying or Harrassment"
                  ? "checked"
                  : "unchecked"
              }
              onPress={() => setSelectedValue("Bullying or Harrassment")}
            />
            <Text style={styles.radioText}>Bullying or Harrassment</Text>
          </View>
          <View style={styles.radioBtn}>
            <RadioButton
              color="#00ed64"
              value="Hateful Conduct"
              status={
                selectedValue === "Hateful Conduct" ? "checked" : "unchecked"
              }
              onPress={() => setSelectedValue("Hateful Conduct")}
            />
            <Text style={styles.radioText}>Hateful Conduct</Text>
          </View>
          <View style={styles.radioBtn}>
            <RadioButton
              color="#00ed64"
              value="Sexually Explicit"
              status={
                selectedValue === "Sexually Explicit" ? "checked" : "unchecked"
              }
              onPress={() => setSelectedValue("Sexually Explicit")}
            />
            <Text style={styles.radioText}>Sexually Explicit</Text>
          </View>
          <View style={styles.radioBtn}>
            <RadioButton
              color="#00ed64"
              value="Spam, Scams or Bots"
              status={
                selectedValue === "Spam, Scams or Bots"
                  ? "checked"
                  : "unchecked"
              }
              onPress={() => setSelectedValue("Spam, Scams or Bots")}
            />
            <Text style={styles.radioText}>Spam, Scams or Bots</Text>
          </View>
          <View style={styles.radioBtn}>
            <RadioButton
              color="#00ed64"
              value="Racism"
              status={selectedValue === "Racism" ? "checked" : "unchecked"}
              onPress={() => setSelectedValue("Racism")}
            />
            <Text style={styles.radioText}>Racism</Text>
          </View>
        </View>
        <View style={styles.btns}>
          <TouchableOpacity
            style={styles.cancelBtn}
            onPress={() => changeModalState(false)}
          >
            <Ionicons name="close-circle" size={18} color="#001e2b" />
            <Text>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.submitBtn}
            onPress={() => sendReport(user, selectedValue, changeModalState)}
          >
            <Ionicons name="send" size={15} color="#001e2b" />
            <Text>Submit</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default ReportModal;

const styles = StyleSheet.create({
  modal: {
    position: "absolute",
    display: "flex",
    alignItems: "center",
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
    backgroundColor: "#4343434a",
    color: "#ffffff",
    zIndex: 99,
  },
  modalContainer: {
    display: "flex",
    alignItems: "center",
    backgroundColor: "#001e2b",
    width: (Dimensions.get("window").width * 7) / 8,
    height: (Dimensions.get("window").height * 4) / 5,
    marginTop: 10,
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
