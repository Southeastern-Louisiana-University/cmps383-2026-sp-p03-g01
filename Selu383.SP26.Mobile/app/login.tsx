import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Image,
} from "react-native";
import { router } from "expo-router";

export default function LoginScreen() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    try {
      const res = await fetch(
        "https://selu383-sp26-p03-g01.azurewebsites.net/api/authentication/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include", 
          body: JSON.stringify({
            userName: username, 
            password: password,
          }),
        }
      );

      if (!res.ok) {
        alert("Invalid username or password");
        return;
      }

      console.log("Logged in successfully");

      router.replace("/");
    } catch (err) {
      console.log("Login error:", err);
    }
  };

  return (
    <View style={styles.container}>
      <Pressable onPress={() => router.replace("/")} style={styles.backButton}>
        <Text style={styles.backText}>←</Text>
      </Pressable>

      <View style={styles.centerBox}>
        <View style={styles.header}>
          <Image
            source={require("../assets/images/icon.png")}
            style={styles.icon}
          />
          <Text style={styles.title}>Caffeinated Lions</Text>
        </View>

        <TextInput
          style={styles.input}
          placeholder="Username"
          placeholderTextColor="#aaa"
          value={username}
          onChangeText={setUsername}
        />

        <View style={styles.passwordWrapper}>
          <TextInput
            style={[styles.input, { flex: 1, marginBottom: 0 }]}
            placeholder="Password"
            placeholderTextColor="#aaa"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
          />

          <Pressable
            onPress={() => setShowPassword(!showPassword)}
            style={styles.showButton}
          >
            <Text style={{ color: "#d8b4fe", fontWeight: "600" }}>
              {showPassword ? "Hide" : "Show"}
            </Text>
          </Pressable>
        </View>

        <Pressable style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </Pressable>

        <Pressable onPress={() => router.push("/signup")}>
          <Text
            style={{ color: "#d8b4fe", textAlign: "center", marginTop: 20 }}
          >
            Don't have an account? Sign Up
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#242424",
    padding: 20,
    paddingBottom: 280,
  },
  header: {
    alignItems: "center",
    marginBottom: 40,
  },
  icon: {
    width: 200,
    height: 200,
    resizeMode: "contain",
    marginBottom: 12,
  },
  title: {
    color: "#d8b4fe",
    fontSize: 28,
    fontWeight: "bold",
  },
  input: {
    backgroundColor: "#333",
    padding: 12,
    borderRadius: 8,
    color: "white",
    marginBottom: 15,
  },
  passwordWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#333",
    borderRadius: 8,
    marginBottom: 15,
    paddingRight: 10,
  },
  showButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  button: {
    backgroundColor: "#d8b4fe",
    padding: 14,
    borderRadius: 8,
    marginTop: 10,
  },
  buttonText: {
    textAlign: "center",
    fontWeight: "700",
    fontSize: 18,
    color: "#000",
  },
  centerBox: {
    flex: 1,
    justifyContent: "center",
  },
  backButton: {
    position: "absolute",
    top: 40,
    left: 20,
    padding: 10,
  },
  backText: {
    color: "#d8b4fe",
    fontSize: 50,
    fontWeight: "600",
  },
});
