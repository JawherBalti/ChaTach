import { View, StyleSheet } from "react-native";
import React from "react";
import EmojiSelector, { Categories } from "react-native-emoji-selector";

const Emojis = ({ setInput }) => {
  return (
    <View style={styles.container}>
      <EmojiSelector
        onEmojiSelected={(emoji) => setInput((prev) => prev + emoji)}
        category={Categories.emotion}
        showTabs={false}
        showSectionTitles={false}
        showSearchBar={false}
      />
    </View>
  );
};

export default Emojis;

const styles = StyleSheet.create({
  container: {
    padding: 30,
    width: "100%",
    height: "60%",
    backgroundColor: "#ececec",
    borderRadius: 20,
  },
});
