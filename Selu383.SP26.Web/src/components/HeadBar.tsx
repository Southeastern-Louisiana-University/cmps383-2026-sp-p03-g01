import "@/styles/App.css";
import icon from "@/assets/icon.png";

import { Outlet, Link } from "react-router";

export function HeadBar() {
  return (
    <div>
    <div className="head">
      <Link to="/" id="home"><img src={icon} alt="Caffeinated Lions Icon" id="navIcon"></img><h1>Caffeinated Lions</h1></Link>
      <Link to="/login">Login</Link>
      <Link to="/signup">Signup</Link>
      <Link to="/account">Account</Link>
    </div>

    <main>
      <Outlet />
    </main>

    </div>
  );
}
