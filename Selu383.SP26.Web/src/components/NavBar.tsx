//Style import
import "@/styles/nav.css";
//Image imports
import bag from "@/assets/bag.png";
import pin from "@/assets/pin.png";
import icon from "@/assets/icon.png";
//import profile from "@/assets/default.jpg";
//Component imports
import { Outlet, Link } from "react-router";
//Material UI imports
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
//Auth import
import { useAuth } from "@/context/UserLoggedInContext";

export function NavBar() {
  const { user, isLoggedIn, logout } = useAuth();
  const isAdmin = isLoggedIn && user && user.roles.includes("Admin");

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <div>
    <div className="totalBar">

      <div className="head" >
        <div className="headLeft">
          <Link to="/" className="home"><img src={icon} alt="Caffeinated Lions Icon" id="navIcon"></img><h1>Caffeinated Lions</h1></Link>
        </div>

        <div className="headRight">
          <ul>
            {isAdmin && (
              <li>
                <button className="accountButtons"><Link to="/admin">Admin</Link></button>
              </li>
            )}
            {isLoggedIn ? (
              <li>
                <button className="accountButtons" onClick={handleLogout}>Logout</button>
              </li>
            ) : (
              <>
                <li>
                  <button className="accountButtons"><Link to="/login">Login</Link></button>
                </li>
                <li>
                  <button className="accountButtons"><Link to="/signup">Signup</Link></button>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>

      <div className="nav">
        <Box display="flex" justifyContent="center">
          <List className="nav" style={{ display: 'flex', justifyContent: 'center' }}>
            <ListItem className="navItem">
              <Link to="/Menu">Menu</Link>
            </ListItem>

            <ListItem className="navDivider">|</ListItem>

            <ListItem className="navItem">
              <Link to="/Rewards">Rewards</Link>
            </ListItem>

            <ListItem className="navDivider">|</ListItem>

            <ListItem className="navItem">
              <Link to="/locations">Locations
                <img src={pin} alt="Pin" id="pinIcon"></img>
              </Link>
            </ListItem>

            <ListItem className="navDivider">|</ListItem>

            <ListItem className="navItem">
              <Link to="/Bag">Bag
                <img src={bag} alt="Bag" id="bagIcon"></img>
              </Link>
            </ListItem>
          </List>
        </Box>
      </div>

    </div>
      <main>
        <Outlet />
      </main>
    </div>
  );
}
