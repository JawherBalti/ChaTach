import {
  Keyboard,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import React, { useLayoutEffect, useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import { auth } from "../firebase";
import Spinner from "react-native-loading-spinner-overlay";
import HeaderRight from "../components/HeaderRight";
import HeaderLeft from "../components/HeaderLeft";
import DeleteModal from "../components/DeleteModal";
import Day from "../components/Day";
import Sender from "../components/Sender";
import Reciever from "../components/Reciever";
import SendMessage from "../components/SendMessage";
import Emojis from "../components/Emojis";
import {
  pickImage,
  sendMessage,
  getUserAdmin,
  getPublicMessages,
  getUserBanned,
} from "../utils";
import Banned from "../components/Banned";

const PublicChat = ({ navigation, route }) => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isBanned, setIsBanned] = useState(false);
  const [showEmojis, setShowEmojis] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [deleteModalOpened, setDeleteModalOpened] = useState(false);
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

  useEffect(() => {
    if (auth?.currentUser) {
      setIsLoading(true);
      getPublicMessages(setIsLoading, setMessages, route.params.id);
      getUserAdmin(setIsAdmin);
      getUserBanned(setIsBanned);
    }
  }, []);

  return (
    <>
      {isBanned ? (
        <Banned />
      ) : (
        <View style={styles.container}>
          {isLoading && <Spinner visible={isLoading} color="#ffffff" />}
          <View style={styles.chatHeader}>
            <Text style={styles.headerText}>
              Welcome to {route.params.chatName}
            </Text>
            {isAdmin && (
              <View style={styles.headerActions}>
                <TouchableOpacity
                  onPress={() => setDeleteModalOpened(!deleteModalOpened)}
                >
                  <Ionicons
                    name="remove-circle-outline"
                    size={20}
                    color="#001e2b"
                  />
                </TouchableOpacity>
              </View>
            )}
          </View>

          {deleteModalOpened && (
            <DeleteModal
              room={route.params}
              changeModalState={setDeleteModalOpened}
              navigation={navigation}
            />
          )}
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <>
              <FlatList
                data={messages}
                keyExtractor={(item) => item?.data?.timestamp}
                renderItem={(data) =>
                  data.item.data.email === auth.currentUser.email ? (
                    <>
                      <Sender senderData={data.item.data} />
                      {data.item.data.timestamp ? (
                        <Day date={data.item?.data?.timestamp.seconds} />
                      ) : null}
                    </>
                  ) : (
                    <Reciever recieverData={data.item.data} route={route} />
                  )
                }
              />
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
            </>
          </TouchableWithoutFeedback>
          {showEmojis && <Emojis setInput={setInput} />}
        </View>
      )}
    </>
  );
};

export default PublicChat;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#001E2B",
  },
  chatHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#ffffff",
    height: "10%",
    padding: 15,
  },
  headerText: {
    color: "#001e2b",
  },
});
