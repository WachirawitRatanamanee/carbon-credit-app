import { AntDesign } from "@expo/vector-icons";
import {
  Pressable,
  Text,
  View,
  StyleSheet,
} from "react-native";

module.exports = {
  DetailElement: function ({ detail }) {
    return (
      <View>
        <Text style={styles.text}>
          {" "}
          ชื่อ:{" "}
          <Text style={[styles.text, styles.data]}>
            {detail[0]}
          </Text>
        </Text>
        <Text style={styles.text}>
          {" "}
          นามสกุล:{" "}
          <Text style={[styles.text, styles.data]}>
            {detail[1]}
          </Text>
        </Text>
        <Text style={styles.text}>
          {" "}
          เบอร์โทร:{" "}
          <Text style={[styles.text, styles.data]}>
            {detail[2]}
          </Text>
        </Text>
        <Text style={styles.text}>
          {" "}
          เลขบัตรประชาชน:{" "}
          <Text style={[styles.text, styles.data]}>
            {detail[3]}
          </Text>
        </Text>
      </View>
    );
  },

  Element: function ({
    data,
    isExpand,
    setIsExpand,
    myStyle,
  }) {
    return (
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <Text style={myStyle}>{data}</Text>
        <View style={{ position: "relative" }}>
          <View
            style={{
              position: "absolute",
              right: 12,
              top: -8,
            }}
          >
            <Pressable
              onPress={() => setIsExpand(!isExpand)}
            >
              <View>
                {isExpand ? (
                  <AntDesign
                    name="infocirlce"
                    size={18}
                    color="black"
                  />
                ) : (
                  <AntDesign
                    name="infocirlceo"
                    size={18}
                    color="black"
                  />
                )}
              </View>
            </Pressable>
          </View>
        </View>
      </View>
    );
  },
};

const styles = StyleSheet.create({
  text: {
    fontSize: 15,
    padding: 5,
    color: "#333",
  },
  data: {
    fontWeight: "bold",
    color: "black",
  },
});
