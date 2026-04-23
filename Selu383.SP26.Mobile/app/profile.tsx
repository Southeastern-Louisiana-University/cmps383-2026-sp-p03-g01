import { useEffect, useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { router } from "expo-router";

type UserDto = {
  id: number;
  userName: string;
  roles: string[];
  rewardPoints?: number; 
};

export default function ProfileScreen() {
  const [user, setUser] = useState<UserDto | null>(null);

  // Fetch user from backend
  async function fetchUser() {
    try {
      const res = await fetch(
        "https://selu383-sp26-p03-g01.azurewebsites.net/api/authentication/me",
        {
          method: "GET",
          credentials: "include",
        }
      );

      if (!res.ok) {
        router.replace("/login");
        return;
      }

      const data = await res.json();
      setUser(data);
    } catch (err) {
      console.log("Profile load error:", err);
    }
  }

  // Logout request
  async function handleLogout() {
    try {
      await fetch(
        "https://selu383-sp26-p03-g01.azurewebsites.net/api/authentication/logout",
        {
          method: "POST",
          credentials: "include",
        }
      );
    } catch (err) {
      console.log("Logout error:", err);
    }

    router.replace("/");
  }

  useEffect(() => {
    fetchUser();
  }, []);

  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.header}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Profile</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Username</Text>
        <Text style={styles.value}>{user.userName}</Text>

        <Text style={[styles.label, { marginTop: 20 }]}>Current Points</Text>
        <Text style={styles.points}>{user.rewardPoints ?? 0}</Text>
      </View>

      <Pressable style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#242424",
    paddingTop: 80,
    paddingHorizontal: 20,
  },
  header: {
    color: "white",
    fontSize: 32,
    fontWeight: "700",
    marginBottom: 30,
    textAlign: "center",
  },
  card: {
    backgroundColor: "#333",
    padding: 20,
    borderRadius: 12,
  },
  label: {
    color: "#bbbbbb",
    fontSize: 16,
  },
  value: {
    color: "white",
    fontSize: 22,
    fontWeight: "600",
    marginTop: 4,
  },
  points: {
    color: "#d8b4fe",
    fontSize: 28,
    fontWeight: "700",
    marginTop: 4,
  },
  logoutButton: {
    marginTop: 40,
    backgroundColor: "#d8b4fe",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  logoutText: {
    color: "black",
    fontSize: 18,
    fontWeight: "700",
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
