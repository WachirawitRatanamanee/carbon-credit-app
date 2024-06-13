import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
} from "react-native";

export default function HistoryScreen() {
  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../../../assets/images/history-bg.jpg")}
        resizeMode="cover"
        style={styles.imageBackground}
        imageStyle={{ opacity: 0.3 }}
      >
        <Text style={styles.text}>History Screen</Text>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alighItems: "center",
    justifyContent: "center",
    // backgroundColor: "rgba(0,360,0,0.07)",
  },
  imageBackground: {
    flex: 1,
    justifyContent: "space-evenly",
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
});
