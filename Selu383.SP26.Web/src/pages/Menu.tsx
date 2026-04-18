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
      //Add some stuff that divdes the menu into categories and then lists the items in those categories.
      <div>
        <h2 style={{ textAlign: "center" }}>Our Menu</h2>
         {items.length > 0 ? (
        <ul>
          {items.map((item) => (
            <li className="card menu-card" key={item.id}>
                <table>
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
      ) : (
        <p>No items available.</p>
      )}

      </div>
    )
}

export default Menu