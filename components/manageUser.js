import {
  Pressable,
  Text,
  StyleSheet,
  View,
} from "react-native";
import { ref, update } from "firebase/database";
import { database } from "../firebase";

export default function ManageUserButton({
  text,
  whenPress = () => {},
  icon = null,
  color = "black",
  myStyle = {},
  marginV = "3%",
}) {
  return (
    <Pressable
      style={[
        styles.container,
        { marginVertical: marginV },
      ]}
      onPress={whenPress}
    >
      <View style={styles.icon}>{icon}</View>
      <Text
        style={[styles.text, { color: color }, myStyle]}
      >
        {text}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    width: "30%",
  },
  icon: {
    borderWidth: 2,
    borderRadius: 1000,
    padding: 10,
    borderColor: "#004000",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 18,
    textAlign: "center",
  },
});
