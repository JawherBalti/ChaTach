import React, { useEffect, useLayoutEffect, useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image,
  Text,
} from "react-native";
import { auth, db } from "../firebase";
import {
  collection,
  getCountFromServer,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { Ionicons } from "@expo/vector-icons";
import HeaderRight from "../components/HeaderRight";
import HeaderLeft from "../components/HeaderLeft";
import Input from "../components/Input";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import * as Facebook from "expo-auth-session/providers/facebook";
import Spinner from "react-native-loading-spinner-overlay";
import {
  uploadImage,
  signInWithCredentials,
  createUserWithSocials,
} from "../utils";

WebBrowser.maybeCompleteAuthSession();

const Login = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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
      headerStyle: { backgroundColor: "#ffffff" },
      headerLeft: () => <HeaderLeft navigation={navigation} />,
      headerRight: () => <HeaderRight navigation={navigation} />,
    });
  }, []);

  //listens to any authentication or logout attempt from any page of the app
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        navigation.replace("Home");
      }
    });
    return unsubscribe;
  }, []);

  const login = () => {
    //no need for the clause because we have a listener in the useEffect
    setIsLoading(true);
    signInWithCredentials(email, password, setIsLoading);
  };

  //signin with facebook
  const SignInWithFacebook = () => {
    let user = {};
    setIsLoading(true);
    facebookPromptLogin().then(async (response) => {
      if (response.type === "success") {
        let userInfo = await fetch(
          `https://graph.facebook.com/me?fields=name,email,picture&access_token=${response.authentication.accessToken}`
        );
        userInfo.json().then(async (data) => {
          //find a user by email
          const usersRef = collection(db, "users");
          const userQuery = query(usersRef, where("email", "==", data.email));
          const querySnapshot = await getDocs(userQuery);
          querySnapshot.forEach((doc) => {
            if (doc) {
              user = doc.data();
            }
          });

          //if user exists, signin else create one
          if (Object.keys(user).length !== 0) {
            signInWithCredentials(data.email, data.name, setIsLoading);
          } else {
            const url = await uploadImage(data.picture.data.url);

            const users = collection(db, "users");
            const snapshot = await getCountFromServer(users);
            const usersCount = snapshot.data().count;
            createUserWithSocials(data, url, usersCount, setIsLoading);
          }
        });
      }
    });
  };

  //signin with google
  const SignInWithGoogle = async () => {
    let user = {};
    setIsLoading(true);
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
          //find a user by email
          const usersRef = collection(db, "users");
          const userQuery = query(usersRef, where("email", "==", data.email));
          const querySnapshot = await getDocs(userQuery);
          querySnapshot.forEach((doc) => {
            if (doc) {
              user = doc.data();
            }
          });

          //if user exists, signin else create one
          if (Object.keys(user).length !== 0) {
            signInWithCredentials(data.email, data.picture, setIsLoading);
          } else {
            const url = await uploadImage(data.picture);
            const users = collection(db, "users");
            const snapshot = await getCountFromServer(users);
            const usersCount = snapshot.data().count;
            createUserWithSocials(data, url, usersCount, setIsLoading);
          }
        });
      }
    });
  };

  return (
    <View style={styles.container}>
      {isLoading && <Spinner visible={isLoading} color="#ffffff" />}
      <Text style={styles.title}>Login</Text>

      <View style={styles.inputContainer}>
        <Input
          label="Email Address"
          icon="mail"
          size={20}
          value={email}
          setValue={setEmail}
          placeholder="Enter your email"
          isSecure={false}
          type="email"
        />

        <Input
          label="Password"
          icon="key"
          size={20}
          value={password}
          setValue={setPassword}
          placeholder="Enter your password"
          isSecure={true}
          type="password"
          onSubmit={login}
        />
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
  label: {
    color: "#ffffff",
    fontSize: 12,
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
