import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useBag } from "../context/BagContext";

export default function BagScreen() {
  const { bag, loading, update, remove, doCheckout } = useBag();

  if (loading || !bag) {
    return (
      <View style={styles.centered}>
        <Text style={{ color: "#d8b4fe" }}>Loading...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={bag.items}
        keyExtractor={(i) => i.itemId.toString()}
        contentContainerStyle={{ padding: 20 }}
        renderItem={({ item }) => (
          <View style={styles.itemCard}>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemText}>${item.price.toFixed(2)}</Text>
            <Text style={styles.itemText}>
              Line Total: ${item.lineTotal.toFixed(2)}
            </Text>

            <View style={styles.controls}>
              <TouchableOpacity
                onPress={() => {
                  if (item.quantity > 1) {
                    update(item.itemId, item.quantity - 1);
                  } else {
                    remove(item.itemId);
                  }
                }}
              >
                <Text style={styles.controlText}>−</Text>
              </TouchableOpacity>

              <Text style={styles.controlText}>{item.quantity}</Text>

              <TouchableOpacity
                onPress={() => update(item.itemId, item.quantity + 1)}
              >
                <Text style={styles.controlText}>+</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => remove(item.itemId)}
                style={{ marginLeft: "auto" }}
              >
                <Text style={{ color: "#ef4444", fontWeight: "600" }}>
                  Remove
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      <View style={styles.footer}>
        <Text style={styles.subtotal}>
          Subtotal: ${bag.subtotal.toFixed(2)}
        </Text>
        <TouchableOpacity onPress={doCheckout} style={styles.checkoutButton}>
          <Text style={styles.checkoutText}>Checkout</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  },
  itemCard: {
    backgroundColor: "#d8b4fe",
    padding: 16,
    borderRadius: 20,
    marginBottom: 12,
  },
  itemName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
  },
  itemText: {
    color: "#000",
  },
  controls: {
    flexDirection: "row",
    marginTop: 10,
    alignItems: "center",
  },
  controlText: {
    fontSize: 22,
    marginHorizontal: 10,
    color: "#000",
    fontWeight: "bold",
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#333",
  },
  subtotal: {
    fontSize: 22,
    fontWeight: "700",
    color: "#d8b4fe",
  },
  checkoutButton: {
    backgroundColor: "#362845",
    padding: 16,
    borderRadius: 12,
    marginTop: 20,
  },
  checkoutText: {
    color: "white",
    textAlign: "center",
    fontSize: 18,
    fontWeight: "600",
  },
});
