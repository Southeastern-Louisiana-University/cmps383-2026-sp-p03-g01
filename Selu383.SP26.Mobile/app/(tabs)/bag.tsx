import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
  Modal,
} from "react-native";
import { useBag } from "../../context/BagContext";
import { router } from "expo-router";
import { useState, useEffect } from "react";

export default function BagTab() {
  const { bag, loading, remove, clear, refresh } = useBag();
  const [user, setUser] = useState(null);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  // Fetch user from backend (cookie-based)
  async function fetchUser() {
    try {
      const res = await fetch(
        "https://selu383-sp26-p03-g01.azurewebsites.net/api/authentication/me",
        {
          method: "GET",
          credentials: "include",
        }
      );

      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  }

  useEffect(() => {
    fetchUser().then(setUser);
  }, []);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#d8b4fe" />
        <Text style={[styles.text, { marginTop: 10 }]}>
          Loading your bag...
        </Text>
      </View>
    );
  }

  if (!bag || !bag.items || bag.items.length === 0) {
    return (
      <View style={styles.centered}>
        <Text style={styles.text}>Your bag is empty.</Text>
        <Pressable onPress={refresh} style={styles.retryButton}>
          <Text style={styles.retryButtonText}>Refresh Bag</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={bag.items}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ padding: 20 }}
        renderItem={({ item }) => (
          <View style={styles.itemRow}>
            <View style={styles.itemInfo}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>
            </View>
            <Pressable
              onPress={() => remove(item.id)}
              style={({ pressed }) => [
                styles.removeButton,
                { opacity: pressed ? 0.7 : 1 },
              ]}
            >
              <Text style={styles.removeButtonText}>Remove</Text>
            </Pressable>
          </View>
        )}
      />

      <View style={styles.footer}>
        <Text style={styles.subtotalText}>
          Subtotal: ${bag.subtotal.toFixed(2)}
        </Text>

        <Pressable
          style={styles.checkoutButton}
          onPress={() => {
            if (!user) {
              setShowLoginPrompt(true);
              return;
            }
            router.push("/checkout");
          }}
        >
          <Text style={styles.checkoutText}>Checkout</Text>
        </Pressable>

        <Pressable
          onPress={clear}
          style={({ pressed }) => [
            styles.clearButton,
            { opacity: pressed ? 0.7 : 1 },
          ]}
        >
          <Text style={styles.clearButtonText}>Clear Bag</Text>
        </Pressable>
      </View>

      {/* LOGIN MODAL */}
      <Modal
        transparent
        animationType="fade"
        visible={showLoginPrompt}
        onRequestClose={() => setShowLoginPrompt(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Earn Reward Points</Text>
            <Text style={styles.modalText}>
              Log in to earn points for this purchase.
            </Text>

            <View style={styles.modalButtons}>
              <Pressable
                style={styles.modalButtonLogin}
                onPress={() => {
                  setShowLoginPrompt(false);
                  router.push("/login");
                }}
              >
                <Text style={styles.modalButtonTextDark}>Login</Text>
              </Pressable>

              <Pressable
                style={styles.modalButtonContinue}
                onPress={() => {
                  setShowLoginPrompt(false);
                  router.push("/checkout");
                }}
              >
                <Text style={styles.modalButtonTextLight}>Continue</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#333333",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#333333",
  },
  text: {
    color: "#d8b4fe",
    fontSize: 20,
    fontWeight: "600",
  },
  itemRow: {
    backgroundColor: "#362845",
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#4a3b5c",
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    color: "#d8b4fe",
    fontSize: 18,
    fontWeight: "700",
  },
  itemPrice: {
    color: "#d8b4fe",
    fontSize: 16,
    opacity: 0.9,
  },
  removeButton: {
    backgroundColor: "#d8b4fe",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  removeButtonText: {
    color: "#362845",
    fontWeight: "700",
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderColor: "#444",
    backgroundColor: "#333333",
    flexDirection: "column",
    gap: 12,
  },
  subtotalText: {
    color: "#d8b4fe",
    fontSize: 22,
    fontWeight: "800",
    marginBottom: 15,
    textAlign: "right",
  },
  clearButton: {
    backgroundColor: "#d8b4fe",
    padding: 16,
    alignItems: "center",
    borderRadius: 4,
    marginTop: 10
  },
  clearButtonText: {
    color: "#362845",
    fontWeight: "800",
    fontSize: 16,
  },
  retryButton: {
    marginTop: 20,
    padding: 12,
    borderWidth: 1,
    borderColor: "#d8b4fe",
    borderRadius: 4,
  },
  retryButtonText: {
    color: "#d8b4fe",
    fontWeight: "600",
  },
  checkoutButton: {
    backgroundColor: "#d8b4fe",
    padding: 16,
    alignItems: "center",
    borderRadius: 4,
  },
  checkoutText: {
    color: "#362845",
    fontWeight: "800",
    fontSize: 16,
  },
  modalOverlay: {
  flex: 1,
  backgroundColor: "rgba(0,0,0,0.6)",
  justifyContent: "center",
  alignItems: "center",
},

modalBox: {
  width: "80%",
  backgroundColor: "#362845",
  padding: 20,
  borderRadius: 12,
  borderWidth: 1,
  borderColor: "#d8b4fe",
},

modalTitle: {
  color: "#d8b4fe",
  fontSize: 22,
  fontWeight: "700",
  marginBottom: 10,
  textAlign: "center",
},

modalText: {
  color: "white",
  fontSize: 16,
  textAlign: "center",
  marginBottom: 20,
},

modalButtons: {
  flexDirection: "row",
  justifyContent: "space-between",
},

modalButtonLogin: {
  backgroundColor: "#d8b4fe",
  paddingVertical: 10,
  paddingHorizontal: 20,
  borderRadius: 8,
  flex: 1,
  marginRight: 8,
},

modalButtonContinue: {
  backgroundColor: "transparent",
  borderWidth: 1,
  borderColor: "#d8b4fe",
  paddingVertical: 10,
  paddingHorizontal: 20,
  borderRadius: 8,
  flex: 1,
  marginLeft: 8,
},

modalButtonTextDark: {
  color: "#362845",
  fontWeight: "700",
  textAlign: "center",
},

modalButtonTextLight: {
  color: "#d8b4fe",
  fontWeight: "700",
  textAlign: "center",
},
});
