import { View, Text, StyleSheet, TextInput } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";

const Input = ({
  label,
  icon,
  size,
  value,
  setValue,
  placeholder,
  isSecure,
  type,
  onSubmit,
}) => {
  return (
    <View>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.input}>
        <Ionicons name={icon} size={size} color="#001e2b" />
        <TextInput
          value={value}
          onChangeText={(text) => setValue(text)}
          placeholder={placeholder}
          secureTextEntry={isSecure}
          type={type}
          placeholderTextColor="grey"
          onSubmitEditing={onSubmit}
          style={styles.textInput}
        />
      </View>
    </View>
  );
};

export default Input;

const styles = StyleSheet.create({
  label: {
    color: "#ffffff",
    fontSize: 12,
  },

  input: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },

  textInput: {
    color: "#001e2b",
    marginLeft: 5,
    width: "90%",
    fontSize: 12,
  },
});
