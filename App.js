import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Login from "./screens/Login";
import Register from "./screens/Register";
import Home from "./screens/Home";
import PrivateChat from "./screens/PrivateChat";
import PublicChat from "./screens/PublicChat";
import CreateRoom from "./screens/CreateRoom";

const Stack = createNativeStackNavigator();

const globalScreenOptions = {
  headerStyle: { backgroundColor: "#fff" },
  headerTitleStyle: { color: "white" },
  headerTintColor: "white",
  headerTitleAlign: "center",
};

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={globalScreenOptions}
      >
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="CreateRoom" component={CreateRoom} />
        <Stack.Screen name="PublicChat" component={PublicChat} />
        <Stack.Screen name="PrivateChat" component={PrivateChat} />
      </Stack.Navigator>
      <StatusBar style="light" />
    </NavigationContainer>
  );
}
