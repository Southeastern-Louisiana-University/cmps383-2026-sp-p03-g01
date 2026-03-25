import "@/styles/App.css"
import { Link } from "react-router";

function LocationsPage(){    
    return (
      <div>
        <h2>Here's where you can find us!</h2>
        <ul>
            <li className="card">
                <h2>Hypothetical Location</h2>
                <Link to={`/locations/1`}>View Details</Link>
            </li>
        </ul>
      </div>
    )
}

export default LocationsPage

//For the love of GOD get help to fix the frontend/backend connection. This is completely faking a functional location page.