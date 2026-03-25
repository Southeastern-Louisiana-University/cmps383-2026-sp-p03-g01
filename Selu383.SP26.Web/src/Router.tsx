import { Routes, Route } from "react-router";

import { NavBar } from "@/components/NavBar";

import Home from "@/pages/Home";
import Menu from "@/pages/Menu";
import Rewards from "@/pages/Rewards";
import LocationsPage from "@/pages/LocationsPage";
import Bag from "@/pages/Bag";
import Account from "@/pages/Account";

import { LocationDetailPage } from "@/pages/LocationDetailPage";

export function Router() {
  return (
    <Routes>
      <Route element={<NavBar />}>
        <Route index element={<Home />} />
        <Route path="menu" element={<Menu />} />
        <Route path="rewards" element={<Rewards />} />
        <Route path="locations" element={<LocationsPage />} />
        <Route path="bag" element={<Bag />} />
        <Route path="account" element={<Account />} />

        <Route path="locations/:locationId" element={<LocationDetailPage />} />

      </Route>
    </Routes>
  );
}
