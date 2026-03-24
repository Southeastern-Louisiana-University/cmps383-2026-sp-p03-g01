import type { LocationDto } from "@/types/LocationDto";
import { useEffect, useState } from "react";
import { useParams } from "react-router";

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
    <div>
      <h1>Location Detail Page {locationId}</h1>
      <a href="https://maps.google.com" target="_blank" rel="noopener noreferrer" style={{ display: "block" }}>
        View upcoming location on map!
      </a>
      <span>{location === undefined ? "Loading..." : location.address}</span>
    </div>
  );
}
