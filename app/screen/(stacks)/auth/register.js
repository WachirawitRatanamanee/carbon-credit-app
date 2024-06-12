import {
  Text,
  View,
  StyleSheet,
  KeyboardAvoidingView,
  TextInput,
  TouchableHighlight,
  Alert,
  ScrollView,
  ImageBackground,
} from "react-native";
import { useState } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { auth, database } from "../../../../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { ref, set } from "firebase/database";

export default function Register({ navigation }) {
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [lastname, setLastname] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [errors, setErrors] = useState({});

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const toggleShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const validateForm = () => {
    let errors = {};

    if (!username)
      errors.username = "กรุณากรอกชื่อผู้ใช้งาน";
    if (!name) errors.name = "กรุณากรอกชื่อ";
    if (!lastname) errors.lastname = "กรุณากรอกนามสกุล";
    if (!phone) errors.phone = "กรุณากรอกเบอร์โทรศัพท์";
    if (!password) errors.password = "กรุณากรอกรหัสผ่าน";
    if (!confirmPassword)
      errors.confirmPassword = "กรุณากรอกยืนยันรหัสผ่าน";

    if (password !== confirmPassword)
      errors.confirmPassword = "รหัสผ่านไม่ตรงกัน";

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = () => {
    createUserWithEmailAndPassword(auth, username, password)
      .then(() => {
        auth.onAuthStateChanged((user) => {
          if (user) {
            const save = set(
              ref(database, "users/" + user.uid),
              {
                username: username,
                name: name,
                lastname: lastname,
                phone: phone,
              }
            );
            console.log(save);
          }
        });
      })
      .catch((error) => {
        alert(error.message);
      });

    if (validateForm()) {
      Alert.alert(
        "โปรดตรวจสอบอีกครั้ง",
        "โปรดยืนยันความถูกต้องของข้อมูล",
        [
          {
            text: `สมัครสมาชิก`,
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
    Alert.alert(
      `สมัครสมาชิกสำเร็จ`,
      `ข้อมูลของคุณได้รับการบันทึกแล้ว`,
      [
        {
          text: `ตกลง`,
        },
      ]
    );
    navigation.goBack();
  };

  const cancel = () => {
    if (
      username ||
      name ||
      lastname ||
      phone ||
      password ||
      confirmPassword
    ) {
      Alert.alert(
        "ท่านต้องการย้อนกลับหรือไม่",
        `การเปลี่ยนแปลงทั้งหมดจะโดนละทิ้ง`,
        [
          {
            text: `ยืนยัน`,
            onPress: () => navigation.goBack(),
          },
          {
            text: "ยกเลิก",
          },
        ]
      );
    } else {
      navigation.goBack();
    }
  };

  return (
    <ImageBackground
      source={require("../../../../assets/images/login-bg.jpg")}
      resizeMode="cover"
      style={styles.imageBackground}
      imageStyle={{ opacity: 0.1 }}
    >
      <KeyboardAvoidingView
        behavior="padding"
        style={styles.container}
      >
        <ScrollView>
          <Text style={styles.bigText}>สมัครสมาชิก</Text>
          <View style={styles.inputBox}>
            <View>
              <Text style={styles.text}>
                ชื่อผู้ใช้งาน :
              </Text>
              <View style={styles.form}>
                <TextInput
                  style={[
                    styles.input,
                    errors.username ? styles.ifError : {},
                  ]}
                  placeholder="โปรดกรอกชื่อผู้ใช้งาน"
                  value={username}
                  onChangeText={setUsername}
                />
                {errors.username ? (
                  <Text style={styles.errorText}>
                    {errors.username}
                  </Text>
                ) : null}
              </View>
              <Text style={styles.text}>ชื่อ : </Text>
              <View style={styles.form}>
                <TextInput
                  style={[
                    styles.input,
                    errors.name ? styles.ifError : {},
                  ]}
                  placeholder="โปรดกรอกชื่อ"
                  value={name}
                  onChangeText={setName}
                />
                {errors.name ? (
                  <Text style={styles.errorText}>
                    {errors.name}
                  </Text>
                ) : null}
              </View>

              <Text style={styles.text}>นามสกุล : </Text>
              <View style={styles.form}>
                <TextInput
                  style={[
                    styles.input,
                    errors.lastname ? styles.ifError : {},
                  ]}
                  placeholder="โปรดกรอกนามสกุล"
                  value={lastname}
                  onChangeText={setLastname}
                />
                {errors.lastname ? (
                  <Text style={styles.errorText}>
                    {errors.lastname}
                  </Text>
                ) : null}
              </View>

              <Text style={styles.text}>
                เบอร์โทรศัพท์ :
              </Text>
              <View style={styles.form}>
                <TextInput
                  style={[
                    styles.input,
                    errors.phone ? styles.ifError : {},
                  ]}
                  placeholder="โปรดกรอกเบอร์โทรศัพท์"
                  value={phone}
                  onChangeText={setPhone}
                  keyboardType="numeric"
                />
                {errors.phone ? (
                  <Text style={styles.errorText}>
                    {errors.phone}
                  </Text>
                ) : null}
              </View>

              <Text style={styles.text}>รหัสผ่าน :</Text>
              <View style={styles.form}>
                <View
                  style={[
                    styles.input,
                    styles.passwordForm,
                    errors.password ? styles.ifError : {},
                  ]}
                >
                  <TextInput
                    style={styles.passwordInput}
                    secureTextEntry={!showPassword}
                    value={password}
                    onChangeText={setPassword}
                    placeholder="โปรดกรอกรหัสผ่าน"
                  />
                  <MaterialCommunityIcons
                    name={showPassword ? "eye" : "eye-off"}
                    size={22}
                    color="#aaa"
                    style={styles.hiddenIcon}
                    onPress={toggleShowPassword}
                  />
                </View>
                {errors.password ? (
                  <Text style={styles.errorText}>
                    {errors.password}
                  </Text>
                ) : null}
              </View>

              <Text style={styles.text}>
                ยืนยันรหัสผ่าน :
              </Text>

              <View style={styles.form}>
                <View
                  style={[
                    styles.input,
                    styles.passwordForm,
                    { marginBottom: 0 },
                    errors.confirmPassword
                      ? styles.ifError
                      : {},
                  ]}
                >
                  <TextInput
                    style={styles.passwordInput}
                    secureTextEntry={!showConfirmPassword}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    placeholder="โปรดยืนยันรหัสผ่าน"
                  />
                  <MaterialCommunityIcons
                    name={
                      showConfirmPassword
                        ? "eye"
                        : "eye-off"
                    }
                    size={22}
                    color="#aaa"
                    style={styles.hiddenIcon}
                    onPress={toggleShowConfirmPassword}
                  />
                </View>
                {errors.confirmPassword ? (
                  <Text
                    style={[
                      styles.errorText,
                      { marginBottom: 0 },
                    ]}
                  >
                    {errors.confirmPassword}
                  </Text>
                ) : null}
              </View>
              <View style={styles.buttonContainer}>
                <TouchableHighlight
                  underlayColor="#ccc"
                  style={styles.button}
                  onPress={handleSubmit}
                >
                  <Text style={styles.buttonText}>
                    สมัครสมาชิก
                  </Text>
                </TouchableHighlight>
                <TouchableHighlight
                  underlayColor="#ccc"
                  style={styles.button}
                  onPress={cancel}
                >
                  <Text style={styles.buttonText}>
                    ย้อนกลับ
                  </Text>
                </TouchableHighlight>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(0,360,0,0.07)",
  },
  imageBackground: {
    flex: 1,
    justifyContent: "space-evenly",
  },
  bigText: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: "10%",
  },
  inputBox: {
    marginTop: "5%",
    alignItems: "center",
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
    marginBottom: 10,
    padding: 10,
    borderRadius: 5,
    fontSize: 16,
  },
  errorText: {
    color: "red",
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: "10%",
  },
  passwordForm: {
    flexDirection: "row",
    alignItems: "center",
  },
  passwordInput: {
    fontSize: 16,
    width: "85%",
    maxWidth: "85%",
  },
  hiddenIcon: { marginLeft: 10 },
  button: {
    backgroundColor: "darkgreen",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: "white",
    padding: 10,
    fontSize: 16,
  },
  ifError: {
    marginBottom: 5,
  },
});
