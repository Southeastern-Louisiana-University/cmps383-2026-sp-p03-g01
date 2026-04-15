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

  // Customizing the navigation theme to use your colors
  const MyDarkTheme = {
    ...DarkTheme,
    colors: {
      ...DarkTheme.colors,
      primary: "#d8b4fe", // Replaces the blue highlight with your light purple
      background: "#000", // Sets the base background to black
      card: "#000", // Sets header/tab backgrounds to black
      text: "#d8b4fe", // Sets default text color
      border: "#333", // Darker border color
    },
  };

  const MyLightTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: "#362845", // Your dark purple
      background: "#fff",
    },
  };

  return (
    <BagProvider>
      <ThemeProvider
        value={colorScheme === "dark" ? MyDarkTheme : MyLightTheme}
      >
        <Stack screenOptions={{ headerShown: false }} />
      </ThemeProvider>
    </BagProvider>
  );
}
