import "@/styles/App.css"
import type { LocationDto } from "@/types/LocationDto";
import { useEffect, useState } from "react";
import { Link } from "react-router";

function LocationsPage(){
    
    const [locations, setLocations] = useState<LocationDto[]>([]);

        useEffect(() => {
            const locationApi = "/api/locations";
            fetch(locationApi)
            .then((response) => {
              return response.json() as Promise<LocationDto[]>;
            })
            .then((data) => {
              console.log("locations", data);
              setLocations(data);
            })
              .catch((error) => {
                console.error("Error fetching locations:", error);
              });
          }, []);
    
    return (
      <div>
        <h2>Here's where you can find us!</h2>

         {locations.length > 0 ? (
        <ul>
          {locations.map((location) => (
            <li key={location.id}>
                <h2>{location.name}</h2>
                <Link to={`/locations/${location.id}`}>View Details</Link>
            </li>
          ))}
        </ul>
      ) : (
        <p>No locations available.</p>
      )}

      </div>
    )
}

export default LocationsPage