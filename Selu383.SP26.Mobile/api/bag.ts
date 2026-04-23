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

export async function updateItem(itemId: number, quantity: number) {
  const sid = await getSessionId();
  const res = await fetch(`${API_URL}/bag/items/${itemId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "X-Session-Id": sid,
    },
    body: JSON.stringify({ quantity }),
  });
  if (!res.ok) throw new Error("Could not update item");
}

export async function removeItem(itemId: number) {
  const sid = await getSessionId();
  const res = await fetch(`${API_URL}/bag/items/${itemId}`, {
    method: "DELETE",
    headers: { "X-Session-Id": sid },
  });

  if (res.status === 204) return;

  if (res.status === 404) return;

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Could not remove item: ${res.status} ${text}`);
  }
}

  export async function checkout() {
  const sid = await getSessionId();

  console.log("Checkout: session ID =", sid);

  const res = await fetch(`${API_URL}/bag/checkout`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Session-Id": sid,
    },
    body: JSON.stringify({}),
  });

  const text = await res.text();
  console.log("Checkout response:", res.status, text);

  if (!res.ok) {
    throw new Error(`Checkout failed: ${res.status} - ${text}`);
  }

  try {
    return JSON.parse(text);
  } catch {
    return null; 
  }
}
