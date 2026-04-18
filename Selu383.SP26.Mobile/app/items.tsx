import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useBag } from "../context/BagContext";

type Item = {
  id: number;
  name: string;
  description: string;
  price: number;
  nutrition: string;
};

export default function Items() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const bag = useBag();

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(
          "https://selu383-sp26-p03-g01.azurewebsites.net/api/items",
        );
        const data = await res.json();

        const list = Array.isArray(data)
          ? data
          : Array.isArray(data?.items)
            ? data.items
            : [];

        const formattedList = list.map((item: any) => ({
          id: item.id ?? item.Id,
          name: item.name ?? item.Name ?? "Unknown Item",
          description: item.description ?? item.Description ?? "",
          price: item.price ?? item.Price ?? 0,
          nutrition: item.nutrition ?? item.Nutrition ?? "N/A",
        }));

        setItems(formattedList);
      } catch (err) {
        console.error("Fetch error:", err);
        setItems([]);
      }

      setLoading(false);
    };

    load();
  }, []);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#d8b4fe" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={items}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <View style={styles.itemRow}>
            <Text style={styles.itemName}>{item.name}</Text>

            <Text style={styles.itemPrice}>
              ${typeof item.price === "number" ? item.price.toFixed(2) : "0.00"}
            </Text>

            <Text style={styles.itemDescription}>{item.description}</Text>
            <Text style={styles.itemNutrition}>{item.nutrition}</Text>

            <Pressable
              onPress={() => {
                try {
                  bag.add(item.id);
                } catch (e) {
                  console.log("BagContext error:", e);
                }
              }}
              style={({ pressed }) => [
                styles.addButton,
                { opacity: pressed ? 0.7 : 1 },
              ]}
            >
              <Text style={styles.addButtonText}>Add to Bag</Text>
            </Pressable>
          </View>
        )}
      />
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
  listContent: {
    padding: 20,
  },
  itemRow: {
    backgroundColor: "#1a1a1a",
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#333",
  },
  itemName: {
    color: "#d8b4fe",
    fontSize: 20,
    fontWeight: "700",
  },
  itemPrice: {
    color: "#d8b4fe",
    fontSize: 16,
    fontWeight: "600",
    marginTop: 4,
  },
  itemDescription: {
    color: "#d8b4fe",
    fontSize: 14,
    opacity: 0.8,
    marginTop: 4,
  },
  itemNutrition: {
    color: "#d8b4fe",
    fontSize: 13,
    opacity: 0.6,
    marginTop: 4,
  },

  // UPDATED BUTTON COLORS
  addButton: {
    backgroundColor: "#d8b4fe", // lavender button
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginTop: 12,
    borderWidth: 1,
    borderColor: "#000",
  },
  addButtonText: {
    color: "#362845", // deep purple text
    fontWeight: "700",
  },
});
