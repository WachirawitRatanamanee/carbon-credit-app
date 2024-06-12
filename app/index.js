import { SafeAreaProvider } from "react-native-safe-area-context";
import Stacks from "./stacks";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

export default function App() {
  const Stack = createNativeStackNavigator();

  return (
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
  );
}
