import {
  Keyboard,
  TextInput,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  FlatList,
  AppState,
  Image,
} from "react-native";
import React, { useLayoutEffect, useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import { Avatar, ListItem } from "react-native-elements";
import { db, auth } from "../firebase";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import HeaderRight from "../components/HeaderRight";
import HeaderLeft from "../components/HeaderLeft";
import ReportModal from "../components/ReportModal";
import BlockModal from "../components/BlockModal";
import Spinner from "react-native-loading-spinner-overlay";
import EmojiSelector, { Categories } from "react-native-emoji-selector";
import * as ImagePicker from "expo-image-picker";

// npx expo install expo-device expo-notifications

const PrivateChat = ({ navigation, route }) => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showEmojis, setShowEmojis] = useState(false);
  const [reportModalOpened, setReportModalOpened] = useState(false);
  const [blockModalOpened, setBlockModalOpened] = useState(false);
  const [blockedBy, setBlockedBy] = useState([]);
  // const appState = useRef(AppState.currentState);

  // const [appStateVisible, setAppStateVisible] = useState(appState.current);

  // useEffect(() => {
  //   const subscription = AppState.addEventListener("change", (nextAppState) => {
  //     if (
  //       appState.current.match(/inactive|background/) &&
  //       nextAppState === "active"
  //     ) {
  //     }

  //     appState.current = nextAppState;
  //     setAppStateVisible(appState.current);
  //   });

  //   return () => {
  //     subscription.remove();
  //   };
  // }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "",
      headerStyle: { backgroundColor: "#fff" },
      headerRight: () => <HeaderRight navigation={navigation} />,
      headerLeft: () => <HeaderLeft navigation={navigation} />,
    });
  }, [navigation]);

  useLayoutEffect(() => {
    setLoading(true);
    const unsub = onSnapshot(
      query(collection(db, "privateMessages"), orderBy("timestamp", "desc")),
      (snapshot) => {
        const allMessages = snapshot.docs
          .map((doc) => ({
            id: doc.id,
            data: doc.data(),
          }))
          .filter(
            (message) =>
              (message.data.senderEmail === auth?.currentUser?.email &&
                message.data.recieverEmail === route.params.data.email) ||
              (message.data.senderEmail === route.params.data.email &&
                message.data.recieverEmail === auth?.currentUser?.email)
          );

        setMessages(allMessages);
        setLoading(false);

        //set last message to read
        if (
          allMessages.length > 0 &&
          allMessages?.[0]?.data.senderEmail !== auth?.currentUser?.email &&
          !allMessages?.[0]?.data.isRead
        ) {
          updateDoc(doc(db, "privateMessages", allMessages[0].id), {
            isRead: true,
          });
        }
      }
    );
    return unsub;
  }, []);

  useEffect(() => {
    if (auth.currentUser.uid) {
      getBlockedByList();
    }
  }, []);

  const getBlockedByList = async () => {
    const userRef = doc(db, "users", auth?.currentUser?.uid);
    const userSnap = await getDoc(userRef);
    setBlockedBy(userSnap.data().blockedBy);
  };

  const sendMessage = async () => {
    Keyboard.dismiss();

    if (input) {
      const message = {
        timestamp: serverTimestamp(),
        message: input,
        displayName: auth.currentUser.displayName,
        photoURL: auth.currentUser.photoURL,
        senderEmail: auth.currentUser.email,
        recieverEmail: route.params.data.email,
        isRead: false,
      };

      addDoc(collection(db, "privateMessages"), message);

      setInput("");
    }
    // const notifData = {
    //   subID: message.recieverEmail,
    //   appId: 5714,
    //   appToken: "SjNbNi7iZK3N2k3C1jM21X",
    //   title: `${message.displayName} sent you a message!`,
    //   message: message.message,
    // };

    // fetch(`https://app.nativenotify.com/api/indie/notification`, {
    //   mode: "cors", // no-cors, *cors, same-origin
    //   cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
    //   credentials: "same-origin", // include, *same-origin, omit
    //   headers: {
    //     "Content-Type": "application/json",
    //     // 'Content-Type': 'application/x-www-form-urlencoded',
    //   },
    //   method: "POST",
    //   body: JSON.stringify(notifData),
    // });
  };

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted) {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        aspect: [4, 3],
        quality: 1,
        base64: true,
        allowsEditing: true,
      });

      if (!result.canceled) {
        let imageObj = {
          uri: result.assets[0].uri,
          type: `test/${result.assets[0].uri.split(".")[1]}`,
          name: `test.${result.assets[0].uri.split(".")[1]}`,
        };
        uploadImage(imageObj);
      }
    } else {
      alert("Access to photos refused!");
    }
  };

  const uploadImage = async (image) => {
    const data = new FormData();
    data.append("file", image);
    data.append("upload_preset", "eiqxfhzq");
    data.append("cloud_name", "dv1lhvgjr");
    try {
      let res = await fetch(
        "https://api.cloudinary.com/v1_1/dv1lhvgjr/image/upload",
        {
          method: "post",
          body: data,
        }
      );
      const urlData = await res.json();
      const message = {
        timestamp: serverTimestamp(),
        message: urlData.url,
        displayName: auth.currentUser.displayName,
        photoURL: auth.currentUser.photoURL,
        senderEmail: auth.currentUser.email,
        recieverEmail: route.params.data.email,
        isRead: false,
      };
      addDoc(collection(db, "privateMessages"), message);
      return urlData.url;
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <View style={styles.container}>
      {loading && <Spinner visible={loading} color="#ffffff" />}
      <View style={styles.chatHeader}>
        {/* <Text style={styles.headerText}>
        </Text> */}
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
                  <View key={data.item.data.timestamp} style={styles.sender}>
                    <Avatar
                      rounded
                      size={30}
                      style={styles.avatar}
                      source={{ uri: data.item.data.photoURL }}
                    />
                    {data.item.data.message.slice(-4) === ".png" ? (
                      <Image
                        style={styles.imageMsg}
                        source={{
                          uri: data.item.data.message,
                        }}
                      />
                    ) : (
                      <Text style={styles.senderText}>
                        {data.item.data.message}
                      </Text>
                    )}

                    {data.item.data.timestamp ? (
                      <Text
                        style={[
                          styles.timestamp,
                          { color: "#ffffff", paddingRight: 5 },
                        ]}
                      >
                        {new Date(data.item?.data?.timestamp?.seconds * 1000)
                          .getHours()
                          .toString()
                          .padStart(2, "0") +
                          ":" +
                          new Date(data.item?.data?.timestamp?.seconds * 1000)
                            .getMinutes()
                            .toString()
                            .padStart(2, "0")}
                      </Text>
                    ) : null}
                  </View>
                  {data.item.data.timestamp ? (
                    <Text style={styles.date}>
                      {new Date(data.item?.data?.timestamp.seconds * 1000)
                        .toISOString()
                        .substring(0, 10)}
                    </Text>
                  ) : null}
                </>
              ) : (
                <View key={data.item.data.id} style={styles.recieverContainer}>
                  <View style={styles.reciever}>
                    <Avatar
                      rounded
                      size={30}
                      style={styles.avatar}
                      source={{ uri: data.item.data.photoURL }}
                    />
                    {data.item.data.message.slice(-4) === ".png" ? (
                      <Image
                        style={styles.imageMsg}
                        source={{
                          uri: data.item.data.message,
                        }}
                      />
                    ) : (
                      <Text style={styles.recieverText}>
                        {data.item.data.message}
                      </Text>
                    )}

                    {data.item.data.timestamp ? (
                      <Text style={styles.timestamp}>
                        {new Date(data.item?.data?.timestamp?.seconds * 1000)
                          .getHours()
                          .toString()
                          .padStart(2, "0") +
                          ":" +
                          new Date(data.item?.data?.timestamp?.seconds * 1000)
                            .getMinutes()
                            .toString()
                            .padStart(2, "0")}
                      </Text>
                    ) : null}
                  </View>
                  {data.item.data.timestamp ? (
                    <Text style={styles.date}>
                      {new Date(data.item?.data?.timestamp.seconds * 1000)
                        .toISOString()
                        .substring(0, 10)}
                    </Text>
                  ) : null}
                </View>
              )
            }
          />
          {blockedBy.includes(route.params.data.email) ? (
            <Text style={styles.blockMsg}>
              This user blocked you! You are not able to send messages to them.
            </Text>
          ) : (
            <View style={styles.inputContainer}>
              <View style={styles.input}>
                <Ionicons
                  name="chatbubbles-outline"
                  size={20}
                  color="#001e2b"
                />

                <TextInput
                  style={styles.textInput}
                  placeholder="Send a message..."
                  value={input}
                  onChangeText={(text) => setInput(text)}
                  onSubmitEditing={sendMessage}
                  // onBlur={() => console.log("not")}
                  // onFocus={() => console.log("focus")}
                />
                <View style={styles.inputActions}>
                  <TouchableOpacity onPress={() => setShowEmojis(!showEmojis)}>
                    <Ionicons name="happy-outline" size={20} color="#001e2b" />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={pickImage}>
                    <Ionicons name="image-outline" size={20} color="#001e2b" />
                  </TouchableOpacity>
                </View>
              </View>
              <TouchableOpacity
                activeOpacity={0.5}
                onPress={sendMessage}
                style={styles.sendBtn}
              >
                <Ionicons name="send" size={25} color="#001e2b" />
              </TouchableOpacity>
            </View>
          )}
        </>
      </TouchableWithoutFeedback>
      {showEmojis && (
        <View
          style={{
            padding: 30,
            width: "100%",
            height: "60%",
            backgroundColor: "#ececec",
            borderRadius: 20,
          }}
        >
          <EmojiSelector
            onEmojiSelected={(emoji) => setInput((prev) => prev + emoji)}
            category={Categories.emotion}
            showTabs={false}
            showSectionTitles={false}
            showSearchBar={false}
          />
        </View>
      )}
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
  recieverContainer: {
    alignSelf: "flex-end",
    alignItems: "flex-end",
  },
  reciever: {
    paddingBottom: 5,
    paddingTop: 10,
    paddingLeft: 10,
    paddingRight: 25,
    backgroundColor: "#ececec",
    borderRadius: 20,
    margin: 15,
    maxWidth: "80%",
    position: "relative",
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
  imageMsg: {
    width: 200,
    height: 150,
    borderRadius: 15,
    margin: 5,
  },
  senderText: {
    color: "white",
    fontWeight: "500",
    marginBottom: 5,
  },
  recieverText: {
    color: "black",
    fontWeight: "500",
    marginBottom: 5,
  },
  recieverName: {
    fontSize: 10,
    color: "#fff",
    marginRight: 20,
    marginBottom: 10,
    marginTop: 10,
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
  },
  blockMsg: {
    color: "#ffffff",
    textAlign: "center",
    marginBottom: 50,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    padding: 15,
  },
  inputActions: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    width: "30%",
  },
  input: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ececec",
    bottom: 0,
    height: 40,
    flex: 1,
    marginRight: 15,
    padding: 10,
    borderRadius: 10,
  },
  textInput: {
    color: "#001e2b",
    marginLeft: 5,
    width: "65%",
    height: 35,
    fontSize: 12,
  },
  sendBtn: {
    backgroundColor: "#00ed64",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#fff",
    padding: 5,
  },
});
