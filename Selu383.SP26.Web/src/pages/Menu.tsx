import "@/styles/App.css"
import type { ItemDto } from "@/types/ItemDto";
import { useEffect, useState } from "react";
import { BagService } from "@/services/bagService";

function Menu(){
    
    const [items, setItems] = useState<ItemDto[]>([]);
    const [addingToBag, setAddingToBag] = useState<number | null>(null);
    const [addedToBag, setAddedToBag] = useState<Set<number>>(new Set());

        useEffect(() => {
            const itemApi = "/api/items";
            fetch(itemApi)
            .then((response) => {
                return response.json() as Promise<ItemDto[]>;
            })
            .then((data) => {
              console.log("items", data);
              setItems(data);
            })
              .catch((error) => {
                console.error("Error fetching items:", error);
              });
          }, []);
    
    const handleAddToBag = async (itemId: number) => {
        try {
            setAddingToBag(itemId);
            await BagService.addItem(itemId);
            setAddedToBag(prev => new Set(prev).add(itemId));
            // Reset the "Added!" state after 2 seconds
            setTimeout(() => {
                setAddedToBag(prev => {
                    const newSet = new Set(prev);
                    newSet.delete(itemId);
                    return newSet;
                });
            }, 2000);
        } catch (error) {
            console.error("Error adding item to bag:", error);
            alert("Failed to add item to bag");
        } finally {
            setAddingToBag(null);
        }
    };

    return (
      <div>
        <h2 style={{ textAlign: "center" }}>Our Menu</h2>
        {items.length > 0 ? (
          (() => {
            const grouped = items.reduce((acc, item) => {
              if (!acc[item.category]) acc[item.category] = [];
              acc[item.category].push(item);
              return acc;
            }, {} as Record<string, ItemDto[]>);

            const sortedCategories = Object.keys(grouped).sort();

            return sortedCategories.map(category => (
              <div key={category} style={{ marginBottom: "30px" }}>
                <h3 style={{ textAlign: "center" }}>{category}</h3>
                <ul>
                  {grouped[category].sort((a, b) => a.name.localeCompare(b.name)).map((item) => (
                    <li className="card menu-card" key={item.id}>
                      <table style={{ alignItems: "flex-start" }}>
                        <tr>
                          <td><img className="menuItem" src={item.imageUrl} alt={item.name} /></td>
                          <td>
                            <h2>{item.name}</h2>
                            <p style={{ fontWeight: "bold" }}>Price: ${item.price.toFixed(2)}</p>
                            <p>{item.description}</p>
                            <button onClick={() => handleAddToBag(item.id)} disabled={addingToBag === item.id}>
                              {addingToBag === item.id ? "Adding..." : addedToBag.has(item.id) ? "Added!" : "Add to bag"}
                            </button>
                          </td>
                        </tr>
                      </table>
                    </li>
                  ))}
                </ul>
              </div>
            ));
          })()
        ) : (
          <p>No items available.</p>
        )}
      </div>
    )
}

export default Menu