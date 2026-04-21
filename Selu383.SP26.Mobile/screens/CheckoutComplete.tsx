import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useBag } from "../context/BagContext";

export default function CheckoutComplete() {
  const { selectedLocation } = useBag();

  return (
    <View style={styles.container}>
      <Text style={styles.checkmark}>✓</Text>

      <Text style={styles.title}>Order Placed</Text>

      {selectedLocation && (
        <Text style={styles.subtitle}>
          We're preparing your order at {selectedLocation.name}
        </Text>
      )}

      <Text style={styles.pun}>
        Thank you for making us your MANE caffeine source
      </Text>

      <Pressable
        onPress={() => router.push("/")}
        style={({ pressed }) => [styles.button, { opacity: pressed ? 0.7 : 1 }]}
      >
        <Text style={styles.buttonText}>Back to Home</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  checkmark: {
    fontSize: 80,
    color: "#d8b4fe",
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#d8b4fe",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: "#aaa",
    textAlign: "center",
    marginBottom: 20,
  },
  pun: {
    fontSize: 16,
    color: "#d8b4fe",
    textAlign: "center",
    marginBottom: 40,
    fontWeight: "600",
  },
  button: {
    backgroundColor: "#d8b4fe",
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderWidth: 1,
    borderColor: "#362845",
  },
  buttonText: {
    color: "#362845",
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
  },
});
