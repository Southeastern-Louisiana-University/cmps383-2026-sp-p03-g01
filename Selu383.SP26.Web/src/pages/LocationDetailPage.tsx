import type { LocationDto } from "@/types/LocationDto";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import "@/styles/App.css"

export function LocationDetailPage() {
  const params = useParams();
  const locationId = params.locationId;
  useEffect(() => {
    console.log("location id", locationId);
  }, [locationId]);

  const [location, setLocation] = useState<LocationDto | undefined>(undefined);
  useEffect(() => {
    const locationApi = `/api/locations/${locationId}`;
    fetch(locationApi)
      .then((response) => response.json() as Promise<LocationDto>)
      .then((data) => {
        console.log("location", data);
        setLocation(data);
      })
      .catch((error) => {
        console.error("Error fetching location:", error);
      });
  }, [locationId]);

  return (
    <div id="map">
      <h1>{location?.name}</h1>
      <p>{location === undefined ? "Loading..." : location.address}</p>
      <button style={{ backgroundColor: "rgb(216, 180, 254)", color: "rgb(54, 40, 69)", border: "none", borderRadius: "5px", padding: "5px", cursor: "pointer" }}>Order from here</button>
    </div>
  );
}