import {
  Text,
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  TouchableHighlight,
  Alert,
} from "react-native";
import { useState } from "react";

export default function EditScorePopup({ route }) {
  const [username, setUsername] = useState("");
  const [score, setScore] = useState(0);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    let errors = {};

    if (!username)
      errors.username = "กรุณากรอกบัญชีผู้ใช้งาน";
    if (route.params.text && !score)
      errors.score = "กรุณากรอกคะแนน";

    setErrors(errors);

    return Object.keys(errors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      Alert.alert(
        "โปรดยืนยัน",
        `${route.params.action} ${username} ${
          score ? `จำนวน ${score} คะแนน` : ""
        }?`,
        [
          {
            text: `ยืนยัน`,
            onPress: sendData,
          },
          {
            text: "ยกเลิก",
          },
        ]
      );
    }
  };

  const sendData = () => {
    console.log("Submitted", username, score);
    Alert.alert(
      `สำเร็จ`,
      `${route.params.action} ${username} ${
        score ? `จำนวน ${score} คะแนน` : "สำเร็จ"
      }`,
      [
        {
          text: `ตกลง`,
        },
      ]
    );
    setUsername("");
    setScore(0);
    setErrors({});
  };

  return (
    <KeyboardAvoidingView
      behavior="padding"
      style={styles.container}
    >
      <View style={styles.inputBox}>
        <Text style={styles.text}> บัญชีผู้ใช้งาน : </Text>
        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="โปรดกรอกบัญชีผู้ใช้งาน"
            value={username}
            onChangeText={setUsername}
          />
          {errors.username ? (
            <Text style={styles.errorText}>
              {errors.username}
            </Text>
          ) : null}
        </View>
        {route.params.text ? (
          <View>
            <Text style={styles.text}>
              {"\n"}
              {route.params.text} :
            </Text>
            <View style={styles.form}>
              <TextInput
                style={styles.input}
                placeholder="โปรดกรอกจำนวนคะแนน"
                value={score}
                onChangeText={setScore}
                keyboardType="numeric"
              />
              {errors.score ? (
                <Text style={styles.errorText}>
                  {errors.score}
                </Text>
              ) : null}
            </View>
          </View>
        ) : null}
      </View>
      <TouchableHighlight
        underlayColor="#ccc"
        style={{
          backgroundColor: "darkgreen",
          justifyContent: "center",
          alignItems: "center",
          marginTop: 20,
        }}
        onPress={handleSubmit}
      >
        <Text
          style={{
            color: "white",
            padding: 10,
            fontSize: 16,
          }}
        >
          ยืนยัน
        </Text>
      </TouchableHighlight>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: "10%",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
  },
  text: {
    fontSize: 18,
  },
  form: {
    marginTop: 10,
  },
  input: {
    height: 50,
    width: 300,
    borderColor: "darkgreen",
    borderWidth: 1,
    marginBottom: 15,
    padding: 10,
    borderRadius: 5,
    fontSize: 16,
  },
  errorText: {
    color: "red",
  },
});
