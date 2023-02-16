import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useState, useLayoutEffect } from "react";
import { auth, db } from "../firebase";
import { Ionicons } from "@expo/vector-icons";
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";
import { signOut } from "firebase/auth";
import { Avatar } from "react-native-elements";
import { useRoute } from "@react-navigation/native";
import Spinner from "react-native-loading-spinner-overlay";
import { useEffect } from "react";

const HeaderRight = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isBanned, setIsBanned] = useState(false);
  const [reports, setReports] = useState([]);
  const [unbanRequests, setUnbanRequests] = useState([]);

  const route = useRoute();

  useLayoutEffect(() => {
    if (auth.currentUser) {
      getUserInfo();
      getReports();
      getUnbanRequests();
    }
  }, []);

  const getUserInfo = async () => {
    const userRef = doc(db, "users", auth?.currentUser?.uid);
    const userSnap = await getDoc(userRef);
    setIsAdmin(userSnap.data().isAdmin);
    setIsBanned(userSnap.data().isBanned);
  };

  const getReports = () => {
    onSnapshot(
      query(collection(db, "reports"), orderBy("timestamp", "asc")),
      (snapshot) => {
        const allReports = snapshot.docs.map((doc) => ({
          id: doc.id,
          data: doc.data(),
        }));
        setReports(allReports);
      }
    );
  };

  const getUnbanRequests = () => {
    onSnapshot(
      query(collection(db, "requests"), orderBy("timestamp", "asc")),
      (snapshot) => {
        const allRequests = snapshot.docs.map((doc) => ({
          id: doc.id,
          data: doc.data(),
        }));
        setUnbanRequests(allRequests);
      }
    );
  };

  const signOutUser = () => {
    setLoading(true);
    updateDoc(doc(db, "users", auth?.currentUser?.uid), {
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
          {route.name === "Home" && !isBanned && (
            <TouchableOpacity
              onPress={() => navigation.navigate("CreateRoom")}
              activeOpacity={0.5}
            >
              <Ionicons name="add-circle-outline" size={25} color="#001e2b" />
            </TouchableOpacity>
          )}

          {isAdmin && (
            <TouchableOpacity
              onPress={() => navigation.navigate("Moderation")}
              activeOpacity={0.5}
              style={styles.notificationBell}
            >
              <Ionicons
                name="notifications-outline"
                size={25}
                color="#001e2b"
              />
              {(reports.length > 0 || unbanRequests.length > 0) && (
                <View style={styles.notification}></View>
              )}
            </TouchableOpacity>
          )}
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
  notificationBell: {
    marginLeft: 15,
    position: "relative",
  },
  notification: {
    position: "absolute",
    top: "45%",
    left: "65%",
    width: 10,
    height: 10,
    borderRadius: 10,
    backgroundColor: "#dc3545",
  },
  avatar: {
    marginLeft: 20,
  },
});
