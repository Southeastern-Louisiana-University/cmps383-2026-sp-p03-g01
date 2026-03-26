import "@/styles/App.css";

import { Outlet, Link } from "react-router";

export function NavBar() {
  return (
    <div>
    <div className="nav">
      <Link to="/" id="home"><h1>Caffeinated Lions</h1></Link>
      <ul className="nav">
        <li className="navItem"><Link to="/Menu">Menu</Link></li>
        <li className="navItem"><Link to="/Rewards">Rewards</Link></li>
        <li className="navItem"><Link to="/locations">Locations</Link></li>
        <li className="navItem"><Link to="/Bag"><img src="path/to/image.jpg" alt="Bag"></img></Link></li>
        <li className="navItem"><Link to="/Account">Account</Link></li>
      </ul>
    </div>

    <main>
      <Outlet />
    </main>

    </div>
  );
}
