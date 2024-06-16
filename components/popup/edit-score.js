import {
  Text,
  View,
  StyleSheet,
  KeyboardAvoidingView,
  TextInput,
  TouchableHighlight,
  Alert,
} from "react-native";
import { useState } from "react";
import { ref, update } from "firebase/database";
import { database } from "../../firebase";

export default function EditScorePopup({
  navigation,
  route,
}) {
  const [username, setUsername] = useState("");
  const [score, setScore] = useState(0);
  const [errors, setErrors] = useState({});
  const allUsers = route.params.allUsers;
  const tableDataArr = Object.entries(allUsers);
  const action = route.params.action;
  const typeAction = route.params.typeAction;
  let flagError = false;

  let allUsername = [];
  tableDataArr.map((value, index) => {
    allUsername.push(value[0]);
  });

  const validateForm = () => {
    let errors = {};

    if (!allUsername.includes(username))
      errors.username = "ไม่พบบัญชีผู้ใช้งานนี้";

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
        `${action} ${username} ${
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

  const updateData = (user, typeAction) => {
    let data = {};
    flagError = false;
    tableDataArr.map((value, index) => {
      if (user == value[0]) {
        data = value[1];
      }
    });
    let point;
    if (typeAction == "increase") {
      point = parseInt(data.point) + parseInt(score);
    }
    if (typeAction == "decrease") {
      point = parseInt(data.point) - parseInt(score);
      if (point < 0) {
        Alert.alert(
          `ล้มเหลว`,
          `คะแนนไม่สามารถต่ำกว่า 0 ได้`,
          [
            {
              text: `ตกลง`,
            },
          ]
        );
        flagError = true;
        return;
      }
    }

    const updatedData = {
      ...data,
      point: point,
    };
    const updates = {};
    updates["/users/" + data.username] = updatedData;
    return update(ref(database), updates);
  };

  // const deleteUser = (user) => {
  //   tableDataArr.map((value, index) => {
  //     if (user == value[0]) {
  //       data = value[1];
  //     }
  //   });
  //   const updates = {};
  //   updates["/users/" + data.username] = null;
  //   return update(ref(database), updates);
  // };

  const sendData = () => {
    try {
      if (
        typeAction == "increase" ||
        typeAction == "decrease"
      ) {
        updateData(username, typeAction);
      }
      // if (typeAction == "delete") {
      //   deleteUser(username);
      // }
      if (!flagError) {
        Alert.alert(
          `สำเร็จ`,
          `คุณได้${action} ${username} ${
            score ? `จำนวน ${score} คะแนน` : "สำเร็จ"
          }`,
          [
            {
              text: `ตกลง`,
              onPress: () => navigation.goBack(),
            },
          ]
        );
      }
    } catch (error) {
      err = error.code;
      Alert.alert(``, `${err}`, [
        {
          text: `ตกลง`,
        },
      ]);
    }

    setScore(0);
    setErrors({});
  };

  const filterNumber = (string) => {
    setScore(string.replace(/[^0-9+]/g, ""));
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
                onChangeText={filterNumber}
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
