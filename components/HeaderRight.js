import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useState, useLayoutEffect } from "react";
import { auth, db } from "../firebase";
import { Ionicons } from "@expo/vector-icons";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { Avatar } from "react-native-elements";
import { useRoute } from "@react-navigation/native";
import Spinner from "react-native-loading-spinner-overlay";

const HeaderRight = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isBanned, setIsBanned] = useState(false);

  const route = useRoute();

  useLayoutEffect(() => {
    getUserBanned();
    getUserAdmin();
  }, []);

  const getUserAdmin = async () => {
    if (auth.currentUser) {
      const userRef = doc(db, "users", auth.currentUser.uid);
      const userSnap = await getDoc(userRef);
      setIsAdmin(userSnap.data().isAdmin);
    }
  };

  const getUserBanned = async () => {
    if (auth.currentUser) {
      const userRef = doc(db, "users", auth.currentUser.uid);
      const userSnap = await getDoc(userRef);
      setIsBanned(userSnap.data().isBanned);
    }
  };

  const signOutUser = () => {
    setLoading(true);
    updateDoc(doc(db, "users", auth.currentUser.uid), {
      online: false,
    });
    signOut(auth).then(() => {
      setLoading(false);
      navigation.replace("Login");
    });
  };

  return (
    <View style={styles.headerRight}>
      {loading && <Spinner visible={loading} color="#ffffff" />}
      {auth?.currentUser ? (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          {route.name === "Home" && !isBanned ? (
            <TouchableOpacity
              onPress={() => navigation.navigate("CreateRoom")}
              activeOpacity={0.5}
            >
              <Ionicons name="add-circle-outline" size={25} color="#001e2b" />
            </TouchableOpacity>
          ) : null}
          {route.name === "Home" && isAdmin ? (
            <TouchableOpacity
              onPress={() => navigation.navigate("Moderation")}
              activeOpacity={0.5}
              style={styles.notification}
            >
              <Ionicons
                name="notifications-outline"
                size={25}
                color="#001e2b"
              />
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
  notification: {
    marginLeft: 15,
  },
  avatar: { marginLeft: 20 },
});
