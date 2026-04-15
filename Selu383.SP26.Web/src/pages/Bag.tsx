import "@/styles/App.css";
import { useEffect, useState } from "react";
import type { BagDto, BagItemDto } from "@/types/BagDto";
import { BagService } from "@/services/bagService";

function Bag() {
    const [bag, setBag] = useState<BagDto | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchBag = async () => {
        try {
            setLoading(true);
            const bagData = await BagService.getBag();
            setBag(bagData);
            setError(null);
        } catch (err) {
            setError("Failed to load bag");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBag();
    }, []);

    const handleUpdateQuantity = async (itemId: number, newQuantity: number) => {
        if (newQuantity <= 0) {
            await handleRemoveItem(itemId);
            return;
        }

        try {
            await BagService.updateItemQuantity(itemId, newQuantity);
            await fetchBag(); // Refresh bag data
        } catch (err) {
            setError("Failed to update quantity");
            console.error(err);
        }
    };

    const handleRemoveItem = async (itemId: number) => {
        try {
            await BagService.removeItem(itemId);
            await fetchBag(); // Refresh bag data
        } catch (err) {
            setError("Failed to remove item");
            console.error(err);
        }
    };

    const handleCheckout = async () => {
        try {
            await BagService.checkout();
            alert("Checkout successful!");
            await fetchBag(); // Refresh bag data
        } catch (err) {
            setError("Failed to checkout");
            console.error(err);
        }
    };

    if (loading) {
        return <div>Loading bag...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!bag || bag.items.length === 0) {
        return (
            <div>
                <h2>Your bag is empty</h2>
                <p>Add some items from the menu!</p>
            </div>
        );
    }

    return (
        <div>
            <h2>Items in your bag:</h2>
            <ul>
                {bag.items.map((item: BagItemDto) => (
                    <li key={item.itemId} className="card">
                        <div>
                            <h3>{item.name}</h3>
                            <p>Price: ${item.price.toFixed(2)}</p>
                            <div>
                                <label>Quantity: </label>
                                <button onClick={() => handleUpdateQuantity(item.itemId, item.quantity - 1)}>-</button>
                                <span>  {item.quantity}  </span>
                                <button onClick={() => handleUpdateQuantity(item.itemId, item.quantity + 1)}>+</button>
                            </div>
                            <p>Item Total: ${item.lineTotal.toFixed(2)}</p>
                            <button onClick={() => handleRemoveItem(item.itemId)}>Remove</button>
                        </div>
                    </li>
                ))}
            </ul>
            <div className="bag-summary">
                <h3>Subtotal: ${bag.subtotal.toFixed(2)}</h3>
                <button onClick={handleCheckout}>Checkout</button>
            </div>
        </div>
    );
}

export default Bag;
