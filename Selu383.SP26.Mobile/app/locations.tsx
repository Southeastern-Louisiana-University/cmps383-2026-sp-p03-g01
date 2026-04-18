import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useBag } from "../context/BagContext"; // ✅ FIXED PATH

type Location = {
  id: number;
  name: string;
};

export default function Locations() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);

  const { setLocation, selectedLocation } = useBag();

  useEffect(() => {
    fetch("https://selu383-sp26-p03-g01.azurewebsites.net/api/locations")
      .then((res) => res.json())
      .then((data) => {
        setLocations(data);
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

            <Pressable
              onPress={() => setLocation(item)}
              style={({ pressed }) => [
                styles.locationButton,
                { opacity: pressed ? 0.7 : 1 },
              ]}
            >
              <Text style={styles.locationButtonText}>
                {selectedLocation?.id === item.id
                  ? "Selected"
                  : "Make this my location"}
              </Text>
            </Pressable>
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
  },
  rowText: {
    color: "#d8b4fe",
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 10,
  },

  locationButton: {
    backgroundColor: "#d8b4fe",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "#000",
  },
  locationButtonText: {
    color: "#362845",
    fontWeight: "700",
    textAlign: "center",
  },
});
