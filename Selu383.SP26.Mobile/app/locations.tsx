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
    fetch("http://172.25.131.79:7116/api/locations")
      .then((res) => res.json())
      .then((data: Location[]) => {
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
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={locations}
        keyExtractor={(loc) => loc.id.toString()}
        renderItem={({ item }) => <Text style={styles.text}>{item.name}</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  text: {
    fontSize: 22,
    marginBottom: 10,
  },
});
