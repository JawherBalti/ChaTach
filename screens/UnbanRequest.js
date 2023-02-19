import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React, { useLayoutEffect } from "react";
import HeaderRight from "../components/HeaderRight";
import HeaderLeft from "../components/HeaderLeft";
import { Ionicons } from "@expo/vector-icons";
import { ListItem } from "react-native-elements";
import { deleteUnbanRequest, unbanUser } from "../utils";
import Day from "../components/Day";
import Sender from "../components/Sender";

const UnbanRequest = ({ navigation, route }) => {
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

  const handUnbanRequest = () => {
    unbanUser(navigation, route);
    deleteUnbanRequest(navigation, route);
  };

  return (
    <View style={styles.container}>
      <View style={styles.chatHeader}>
        <ListItem.Subtitle
          style={styles.headerText}
          ellipsizeMode="tail"
          numberOfLines={1}
        >
          Unban request by {route.params.data.displayName}
        </ListItem.Subtitle>
      </View>
      <View style={styles.unbanRequest}>
        <Sender senderData={route.params.data} />
        <TouchableOpacity style={styles.btn} onPress={handUnbanRequest}>
          <Ionicons name="lock-open" size={17} color="#001e2b" />
          <Text style={{ color: "#001e2b" }}>Unban</Text>
        </TouchableOpacity>
      </View>
      {route.params.data.timestamp ? (
        <Day date={route.params.data.timestamp.seconds} />
      ) : null}
    </View>
  );
};

export default UnbanRequest;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#001E2B",
    zIndex: 50,
  },
  chatHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#ffffff",
    height: "10%",
    padding: 10,
  },
  headerText: {
    color: "#001e2b",
    width: "70%",
  },
  unbanRequest: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "85%",
  },
  btn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    borderWidth: 1,
    borderColor: "#ffffff",
    padding: 8,
    borderRadius: 5,
    width: 80,
    height: 40,
    textAlign: "center",
    backgroundColor: "#00ed64",
  },
});
