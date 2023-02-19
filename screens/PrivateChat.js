import {
  Keyboard,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  FlatList,
} from "react-native";
import React, { useLayoutEffect, useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import { ListItem } from "react-native-elements";
import { auth } from "../firebase";
import Spinner from "react-native-loading-spinner-overlay";
import HeaderRight from "../components/HeaderRight";
import HeaderLeft from "../components/HeaderLeft";
import ReportModal from "../components/ReportModal";
import BlockModal from "../components/BlockModal";
import Day from "../components/Day";
import Sender from "../components/Sender";
import Reciever from "../components/Reciever";
import SendMessage from "../components/SendMessage";
import Emojis from "../components/Emojis";
import {
  getBlockedByList,
  getPrivateMessages,
  pickImage,
  sendMessage,
} from "../utils";
// npx expo install expo-device expo-notifications

const PrivateChat = ({ navigation, route }) => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showEmojis, setShowEmojis] = useState(false);
  const [reportModalOpened, setReportModalOpened] = useState(false);
  const [blockModalOpened, setBlockModalOpened] = useState(false);
  const [blockedBy, setBlockedBy] = useState([]);
  const [image, setImage] = useState("");
  const [imagePreview, setImagePreview] = useState("");

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "",
      headerStyle: { backgroundColor: "#fff" },
      headerRight: () => <HeaderRight navigation={navigation} />,
      headerLeft: () => <HeaderLeft navigation={navigation} />,
    });
  }, [navigation]);

  useLayoutEffect(() => {
    setIsLoading(true);
    getPrivateMessages(setIsLoading, setMessages, route);
  }, []);

  useEffect(() => {
    if (auth.currentUser.uid) {
      getBlockedByList(setBlockedBy);
    }
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
          Chatting with {route.params.data.displayName}
        </ListItem.Subtitle>
        <View style={styles.headerActions}>
          <TouchableOpacity
            onPress={() => setBlockModalOpened(!blockModalOpened)}
          >
            <Ionicons name="close-circle-outline" size={21} color="#001e2b" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setReportModalOpened(!reportModalOpened)}
          >
            <Ionicons name="flag-outline" size={21} color="#001e2b" />
          </TouchableOpacity>
        </View>
      </View>

      {reportModalOpened && (
        <ReportModal
          user={route.params.data}
          changeModalState={setReportModalOpened}
        />
      )}
      {blockModalOpened && (
        <BlockModal
          user={route.params.data}
          changeModalState={setBlockModalOpened}
          navigation={navigation}
        />
      )}

      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <>
          <FlatList
            data={messages}
            keyExtractor={(item) => item.data.timestamp}
            renderItem={(data) =>
              data.item.data.senderEmail === auth?.currentUser?.email ? (
                <>
                  <Sender senderData={data.item.data} />
                  {data.item.data.timestamp ? (
                    <Day date={data.item?.data?.timestamp?.seconds} />
                  ) : null}
                </>
              ) : (
                <Reciever recieverData={data.item.data} route={route} />
              )
            }
          />
          {blockedBy.includes(route.params.data.email) ? (
            <Text style={styles.blockMsg}>
              This user blocked you! You are not able to send messages to them.
            </Text>
          ) : (
            <SendMessage
              input={input}
              setInput={setInput}
              showEmojis={showEmojis}
              setShowEmojis={setShowEmojis}
              setImage={setImage}
              setImagePreview={setImagePreview}
              sendMessage={sendMessage}
              pickImage={pickImage}
              route={route}
            />
          )}
        </>
      </TouchableWithoutFeedback>
      {showEmojis && <Emojis setInput={setInput} />}
    </View>
  );
};

export default PrivateChat;

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
  headerActions: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    width: "20%",
  },
  blockMsg: {
    color: "#ffffff",
    textAlign: "center",
    marginBottom: 50,
  },
});
