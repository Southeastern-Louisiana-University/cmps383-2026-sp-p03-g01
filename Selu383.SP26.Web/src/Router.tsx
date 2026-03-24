import { Routes, Route } from "react-router";

import { NavBar } from "@/components/NavBar";

import Home from "@/pages/Home";
import LocationsPage from "@/pages/LocationsPage";

export function Router() {
  return (
    <Routes>
      <Route element={<NavBar />}>
        <Route index element={<Home />} />
        <Route path="locations" element={<LocationsPage />} />
      </Route>
    </Routes>
  );
}
