import { View, Text, Pressable, StyleSheet } from "react-native";
import { useMemo, useState } from "react";
import { useBag } from "@/context/BagContext";
import { router } from "expo-router";
import { checkout as apiCheckout } from "@/api/bag";

export default function CheckoutScreen() {
  const { bag, clear } = useBag();
  const [isProcessing, setIsProcessing] = useState(false);

  const items = bag?.items ?? [];

  const totalPrice = useMemo(() => {
    return items.reduce((sum: number, item: any) => sum + item.price, 0);
  }, [items]);

  const pointsEarned = Math.floor(totalPrice * 100);

  const handleConfirm = async () => {
    if (isProcessing) return;
    setIsProcessing(true);

    try {
      await apiCheckout();

      clear();

      router.replace("/");
    } catch (err) {
      console.error("Checkout failed:", err);
      alert("Checkout failed");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Order Summary</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Total Price</Text>
        <Text style={styles.value}>${totalPrice.toFixed(2)}</Text>

        <Text style={[styles.label, { marginTop: 20 }]}>Points Earned</Text>
        <Text style={styles.points}>{pointsEarned}</Text>
      </View>

      <Pressable
        style={styles.confirmButton}
        onPress={handleConfirm}
        disabled={isProcessing}
      >
        <Text style={styles.confirmText}>
          {isProcessing ? "Processing..." : "Confirm Purchase"}
        </Text>
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
    fontSize: 26,
    fontWeight: "700",
    marginTop: 4,
  },
  points: {
    color: "#d8b4fe",
    fontSize: 28,
    fontWeight: "700",
    marginTop: 4,
  },
  confirmButton: {
    marginTop: 40,
    backgroundColor: "#d8b4fe",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  confirmText: {
    color: "black",
    fontSize: 18,
    fontWeight: "700",
  },
});
