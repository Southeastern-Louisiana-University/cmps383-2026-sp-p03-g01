import "@/styles/App.css";
import type { ItemDto } from "@/types/ItemDto";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/UserLoggedInContext";

function Home(){
    const [featuredItems, setFeaturedItems] = useState<ItemDto[]>([]);
    const { user, isLoggedIn } = useAuth();

    useEffect(() => {
        const itemsApi = "/api/items";
        fetch(itemsApi)
        .then((response) => {
            return response.json() as Promise<ItemDto[]>;
        })
        .then((data) => {
          console.log("all items", data);
          const featured = data.filter(item => item.featured);
          setFeaturedItems(featured);
        })
          .catch((error) => {
            console.error("Error fetching items:", error);
          });
      }, []);

    return (
      <div>
        <h2 style={{ textAlign: "center" }}>
          {isLoggedIn && user ? `Welcome, ${user.userName}!` : "Welcome!"}
        </h2>
        <p style={{ textAlign: "center" }}>
          Experience the best coffee in town with our wide selection of blends and flavors. 
        </p>
        <p style={{ textAlign: "center" }}>
          Join our rewards program to earn points and enjoy exclusive offers. 
        </p>
        <p style={{ textAlign: "center" }}>
          Find a location near you and visit us today!
        </p>
        
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <h3>Featured Items</h3>
          {featuredItems.length > 0 ? (
            featuredItems.map((item) => (
              <div key={item.id} className="card" style={{ marginBottom: '20px', textAlign: 'center' }}>
                <img src={item.imageUrl} alt={item.name} style={{ width: "100px", height: "100px", borderRadius: "20px", objectFit: "cover" }} />
                <h3>{item.name}</h3>
                <p>{item.description}</p>
                <p style={{ fontWeight: "bold" }}>Price: ${item.price.toFixed(2)}</p>
              </div>
            ))
          ) : (
            <>
              <div className="card" style={{ marginBottom: '20px', textAlign: 'center' }}>
                <h3>Spring Tea</h3>
                <p>A delightful taste sensation</p>
              </div>

              <div className="card" style={{ marginBottom: '20px', textAlign: 'center' }}>
                <h3>Spring Coffee</h3>
                <p>A rich and smooth blend</p>
              </div>

              <div className="card" style={{ marginBottom: '20px', textAlign: 'center' }}>
                <h3>Spring Pastry</h3>
                <p>A delicious treat for any time of day</p>
              </div>
            </>
          )}
        </div>

      </div>
    )
}

export default Home