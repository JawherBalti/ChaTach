import {
  addDoc,
  arrayRemove,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { auth, db } from "./firebase";
import * as ImagePicker from "expo-image-picker";
import { Keyboard } from "react-native";

export const signInWithCredentials = (email, password, setIsLoading) => {
  signInWithEmailAndPassword(auth, email, password)
    .then((data) => {
      setIsLoading(false);
      updateDoc(doc(db, "users", data.user.uid), {
        online: true,
      });
    })
    .catch((err) => {
      setIsLoading(false);
      alert("Could not login! Please try again.");
    });
};

export const createUserWithCredentials = (
  name,
  email,
  password,
  photoUrl,
  usersCount,
  setIsLoading
) => {
  createUserWithEmailAndPassword(auth, email, password)
    .then(async (authUser) => {
      setIsLoading(false);
      await setDoc(doc(db, "users", authUser.user.uid), {
        id: authUser.user.uid,
        displayName: name,
        email: email,
        photoURL: photoUrl,
        online: true,
        isBanned: false,
        blockedBy: [],
        unbanRequestSent: false,
        isAdmin: usersCount > 0 ? false : true,
      });
      updateProfile(authUser.user, {
        displayName: name,
        photoURL: photoUrl,
      });
    })
    .catch((err) => {
      setIsLoading(false);
      alert("Could not register! Please try again.");
    });
};

export const createUserWithSocials = (
  data,
  photoUrl,
  usersCount,
  setIsLoading
) => {
  createUserWithEmailAndPassword(
    auth,
    data.email,
    typeof data.picture === "string" ? data.picture : data.name
  )
    .then(async (authUser) => {
      setIsLoading(false);
      await setDoc(doc(db, "users", authUser.user.uid), {
        id: authUser.user.uid,
        displayName: data.name,
        email: data.email,
        photoURL: photoUrl,
        online: true,
        isBanned: false,
        blockedBy: [],
        unbanRequestSent: false,
        isAdmin: usersCount > 0 ? false : true,
      });
      updateProfile(authUser.user, {
        displayName: data.name,
        photoURL: photoUrl,
      });
    })
    .catch((err) => {
      setIsLoading(false);
      alert("Could not register! Please try again.");
    });
};

export const signOutUser = (navigation, setIsLoading) => {
  setIsLoading(true);
  updateDoc(doc(db, "users", auth?.currentUser?.uid), {
    online: false,
  });
  signOut(auth).then(() => {
    setIsLoading(false);
    navigation.replace("Login");
  });
};

export const pickImage = async (setImage, setImagePreview, route) => {
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
      if (route.name === "Register") {
        setImage(imageObj);
        setImagePreview(result.assets[0].uri);
      } else uploadImage(imageObj, route);
    }
  } else {
    alert("Access to photos refused!");
  }
};

export const uploadImage = async (image, route) => {
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
    if (route?.name === "PrivateChat") {
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
    } else if (route?.name === "PublicChat") {
      const message = {
        timestamp: serverTimestamp(),
        message: urlData.url,
        displayName: auth.currentUser.displayName,
        email: auth.currentUser.email,
        photoURL: auth.currentUser.photoURL,
      };
      addDoc(
        collection(doc(db, "publicMessages", route.params.id), "messages"),
        message
      );
    }
    return urlData.url;
  } catch (error) {
    alert(error.message);
  }
};

export const getRooms = async (setRooms, setIsLoading) => {
  setIsLoading(false);
  onSnapshot(query(collection(db, "publicMessages")), (snapshot) => {
    const allRooms = snapshot.docs.map((doc) => ({
      id: doc.id,
      data: doc.data(),
    }));
    setIsLoading(false);
    setRooms(
      allRooms.filter((user) => user.data.email !== auth?.currentUser?.email)
    );
  });
};

export const getUsers = (setUsers, setIsLoading) => {
  setIsLoading(true);
  onSnapshot(query(collection(db, "users")), (snapshot) => {
    const allUsers = snapshot.docs.map((doc) => ({
      id: doc.id,
      data: doc.data(),
    }));
    setIsLoading(false);
    setUsers(
      allUsers.filter((user) => user.data.email !== auth?.currentUser?.email)
    );
  });
};

export const getReports = (setIsLoading, setReports) => {
  setIsLoading(true);
  onSnapshot(
    query(collection(db, "reports"), orderBy("timestamp", "asc")),
    (snapshot) => {
      const allReports = snapshot.docs.map((doc) => ({
        id: doc.id,
        data: doc.data(),
      }));
      setIsLoading(false);
      setReports(allReports);
    }
  );
};

export const getUnbanRequests = (setIsLoading, setUnbanRequests) => {
  setIsLoading(true);
  onSnapshot(
    query(collection(db, "requests"), orderBy("timestamp", "asc")),
    (snapshot) => {
      const allRequests = snapshot.docs.map((doc) => ({
        id: doc.id,
        data: doc.data(),
      }));
      setIsLoading(false);
      setUnbanRequests(allRequests);
    }
  );
};

export const getUserInfo = async (setIsLoading, setIsAdmin, setIsBanned) => {
  setIsLoading(true);
  const userRef = doc(db, "users", auth?.currentUser?.uid);
  const userSnap = await getDoc(userRef);
  setIsAdmin(userSnap.data().isAdmin);
  setIsBanned(userSnap.data().isBanned);
  setIsLoading(false);
};

export const getUserBanned = async (setIsBanned) => {
  if (auth.currentUser) {
    const userRef = doc(db, "users", auth?.currentUser?.uid);
    const userSnap = await getDoc(userRef);
    setIsBanned(userSnap.data().isBanned);
  }
};

export const getUserRequestSent = async (setUnbanRequestSent) => {
  const userRef = doc(db, "users", auth?.currentUser?.uid);
  const userSnap = await getDoc(userRef);
  setUnbanRequestSent(userSnap.data().unbanRequestSent);
};

export const getUserAdmin = async (setIsAdmin) => {
  const userRef = doc(db, "users", auth?.currentUser?.uid);
  const userSnap = await getDoc(userRef);
  setIsAdmin(userSnap.data().isAdmin);
};

export const getBlockedByList = async (setBlockedBy) => {
  const userRef = doc(db, "users", auth?.currentUser?.uid);
  const userSnap = await getDoc(userRef);
  setBlockedBy(userSnap.data().blockedBy);
};

export const getPublicMessages = (setIsLoading, setMessages, id) => {
  onSnapshot(
    query(
      collection(db, "publicMessages", id, "messages"),
      orderBy("timestamp", "desc")
    ),
    (snapshot) => {
      const allMessages = snapshot.docs.map((doc) => ({
        id: doc.id,
        data: doc.data(),
      }));
      setMessages(allMessages);
      setIsLoading(false);
    }
  );
};

export const getPrivateMessages = (setIsLoading, setMessages, route, dataa) => {
  onSnapshot(
    query(collection(db, "privateMessages"), orderBy("timestamp", "desc")),
    (snapshot) => {
      if (route.name === "Report") {
        const allMessages = snapshot.docs
          .map((doc) => ({
            id: doc.id,
            data: doc.data(),
          }))
          .filter(
            (message) =>
              message.data.senderEmail === route.params.data.reportedEmail
          );

        setMessages(allMessages);
        setIsLoading(false);
      } else if (route.name === "Home") {
        const allMessages = snapshot.docs
          .map((doc) => ({
            id: doc.id,
            data: doc.data(),
          }))
          .filter(
            (message) =>
              (message.data.senderEmail === auth?.currentUser?.email &&
                message.data.recieverEmail === dataa?.email) ||
              (message.data.senderEmail === dataa?.email &&
                message.data.recieverEmail === auth?.currentUser?.email)
          );
        setMessages(allMessages);
      } else {
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
        setIsLoading(false);

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
    }
  );
};

export const sendMessage = async (input, setInput, route) => {
  Keyboard.dismiss();
  if (input) {
    if (route.name === "PrivateChat") {
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
    } else if (route.name === "PublicChat") {
      addDoc(
        collection(doc(db, "publicMessages", route.params.id), "messages"),
        {
          timestamp: serverTimestamp(),
          message: input,
          displayName: auth.currentUser.displayName,
          email: auth.currentUser.email,
          photoURL: auth.currentUser.photoURL,
        }
      );
    }
    setInput("");
  }
};

export const sendUnbanRequest = (input, setInput, setUnbanRequestSent) => {
  if (input !== "") {
    const unbanRequest = {
      id: auth?.currentUser?.uid,
      displayName: auth?.currentUser?.displayName,
      photoUrl: auth?.currentUser?.photoURL,
      request: input,
      timestamp: serverTimestamp(),
    };

    addDoc(collection(db, "requests"), unbanRequest);
    updateDoc(doc(db, "users", auth?.currentUser?.uid), {
      unbanRequestSent: true,
    });
    setUnbanRequestSent(true);
  }
  setInput("");
};

export const sendReport = (user, selectedValue, changeModalState) => {
  const report = {
    reporter: auth.currentUser.displayName,
    reporterAvatar: auth.currentUser.photoURL,
    reported: user.displayName,
    reportedEmail: user.email,
    reportReason: selectedValue,
    timestamp: serverTimestamp(),
  };
  addDoc(collection(db, "reports"), report);
  changeModalState(false);
};

export const setAdmin = (navigation, route) => {
  updateDoc(doc(db, "users", route.params.data.id), {
    isAdmin: true,
  });
  navigation.navigate("Home");
};

export const setRegular = (navigation, route) => {
  updateDoc(doc(db, "users", route.params.data.id), {
    isAdmin: false,
  });
  navigation.navigate("Home");
};

export const banUser = (navigation, route) => {
  updateDoc(doc(db, "users", route.params.data.id), {
    isBanned: true,
  });
  navigation.navigate("Home");
};

export const unbanUser = (navigation, route) => {
  updateDoc(doc(db, "users", route.params.data.id), {
    isBanned: false,
    unbanRequestSent: false,
  });
  if (route.name === "UnbanRequest") {
    navigation.navigate("Moderation");
  } else {
    navigation.navigate("Home");
  }
};

export const block = (user, navigation, changeModalState) => {
  updateDoc(doc(db, "users", user.id), {
    blockedBy: arrayUnion(auth.currentUser.email),
  });
  changeModalState(false);
  navigation.navigate("Home");
};

export const unblock = (user, navigation, changeModalState) => {
  updateDoc(doc(db, "users", user.id), {
    blockedBy: arrayRemove(auth.currentUser.email),
  });
  changeModalState(false);
  navigation.navigate("Home");
};

export const deleteRoom = (room, navigation) => {
  const roomRef = doc(db, "publicMessages", room.id);
  deleteDoc(roomRef)
    .then(() => {
      navigation.navigate("Home");
    })
    .catch((err) => alert("Could not delete room!"));
};

export const deleteReport = (navigation, route) => {
  const reportRef = doc(db, "reports", route.params.id);
  deleteDoc(reportRef)
    .then(() => {
      navigation.navigate("Moderation");
    })
    .catch((err) => alert("Could not delete report!"));
};

export const deleteUnbanRequest = (navigation, route) => {
  const requestRef = doc(db, "requests", route.params.id);
  deleteDoc(requestRef)
    .then(() => {
      navigation.navigate("Moderation");
    })
    .catch((err) => alert("Could not delete unban request!"));
};

export const createRoom = async (setIsLoading, input, navigation) => {
  setIsLoading(false);
  if (input) {
    setIsLoading(true);
    try {
      const doc = await addDoc(collection(db, "publicMessages"), {
        chatName: input,
      });
      if (doc) {
        navigation.goBack();
      }
    } catch (err) {
      setIsLoading(false);
      alert("Error while creating room!");
    }
  } else {
    setIsLoading(false);

    alert("Room name cannot be empty!");
  }
};

export const enterPrivateChat = (id, data, navigation) => {
  navigation.navigate("PrivateChat", {
    id: id,
    data: data,
  });
};

export const enterChat = (id, chatName, navigation) => {
  navigation.navigate("PublicChat", {
    id: id,
    chatName: chatName,
  });
};

export const manageUser = (id, data, navigation) => {
  navigation.navigate("ManageUser", {
    id: id,
    data: data,
  });
};
