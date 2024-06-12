import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "./screen/(tabs)/home";
import ProfileScreen from "./screen/(tabs)/profile";
import HistoryScreen from "./screen/(tabs)/history";
import { AntDesign } from "@expo/vector-icons";

const Tab = createBottomTabNavigator();

export default function Tabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        // tabBarShowLabel: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === "Home") {
            iconName = "home";
          } else if (route.name === "History") {
            iconName = "clockcircleo";
          } else if (route.name === "Profile") {
            iconName = "user";
          }
          if (focused) {
            size = size + 8;
          }

          return (
            <AntDesign
              name={iconName}
              size={size}
              color={color}
            />
          );
        },
        tabBarActiveTintColor: "#234F1E",
        tabBarActiveBackgroundColor: "#abf7b1",
        tabBarInactiveBackgroundColor: "#cefad0",
        tabBarShowLabel: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      {/* <Tab.Screen name="History" component={HistoryScreen}/> */}
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
      />
    </Tab.Navigator>
  );
}
