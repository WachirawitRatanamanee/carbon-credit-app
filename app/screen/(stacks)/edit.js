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
import { ref, update } from "firebase/database";
import { auth, database } from "../../../firebase";
import { updatePassword } from "firebase/auth";

export default function Edit({ navigation, route }) {
  const userData = route.params.userData;
  const defaultUsername = userData.username;
  const defaultName = userData.name;
  const defaultLastname = userData.lastname;
  const defaultPhone = userData.phone;
  const defaultIdCard = userData.idCard;

  const [name, setName] = useState(defaultName);
  const [lastname, setLastname] = useState(defaultLastname);
  const [phone, setPhone] = useState(defaultPhone);
  const [idCard, setIdCard] = useState(defaultIdCard);

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

    if (phone.length != 10) {
      errors.phone = "เบอร์โทรศัพท์ไม่ถูกต้อง";
    }

    if (password.length < 6 && password.length > 0) {
      errors.password =
        "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร";
    }

    if (idCard.length != 13 && idCard.length > 0) {
      errors.idCard = "เลขบัตรประชาชนไม่ถูกต้อง";
    }

    if (!name)
      errors.name = "กรุณากรอกชื่อที่ต้องการเปลี่ยน";
    if (!lastname)
      errors.lastname = "กรุณากรอกนามสกุลที่ต้องการเปลี่ยน";
    if (!phone)
      errors.phone =
        "กรุณากรอกเบอร์โทรศัพท์ที่ต้องการเปลี่ยน";
    if (!idCard) errors.idCard = "กรุณากรอกเลขบัตรประชาชน";

    if (password !== confirmPassword)
      errors.confirmPassword = "รหัสผ่านไม่ตรงกัน";

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      if (
        name != defaultName ||
        lastname != defaultLastname ||
        phone != defaultPhone ||
        idCard != defaultIdCard ||
        (password && confirmPassword)
      ) {
        Alert.alert(
          "โปรดยืนยัน",
          "คุณต้องการเปลี่ยนข้อมูลส่วนตัวใช่หรือไม่",
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
      } else {
        navigation.goBack();
      }
    }
  };

  const updateData = (name, lastname, phone, idCard) => {
    const updatedData = {
      ...userData,
      name: name,
      lastname: lastname,
      phone: phone,
      idCard: idCard,
    };
    const updates = {};
    updates["/users/" + defaultUsername] = updatedData;

    return update(ref(database), updates);
  };

  const updateUserPassword = (password) => {
    const user = auth.currentUser;
    updatePassword(user, password);
  };

  const sendData = () => {
    try {
      if (
        name != defaultName ||
        lastname != defaultLastname ||
        phone != defaultPhone ||
        idCard != defaultIdCard
      ) {
        updateData(name, lastname, phone, idCard);
      }
      if (password && confirmPassword) {
        updateUserPassword(password);
      }
      Alert.alert(
        `สำเร็จ`,
        `ข้อมูลของคุณได้รับการเปลี่ยนแปลงแล้ว`,
        [
          {
            text: `ตกลง`,
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error) {
      err = error.code;
      Alert.alert(``, `${err}`, [
        {
          text: `ตกลง`,
        },
      ]);
    }
  };

  const cancel = () => {
    if (
      name != defaultName ||
      lastname != defaultLastname ||
      phone != defaultPhone ||
      idCard != defaultIdCard ||
      password ||
      confirmPassword
    ) {
      Alert.alert(
        "โปรดยืนยัน",
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

  const filterNumber = (string) => {
    setPhone(string.replace(/[^0-9+]/g, ""));
  };

  const filterId = (string) => {
    setIdCard(string.replace(/[^0-9+]/g, ""));
  };

  return (
    <ImageBackground
      source={require("../../../assets/images/history-bg.jpg")}
      resizeMode="cover"
      style={styles.imageBackground}
      imageStyle={{ opacity: 0.2 }}
    >
      <KeyboardAvoidingView
        behavior="padding"
        style={styles.container}
      >
        <ScrollView>
          <View style={styles.inputBox}>
            <View>
              <Text style={styles.text}>
                ชื่อผู้ใช้งาน :
              </Text>
              <View style={styles.form}>
                <TextInput
                  style={[
                    styles.input,
                    styles.disabledInput,
                  ]}
                  value={defaultUsername}
                  editable={false}
                  selectTextOnFocus={false}
                />
              </View>
              <Text style={styles.text}>ชื่อ :</Text>
              <View style={styles.form}>
                <TextInput
                  style={[
                    styles.input,
                    errors.name ? { marginBottom: 5 } : {},
                  ]}
                  placeholder="โปรดกรอกชื่อที่ต้องการเปลี่ยน"
                  value={name}
                  onChangeText={setName}
                />
                {errors.name ? (
                  <Text style={styles.errorText}>
                    {errors.name}
                  </Text>
                ) : null}
              </View>

              <Text style={styles.text}>นามสกุล :</Text>
              <View style={styles.form}>
                <TextInput
                  style={[
                    styles.input,
                    errors.name ? { marginBottom: 5 } : {},
                  ]}
                  placeholder="โปรดกรอกนามสกุลที่ต้องการเปลี่ยน"
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
                </View>
                {errors.idCard ? (
                  <Text style={styles.errorText}>
                    {errors.idCard}
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
                    errors.name ? { marginBottom: 5 } : {},
                  ]}
                  placeholder="โปรดกรอกเบอร์โทรศัพท์ที่ต้องการเปลี่ยน"
                  value={phone}
                  onChangeText={filterNumber}
                  keyboardType="numeric"
                  maxLength={10}
                />
                {errors.phone ? (
                  <Text style={styles.errorText}>
                    {errors.phone}
                  </Text>
                ) : null}
              </View>

              <Text style={styles.text}>
                รหัสผ่านใหม่ :
              </Text>
              <View style={styles.form}>
                <View
                  style={[
                    styles.input,
                    styles.passwordForm,
                  ]}
                >
                  <TextInput
                    style={styles.passwordInput}
                    secureTextEntry={!showPassword}
                    value={password}
                    onChangeText={setPassword}
                    placeholder="โปรดกรอกรหัสผ่านที่ต้องการ"
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
                ยืนยันรหัสผ่านใหม่ :
              </Text>

              <View style={styles.form}>
                <View
                  style={[
                    styles.input,
                    styles.passwordForm,
                    { marginBottom: 0 },
                    errors.name ? { marginBottom: 5 } : {},
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
                    ยืนยัน
                  </Text>
                </TouchableHighlight>
                <TouchableHighlight
                  underlayColor="#ccc"
                  style={styles.button}
                  onPress={cancel}
                >
                  <Text style={styles.buttonText}>
                    ยกเลิก
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
  inputBox: {
    marginTop: "10%",
    justifyContent: "center",
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
  disabledInput: {
    backgroundColor: "rgb(235, 235, 228)",
    color: "rgb(84, 84, 84)",
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
  },
  buttonText: {
    color: "white",
    padding: 10,
    fontSize: 16,
  },
});
