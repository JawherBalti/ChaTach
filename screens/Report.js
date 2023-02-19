import {
  View,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
  FlatList,
  TouchableOpacity,
} from "react-native";
import React, { useLayoutEffect, useState } from "react";
import HeaderLeft from "../components/HeaderLeft";
import HeaderRight from "../components/HeaderRight";
import { ListItem } from "react-native-elements";
import Spinner from "react-native-loading-spinner-overlay";
import { Ionicons } from "@expo/vector-icons";
import { deleteReport, getPrivateMessages } from "../utils";
import Day from "../components/Day";
import Sender from "../components/Sender";

const Report = ({ navigation, route }) => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

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

  useLayoutEffect(() => {
    setIsLoading(true);
    getPrivateMessages(setIsLoading, setMessages, route);
  }, []);

  return (
    <View style={styles.container}>
      {isLoading && <Spinner visible={isLoading} color="#ffffff" />}
      <View style={styles.chatHeader}>
        <ListItem.Subtitle
          style={styles.headerText}
          ellipsizeMode="tail"
          numberOfLines={1}
        >
          Messages sent by {route.params.data.reported}
        </ListItem.Subtitle>
        <TouchableOpacity onPress={() => deleteReport(navigation, route)}>
          <Ionicons name="remove-circle-outline" size={20} color="#001e2b" />
        </TouchableOpacity>
      </View>

      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <FlatList
          data={messages}
          keyExtractor={(item) => new Date(item?.data?.timestamp * 1000)}
          renderItem={(data) => (
            <>
              <Sender senderData={data.item.data} />

              {data.item.data.timestamp ? (
                <Day date={data.item.data.timestamp.seconds} />
              ) : null}
            </>
          )}
        />
      </TouchableWithoutFeedback>
      <Text style={styles.reportReason}>
        This user has been reported by {route.params.data.reporter} for{" "}
        {route.params.data.reportReason}
      </Text>
    </View>
  );
};

export default Report;

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
  reportReason: {
    color: "#ffffff",
    textAlign: "center",
    padding: 10,
  },
});
