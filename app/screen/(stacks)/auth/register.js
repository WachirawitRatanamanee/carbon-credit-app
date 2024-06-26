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
  Image,
  Dimensions,
} from "react-native";
import { useState } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { auth, database } from "../../../../firebase";
import {
  createUserWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { ref, set } from "firebase/database";
import * as ImagePicker from "expo-image-picker";

export default function Register({ navigation }) {
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [lastname, setLastname] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");
  const [idCard, setIdCard] = useState(0);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);
  const [image, setImage] = useState(null);

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };
  const toggleShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      quality: 1,
    });
    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const validateForm = () => {
    let errors = {};

    if (username.length < 2) {
      errors.username =
        "ชื่อผู้ใช้งานต้องมีอย่างน้อย 2 ตัวอักษร";
    }

    if (
      !/^(?=[a-zA-Z0-9._]{1,20}$)(?!.*[_.]{2})[^_.].*[^_.]$/g.test(
        username
      )
    ) {
      errors.username = "รูปแบบชื่อผู้ใช้งานไม่ถูกต้อง";
    }

    if (
      phone.length < 10 ||
      (phone.length > 10 && phone.length < 12)
    ) {
      errors.phone = "เบอร์โทรศัพท์ไม่ถูกต้อง";
    }

    if (password.length < 6) {
      errors.password =
        "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร";
    }

    if (idCard.length != 13) {
      errors.idCard = "เลขบัตรประชาชนไม่ถูกต้อง";
    }

    if (!image)
      errors.imageCard = "กรุณาเลือกรูปภาพบัตรประชาชน";

    if (!username)
      errors.username = "กรุณากรอกชื่อผู้ใช้งาน";
    if (!name) errors.name = "กรุณากรอกชื่อ";
    if (!lastname) errors.lastname = "กรุณากรอกนามสกุล";
    if (!phone) errors.phone = "กรุณากรอกเบอร์โทรศัพท์";
    if (!password) errors.password = "กรุณากรอกรหัสผ่าน";
    if (!confirmPassword)
      errors.confirmPassword = "กรุณากรอกยืนยันรหัสผ่าน";
    if (!idCard) errors.idCard = "กรุณากรอกเลขบัตรประชาชน";

    if (password !== confirmPassword)
      errors.confirmPassword = "รหัสผ่านไม่ตรงกัน";

    setErrors(errors);
    return Object.keys(errors).length === 0;
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
      default:
        return "การเข้าสู่ระบบล้มเหลว กรุณาลองอีกครั้ง";
    }
  };

  const sendData = () => {
    createUserWithEmailAndPassword(
      auth,
      username + "@gmail.com",
      password
    )
      .then(() => {
        signOut(auth);
        set(ref(database, "users/" + username), {
          username: username,
          name: name,
          lastname: lastname,
          phone: phone,
          admin: false,
          foodWaste: 0,
          organicWaste: 0,
          plasticWaste: 0,
          idCard: idCard,
        });
      })
      .then(() => {
        Alert.alert(
          `สมัครสมาชิกสำเร็จ`,
          `ข้อมูลของคุณได้รับการบันทึกแล้ว`,
          [
            {
              text: `ตกลง`,
              onPress: () => navigation.replace("Login"),
            },
          ]
        );
      })
      .catch((error) => {
        err = handleError(error.code);
        Alert.alert(``, `${err}`, [
          {
            text: `ตกลง`,
          },
        ]);
      });
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
            onPress: () => navigation.replace("Login"),
          },
          {
            text: "ยกเลิก",
          },
        ]
      );
    } else {
      navigation.replace("Login");
    }
  };

  const filterNumber = (string) => {
    setPhone(string.replace(/[^0-9+]/g, ""));
  };

  const filterId = (string) => {
    setIdCard(string.replace(/[^0-9+]/g, ""));
  };

  return (
    <ImageBackground
      source={require("../../../../assets/images/login-bg.jpg")}
      resizeMode="cover"
      style={styles.imageBackground}
      imageStyle={{ opacity: 0.4 }}
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
                  placeholder="chompu"
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
              <Text style={styles.text}>ชื่อ : </Text>
              <View style={styles.form}>
                <TextInput
                  style={[
                    styles.input,
                    errors.name ? styles.ifError : {},
                  ]}
                  placeholder="สุขกาย"
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
                  placeholder="สบายใจ"
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
                เลขบัตรประชาชน :
              </Text>

              <View style={styles.form}>
                <View
                  style={[
                    styles.input,
                    styles.passwordForm,
                    errors.idCard ? styles.ifError : {},
                  ]}
                >
                  <TextInput
                    style={styles.passwordInput}
                    value={idCard}
                    onChangeText={filterId}
                    keyboardType="numeric"
                    maxLength={13}
                  />
                  <MaterialCommunityIcons
                    name="image"
                    size={26}
                    color="gray"
                    onPress={pickImage}
                    style={styles.hiddenIcon}
                  />
                </View>
                {errors.idCard ? (
                  <Text style={styles.errorText}>
                    {errors.idCard}
                  </Text>
                ) : null}
              </View>
              {image ? (
                <View style={styles.image}>
                  <Image
                    source={{ uri: image }}
                    style={{
                      width: "100%",
                      height: "100%",
                      borderRadius: 10,
                    }}
                  />
                  <TouchableHighlight
                    underlayColor={false}
                    activeOpacity={0.6}
                    style={{
                      borderRadius: 5,
                      position: "absolute",
                      right: 0,
                      top: 0,
                    }}
                    onPress={() => setImage(null)}
                  >
                    <Text
                      style={{
                        color: "darkred",
                        padding: 10,
                        fontSize: 16,
                        fontWeight: "bold",
                        textAlign: "center",
                      }}
                    >
                      X
                    </Text>
                  </TouchableHighlight>
                </View>
              ) : null}
              {errors.imageCard ? (
                <Text style={styles.errorText}>
                  {errors.imageCard}
                </Text>
              ) : null}

              <Text style={styles.text}>
                เบอร์โทรศัพท์ :
              </Text>
              <View style={styles.form}>
                <TextInput
                  style={[
                    styles.input,
                    errors.phone ? styles.ifError : {},
                  ]}
                  value={phone}
                  onChangeText={filterNumber}
                  keyboardType="numeric"
                  maxLength={12}
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
  image: {
    width: Dimensions.get("window").width * 0.7,
    height: Dimensions.get("window").width * 0.7,
    alignSelf: "center",
    borderWidth: 1,
    borderColor: "darkgreen",
    borderRadius: 10,
    marginTop: 5,
    marginBottom: 10,
  },
});
