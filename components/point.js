import {
  Pressable,
  Text,
  StyleSheet,
  View,
  Dimensions,
} from "react-native";

export default function Point({
  text,
  whenPress = () => {},
  icon = null,
  color = "black",
  myStyle = {},
  point = 0,
}) {
  return (
    <Pressable style={styles.container} onPress={whenPress}>
      <View>
        <View
          style={{
            position: "absolute",
          }}
        >
          {icon}
        </View>
        <View style={styles.circle}></View>
        <View style={styles.styleText}>
          <Text style={[styles.justText, { color: color }]}>
            {"\n"}
            {text}
          </Text>
        </View>
        <View style={styles.point}>
          <Text
            style={[styles.text, { color: color }, myStyle]}
          >
            {point}
          </Text>
          <View style={styles.styleText}>
            <Text
              style={[
                styles.justText,
                { color: color },
                { marginTop: 2 },
              ]}
            >
              แต้ม
            </Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
  },
  point: {
    borderWidth: 2,
    borderColor: "#004000",
    borderRadius:
      Math.round(
        Dimensions.get("window").width +
          Dimensions.get("window").height
      ) / 2,
    width: Dimensions.get("window").width * 0.45,
    height: Dimensions.get("window").width * 0.45,
    justifyContent: "center",
    alignItems: "center",
  },
  justText: {
    position: "absolute",
    fontSize: 24,
    textAlign: "center",
  },
  styleText: {
    alignItems: "center",
  },
  text: {
    fontSize: 32,
    textAlign: "center",
    fontWeight: "bold",
  },
  circle: {
    borderWidth: 2,
    borderColor: "#004000",
    borderRadius:
      Math.round(
        Dimensions.get("window").width +
          Dimensions.get("window").height
      ) / 2,
    width: Dimensions.get("window").width * 0.45,
    height: Dimensions.get("window").width * 0.45,
    position: "absolute",
    backgroundColor: "rgba(0, 64, 0, 0.1)",
  }
});
