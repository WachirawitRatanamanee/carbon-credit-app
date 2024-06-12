import { Text, Button, View } from "react-native";

export default function TutotialPopup({ navigation }) {
  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Text style={{ fontSize: 30 }}>
        This is a Tutorialmodal!
      </Text>
      <Button
        onPress={() => navigation.goBack()}
        title="Dismiss"
      />
    </View>
  );
}
