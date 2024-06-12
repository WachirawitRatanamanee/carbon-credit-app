import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "./screen/(stacks)/auth/login";
import Tabs from "./tabs";
import Edit from "./screen/(stacks)/edit";
import { StyleSheet, Pressable, View } from "react-native";
import TutotialPopup from "../components/popup/tutorial";
import TypePopup from "../components/popup/type";
import EditScorePopup from "../components/popup/edit-score";
import Register from "./screen/(stacks)/auth/register";
import Forgot from "./screen/(stacks)/auth/forgot";
import { AntDesign } from "@expo/vector-icons";

const Stack = createNativeStackNavigator();

export default function Stacks({ navigation }) {
  return (
    // If users have session, hidden login screen
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: "green",
        },
        headerTintColor: "#fff",
        headerTitleAlign: "center",
        headerLeft: () => (
          <Pressable onPress={() => navigation.goBack()}>
            <View style={{ marginRight: 10 }}>
              <AntDesign
                name="left"
                size={26}
                color="white"
              />
            </View>
          </Pressable>
        ),
      }}
    >
      <Stack.Group>
        <Stack.Group>
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Register"
            component={Register}
            options={{
              headerShown: false,
              title: "สมัครสมาชิก",
            }}
          />
          <Stack.Screen
            name="Forgot"
            component={Forgot}
            options={{
              headerShown: false,
              title: "ลืมรหัสผ่าน",
            }}
          />
        </Stack.Group>
        <Stack.Screen
          name="Tabs"
          component={Tabs}
          options={{
            headerShown: false,
            title: "หน้าหลัก",
          }}
        />
        <Stack.Screen
          name="Edit"
          component={Edit}
          options={{
            headerShown: true,
            title: "แก้ไขข้อมูลส่วนตัว",
          }}
        />
      </Stack.Group>
      <Stack.Group
        screenOptions={{ presentation: "modal" }}
      >
        <Stack.Screen
          name="TutotialPopup"
          component={TutotialPopup}
          options={{ title: "วิธืใช้งานแอพพลิเคชั่น" }}
        />
        <Stack.Screen
          name="TypePopup"
          component={TypePopup}
          options={{ title: "ประเภทขยะ" }}
        />
        <Stack.Screen
          name="EditScorePopup"
          component={EditScorePopup}
          options={({ route }) => ({
            title: route.params.action,
          })}
        />
      </Stack.Group>
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "green",
    paddingHorizontal: 200,
  },
});
