import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Text,
} from "react-native";
import React, { useLayoutEffect, useState } from "react";
import { useRoute } from "@react-navigation/native";
import { db } from "../firebase";
import { collection, getCountFromServer } from "firebase/firestore";
import Input from "../components/Input";
import { Ionicons } from "@expo/vector-icons";
import HeaderLeft from "../components/HeaderLeft";
import HeaderRight from "../components/HeaderRight";
import Spinner from "react-native-loading-spinner-overlay";
import { createUserWithCredentials, uploadImage, pickImage } from "../utils";

const Register = ({ navigation }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [image, setImage] = useState();
  const [imagePreview, setImagePreview] = useState(null);

  const route = useRoute();

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "",
      headerStyle: { backgroundColor: "#ffffff" },
      headerLeft: () => <HeaderLeft navigation={navigation} />,
      headerRight: () => <HeaderRight navigation={navigation} />,
    });
  }, []);

  const register = async () => {
    const url = await uploadImage(image);

    const users = collection(db, "users");
    const snapshot = await getCountFromServer(users);
    const usersCount = snapshot.data().count;

    setIsLoading(true);
    createUserWithCredentials(
      name,
      email,
      password,
      url,
      usersCount,
      setIsLoading
    );
  };

  return (
    <KeyboardAvoidingView behavior="position" style={styles.container}>
      {isLoading && <Spinner visible={isLoading} color="#ffffff" />}
      <View style={{ alignItems: "center" }}>
        <Text style={styles.title}>Register</Text>
        <View style={styles.avatar}>
          {imagePreview ? (
            <Image
              source={{
                uri: imagePreview,
              }}
              style={styles.preview}
            />
          ) : (
            <Image
              source={require("../assets/defaultAvatar.png")}
              style={styles.preview}
            />
          )}

          <TouchableOpacity
            style={styles.selectAvatar}
            onPress={() => pickImage(setImage, setImagePreview, route)}
          >
            <Text style={styles.plus}>+</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.inputContainer}>
        <Input
          label="Full Name"
          icon="ios-person"
          size={20}
          value={name}
          setValue={setName}
          placeholder="Enter your name"
          isSecure={false}
        />

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
          onSubmit={register}
        />
      </View>
      <View style={{ alignItems: "center" }}>
        <TouchableOpacity style={styles.button} onPress={register}>
          <Ionicons name="person-add" size={20} color="#001e2b" />
          <Text style={styles.btnText}>Register</Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.label}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate("Login")}>
            <Text style={styles.link}>Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#001E2B",
  },
  title: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 25,
    marginBottom: 30,
    marginTop: 20,
  },
  avatar: {
    position: "relative",
    marginBottom: 20,
  },
  preview: {
    width: 70,
    height: 70,
    borderRadius: 50,
  },
  selectAvatar: {
    position: "absolute",
    alignItems: "center",
    backgroundColor: "#00ed64",
    borderRadius: 50,
    width: 20,
    top: "75%",
    left: "16%",
  },
  plus: {
    color: "#001E2B",
  },
  label: {
    color: "#ffffff",
  },
  inputContainer: {
    width: "80%",
  },
  button: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    padding: 10,
    marginTop: 20,
    backgroundColor: "#00ed64",
    borderColor: "#fff",
    borderWidth: 1,
    borderRadius: 5,
  },
  btnText: {
    marginLeft: 5,
  },
  footer: {
    flexDirection: "row",
    marginTop: 20,
  },
  link: {
    color: "#1877f2",
  },
});

export default Register;
