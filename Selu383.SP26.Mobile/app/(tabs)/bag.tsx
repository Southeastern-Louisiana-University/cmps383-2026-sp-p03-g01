import { StyleSheet, Text, View } from "react-native";
import { useBag } from "../../context/BagContext";
import BagScreen from "../../screens/BagScreen";

export default function BagTab() {
  const { bag, loading } = useBag();

  // 1. Loading State
  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Loading your bag...</Text>
      </View>
    );
  }

  // 2. Empty State
  if (!bag || bag.items.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Your bag is empty.</Text>
      </View>
    );
  }

  // 3. Success State
  return <BagScreen />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000", // Matches your Items screen background
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: "#d8b4fe", // Updated to your requested color
    fontSize: 20,
    fontWeight: "600",
  },
});
