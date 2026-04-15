import type { BagDto, AddItemDto, UpdateItemDto } from "@/types/BagDto";

const API_BASE = "/api";

export class BagService {
    static async getBag(): Promise<BagDto> {
        const response = await fetch(`${API_BASE}/bag`);
        if (!response.ok) {
            throw new Error("Failed to fetch bag");
        }
        return response.json();
    }

    static async addItem(itemId: number, quantity: number = 1): Promise<void> {
        const response = await fetch(`${API_BASE}/bag/items`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ itemId, quantity } as AddItemDto),
        });
        if (!response.ok) {
            throw new Error("Failed to add item to bag");
        }
    }

    static async updateItemQuantity(itemId: number, quantity: number): Promise<void> {
        const response = await fetch(`${API_BASE}/bag/items/${itemId}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ quantity } as UpdateItemDto),
        });
        if (!response.ok) {
            throw new Error("Failed to update item quantity");
        }
    }

    static async removeItem(itemId: number): Promise<void> {
        const response = await fetch(`${API_BASE}/bag/items/${itemId}`, {
            method: "DELETE",
        });
        if (!response.ok) {
            throw new Error("Failed to remove item from bag");
        }
    }

    static async checkout(): Promise<void> {
        const response = await fetch(`${API_BASE}/bag/checkout`, {
            method: "POST",
        });
        if (!response.ok) {
            throw new Error("Failed to checkout");
        }
    }
}