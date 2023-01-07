import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { auth, db } from "../firebase";
import { Ionicons } from "@expo/vector-icons";
import { doc, updateDoc } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { Avatar } from "react-native-elements";
import { useRoute } from "@react-navigation/native";

const HeaderRight = ({ navigation }) => {
  const route = useRoute();

  const signOutUser = () => {
    updateDoc(doc(db, "users", auth.currentUser.uid), {
      online: false,
    });
    signOut(auth).then(() => {
      navigation.replace("Login");
    });
  };

  return (
    <View style={styles.headerRight}>
      {auth?.currentUser ? (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          {route.name === "Home" ? (
            <TouchableOpacity
              onPress={() => navigation.navigate("CreateRoom")}
              activeOpacity={0.5}
            >
              <Ionicons name="add-circle-outline" size={25} color="#001e2b" />
            </TouchableOpacity>
          ) : null}
          <TouchableOpacity
            style={styles.avatar}
            activeOpacity={0.5}
            onPress={signOutUser}
          >
            <Avatar rounded source={{ uri: auth?.currentUser?.photoURL }} />
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.headerRight}>
          <TouchableOpacity onPress={() => navigation.navigate("Login")}>
            <Text style={styles.text}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate("Register")}>
            <Text style={styles.text}>Register</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default HeaderRight;

const styles = StyleSheet.create({
  headerRight: {
    flexDirection: "row",
  },
  text: {
    color: "#001e2b",
    marginLeft: 10,
  },
  avatar: { marginLeft: 20 },
});
