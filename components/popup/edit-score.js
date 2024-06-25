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
  const [scoreFoodWaste, setScoreFoodWaste] = useState("0");
  const [scoreOrganicWaste, setScoreOrganicWaste] =
    useState("0");
  const [scorePlasticWaste, setScorePlasticWaste] =
    useState("0");
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
    if (route.params.text && !scoreFoodWaste)
      errors.scoreFoodWaste =
        "กรุณากรอกคะแนนประเภทเศษอาหาร";

    if (route.params.text && !scoreOrganicWaste)
      errors.scoreOrganicWaste =
        "กรุณากรอกคะแนนประเภทขยะอินทรีย์";

    if (route.params.text && !scorePlasticWaste)
      errors.scorePlasticWaste =
        "กรุณากรอกคะแนนประเภทขยะพลาสติก";

    setErrors(errors);

    return Object.keys(errors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      Alert.alert(
        `${action}`,
        `${action} ${username} ใช่หรือไม่?`,
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
    let foodWaste;
    let organicWaste;
    let plasticWaste;
    if (typeAction == "increase") {
      foodWaste =
        parseInt(data.foodWaste) + parseInt(scoreFoodWaste);
      organicWaste =
        parseInt(data.organicWaste) +
        parseInt(scoreOrganicWaste);
      plasticWaste =
        parseInt(data.plasticWaste) +
        parseInt(scorePlasticWaste);
    }
    if (typeAction == "decrease") {
      let scoreMinus;
      foodWaste =
        parseInt(data.foodWaste) - parseInt(scoreFoodWaste);
      organicWaste =
        parseInt(data.organicWaste) -
        parseInt(scoreOrganicWaste);
      plasticWaste =
        parseInt(data.plasticWaste) -
        parseInt(scorePlasticWaste);
      if (
        foodWaste < 0 ||
        organicWaste < 0 ||
        plasticWaste < 0
      ) {
        if (foodWaste < 0) {
          scoreMinus = "เศษอาหาร";
        }
        if (organicWaste < 0) {
          if (scoreMinus)
            scoreMinus = scoreMinus + " และคะแนน";
          scoreMinus = scoreMinus + "ขยะอินทรีย์";
        }
        if (plasticWaste < 0) {
          if (scoreMinus)
            scoreMinus = scoreMinus + " และคะแนน";
          scoreMinus = scoreMinus + "ขยะพลาสติก";
        }
        Alert.alert(
          `ล้มเหลว`,
          `คะแนน${scoreMinus} ไม่สามารถต่ำกว่า 0 ได้`,
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
      foodWaste: foodWaste,
      organicWaste: organicWaste,
      plasticWaste: plasticWaste,
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
          `คุณได้${action} ${username} สำเร็จแล้ว`,
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

    setErrors({});
  };

  const filterNumberFoodWaste = (string) => {
    const cleanedInput = string.replace(/[^0-9]/g, "");
    const finalValue =
      cleanedInput === "" || cleanedInput === "0"
        ? "0"
        : cleanedInput.replace(/^0+/, "");
    setScoreFoodWaste(finalValue);
  };

  const filterNumberOrganicWaste = (string) => {
    const cleanedInput = string.replace(/[^0-9]/g, "");
    const finalValue =
      cleanedInput === "" || cleanedInput === "0"
        ? "0"
        : cleanedInput.replace(/^0+/, "");
    setScoreOrganicWaste(finalValue);
  };

  const filterNumberPlasticWaste = (string) => {
    const cleanedInput = string.replace(/[^0-9]/g, "");
    const finalValue =
      cleanedInput === "" || cleanedInput === "0"
        ? "0"
        : cleanedInput.replace(/^0+/, "");
    setScorePlasticWaste(finalValue);
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
            maxLength={20}
          />
          {errors.username ? (
            <Text style={styles.errorText}>
              {errors.username}
            </Text>
          ) : null}
        </View>

        {/* {route.params.text ? ( */}
        <View>
          <Text style={styles.text}>
            {"\n"}
            {route.params.text}ประเภทเศษอาหาร :
          </Text>
          <View style={styles.form}>
            <View>
              <TextInput
                style={styles.input}
                placeholder="โปรดกรอกจำนวนคะแนน"
                value={scoreFoodWaste}
                onChangeText={filterNumberFoodWaste}
                keyboardType="numeric"
                maxLength={6}
              />
            </View>
            {errors.scoreFoodWaste ? (
              <Text style={styles.errorText}>
                {errors.scoreFoodWaste}
              </Text>
            ) : null}
          </View>

          <Text style={styles.text}>
            {"\n"}
            {route.params.text}ประเภทขยะอินทรีย์ :
          </Text>
          <View style={styles.form}>
            <View>
              <TextInput
                style={styles.input}
                placeholder="โปรดกรอกจำนวนคะแนน"
                value={scoreOrganicWaste}
                onChangeText={filterNumberOrganicWaste}
                keyboardType="numeric"
                maxLength={6}
              />
            </View>
            {errors.scoreOrganicWaste ? (
              <Text style={styles.errorText}>
                {errors.scoreOrganicWaste}
              </Text>
            ) : null}
          </View>

          <Text style={styles.text}>
            {"\n"}
            {route.params.text}ประเภทขยะพลาสติก :
          </Text>
          <View style={styles.form}>
            <View>
              <TextInput
                style={styles.input}
                placeholder="โปรดกรอกจำนวนคะแนน"
                value={scorePlasticWaste}
                onChangeText={filterNumberPlasticWaste}
                keyboardType="numeric"
                maxLength={6}
              />
            </View>
            {errors.scorePlasticWaste ? (
              <Text style={styles.errorText}>
                {errors.scorePlasticWaste}
              </Text>
            ) : null}
          </View>
        </View>
        {/* ) : null} */}
      </View>
      <TouchableHighlight
        underlayColor="#ccc"
        style={{
          backgroundColor: "darkgreen",
          justifyContent: "center",
          alignItems: "center",
          marginTop: 20,
          borderRadius: 5,
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
