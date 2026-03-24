import { useEffect, useState } from "react";
import reactLogo from "@/assets/react.svg";
import viteLogo from "/vite.svg";
import "@/styles/App.css";
import { Link } from "react-router";
import type { LocationDto } from "@/types/LocationDto";

function Home() {
  //const [count, setCount] = useState(0);

  const [locations, setLocations] = useState<LocationDto[]>([]);

  useEffect(() => {
    const locationApi = "/api/locations";
    fetch(locationApi)
      .then((response) => response.json() as Promise<LocationDto[]>)
      .then((data) => {
        console.log("locations", data);
        setLocations(data);
      })
      .catch((error) => {
        console.error("Error fetching locations:", error);
      });
  }, []);

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React is cool</h1>

      <Link to="/test">Go to test page!</Link>
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
      <div></div>
      <div className="card">
        

        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">Click on the Vite and React logos to learn more</p>
    </>
  );
}

export default Home;
