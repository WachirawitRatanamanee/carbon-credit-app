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
// import { MaterialCommunityIcons } from "@expo/vector-icons";
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
  const userPointFoodWaste = userData.foodWaste;
  const userPointOrganicWaste = userData.organicWaste;
  const userPointPlasticWaste = userData.plasticWaste;
  const username = userData.username;
  const allUsers = route.params.allUsers;
  const [isExpand, setIsExpand] = useState(false);
  const tableDataArr = Object.entries(allUsers);

  let tableData = [];
  let detailData = [];
  tableDataArr.map((value, index) => {
    let allUsersData = value[1];
    tableData.push([
      allUsersData.username,
      parseInt(allUsersData.foodWaste),
      parseInt(allUsersData.organicWaste),
      parseInt(allUsersData.plasticWaste),
    ]);
    detailData.push([
      allUsersData.name,
      allUsersData.lastname,
      allUsersData.phone,
      allUsersData.idCard,
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
      `เศษอาหาร`,
      `ขยะอินทรีย์`,
      `ขยะพลาสติก`,
    ],
  };

  const calculateTotalScore = (scoreIndex) => {
    let totalScore = 0;
    tableData.map((value, index) => {
      totalScore += value[scoreIndex];
    });
    return totalScore;
  };

  const totalScoreTable = [
    "คะแนนทั้งหมด",
    calculateTotalScore(1),
    calculateTotalScore(2),
    calculateTotalScore(3),
  ];

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
          index === data.tableHead.length - 1 ? (
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
                            textStyle={[
                              styles.tableTextData,
                              cellIndex == 0
                                ? { fontWeight: "bold" }
                                : {
                                    fontWeight: "normal",
                                  },
                            ]}
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
                data={totalScoreTable}
                style={styles.tableHead}
                textStyle={[
                  styles.tableTextHead,
                  { flex: 0 },
                ]}
              />
            </Table>
          </View>
        ) : (
          <View>
          <View style={{flexDirection:"row", justifyContent:"center"}}>
            <Point
              text={"คะแนนเศษอาหาร"}
              point={userPointFoodWaste}
              icon={
                <AntDesign
                  name="pushpin"
                  size={32}
                  color="green"
                />
              }
              color="#023020"
            />
            <Point
              text={"คะแนนขยะอินทรีย์"}
              point={userPointOrganicWaste}
              icon={
                <AntDesign
                  name="pushpin"
                  size={32}
                  color="green"
                />
              }
              color="#023020"
            />
            </View>
            <Point
              text={"คะแนนขยะพลาสติก"}
              point={userPointPlasticWaste}
              icon={
                <AntDesign
                  name="pushpin"
                  size={32}
                  color="green"
                />
              }
              color="#023020"
            />
          </View>
        )}
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
    fontSize: 15,
  },
  tableTextData: {
    textAlign: "center",
    fontSize: 14,
    flex: 1,
    textAlignVertical: "center",
    padding: 5,
  },

  row: { flexDirection: "row" },
});
