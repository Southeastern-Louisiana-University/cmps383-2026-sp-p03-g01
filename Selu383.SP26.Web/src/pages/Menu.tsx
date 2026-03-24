import "@/styles/App.css"
import type { ItemDto } from "@/types/ItemDto";
import { useEffect, useState } from "react";
import { Link } from "react-router";

function Menu(){
    
    const [locations, setLocations] = useState<ItemDto[]>([]);

        useEffect(() => {
            const itemApi = `/api/items`;
            fetch(itemApi)
            .then((response) => {
                return response.json() as Promise<ItemDto[]>;
            })
            .then((data) => {
              console.log("items", data);
              setLocations(data);
            })
              .catch((error) => {
                console.error("Error fetching items:", error);
              });
          }, []);
    
    return (
      <div>
        <h2>Here's our whole menu!</h2>

         {locations.length > 0 ? (
        <ul>
          {locations.map((item) => (
            <li key={item.Id}>
                <h2>{item.Name}</h2>
                <Link to={`/items/${item.Id}`}>View Details</Link>
                //The "extra options" stuff still needs to be added but idk how to do that rn.
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