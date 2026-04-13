import "@/styles/App.css"
import type { ItemDto } from "@/types/ItemDto";
import { useEffect, useState } from "react";

function Menu(){
    
    const [items, setItems] = useState<ItemDto[]>([]);

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
    
    return (
      //Add some stuff that divdes the menu into categories and then lists the items in those categories.
      <div>
        <h2>Here's our whole menu!</h2>

         {items.length > 0 ? (
        <ul>
          {items.map((item) => (
            <li className="card"key={item.id}>
                <img src={item.imageUrl} alt={item.name} />
                <h2>{item.name}</h2>
                <p>{item.description}</p>
                <p>Price: ${item.price.toFixed(2)}</p>
                <button>Add to bag</button>
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