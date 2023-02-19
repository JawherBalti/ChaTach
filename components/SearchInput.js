import { View, StyleSheet, TextInput } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";

const SearchInput = ({ searchedValue, setSearchedValue, placeholder }) => {
  return (
    <View style={styles.input}>
      <Ionicons name="md-search" size={20} color="#001e2b" />
      <TextInput
        value={searchedValue}
        onChangeText={(text) => setSearchedValue(text)}
        placeholder={placeholder}
        placeholderTextColor="grey"
        style={styles.textInput}
      />
    </View>
  );
};

export default SearchInput;

const styles = StyleSheet.create({
  input: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 5,
    padding: 10,
  },
  textInput: {
    color: "#001E2B",
    marginLeft: 10,
    width: "90%",
    fontSize: 15,
  },
});
