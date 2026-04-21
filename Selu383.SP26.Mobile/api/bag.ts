import { getSessionId } from "../session";

const API_URL = "https://selu383-sp26-p03-g01.azurewebsites.net/api";

export async function getBag() {
  const sid = await getSessionId();
  const res = await fetch(`${API_URL}/bag`, {
    headers: { "X-Session-Id": sid },
  });
  if (!res.ok) throw new Error("Could not retrieve bag");
  return res.json();
}

// FIX: Added /items to the path
export async function addItem(itemId: number, quantity: number = 1) {
  const sid = await getSessionId();
  const res = await fetch(`${API_URL}/bag/items`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Session-Id": sid,
    },
    body: JSON.stringify({ itemId, quantity }),
  });
  if (!res.ok) throw new Error("Could not add item");
}

// FIX: Changed PUT to PATCH and updated path to /bag/items/{itemId}
export async function updateItem(itemId: number, quantity: number) {
  const sid = await getSessionId();
  const res = await fetch(`${API_URL}/bag/items/${itemId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "X-Session-Id": sid,
    },
    body: JSON.stringify({ quantity }), // Swagger usually just needs quantity here
  });
  if (!res.ok) throw new Error("Could not update item");
}

// FIX: Updated path to /bag/items/{itemId}
export async function removeItem(itemId: number) {
  const sid = await getSessionId();
  const res = await fetch(`${API_URL}/bag/items/${itemId}`, {
    method: "DELETE",
    headers: { "X-Session-Id": sid },
  });
  if (!res.ok) throw new Error("Could not remove item");
}

export async function checkout() {
  const sid = await getSessionId();
  const res = await fetch(`${API_URL}/bag/checkout`, {
    method: "POST",
    headers: { "X-Session-Id": sid },
  });
  if (!res.ok) throw new Error("Checkout failed");
}
