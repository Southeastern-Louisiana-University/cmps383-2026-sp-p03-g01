import { getSessionId } from "../session";

const API_URL = "https://selu383-sp26-p03-g01.azurewebsites.net/api/bag"; // change if needed

export async function getBag() {
  const sid = await getSessionId();
  const res = await fetch(`${API_URL}/bag`, {
    headers: { "X-Session-Id": sid },
  });
  return res.json();
}

export async function addItem(itemId: number, quantity: number = 1) {
  const sid = await getSessionId();
  await fetch(`${API_URL}/bag/items`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Session-Id": sid,
    },
    body: JSON.stringify({ itemId, quantity }),
  });
}

export async function updateItem(itemId: number, quantity: number) {
  const sid = await getSessionId();
  await fetch(`${API_URL}/bag/items/${itemId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "X-Session-Id": sid,
    },
    body: JSON.stringify({ quantity }),
  });
}

export async function removeItem(itemId: number) {
  const sid = await getSessionId();
  await fetch(`${API_URL}/bag/items/${itemId}`, {
    method: "DELETE",
    headers: { "X-Session-Id": sid },
  });
}

export async function checkout() {
  const sid = await getSessionId();
  await fetch(`${API_URL}/bag/checkout`, {
    method: "POST",
    headers: { "X-Session-Id": sid },
  });
}
