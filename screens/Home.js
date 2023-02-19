import {
  Text,
  View,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from "react-native";
import React, { useEffect, useLayoutEffect, useMemo, useState } from "react";
import { Divider } from "react-native-elements";
import { Ionicons } from "@expo/vector-icons";
import { auth } from "../firebase";
import { useIsFocused } from "@react-navigation/native";
import UsersList from "../components/UsersList";
import RoomsList from "../components/RoomsList";
import HeaderLeft from "../components/HeaderLeft";
import HeaderRight from "../components/HeaderRight";
import Banned from "../components/Banned";
import SearchInput from "../components/SearchInput";
import Spinner from "react-native-loading-spinner-overlay";
import {
  enterChat,
  enterPrivateChat,
  getRooms,
  getUserBanned,
  getUsers,
} from "../utils";

const Home = ({ navigation }) => {
  const [rooms, setRooms] = useState([]);
  const [users, setUsers] = useState([]);
  const [isBanned, setIsBanned] = useState(false);
  const [isRooms, setIsRooms] = useState(true);
  const [searchedUser, setSearchedUser] = useState("");
  const [searchedRoom, setSearchedRoom] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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
    if (isFocused && auth?.currentUser) {
      getRooms(setRooms, setIsLoading);
      getUserBanned(setIsBanned);
    }
  }, [isFocused]);

  useEffect(() => {
    if (!auth.currentUser) navigation.navigate("Login");
  }, []);

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      return user.data.displayName
        .toLowerCase()
        .includes(searchedUser.toLowerCase());
    });
  }, [users, searchedUser]);

  const filteredRooms = useMemo(() => {
    return rooms.filter((room) => {
      return room.data.chatName
        .toLowerCase()
        .includes(searchedRoom.toLowerCase());
    });
  }, [rooms, searchedRoom]);

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
                getUsers(setUsers, setIsLoading);
              }}
            >
              <Ionicons name="people" size={20} color="#001e2b" />
              <Text style={styles.btnText}>Users</Text>
            </TouchableOpacity>
          </View>
          <Divider />

          <View style={styles.search}>
            {isRooms ? (
              <SearchInput
                searchedValue={searchedRoom}
                setSearchedValue={setSearchedRoom}
                placeholder="Find a room..."
              />
            ) : (
              <SearchInput
                searchedValue={searchedUser}
                setSearchedValue={setSearchedUser}
                placeholder="Find a user..."
              />
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
                  navigation={navigation}
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
                  navigation={navigation}
                  enterPrivateChat={enterPrivateChat}
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
