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
      <h1>Location Detail Page {locationId}</h1>
      <div>
        <iframe width="400px" height="400px" src="https://maps.google.com/maps?hl=en&amp;q=610%20Ned%20McGehee%20Drive,%20Hammond,%20Louisiana%2070402+(Caffinated%20Lions)&amp;t=&amp;z=14&amp;ie=UTF8&amp;iwloc=B&amp;output=embed"></iframe>
      </div>
      <span>{location === undefined ? "123 Main Street" : location.address}</span>
    </div>
  );
}
//replace the "123 Main Stree" with the "Loading..." text after the presentation.