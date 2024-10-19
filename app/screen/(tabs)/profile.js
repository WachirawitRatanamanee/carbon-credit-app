import {
  View,
  Text,
  StyleSheet,
  Image,
  ImageBackground,
  Alert,
} from "react-native";
import PressButton from "../../../components/pressButton";
import { AntDesign } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";
import { auth } from "../../../firebase";
import { signOut } from "firebase/auth";
import { useEffect } from "react";
import { ref, onValue, off } from "firebase/database";
import { database } from "../../../firebase";

export default function ProfileScreen({
  navigation,
  route,
}) {
  const userData = route.params.userData;
  const name = userData.name;
  const lastname = userData.lastname;
  const username = userData.username;

  useEffect(() => {
    const listener = ref(database, "users/" + username.toLowerCase());
    onValue(listener, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        navigation.setParams({
          userData: data,
        });
      }
    });
    return () => off(listener);
  }, []);

  const navigateToEdit = (userData) => {
    navigation.navigate("Edit", {
      userData: userData,
    });
  };

  const navigateToTutorialPopup = () => {
    navigation.navigate("TutotialPopup");
  };

  const logout = () => {
    Alert.alert("โปรดยืนยัน", "ท่านต้องการออกจากระบบ?", [
      {
        text: "ยืนยัน",
        onPress: handleSignOut,
      },
      {
        text: "ยกเลิก",
      },
    ]);
  };

  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        navigation.replace("Login");
      })
      .catch((error) => {
        alert(error.message);
      });
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../../../assets/images/pf-bg.jpg")}
        resizeMode="cover"
        style={styles.imageBackground}
        imageStyle={{ opacity: 0.3 }}
      >
        <View style={styles.profileSection}>
          <Text style={styles.text}>ข้อมูลส่วนตัว</Text>
          <Image
            source={require("../../../assets/images/icon.png")}
            style={styles.img}
          />
          <Text style={styles.textSmall}>
            {name} {lastname}
          </Text>
          <Text style={styles.textSmaller}>{username}</Text>
        </View>
        <View style={styles.pressSection}>
          <PressButton
            text={"แก้ไขข้อมูลส่วนตัว"}
            whenPress={() => navigateToEdit(userData)}
            icon={
              <FontAwesome5
                name="user-edit"
                size={20}
                color="black"
              />
            }
            next={true}
            // containerStyle={{ borderBottomWidth: 0 }}
          />
          {/* <PressButton
            text={"วิธีใช้งานแอพพลิเคชั่น"}
            whenPress={navigateToTutorialPopup}
            icon={
              <AntDesign
                name="questioncircleo"
                size={20}
                color="black"
              />
            }
            next={true}
          /> */}
          <PressButton
            text={"ออกจากระบบ"}
            whenPress={logout}
            color="red"
            myStyle={{ justifyContent: "center" }}
            containerStyle={{ borderTopWidth: 0 }}
          />
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageBackground: {
    flex: 1,
    justifyContent: "space-around",
    // backgroundColor: "rgba(0,360,0,0.1)",
  },
  profileSection: {
    alignItems: "center",
  },
  text: {
    fontSize: 28,
    fontWeight: "bold",
    alignSelf: "center",
  },
  textSmall: {
    fontSize: 20,
    alignSelf: "center",
    marginTop: 10,
    marginBottom: 5,
    fontWeight: "bold",
  },
  textSmaller: {
    fontSize: 16,
    alignSelf: "center",
  },
  img: {
    width: 150,
    height: 150,
    borderRadius: 1000,
    margin: 10,
    resizeMode: "stretch",
  },
});
