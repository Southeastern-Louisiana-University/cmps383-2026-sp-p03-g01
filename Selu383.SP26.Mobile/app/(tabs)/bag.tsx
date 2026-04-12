import { StyleSheet, Text, View } from "react-native";

export default function BagScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Your bag is empty.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#242424",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: "white",
    fontSize: 20,
    fontWeight: "600",
  },
});
