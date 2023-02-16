import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React, { useLayoutEffect } from "react";
import HeaderRight from "../components/HeaderRight";
import HeaderLeft from "../components/HeaderLeft";
import { Ionicons } from "@expo/vector-icons";
import { Avatar, ListItem } from "react-native-elements";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";

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
    unbanUser();
    deleteUnbanRequest();
  };

  const unbanUser = () => {
    updateDoc(doc(db, "users", route.params.data.id), {
      isBanned: false,
      unbanRequestSent: false,
    });
    navigation.navigate("Moderation");
  };

  const deleteUnbanRequest = () => {
    const requestRef = doc(db, "requests", route.params.id);

    deleteDoc(requestRef)
      .then(() => {
        navigation.navigate("Moderation");
      })
      .catch((err) => alert("Could not delete unban request!"));
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
        <View
          key={new Date(route.params.data.timestamp * 1000)}
          style={styles.sender}
        >
          <Avatar
            rounded
            size={30}
            style={styles.avatar}
            source={{ uri: route.params.data.photoUrl }}
          />
          {route.params.data.timestamp ? (
            <>
              <Text style={styles.senderName}>
                {route.params.data.displayName}
              </Text>
              <View>
                <Text style={styles.senderText}>
                  {route.params.data.request}
                </Text>
              </View>
              <Text style={styles.timestamp}>
                {new Date(route.params.data.timestamp?.seconds * 1000)
                  .getHours()
                  .toString()
                  .padStart(2, "0") +
                  ":" +
                  new Date(route.params.data.timestamp?.seconds * 1000)
                    .getMinutes()
                    .toString()
                    .padStart(2, "0")}
              </Text>
            </>
          ) : null}
        </View>
        <TouchableOpacity style={styles.btn} onPress={handUnbanRequest}>
          <Ionicons name="lock-open" size={17} color="#001e2b" />
          <Text style={{ color: "#001e2b" }}>Unban</Text>
        </TouchableOpacity>
      </View>
      {route.params.data.timestamp ? (
        <Text style={styles.date}>
          {new Date(route.params.data.timestamp.seconds * 1000)
            .toISOString()
            .substring(0, 10)}
        </Text>
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
  sender: {
    paddingBottom: 5,
    paddingTop: 10,
    paddingLeft: 10,
    paddingRight: 25,
    backgroundColor: "#164d64",
    alignSelf: "flex-start",
    borderRadius: 20,
    margin: 15,
    maxWidth: "80%",
    position: "relative",
  },
  senderName: {
    fontSize: 8,
    color: "#ffffff",
  },
  senderText: {
    color: "#ffffff",
    fontWeight: "500",
    marginBottom: 5,
    fontSize: 11,
    padding: 5,
  },
  avatar: {
    position: "absolute",
    bottom: -15,
    right: -5,
    height: 30,
    width: 30,
  },
  date: {
    color: "#ffffff",
    marginLeft: 20,
    margin: 20,
    marginTop: 0,
    fontSize: 10,
  },
  timestamp: {
    fontSize: 8,
    color: "#ffffff",
    paddingRight: 5,
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
