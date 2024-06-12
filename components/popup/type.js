import { View } from "react-native";
import Expand from "../expand";

export default function TypePopup({ navigation }) {
  return (
    <View style={{ flex: 1 }}>
      <Expand
        data={[
          {
            id: 1,
            title: "ประเภทพลาสติก",
            content: [
              `พลาสติกอิหยังวะ : กก`,
              `พลาสติกอิหยังวะแบบสอง : กก`,
            ],
            price: [100, 200],
          },
          {
            id: 2,
            title: "บ้าน",
            content: [`eiei jaja`, "รับบ้าน"],
            price: [200, 200],
          },
        ]}
      />
    </View>
  );
}
