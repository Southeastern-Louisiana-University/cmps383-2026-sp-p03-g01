import "@/styles/nav.css";
import bag from "@/assets/bag.png";
import pin from "@/assets/pin.png";

import { Outlet, Link } from "react-router";

import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";

export function NavBar() {
  return (
    <div>
      <div className="nav">
        <Box display="flex" justifyContent="center">
          <List className="nav" style={{ display: 'flex', justifyContent: 'center' }}>
            <ListItem className="navItem"><Link to="/Menu">Menu</Link></ListItem>
            <ListItem className="navDivider">|</ListItem>
            <ListItem className="navItem"><Link to="/Rewards">Rewards</Link></ListItem>
            <ListItem className="navDivider">|</ListItem>
            <ListItem className="navItem"><Link to="/locations">Locations<img src={pin} alt="Pin" id="pinIcon"></img></Link></ListItem>
            <ListItem className="navDivider">|</ListItem>
            <ListItem className="navItem"><Link to="/Bag">Bag<img src={bag} alt="Bag" id="bagIcon"></img></Link></ListItem>
          </List>
        </Box>
      </div>

      <main>
        <Outlet />
      </main>
      
    </div>
  );
}
