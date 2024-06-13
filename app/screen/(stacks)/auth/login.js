import { useState } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Text,
  TouchableHighlight,
  ImageBackground,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});

  const [showPassword, setShowPassword] = useState(false);
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const validateForm = () => {
    let errors = {};

    if (!username)
      errors.username = "กรุณากรอกชื่อผู้ใช้งาน";
    if (!password) errors.password = "กรุณากรอกรหัสผ่าน";

    setErrors(errors);

    return Object.keys(errors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      console.log("Submitted", username, password);
      setUsername("");
      setPassword("");
      setErrors({});
      navigation.navigate("Tabs");
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
      imageStyle={{ opacity: 0.2 }}
    >
      <KeyboardAvoidingView
        behavior="padding"
        style={styles.container}
      >
        <View style={styles.form}>
          <Text style={styles.label}>ชื่อผู้ใช้งาน</Text>
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
          <Text style={styles.label}>รหัสผ่าน</Text>
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
              placeholder="โปรดกรอกรหัสผ่าน"
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
    backgroundColor: "rgba(0,360,0,0.07)",
    opacity: 0.8,
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
