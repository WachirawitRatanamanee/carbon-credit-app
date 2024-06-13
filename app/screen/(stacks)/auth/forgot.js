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
import { ref, set } from "firebase/database";
import { updatePassword } from "firebase/auth";

export default function Forgot({ navigation }) {
  const [username, setUsername] = useState("");
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

    if (
      !/^(?=[a-zA-Z0-9._]{1,20}$)(?!.*[_.]{2})[^_.].*[^_.]$/g.test(
        username
      )
    ) {
      errors.username = "รูปแบบชื่อผู้ใช้งานไม่ถูกต้อง";
    }

    if (password.length < 6) {
      errors.password =
        "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร";
    }

    if (!username)
      errors.username = "กรุณากรอกชื่อผู้ใช้งาน";
    if (!phone) errors.phone = "กรุณากรอกเบอร์โทรศัพท์";
    if (!password) errors.password = "กรุณากรอกรหัสผ่าน";
    if (!confirmPassword)
      errors.confirmPassword = "กรุณากรอกยืนยันรหัสผ่าน";

    if (password !== confirmPassword)
      errors.confirmPassword = "รหัสผ่านไม่ตรงกัน";

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleError = (error) => {
    console.log(error);
    switch (error) {
      case "auth/account-exists-with-different-credential":
      case "auth/email-already-in-use":
        return "ชื่อผู้ใช้งานนี้ถูกใช้แล้ว";
      case "auth/wrong-password":
        return "ชื่อผู้ใช้งานหรือรหัสผ่านไม่ถูกต้อง";
      case "auth/user-not-found":
        return "ไม่พบผู้ใช้ด้วยชื่อบัญชีนี้";
      case "auth/user-disabled":
        return "ผู้ใช้ถูกระงับ";
      case "auth/too-many-requests":
        return "มีคำร้องขอเข้าสู่ระบบมากเกินไปสำหรับบัญชีนี้";
      case "auth/operation-not-allowed":
        return "เกิดข้อผิดพลาดบนเซิร์ฟเวอร์ โปรดลองอีกครั้งในภายหลัง";
      case "auth/invalid-email":
        return "ชื่อผู้ใช้งานนี้ไม่ถูกต้อง";
      default:
        return "การเข้าสู่ระบบล้มเหลว กรุณาลองอีกครั้ง";
    }
  };

  const handleSubmit = () => {
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
    updatePassword(username, password)
      .then(() => {
        Alert.alert(
          `สมัครสมาชิกสำเร็จ`,
          `ข้อมูลของคุณได้รับการบันทึกแล้ว`,
          [
            {
              text: `ตกลง`,
            },
          ]
        );
        // navigation.goBack();
      })
      .catch((error) => {
        err = handleError(error.code);
        Alert.alert(`เกิดข้อผิดพลาด`, `${err}`, [
          {
            text: `ตกลง`,
          },
        ]);
      });
  };

  const cancel = () => {
    if (username || phone || password || confirmPassword) {
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
    // <ImageBackground
    //   source={require("../../../../assets/images/login-bg.jpg")}
    //   resizeMode="cover"
    //   style={styles.imageBackground}
    //   imageStyle={{ opacity: 0.1 }}
    // >
    <KeyboardAvoidingView
      behavior="padding"
      style={styles.container}
    >
      <ScrollView>
        <Text style={styles.bigText}>ลืมรหัสผ่าน</Text>
        <View style={styles.inputBox}>
          <View>
            <Text style={styles.text}>
              ชื่อผู้ใช้งานของคุณ :
            </Text>
            <View style={styles.form}>
              <TextInput
                style={[
                  styles.input,
                  errors.username ? styles.ifError : {},
                ]}
                value={username}
                onChangeText={setUsername}
              />
              {errors.username ? (
                <Text style={styles.errorText}>
                  {errors.username}
                </Text>
              ) : null}
            </View>

            <Text style={styles.text}>
              เบอร์โทรศัพท์ของคุณ :
            </Text>
            <View style={styles.form}>
              <TextInput
                style={[
                  styles.input,
                  errors.phone ? styles.ifError : {},
                ]}
                value={phone}
                onChangeText={setPhone}
                keyboardType="numeric"
                maxLength={10}
              />
              {errors.phone ? (
                <Text style={styles.errorText}>
                  {errors.phone}
                </Text>
              ) : null}
            </View>

            <Text style={styles.text}>รหัสผ่านใหม่ :</Text>
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
                />
                <MaterialCommunityIcons
                  name={
                    showConfirmPassword ? "eye" : "eye-off"
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
                  เปลี่ยนรหัสผ่าน
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
    // </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: "rgba(0,360,0,0.07)",
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
