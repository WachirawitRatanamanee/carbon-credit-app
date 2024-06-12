import {
  Pressable,
  Text,
  StyleSheet,
  View,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";

export default function PressButton({
  text,
  whenPress,
  icon = null,
  next = false,
  color = "black",
  myStyle = {},
  containerStyle = {},
}) {
  return (
    <Pressable style={[styles.container, containerStyle]} onPress={whenPress}>
      <View style={[styles.view, myStyle]}>
        <View style={styles.iconAndText}>
          {icon ? (
            <View
              style={{
                minWidth: "15%",
              }}
            >
              {icon}
            </View>
          ) : null}
          <Text style={[styles.text, { color: color }]}>
            {text}
          </Text>
        </View>
        {next ? (
          <AntDesign
            name="right"
            size={26}
            color="#36454F"
          />
        ) : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    padding: "3%",
    borderColor: "gray",
  },
  view: {
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
  },
  iconAndText: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  text: {
    fontSize: 20,
  },
});
