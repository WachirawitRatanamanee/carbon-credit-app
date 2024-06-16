import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ImageBackground,
  Image,
  Dimensions,
} from "react-native";
import ManageUserButton from "../../../components/manageUser";
import Point from "../../../components/point";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import {
  Table,
  TableWrapper,
  Row,
  Cell,
} from "react-native-table-component";
import { useState, useEffect } from "react";
import {
  Element,
  DetailElement,
} from "../../../components/element";
import { LogBox } from "react-native";
import { ref, onValue, off } from "firebase/database";
import { database } from "../../../firebase";
LogBox.ignoreLogs(["Warning:"]); // Ignore log notification by message

export default function HomeScreen({ navigation, route }) {
  const userData = route.params.userData;
  const isAdmin = userData.admin;
  const userPoint = userData.point;
  const username = userData.username;
  const allUsers = route.params.allUsers;
  const [isExpand, setIsExpand] = useState(false);
  const tableDataArr = Object.entries(allUsers);

  let tableData = [];
  let detailData = [];
  tableDataArr.map((value, index) => {
    tableData.push([
      value[1].username,
      parseInt(value[1].point),
      2,
      3,
      4,
    ]);
    detailData.push([
      value[1].name,
      value[1].lastname,
      value[1].phone,
      value[1].idCard,
    ]);
  });

  useEffect(() => {
    const listener = ref(database, "users/" + username);
    onValue(listener, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        navigation.setParams({
          userData: data,
        });
      }
    });
    const listenerAdmin = ref(database, "users/");
    if (isAdmin) {
      onValue(listenerAdmin, (snapshot) => {
        if (snapshot.exists()) {
          const allUsers = snapshot.val();
          navigation.setParams({
            allUsers: allUsers,
          });
        }
      });
    }
    return () => {
      off(listener);
      off(listenerAdmin);
    };
  }, []);

  const data = {
    tableHead: [
      "ผู้ใช้งาน",
      `คะแนน1`,
      `คะแนน2`,
      `คะแนน3`,
      `คะแนน4`,
    ],
  };

  const calculateTotalScore = (score) => {
    let totalScore = 0;
    tableData.map((value, index) => {
      totalScore += value[score];
    });
    return totalScore + " คะแนน";
  };

  const totalScoreTable = {
    tableHead: [
      "คะแนนทั้งหมด",
      calculateTotalScore(1),
      calculateTotalScore(2),
      calculateTotalScore(3),
      calculateTotalScore(4),
    ],
  };

  // const navigateToTypePopup = () => {
  //   navigation.navigate("TypePopup");
  // };

  const navigateToEditScorePopup = (
    action,
    typeAction,
    text
  ) => {
    navigation.navigate("EditScorePopup", {
      action: action,
      text: text,
      allUsers: allUsers,
      typeAction: typeAction,
    });
  };

  const tableHeadWithDescription = data.tableHead.map(
    (tableHead, index) => (
      <Cell
        key={index}
        data={
          index === 4 ? (
            <Element
              data={tableHead}
              isExpand={isExpand}
              setIsExpand={setIsExpand}
              myStyle={styles.tableTextHead}
            />
          ) : (
            tableHead
          )
        }
        textStyle={styles.tableTextHead}
      />
    )
  );

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../../../assets/images/home-bg.jpg")}
        resizeMode="cover"
        style={styles.imageBackground}
        imageStyle={{ opacity: 0.3 }}
      >
        {isAdmin ? (
          <View style={{ marginTop: "5%" }}></View>
        ) : null}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Image
            source={require("../../../assets/images/logo.jpg")}
            style={{
              borderRadius:
                Math.round(
                  Dimensions.get("window").width +
                    Dimensions.get("window").height
                ) / 2,
              width: Dimensions.get("window").width * 0.175,
              height:
                Dimensions.get("window").width * 0.175,
              position: "absolute",
              left: "5%",
              top: "-30%",
            }}
          />
          <Text style={styles.text}>Carbon-Credit</Text>
        </View>
        {isAdmin ? (
          <View style={styles.table}>
            <View>
              <ScrollView>
                <Table
                  borderStyle={{
                    borderWidth: 1,
                    borderColor: "gray",
                  }}
                >
                  <Row
                    data={tableHeadWithDescription}
                    style={styles.tableHead}
                  />
                </Table>
              </ScrollView>
            </View>
            <ScrollView>
              <Table
                style={{ marginTop: -1, marginBottom: -1 }}
                borderStyle={{
                  borderWidth: 1,
                  borderColor: "gray",
                }}
              >
                {tableData.map((rowData, index) => (
                  <TableWrapper>
                    <TableWrapper
                      key={index}
                      style={[
                        styles.row,
                        {
                          backgroundColor:
                            index % 2
                              ? "#cefad0"
                              : "#F7F6E7",
                        },
                      ]}
                    >
                      {rowData.map(
                        (cellData, cellIndex) => (
                          <Cell
                            key={cellIndex}
                            data={cellData}
                            textStyle={styles.tableTextData}
                          />
                        )
                      )}
                    </TableWrapper>

                    {isExpand ? (
                      <Cell
                        data={
                          <DetailElement
                            detail={detailData[index]}
                          />
                        }
                        style={[
                          {
                            backgroundColor:
                              index % 2
                                ? "#cefad0"
                                : "#F7F6E7",
                          },
                        ]}
                      />
                    ) : (
                      <Row />
                    )}
                  </TableWrapper>
                ))}
              </Table>
            </ScrollView>
            <Table
              borderStyle={{
                borderWidth: 1,
                borderColor: "gray",
              }}
            >
              <Row
                data={totalScoreTable.tableHead}
                style={styles.tableHead}
                textStyle={[
                  styles.tableTextHead,
                  { flex: 0 },
                ]}
              />
            </Table>
          </View>
        ) : (
          <Point
            text={"คุณมี"}
            point={userPoint}
            icon={
              <AntDesign
                name="pushpin"
                size={32}
                color="green"
              />
            }
            color="#023020"
          />
        )}
        {isAdmin ? null : <View></View>}
        {isAdmin ? null : <View></View>}
        {isAdmin ? null : <View></View>}

        <View style={styles.button}>
          {/* {isAdmin ? (
            <ManageUserButton
              text={"ประเภทขยะ"}
              whenPress={navigateToTypePopup}
              myStyle={{ fontSize: 16 }}
              icon={
                <MaterialCommunityIcons
                  name="format-list-bulleted-type"
                  size={24}
                  color="green"
                />
              }
              marginV="0%"
            />
          ) : (
            <ManageUserButton
              text={"ประเภทขยะ"}
              whenPress={navigateToTypePopup}
              icon={
                <MaterialCommunityIcons
                  name="format-list-bulleted-type"
                  size={48}
                  color="green"
                />
              }
            />
          )} */}
          {isAdmin ? (
            <View style={styles.admin}>
              <ManageUserButton
                text={"เพิ่มคะแนน"}
                whenPress={() =>
                  navigateToEditScorePopup(
                    "เพิ่มคะแนนผู้ใช้งาน",
                    "increase",
                    "เพิ่มคะแนน"
                  )
                }
                icon={
                  <Feather
                    name="user-plus"
                    size={32}
                    color="black"
                  />
                }
                myStyle={{ fontSize: 16 }}
                userData={userData}
              />
              <ManageUserButton
                text={"ลดคะแนน"}
                whenPress={() =>
                  navigateToEditScorePopup(
                    "ลดคะแนนผู้ใช้งาน",
                    "decrease",
                    "ลดคะแนน"
                  )
                }
                icon={
                  <Feather
                    name="user-minus"
                    size={32}
                    color="black"
                  />
                }
                myStyle={{ fontSize: 16 }}
                userData={userData}
              />
              {/* <ManageUserButton
                text={"ลบบัญชี"}
                whenPress={() =>
                  navigateToEditScorePopup(
                    "ลบบัญชีผู้ใช้งาน",
                    "delete",
                  )
                }
                icon={
                  <Feather
                    name="user-x"
                    size={32}
                    color="black"
                  />
                }
                myStyle={{ fontSize: 16 }}
                userData={userData}
              /> */}
            </View>
          ) : null}
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alighItems: "center",
    justifyContent: "space-evenly",
    // backgroundColor: "rgba(0,360,0,0.07)",
  },
  imageBackground: {
    flex: 1,
    justifyContent: "space-evenly",
  },
  text: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  admin: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    width: "100%",
  },
  table: {
    width: "85%",
    maxHeight: "50%",
    alignSelf: "center",
    borderColor: "gray",
  },
  tableHead: {
    backgroundColor: "#abf7b1",
  },
  tableTextHead: {
    margin: 12,
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 18,
    flex: 1,
    textAlignVertical: "center",
  },
  tableTextData: {
    textAlign: "center",
    fontSize: 16,
    flex: 1,
    textAlignVertical: "center",
    padding: 5,
  },

  row: { flexDirection: "row" },
});
