import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useBag } from "../../context/BagContext";
import { router } from "expo-router";

type Item = {
  id: number;
  name: string;
  description: string;
  price: number;
  nutrition: string;
  imageUrl: string;
};

type UserDto = {
  id: number;
  userName: string;
  roles: string[];
};

type Location = { id: number; name: string };

export default function HomeScreen() {
  const [tab, setTab] = useState<"items" | "rewards" | "locations">("items");
  const [items, setItems] = useState<Item[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<UserDto | null>(null);
  const bag = useBag();

  async function fetchUser() {
    const res = await fetch(
      "https://selu383-sp26-p03-g01.azurewebsites.net/api/authentication/me",
      {
        method: "GET",
        credentials: "include",
      }
    );

    if (!res.ok) return null;
    return await res.json();
  }

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
        imageUrl: item.imageUrl ?? item.ImageUrl ?? "",
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

  async function loadUser() {
    const u = await fetchUser();
    console.log("USER FROM BACKEND:", u);
    setUser(u);
  }

    loadUser();
  }, []);

  const renderCard = ({ item }: { item: any }) => {
    if (tab === "locations") {
      return (
        <View style={styles.pill}>
          <Text style={styles.pillText}>{item.name}</Text>
          <Text style={styles.descriptionText}>Visit us at this location!</Text>
        </View>
      );
    }

    return (
      <View style={styles.pill}>
        {item.imageUrl ? (
          <Image
            source={{ uri: item.imageUrl }}
            style={styles.itemImage}
            resizeMode="cover"
          />
        ) : (
          <View style={[styles.itemImage, styles.placeholderImage]}>
            <Text style={{ color: "#aaa" }}>No Image Available</Text>
          </View>
        )}

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

          <Pressable
            style={styles.loginButton}
            onPress={() => {
              if (!user) router.push("/login");
              else router.push("/profile");
            }}
          >
            <Text style={styles.loginButtonText}>
              {user ? (user.userName?.slice(0, 5) ?? "User") : "Login"}
            </Text>
          </Pressable>
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
  itemImage: {
    width: "100%",
    height: 180,
    borderRadius: 8,
    marginBottom: 12,
    backgroundColor: "#2a1f35",
  },
  placeholderImage: {
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#4a3b5c",
    borderStyle: "dashed",
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

  loginButton: {
    marginLeft: "auto",
    backgroundColor: "#d8b4fe",
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 8,
  },

  loginButtonText: {
    color: "black",
    fontSize: 16,
    fontWeight: "600",
  },

  emptyState: { marginTop: 40, alignItems: "center" },
  emptyText: { color: "#aaa", fontSize: 18, fontWeight: "500" },
});
