import {
  Text,
  View,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  TextInput,
} from "react-native";
import React, { useEffect, useLayoutEffect, useMemo, useState } from "react";
import { Divider } from "react-native-elements";
import { Ionicons } from "@expo/vector-icons";
import { auth, db } from "../firebase";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { useIsFocused } from "@react-navigation/native";
import UsersList from "../components/UsersList";
import RoomsList from "../components/RoomsList";
import HeaderLeft from "../components/HeaderLeft";
import HeaderRight from "../components/HeaderRight";
import Spinner from "react-native-loading-spinner-overlay";
import Banned from "../components/Banned";

const Home = ({ navigation }) => {
  const [chats, setChats] = useState([]);
  const [users, setUsers] = useState([]);
  const [isBanned, setIsBanned] = useState(false);
  const [isRooms, setIsRooms] = useState(true);
  const [searchedUser, setSearchedUser] = useState("");
  const [searchedRoom, setSearchedRoom] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const isFocused = useIsFocused();

  const chatsData = [];
  const usersData = [];

  useEffect(() => {
    if (isFocused && auth.currentUser) {
      getRooms();
      getUserBanned();
    }
  }, [isFocused]);

  useEffect(() => {
    if (!auth.currentUser) navigation.navigate("Login");
  }, []);

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

  const getUserBanned = async () => {
    if (auth.currentUser) {
      const userRef = doc(db, "users", auth?.currentUser?.uid);
      const userSnap = await getDoc(userRef);
      setIsBanned(userSnap.data().isBanned);
    }
  };

  const getUsers = () => {
    setIsLoading(true);
    onSnapshot(query(collection(db, "users")), (snapshot) => {
      const allUsers = snapshot.docs.map((doc) => ({
        id: doc.id,
        data: doc.data(),
      }));
      setIsLoading(false);
      setUsers(allUsers);
    });
  };

  const getRooms = async () => {
    setIsLoading(true);
    const unsubscribe = await getDocs(collection(db, "publicMessages"));
    unsubscribe.forEach((doc) => {
      chatsData.push({
        id: doc.id,
        data: doc.data(),
      });
    });
    setIsLoading(false);
    setChats(chatsData);
  };

  const filteredUsers = useMemo(() => {
    return users
      .filter((user) => user.data.email !== auth?.currentUser?.email)
      .filter((user) => {
        return user.data.displayName
          .toLowerCase()
          .includes(searchedUser.toLowerCase());
      });
  }, [users, searchedUser]);

  const filteredRooms = useMemo(() => {
    return chats.filter((chat) => {
      return chat.data.chatName
        .toLowerCase()
        .includes(searchedRoom.toLowerCase());
    });
  }, [chats, searchedRoom]);

  const enterPrivateChat = (id, data) => {
    navigation.navigate("PrivateChat", {
      id: id,
      data: data,
    });
  };

  const enterChat = (id, chatName) => {
    navigation.navigate("PublicChat", {
      id: id,
      chatName: chatName,
    });
  };

  return (
    <>
      {isBanned ? (
        <Banned />
      ) : (
        <View style={styles.container}>
          {isLoading && <Spinner visible={isLoading} color="#ffffff" />}
          <View style={styles.homeBtnContainer}>
            <TouchableOpacity
              style={[
                styles.btn,
                {
                  backgroundColor: !isRooms ? "#ffffff" : "#00ed64",
                },
              ]}
              onPress={() => setIsRooms(true)}
            >
              <Ionicons name="megaphone" size={17} color="#001e2b" />

              <Text style={styles.btnText}>Rooms</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.btn,
                ,
                {
                  backgroundColor: isRooms ? "#ffffff" : "#00ed64",
                },
              ]}
              onPress={() => {
                setIsRooms(false);
                getUsers();
              }}
            >
              <Ionicons name="people" size={20} color="#001e2b" />
              <Text style={styles.btnText}>Users</Text>
            </TouchableOpacity>
          </View>
          <Divider />

          <View style={styles.search}>
            {isRooms ? (
              <View style={styles.input}>
                <Ionicons name="md-search" size={20} color="#001e2b" />

                <TextInput
                  style={styles.textInput}
                  value={searchedRoom}
                  onChangeText={(text) => setSearchedRoom(text)}
                  placeholder="Find a Room..."
                  placeholderTextColor="grey"
                />
              </View>
            ) : (
              <View style={styles.input}>
                <Ionicons name="md-search" size={20} color="#001e2b" />

                <TextInput
                  value={searchedUser}
                  onChangeText={(text) => setSearchedUser(text)}
                  placeholder="Find a User..."
                  placeholderTextColor="grey"
                  style={styles.textInput}
                />
              </View>
            )}
          </View>

          {isRooms ? (
            <FlatList
              style={styles.listBg}
              data={filteredRooms}
              keyExtractor={(item) => item.id}
              renderItem={(data) => (
                <RoomsList
                  id={data.item.id}
                  data={data.item.data}
                  enterChat={enterChat}
                />
              )}
            />
          ) : (
            <FlatList
              style={styles.listBg}
              data={filteredUsers}
              keyExtractor={(item) => item.id}
              renderItem={(data) => (
                <UsersList
                  id={data.item.id}
                  data={data.item.data}
                  enterPrivateChat={enterPrivateChat}
                  navigation={navigation}
                />
              )}
            />
          )}
        </View>
      )}
    </>
  );
};

export default Home;

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
    width: 90,
    textAlign: "center",
  },
  btnText: {
    color: "#001e2b",
  },
});
