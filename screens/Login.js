import {
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Dimensions,
  Image,
} from "react-native";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { Text } from "react-native-elements";
import { auth, db } from "../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import {
  collection,
  doc,
  getCountFromServer,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { Ionicons } from "@expo/vector-icons";
import HeaderRight from "../components/HeaderRight";
import HeaderLeft from "../components/HeaderLeft";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import * as Facebook from "expo-auth-session/providers/facebook";
import Spinner from "react-native-loading-spinner-overlay";

WebBrowser.maybeCompleteAuthSession();

const Login = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [googleRequest, googleResponse, googlePromptLogin] =
    Google.useAuthRequest(
      {
        androidClientId:
          "519775217935-rsgo9iqk031d8c0vt0o74p9pmsukgtam.apps.googleusercontent.com",

        expoClientId:
          "519775217935-i1r7t3n6ml8jgp695itoc23novlo8996.apps.googleusercontent.com",
        redirectUri: "https://auth.expo.io/@jawher94/chAttach",
      },
      { useProxy: true }
    );
  const [fbRequest, fbResponse, facebookPromptLogin] = Facebook.useAuthRequest(
    {
      clientId: "5778013452311829",
      androidClientId: "5778013452311829",
      expoClientId: "5778013452311829",
      redirectUri: "https://auth.expo.io/@jawher94/chAttach",
    },
    { useProxy: true }
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "",
      headerStyle: { backgroundColor: "#fff" },
      headerLeft: () => <HeaderLeft navigation={navigation} />,
      headerRight: () => <HeaderRight navigation={navigation} />,
    });
  }, []);

  useEffect(() => {
    //onAuthStateChanged listens to any authentication or logout attempt from any page of the app
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        navigation.replace("Home");
      }
    });
    return unsubscribe;
  }, []);

  const login = () => {
    setLoading(true);
    //no need for the clause because we have a listener in the useEffect
    signInWithEmailAndPassword(auth, email, password)
      .then((data) => {
        setLoading(false);
        updateDoc(doc(db, "users", data.user.uid), {
          online: true,
        });
      })
      .catch((err) => {
        setLoading(false);
        alert("Could not login! Please try again.");
      });
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

      return urlData.url;
    } catch (error) {
      alert(error.message);
    }
  };

  const SignInWithFacebook = () => {
    let user = {};
    setLoading(false);

    facebookPromptLogin().then(async (response) => {
      if (response.type === "success") {
        let userInfo = await fetch(
          `https://graph.facebook.com/me?fields=name,email,picture&access_token=${response.authentication.accessToken}`
        );
        userInfo.json().then(async (data) => {
          const usersRef = collection(db, "users");
          const userQuery = query(usersRef, where("email", "==", data.email));
          const querySnapshot = await getDocs(userQuery);
          querySnapshot.forEach((doc) => {
            if (doc) {
              user = doc.data();
            }
          });

          if (Object.keys(user).length !== 0) {
            signInWithEmailAndPassword(auth, data.email, data.name)
              .then((data) =>
                updateDoc(doc(db, "users", data.user.uid), {
                  online: true,
                })
              )
              .catch((err) => alert("Could not login! Please try again."));
          } else {
            const url = await uploadImage(data.picture.data.url);

            const users = collection(db, "users");
            const snapshot = await getCountFromServer(users);
            const usersCount = snapshot.data().count;

            createUserWithEmailAndPassword(auth, data.email, data.name)
              .then(async (authUser) => {
                await setDoc(doc(db, "users", authUser.user.uid), {
                  id: authUser.user.uid,
                  displayName: data.name,
                  email: data.email,
                  photoURL: url,
                  online: true,
                  isBanned: false,
                  blockedBy: [],
                  unbanRequestSent: false,
                  isAdmin: usersCount > 0 ? false : true,
                });
                updateProfile(authUser.user, {
                  displayName: data.name,
                  photoURL: url,
                });
              })
              .catch((err) => alert("Could not login! Please try again."));
          }
        });
      }
      setLoading(true);
    });
  };

  const SignInWithGoogle = async () => {
    let user = {};
    setLoading(false);
    googlePromptLogin().then(async (response) => {
      if (response.type === "success") {
        let userInfo = await fetch(
          "https://www.googleapis.com/userinfo/v2/me",
          {
            headers: {
              Authorization: "Bearer " + response.authentication.accessToken,
            },
          }
        );
        userInfo.json().then(async (data) => {
          const usersRef = collection(db, "users");
          const userQuery = query(usersRef, where("email", "==", data.email));
          const querySnapshot = await getDocs(userQuery);
          querySnapshot.forEach((doc) => {
            if (doc) {
              user = doc.data();
            }
          });

          if (Object.keys(user).length !== 0) {
            signInWithEmailAndPassword(auth, data.email, data.picture)
              .then((data) =>
                updateDoc(doc(db, "users", data.user.uid), {
                  online: true,
                })
              )
              .catch((err) => alert("Could not login! Please try again."));
          } else {
            const url = await uploadImage(data.picture);

            const users = collection(db, "users");
            const snapshot = await getCountFromServer(users);
            const usersCount = snapshot.data().count;

            createUserWithEmailAndPassword(auth, data.email, data.picture)
              .then(async (authUser) => {
                await setDoc(doc(db, "users", authUser.user.uid), {
                  id: authUser.user.uid,
                  displayName: data.name,
                  email: data.email,
                  photoURL: url,
                  online: true,
                  isBanned: false,
                  blockedBy: [],
                  unbanRequestSent: false,
                  isAdmin: usersCount > 0 ? false : true,
                });
                updateProfile(authUser.user, {
                  displayName: data.name,
                  photoURL: url,
                });
              })
              .catch((err) => alert("Could not login! Please try again."));
          }
        });
      }
      setLoading(true);
    });
  };

  return (
    <View style={styles.container}>
      {loading && <Spinner visible={loading} color="#ffffff" />}
      <Text style={styles.title}>Login</Text>

      <View style={styles.inputContainer}>
        <View>
          <Text style={styles.label}>Email Address</Text>
          <View style={styles.input}>
            <Ionicons name="mail" size={20} color="#001e2b" />

            <TextInput
              value={email}
              onChangeText={(text) => setEmail(text)}
              placeholder="Enter your email"
              type="email"
              placeholderTextColor="grey"
              style={styles.textInput}
            />
          </View>
        </View>
        <View>
          <Text style={styles.label}>Password</Text>
          <View style={styles.input}>
            <Ionicons name="key" size={20} color="#001e2b" />
            <TextInput
              value={password}
              onChangeText={(text) => setPassword(text)}
              placeholder="Enter your password"
              secureTextEntry
              type="password"
              placeholderTextColor="grey"
              onSubmitEditing={login}
              style={styles.textInput}
            />
          </View>
        </View>
      </View>
      <TouchableOpacity style={styles.button} onPress={login}>
        <Ionicons name="log-in" size={20} color="#001e2b" />
        <Text style={styles.btnText}>Login</Text>
      </TouchableOpacity>
      <Text
        style={{
          color: "#fff",
        }}
      >
        Or
      </Text>
      <TouchableOpacity
        style={[styles.button, styles.googleButton]}
        onPress={SignInWithGoogle}
      >
        {/* <Ionicons name="logo-google" size={17} color="#001e2b" /> */}
        <Image
          style={{
            width: 20,
            height: 20,
          }}
          source={require("../assets/googleicon.png")}
        />
        <Text style={styles.btnText}>Login with Google</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.button, styles.facebookButton]}
        onPress={SignInWithFacebook}
      >
        <Ionicons name="logo-facebook" size={20} color="#ffffff" />

        <Text
          style={[
            styles.btnText,
            {
              color: "#fff",
            },
          ]}
        >
          Login with Facebook
        </Text>
      </TouchableOpacity>
      <View style={styles.footer}>
        <Text style={styles.label}>Don't have an account? </Text>
        <TouchableOpacity onPress={() => navigation.navigate("Register")}>
          <Text style={styles.link}>Register</Text>
        </TouchableOpacity>
      </View>
      <View style={{ height: 90 }} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: Dimensions.get("window").height,
    alignItems: "center",
    justifyContent: "space-evenly",
    backgroundColor: "#001E2B",
  },
  inputContainer: {
    width: "80%",
  },
  title: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 25,
  },
  input: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  textInput: {
    color: "#001e2b",
    marginLeft: 5,
    width: "90%",
    fontSize: 12,
  },
  label: {
    color: "#ffffff",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "80%",
    padding: 10,
    backgroundColor: "#00ed64",
    borderColor: "#ffffff",
    borderWidth: 1,
    borderRadius: 5,
  },
  btnText: {
    marginLeft: 5,
  },
  footer: {
    flexDirection: "row",
  },
  link: {
    color: "#1877f2",
  },
  googleButton: {
    backgroundColor: "#ffffff",
  },
  facebookButton: {
    backgroundColor: "#1877f2",
  },
});

export default Login;
