import { useState, useEffect } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Text,
  TouchableHighlight,
  ImageBackground,
  Alert,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, database } from "../../../../firebase";
import { ref, child, get } from "firebase/database";

const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        const username = user.email.replace(
          "@gmail.com",
          ""
        );
        let userData = {};
        const dbRef = ref(database);
        get(child(dbRef, "/users/" + username))
          .then((snapshot) => {
            if (snapshot.exists()) {
              userData = snapshot.val();
              navigation.replace("Tabs", {
                username: username,
                userData: userData,
              });
            }
          })
          .catch((error) => {
            Alert.alert("Something went wrong!", error);
          });
      }
    });
    return unsubscribe;
  }, []);

  const [showPassword, setShowPassword] = useState(false);
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
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
    if (!password) errors.password = "กรุณากรอกรหัสผ่าน";

    setErrors(errors);

    return Object.keys(errors).length === 0;
  };

  const handleError = (error) => {
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
      case "auth/invalid-credential":
        return "ชื่อผู้ใช้งานหรือรหัสผ่านไม่ถูกต้อง";
      default:
        return "การเข้าสู่ระบบล้มเหลว กรุณาลองอีกครั้ง";
    }
  };

  const handleSubmit = () => {
    if (validateForm()) {
      signInWithEmailAndPassword(
        auth,
        username + "@gmail.com",
        password
      ).catch((error) => {
        err = handleError(error.code);
        Alert.alert(``, `${err}`, [
          {
            text: `ตกลง`,
          },
        ]);
      });
    }
  };

  const handleRegister = () => {
    navigation.navigate("Register");
  };

  const handleForgot = () => {
    navigation.navigate("Forgot");
  };

  return (
    <ImageBackground
      source={require("../../../../assets/images/login-bg.jpg")}
      resizeMode="cover"
      style={styles.imageBackground}
      imageStyle={{ opacity: 0.8 }}
    >
      <KeyboardAvoidingView
        behavior="padding"
        style={styles.container}
      >
        <View style={styles.form}>
          <Text style={styles.labelHead}>
            ชื่อผู้ใช้งาน
          </Text>
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
          <Text style={styles.labelHead}>รหัสผ่าน</Text>
          <View
            style={[
              {
                height: 50,
                borderColor: "darkgreen",
                borderWidth: 1,
                marginBottom: 10,
                padding: 10,
                borderRadius: 5,
                flexDirection: "row",
                alignItems: "center",
              },
              errors.password ? styles.ifError : {},
            ]}
          >
            <TextInput
              style={{
                fontSize: 16,
                width: "85%",
                maxWidth: "85%",
              }}
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
            />
            <MaterialCommunityIcons
              name={showPassword ? "eye" : "eye-off"}
              size={22}
              color="#aaa"
              style={{ marginLeft: 10 }}
              onPress={toggleShowPassword}
            />
          </View>
          {errors.password ? (
            <Text style={styles.errorText}>
              {errors.password}
            </Text>
          ) : null}
          <TouchableHighlight
            underlayColor="#ccc"
            style={[
              {
                backgroundColor: "darkgreen",
                justifyContent: "center",
                alignItems: "center",
                marginTop: 10,
                borderRadius: 5,
              },
              errors.password ? { marginTop: 5 } : {},
            ]}
            onPress={handleSubmit}
          >
            <Text
              style={{
                color: "white",
                padding: 10,
                fontSize: 16,
              }}
            >
              เข้าสู่ระบบ
            </Text>
          </TouchableHighlight>
          <View style={styles.register}>
            <Text style={styles.label}>
              ยังไม่มีบัญชี?{" "}
            </Text>
            <TouchableHighlight
              underlayColor="#ccc"
              style={{
                backgroundColor: "firebrick",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 5,
              }}
              onPress={handleRegister}
            >
              <Text
                style={{
                  color: "white",
                  padding: 10,
                  fontSize: 16,
                }}
              >
                สมัครสมาชิก
              </Text>
            </TouchableHighlight>
          </View>
          {/* <View style={styles.register}>
            <TouchableHighlight
              underlayColor="#ccc"
              style={{
                backgroundColor: "firebrick",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 5,
              }}
              onPress={handleForgot}
            >
              <Text
                style={{
                  color: "white",
                  padding: 10,
                  fontSize: 16,
                }}
              >
                ลืมรหัสผ่าน
              </Text>
            </TouchableHighlight>
          </View> */}
        </View>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    // backgroundColor: "rgba(0,360,0,0.07)",
    // opacity: 0.8,
  },
  imageBackground: {
    flex: 1,
    justifyContent: "space-evenly",
  },
  form: {
    marginHorizontal: 20,
    backgroundColor: "#cefad0",
    padding: 25,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 3,
  },
  labelHead: {
    fontSize: 18,
    marginBottom: 5,
    // fontWeight: "bold",
    alignSelf: "center",
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    fontWeight: "bold",
    alignSelf: "center",
  },
  input: {
    height: 50,
    borderColor: "darkgreen",
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
    borderRadius: 5,
  },
  errorText: {
    color: "red",
    marginBottom: 10,
  },
  register: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingTop: 15,
  },
  press: {
    width: "60%",
    alignItems: "center",
  },
  textPress: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "bold",
    letterSpacing: 0.25,
    color: "red",
  },
  ifError: {
    marginBottom: 5,
  },
});

export default LoginScreen;
