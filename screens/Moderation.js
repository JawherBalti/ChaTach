import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from "react-native";
import React, { useState, useLayoutEffect, useEffect } from "react";
import HeaderRight from "../components/HeaderRight";
import HeaderLeft from "../components/HeaderLeft";
import Spinner from "react-native-loading-spinner-overlay";
import { Ionicons } from "@expo/vector-icons";
import { Divider } from "react-native-elements";
import ReportsList from "../components/ReportsList";
import RequestsList from "../components/RequestsList";
import { auth } from "../firebase";
import { useIsFocused } from "@react-navigation/native";
import { getUnbanRequests, getReports } from "../utils";

const Moderation = ({ navigation }) => {
  const [isReports, setIsReports] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [reports, setReports] = useState([]);
  const [unbanRequests, setUnbanRequests] = useState([]);

  const isFocused = useIsFocused();

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

  useEffect(() => {
    if (isFocused && auth.currentUser) {
      getReports(setIsLoading, setReports);
    }
  }, [isFocused]);

  return (
    <View style={styles.container}>
      {isLoading && <Spinner visible={isLoading} color="#ffffff" />}
      <View style={styles.homeBtnContainer}>
        <TouchableOpacity
          style={[
            styles.btn,
            {
              backgroundColor: !isReports ? "#ffffff" : "#00ed64",
            },
          ]}
          onPress={() => setIsReports(true)}
        >
          <Ionicons name="flag" size={17} color="#001e2b" />

          <Text style={styles.btnText}>Reports</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.btn,
            {
              backgroundColor: isReports ? "#ffffff" : "#00ed64",
            },
          ]}
          onPress={() => {
            setIsReports(false);
            getUnbanRequests(setIsLoading, setUnbanRequests);
          }}
        >
          <Ionicons name="warning" size={20} color="#001e2b" />
          <Text style={styles.btnText}>Requests</Text>
        </TouchableOpacity>
      </View>
      <Divider />

      {isReports ? (
        <FlatList
          style={styles.listBg}
          data={reports}
          keyExtractor={(item) => item.id}
          renderItem={(data) => (
            <ReportsList
              id={data.item.id}
              data={data.item.data}
              navigation={navigation}
            />
          )}
        />
      ) : (
        <FlatList
          style={styles.listBg}
          data={unbanRequests}
          keyExtractor={(item) => item.id}
          renderItem={(data) => (
            <RequestsList
              id={data.item.id}
              data={data.item.data}
              navigation={navigation}
            />
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  homeBtnContainer: {
    flexDirection: "row",
    backgroundColor: "#001e2b",
    justifyContent: "space-evenly",
    padding: 15,
  },
  search: {
    padding: 5,
    backgroundColor: "#001e2b",
  },
  listBg: {
    backgroundColor: "#001e2b",
  },
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
  btn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    borderWidth: 1,
    borderColor: "#ffffff",
    padding: 8,
    borderRadius: 5,
    width: 110,
    textAlign: "center",
  },
  btnText: {
    color: "#001e2b",
  },
});

export default Moderation;
