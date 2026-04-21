import { View, Text, Pressable, StyleSheet } from "react-native";
import { useContext } from "react";
import { AuthContext } from "@/context/AuthContext";
import { router } from "expo-router";

export default function LogoutScreen() {
  const { setUser } = useContext(AuthContext);

  const handleLogout = () => {
    setUser(null);        // clear the user
    router.replace("/");  // go back home
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Are you sure you want to log out?</Text>

      <Pressable style={styles.button} onPress={handleLogout}>
        <Text style={styles.buttonText}>Logout</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#242424",
  },
  title: {
    color: "white",
    fontSize: 22,
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#d8b4fe",
    padding: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: "black",
    fontWeight: "700",
    fontSize: 18,
  },
});