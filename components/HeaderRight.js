import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useState, useEffect } from "react";
import { auth } from "../firebase";
import { Ionicons } from "@expo/vector-icons";
import { Avatar } from "react-native-elements";
import { useRoute } from "@react-navigation/native";
import Spinner from "react-native-loading-spinner-overlay";
import {
  getReports,
  getUnbanRequests,
  getUserInfo,
  signOutUser,
} from "../utils";

const HeaderRight = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isBanned, setIsBanned] = useState(false);
  const [reports, setReports] = useState([]);
  const [unbanRequests, setUnbanRequests] = useState([]);

  const route = useRoute();

  useEffect(() => {
    if (auth.currentUser) {
      getUserInfo(setIsLoading, setIsAdmin, setIsBanned);
      getReports(setIsLoading, setReports);
      getUnbanRequests(setIsLoading, setUnbanRequests);
    }
  }, []);

  return (
    <View style={styles.headerRight}>
      {isLoading && <Spinner visible={isLoading} color="#ffffff" />}
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
            onPress={() => signOutUser(navigation, setIsLoading)}
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
