import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useBag } from "../../context/BagContext";

export default function BagTab() {
  const { bag, loading, remove, clear, refresh } = useBag();

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#d8b4fe" />
        <Text style={[styles.text, { marginTop: 10 }]}>
          Loading your bag...
        </Text>
      </View>
    );
  }

  if (!bag || !bag.items || bag.items.length === 0) {
    return (
      <View style={styles.centered}>
        <Text style={styles.text}>Your bag is empty.</Text>
        <Pressable onPress={refresh} style={styles.retryButton}>
          <Text style={styles.retryButtonText}>Refresh Bag</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={bag.items}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ padding: 20 }}
        renderItem={({ item }) => (
          <View style={styles.itemRow}>
            <View style={styles.itemInfo}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>
            </View>
            <Pressable
              onPress={() => remove(item.id)}
              style={({ pressed }) => [
                styles.removeButton,
                { opacity: pressed ? 0.7 : 1 },
              ]}
            >
              <Text style={styles.removeButtonText}>Remove</Text>
            </Pressable>
          </View>
        )}
      />

      <View style={styles.footer}>
        <Text style={styles.subtotalText}>
          Subtotal: ${bag.subtotal.toFixed(2)}
        </Text>
        <Pressable
          onPress={clear}
          style={({ pressed }) => [
            styles.clearButton,
            { opacity: pressed ? 0.7 : 1 },
          ]}
        >
          <Text style={styles.clearButtonText}>Clear Bag</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#333333", // Grey background to match app
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#333333",
  },
  text: {
    color: "#d8b4fe",
    fontSize: 20,
    fontWeight: "600",
  },
  itemRow: {
    backgroundColor: "#362845", // Deep purple card color
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 8, // Added a slight round for a cleaner card look
    borderWidth: 1,
    borderColor: "#4a3b5c",
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    color: "#d8b4fe", // Lavender text on card
    fontSize: 18,
    fontWeight: "700",
  },
  itemPrice: {
    color: "#d8b4fe", // Lavender text on card
    fontSize: 16,
    opacity: 0.9,
  },
  removeButton: {
    backgroundColor: "#d8b4fe",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  removeButtonText: {
    color: "#362845", // Dark text on light button
    fontWeight: "700",
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderColor: "#444",
    backgroundColor: "#333333",
  },
  subtotalText: {
    color: "#d8b4fe",
    fontSize: 22,
    fontWeight: "800",
    marginBottom: 15,
    textAlign: "right",
  },
  clearButton: {
    backgroundColor: "#d8b4fe",
    padding: 16,
    alignItems: "center",
    borderRadius: 4,
  },
  clearButtonText: {
    color: "#362845",
    fontWeight: "800",
    fontSize: 16,
  },
  retryButton: {
    marginTop: 20,
    padding: 12,
    borderWidth: 1,
    borderColor: "#d8b4fe",
    borderRadius: 4,
  },
  retryButtonText: {
    color: "#d8b4fe",
    fontWeight: "600",
  },
});
