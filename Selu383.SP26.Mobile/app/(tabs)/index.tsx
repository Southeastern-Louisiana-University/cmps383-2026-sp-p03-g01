import { useEffect, useState, useContext } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { router } from "expo-router";
import { AuthContext } from "@/context/AuthContext";

type Item = { id: number; name: string };
type Location = { id: number; name: string };

export default function HomeScreen() {
  const [tab, setTab] = useState<"items" | "rewards" | "locations">("items");

  const [items, setItems] = useState<Item[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);

  const { user } = useContext(AuthContext);

  useEffect(() => {
    Promise.all([
      fetch("https://selu383-sp26-p03-g01.azurewebsites.net/api/items").then(
        (r) => r.json()
      ),
      fetch(
        "https://selu383-sp26-p03-g01.azurewebsites.net/api/locations"
      ).then((r) => r.json()),
    ])
      .then(([itemsData, locationsData]) => {
        setItems(itemsData);
        setLocations(locationsData);
        setLoading(false);
      })
      .catch((err) => {
        console.log("Error fetching data:", err);
        setLoading(false);
      });
  }, []);

  const renderCard = ({ item }: { item: Item | Location }) => (
    <View style={styles.pill}>
      <Text style={styles.pillText}>{item.name}</Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#d8b4fe" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerRow}>
        <Image
          source={require("../../assets/images/icon.png")}
          style={styles.icon}
        />
        <Text style={styles.title}>Caffeinated Lions</Text>

        {/* Always show button — text changes based on login state */}
        <Pressable
          style={styles.loginButton}
          onPress={() => {
            if (!user) router.push("/login");
            else router.push("/logout");
          }}
        >
          <Text style={styles.loginButtonText}>
            {user ? user.username.substring(0, 5) : "Login"}
          </Text>
        </Pressable>
      </View>

      {/* Segmented Control */}
      <View style={styles.segmentContainer}>
        <Pressable
          style={[
            styles.segmentButton,
            tab === "items" && styles.segmentActive,
          ]}
          onPress={() => setTab("items")}
        >
          <Text
            style={[
              styles.segmentText,
              tab === "items" && styles.segmentTextActive,
            ]}
          >
            Menu
          </Text>
        </Pressable>

        <Pressable
          style={[
            styles.segmentButton,
            tab === "rewards" && styles.segmentActive,
          ]}
          onPress={() => setTab("rewards")}
        >
          <Text
            style={[
              styles.segmentText,
              tab === "rewards" && styles.segmentTextActive,
            ]}
          >
            Rewards
          </Text>
        </Pressable>

        <Pressable
          style={[
            styles.segmentButton,
            tab === "locations" && styles.segmentActive,
          ]}
          onPress={() => setTab("locations")}
        >
          <Text
            style={[
              styles.segmentText,
              tab === "locations" && styles.segmentTextActive,
            ]}
          >
            Locations
          </Text>
        </Pressable>
      </View>

      {/* Content */}
      {tab === "rewards" ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No rewards available yet.</Text>
        </View>
      ) : (
        <FlatList
          data={tab === "items" ? items : locations}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderCard}
          contentContainerStyle={{ paddingTop: 20 }}
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

  icon: {
    width: 40,
    height: 40,
    resizeMode: "contain",
  },

  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#d8b4fe",
  },

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

  segmentActive: {
    backgroundColor: "#d8b4fe",
  },

  segmentText: {
    color: "#aaa",
    fontSize: 16,
    fontWeight: "600",
  },

  segmentTextActive: {
    color: "#000",
  },

  pill: {
    backgroundColor: "#362845",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 12,
  },

  pillText: {
    color: "#d8b4fe",
    fontSize: 20,
    fontWeight: "600",
  },

  emptyState: {
    marginTop: 40,
    alignItems: "center",
  },

  emptyText: {
    color: "#aaa",
    fontSize: 18,
    fontWeight: "500",
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
});
