import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import { useLayoutEffect } from "react";
import HeaderRight from "../components/HeaderRight";
import HeaderLeft from "../components/HeaderLeft";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { Avatar } from "react-native-elements";
import { Ionicons } from "@expo/vector-icons";

const ManageUser = ({ route, navigation }) => {
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

  const setAdmin = () => {
    updateDoc(doc(db, "users", route.params.data.id), {
      isAdmin: true,
    });
    navigation.navigate("Home");
  };

  const setRegular = () => {
    updateDoc(doc(db, "users", route.params.data.id), {
      isAdmin: false,
    });
    navigation.navigate("Home");
  };

  const banUser = () => {
    updateDoc(doc(db, "users", route.params.data.id), {
      isBanned: true,
    });
    navigation.navigate("Home");
  };

  const unbanUser = () => {
    updateDoc(doc(db, "users", route.params.data.id), {
      isBanned: false,
      unbanRequestSent: false,
    });
    navigation.navigate("Home");
  };

  return (
    <View style={styles.container}>
      {console.log(route)}
      <Text style={styles.title}>Manage</Text>
      <Text style={styles.subTitle}>User Information:</Text>
      <View style={styles.userInfo}>
        <View style={styles.user}>
          <View style={styles.avatar}>
            <Avatar
              rounded
              source={{
                uri: route.params.data.photoURL,
              }}
            />
            <View
              style={[
                styles.status,
                {
                  backgroundColor: route.params.data.online
                    ? "#00ed64"
                    : "#dc3545",
                },
              ]}
            ></View>
          </View>
          <Text style={styles.text}>{route.params.data.displayName}</Text>
        </View>
        <Text style={styles.text}>
          Current Role: - {route.params.data.isAdmin ? "Admin" : "Regular"}
        </Text>

        <View style={styles.changeRole}>
          <Text style={styles.text}>Change Role:</Text>
          <TouchableOpacity
            style={[
              styles.btn,
              {
                backgroundColor: "#00ed64",
              },
            ]}
            onPress={route.params.data.isAdmin ? setRegular : setAdmin}
          >
            <Ionicons name="construct" size={15} color="#001e2b" />
            <Text>{route.params.data.isAdmin ? "Regular" : "Admin"}</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.subTitle}>Account Information:</Text>

      <View style={styles.accountInfo}>
        <Text style={styles.text}>
          Current Account State: -{" "}
          {route.params.data.isBanned ? "Banned" : "Not Banned"}
        </Text>
        <View style={styles.changeState}>
          <Text style={styles.text}>Change Account State:</Text>
          <TouchableOpacity
            style={[
              styles.btn,
              {
                backgroundColor: "#00ed64",
              },
            ]}
            onPress={route.params.data.isBanned ? unbanUser : banUser}
          >
            <Ionicons
              name={route.params.data.isBanned ? "lock-open" : "lock-closed"}
              size={15}
              color="#001e2b"
            />
            <Text>{route.params.data.isBanned ? "Unban" : "Ban"}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default ManageUser;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#001e2b",
    padding: 25,
  },
  title: {
    color: "#ffffff",
    fontSize: 25,
    textAlign: "center",
  },
  subTitle: {
    color: "#ffffff",
    fontSize: 20,
    marginTop: 15,
  },
  userInfo: {
    justifyContent: "space-evenly",
    height: "30%",
    marginLeft: 10,
  },
  user: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    position: "relative",
    width: 40,
  },
  status: {
    position: "absolute",
    height: 10,
    width: 10,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: "#ffffff",
    top: "70%",
    left: "60%",
  },
  text: {
    color: "#ffffff",
    fontSize: 15,
  },
  changeRole: {
    flexDirection: "row",
    alignItems: "center",
  },
  changeState: {
    flexDirection: "row",
    alignItems: "center",
  },
  btn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    borderWidth: 1,
    borderColor: "#ffffff",
    padding: 6,
    borderRadius: 5,
    width: "30%",
    textAlign: "center",
    marginLeft: 10,
  },
  accountInfo: {
    justifyContent: "space-evenly",
    height: "20%",
    marginLeft: 10,
  },
});
