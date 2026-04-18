import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useBag } from "../../context/BagContext";

type Item = {
  id: number;
  name: string;
  description: string;
  price: number;
  nutrition: string;
};

type Location = { id: number; name: string };

export default function HomeScreen() {
  const [tab, setTab] = useState<"items" | "rewards" | "locations">("items");
  const [items, setItems] = useState<Item[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);

  const bag = useBag();

  const fetchData = async () => {
    try {
      setLoading(true);
      const [itemsRes, locationsRes] = await Promise.all([
        fetch("https://selu383-sp26-p03-g01.azurewebsites.net/api/items"),
        fetch("https://selu383-sp26-p03-g01.azurewebsites.net/api/locations"),
      ]);

      const itemsData = await itemsRes.json();
      const locationsData = await locationsRes.json();

      const rawItems = Array.isArray(itemsData)
        ? itemsData
        : itemsData?.items || [];
      const formattedItems = rawItems.map((item: any) => ({
        id: item.id ?? item.Id,
        name: item.name ?? item.Name ?? "Unknown Item",
        description: item.description ?? item.Description ?? "",
        price: item.price ?? item.Price ?? 0,
        nutrition: item.nutrition ?? item.Nutrition ?? "",
      }));

      const rawLocations = Array.isArray(locationsData)
        ? locationsData
        : locationsData?.locations || [];
      const formattedLocations = rawLocations.map((loc: any) => ({
        id: loc.id ?? loc.Id,
        name: loc.name ?? loc.Name ?? "Unknown Location",
      }));

      setItems(formattedItems);
      setLocations(formattedLocations);
    } catch (err) {
      console.log("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const renderCard = ({ item }: { item: any }) => {
    if (tab === "locations") {
      return (
        <View style={styles.pill}>
          <Text style={styles.pillText}>{item.name}</Text>
          <Pressable
            style={({ pressed }) => [
              styles.addButton,
              { opacity: pressed ? 0.7 : 1 },
            ]}
            onPress={() => {
              try {
                bag.setLocation({ id: item.id, name: item.name });
                Alert.alert("Location set", `${item.name} is now your store.`);
              } catch (e) {
                console.log("Location error:", e);
              }
            }}
          >
            <Text style={styles.addButtonText}>Make this my location</Text>
          </Pressable>
        </View>
      );
    }

    return (
      <View style={styles.pill}>
        <Text style={styles.pillText}>{item.name}</Text>
        <Text style={styles.priceText}>
          ${typeof item.price === "number" ? item.price.toFixed(2) : "0.00"}
        </Text>
        <Text style={styles.descriptionText}>{item.description}</Text>
        <Pressable
          style={({ pressed }) => [
            styles.addButton,
            { opacity: pressed ? 0.7 : 1 },
          ]}
          onPress={async () => {
            try {
              await bag.add(item.id);
              Alert.alert("Added", `${item.name} added to bag!`);
            } catch (e) {
              console.log("Bag error:", e);
            }
          }}
        >
          <Text style={styles.addButtonText}>Add to Bag</Text>
        </Pressable>
      </View>
    );
  };

  if (loading && items.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#d8b4fe" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Image
          source={require("../../assets/images/icon.png")}
          style={styles.icon}
        />
        <Text style={styles.title}>Caffeinated Lions</Text>
      </View>

      <View style={styles.segmentContainer}>
        {(["items", "rewards", "locations"] as const).map((t) => (
          <Pressable
            key={t}
            style={[styles.segmentButton, tab === t && styles.segmentActive]}
            onPress={() => setTab(t)}
          >
            <Text
              style={[
                styles.segmentText,
                tab === t && styles.segmentTextActive,
              ]}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </Text>
          </Pressable>
        ))}
      </View>

      {tab === "rewards" ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No rewards available yet.</Text>
        </View>
      ) : (
        <FlatList
          data={tab === "items" ? items : locations}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderCard}
          contentContainerStyle={{ paddingTop: 20, paddingBottom: 40 }}
          onRefresh={fetchData}
          refreshing={loading}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#242424",
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#242424",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 20,
  },
  icon: { width: 40, height: 40, resizeMode: "contain" },
  title: { fontSize: 26, fontWeight: "bold", color: "#d8b4fe" },
  segmentContainer: {
    flexDirection: "row",
    backgroundColor: "#333",
    borderRadius: 12,
    padding: 4,
  },
  segmentButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  segmentActive: { backgroundColor: "#d8b4fe" },
  segmentText: { color: "#aaa", fontSize: 16, fontWeight: "600" },
  segmentTextActive: { color: "#000" },
  pill: {
    backgroundColor: "#362845",
    padding: 20,
    borderRadius: 12,
    marginBottom: 12,
  },
  pillText: { color: "#d8b4fe", fontSize: 20, fontWeight: "600" },
  priceText: { color: "#fff", fontSize: 16, fontWeight: "bold", marginTop: 4 },
  descriptionText: {
    color: "#d8b4fe",
    fontSize: 14,
    opacity: 0.8,
    marginTop: 4,
  },
  addButton: {
    backgroundColor: "#d8b4fe",
    padding: 10,
    borderRadius: 8,
    marginTop: 12,
    alignItems: "center",
  },
  addButtonText: {
    color: "#362845",
    fontWeight: "bold",
  },
  emptyState: { marginTop: 40, alignItems: "center" },
  emptyText: { color: "#aaa", fontSize: 18, fontWeight: "500" },
});
