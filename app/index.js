import * as React from "react";
import { AppRegistry } from "react-native";
import {
  MD3LightTheme as DefaultTheme,
  PaperProvider,
} from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Stacks from "./stacks";
import { name as appName } from "../app.json";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

export default function App() {
  const Stack = createNativeStackNavigator();

  const theme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: "tomato",
      secondary: "yellow",
    },
  };

  return (
    <PaperProvider theme={theme}>
      <SafeAreaProvider>
        <Stack.Navigator>
          <Stack.Screen
            name="Stacks"
            component={Stacks}
            options={{
              headerShown: false,
            }}
          />
        </Stack.Navigator>
      </SafeAreaProvider>
    </PaperProvider>
  );
}

AppRegistry.registerComponent(appName, () => App);
