import { Link } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Home() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Caffeinated Lions</Text>

      <View style={styles.topButtons}>
        <Link href="/items" asChild>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Items</Text>
          </TouchableOpacity>
        </Link>

        <Link href="/locations" asChild>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Locations</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 80,
    alignItems: "center",
    backgroundColor: "#242424", // ← updated background
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 20,
    color: "white", // ← readable on dark background
  },
  topButtons: {
    flexDirection: "row",
    gap: 12,
  },
  button: {
    backgroundColor: "#362845", // ← your chosen button color
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
  },
});
