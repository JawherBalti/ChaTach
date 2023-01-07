import {
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Dimensions,
  Image,
} from "react-native";
import React, { useLayoutEffect, useState } from "react";
import { Text } from "react-native-elements";
import { auth, db } from "../firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import * as ImagePicker from "expo-image-picker";
import { doc, setDoc } from "firebase/firestore";
import { Ionicons } from "@expo/vector-icons";
import HeaderLeft from "../components/HeaderLeft";
import HeaderRight from "../components/HeaderRight";

const Register = ({ navigation }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [image, setImage] = useState(
    "https://d2cbg94ubxgsnp.cloudfront.net/Pictures/2000xAny/9/9/2/512992_shutterstock_715962319converted_749269.png"
  );
  const [imagePreview, setImagePreview] = useState(null);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "",
      headerStyle: { backgroundColor: "#fff" },
      headerLeft: () => <HeaderLeft navigation={navigation} />,
      headerRight: () => <HeaderRight navigation={navigation} />,
    });
  }, []);

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      aspect: [4, 3],
      quality: 1,
      base64: true,
    });

    if (!result.canceled) {
      let imageObj = {
        uri: result.assets[0].uri,
        type: `test/${result.assets[0].uri.split(".")[1]}`,
        name: `test.${result.assets[0].uri.split(".")[1]}`,
      };
      setImage(imageObj);

      setImagePreview(result.assets[0].uri);
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

      return urlData.url;
    } catch (error) {
      alert(error.message);
    }
  };

  const register = async () => {
    const url = await uploadImage(image);

    createUserWithEmailAndPassword(auth, email, password)
      .then(async (authUser) => {
        await setDoc(doc(db, "users", authUser.user.uid), {
          displayName: name,
          email: email,
          photoURL: url,
          online: true,
        });
        updateProfile(authUser.user, {
          displayName: name,
          photoURL: url,
        });
      })
      .catch((err) => alert(err.message));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register</Text>

      {/* <Button title="Pick an image from camera roll" onPress={pickImage} /> */}
      <View style={styles.avatar}>
        <Image
          source={{
            uri:
              imagePreview ||
              "https://d2cbg94ubxgsnp.cloudfront.net/Pictures/2000xAny/9/9/2/512992_shutterstock_715962319converted_749269.png",
          }}
          style={styles.preview}
        />

        <TouchableOpacity style={styles.selectAvatar} onPress={pickImage}>
          <Text style={styles.plus}>+</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.inputContainer}>
        <View>
          <Text style={styles.label}>Full Name</Text>
          <View style={styles.input}>
            <Ionicons name="ios-person" size={20} color="#001e2b" />

            <TextInput
              value={name}
              onChangeText={(text) => setName(text)}
              placeholder="Enter your name"
              placeholderTextColor="grey"
              style={styles.textInput}
            />
          </View>
        </View>

        <View>
          <Text style={styles.label}>Email Address</Text>
          <View style={styles.input}>
            <Ionicons name="mail" size={20} color="#001e2b" />

            <TextInput
              value={email}
              onChangeText={(text) => setEmail(text)}
              placeholder="Enter email"
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
              placeholder="Password"
              secureTextEntry
              type="password"
              placeholderTextColor="grey"
              onSubmitEditing={register}
              style={styles.textInput}
            />
          </View>
        </View>
      </View>
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
  title: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 25,
  },
  avatar: {
    position: "relative",
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
    top: "70%",
    left: "13%",
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
  input: {
    flexDirection: "row",
    alignItems: "center",
    color: "#001E2B",
    backgroundColor: "#fff",
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
  button: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "80%",
    padding: 10,
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
  },
  link: {
    color: "#1877f2",
  },
});

export default Register;
