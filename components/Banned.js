import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import React, { useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { auth, db } from "../firebase";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";

const Banned = () => {
  const [input, setInput] = useState("");
  const [unbanRequestSent, setUnbanRequestSent] = useState(false);

  useEffect(() => {
    if (auth.currentUser) {
      getUser();
    }
  }, []);

  const getUser = async () => {
    const userRef = doc(db, "users", auth?.currentUser?.uid);
    const userSnap = await getDoc(userRef);
    setUnbanRequestSent(userSnap.data().unbanRequestSent);
  };

  const sendRequest = () => {
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

  return (
    <KeyboardAvoidingView behavior="position" style={styles.container}>
      <Text style={styles.title}>
        This account has been banned! You can send an unban request to our
        moderator.
      </Text>
      <View>
        <View style={styles.form}>
          <Image
            style={{
              width: 250,
              height: 250,
            }}
            source={require("../assets/banned.gif")}
          />

          {unbanRequestSent ? (
            <Text style={{ color: "#fff" }}>
              Your unban request has been sent
            </Text>
          ) : (
            <>
              <View style={styles.input}>
                <Ionicons
                  name="chatbubbles-outline"
                  size={20}
                  color="#001e2b"
                />

                <TextInput
                  style={styles.textInput}
                  placeholder="Why you should be unbanned?"
                  value={input}
                  onChangeText={(text) => setInput(text)}
                  onSubmitEditing={sendRequest}
                />
              </View>
              <TouchableOpacity style={styles.button} onPress={sendRequest}>
                <Ionicons name="warning" size={20} color="#001e2b" />
                <Text style={styles.btnText}>Unban request</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: "#001E2B",
    flex: 1,
  },
  title: {
    textAlign: "center",
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 20,
    marginTop: 30,
  },
  form: {
    alignItems: "center",
    width: "100%",
    padding: 15,
  },
  input: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ececec",
    bottom: 0,
    height: 45,
    padding: 10,
    borderRadius: 10,
    width: "80%",
    marginBottom: 10,
  },
  textInput: {
    color: "#001e2b",
    marginLeft: 5,
    width: "80%",
    height: 45,
    fontSize: 12,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "45%",
    height: 45,
    padding: 10,
    backgroundColor: "#00ed64",
    borderColor: "#ffffff",
    borderWidth: 1,
    borderRadius: 5,
  },
  btnText: {
    marginLeft: 5,
  },
});

export default Banned;
