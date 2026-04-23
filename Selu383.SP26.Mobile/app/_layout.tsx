import { BagProvider } from "@/context/BagContext";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";

import { Stack } from "expo-router";
import { useColorScheme } from "react-native";

export default function RootLayout() {
  const colorScheme = useColorScheme();

  const MyDarkTheme = {
    ...DarkTheme,
    colors: {
      ...DarkTheme.colors,
      primary: "#d8b4fe",
      background: "#000",
      card: "#000",
      text: "#d8b4fe",
      border: "#333",
    },
  };

  const MyLightTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: "#362845",
      background: "#fff",
    },
  };

  return (
    <BagProvider>
      <ThemeProvider value={colorScheme === "dark" ? MyDarkTheme : MyLightTheme}>
        <Stack screenOptions={{ headerShown: false }} />
      </ThemeProvider>
    </BagProvider>
  );
}
