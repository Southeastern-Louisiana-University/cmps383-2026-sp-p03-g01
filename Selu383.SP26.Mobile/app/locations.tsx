import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";

type Location = {
  id: number;
  name: string;
};

export default function Locations() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://selu383-sp26-p03-g01.azurewebsites.net/api/locations")
      .then((res) => res.json())
      .then((data) => {
        // Handle potential case differences from API
        const formattedLocations = Array.isArray(data)
          ? data.map((loc: any) => ({
              id: loc.id ?? loc.Id,
              name: loc.name ?? loc.Name,
            }))
          : [];
        setLocations(formattedLocations);
        setLoading(false);
      })
      .catch((err) => {
        console.log("Error fetching locations:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#d8b4fe" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={locations}
        keyExtractor={(loc) => loc.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Text style={styles.rowText}>{item.name}</Text>
            <Text style={styles.subText}>Open for orders</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#000",
  },
  row: {
    backgroundColor: "#1a1a1a",
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#333",
    borderRadius: 8,
  },
  rowText: {
    color: "#d8b4fe",
    fontSize: 20,
    fontWeight: "600",
  },
  subText: {
    color: "#aaa",
    fontSize: 14,
    marginTop: 4,
  },
});
