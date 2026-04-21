import "@/styles/App.css";
import type { ItemDto } from "@/types/ItemDto";
import { useEffect, useState } from "react";

function Home(){
    const [featuredItems, setFeaturedItems] = useState<ItemDto[]>([]);

    useEffect(() => {
        const featuredApi = "/api/items/featured";
        fetch(featuredApi)
        .then((response) => {
            return response.json() as Promise<ItemDto[]>;
        })
        .then((data) => {
          console.log("featured items", data);
          setFeaturedItems(data);
        })
          .catch((error) => {
            console.error("Error fetching featured items:", error);
          });
      }, []);

    return (

      //This assumes the user is not logged in, so I need to get the authentication stuff set up.
      <div>
        <h2 style={{ textAlign: "center" }}>Welcome!</h2>
        <p style={{ textAlign: "center" }}>
          Experience the best coffee in town with our wide selection of blends and flavors. 
          Join our rewards program to earn points and enjoy exclusive offers. 
          Find a location near you and visit us today!
        </p>
        
        <table>
          <tr><th>Featured Items</th></tr>
          <tr>
            {featuredItems.length > 0 ? (
              featuredItems.map((item) => (
                <td key={item.id}>
                  <div className="card">
                    <img src={item.imageUrl} alt={item.name} style={{ width: "100px", height: "100px" }} />
                    <h3>{item.name}</h3>
                    <p>{item.description}</p>
                    <p style={{ fontWeight: "bold" }}>Price: ${item.price.toFixed(2)}</p>
                  </div>
                </td>
              ))
            ) : (
              <>
                <td>
                  <div className="card">
                    <h3>Spring Tea</h3>
                    <p>A delightful taste sensation</p>
                  </div>
                </td>

                <td>
                  <div className="card">
                    <h3>Spring Coffee</h3>
                    <p>A rich and smooth blend</p>
                  </div>
                </td>

                <td>
                  <div className="card">
                    <h3>Spring Pastry</h3>
                    <p>A delicious treat for any time of day</p>
                  </div>
                </td>
              </>
            )}
          </tr>
        </table>

      </div>
    )
}

export default Home