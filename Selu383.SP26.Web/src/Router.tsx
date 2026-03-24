import { Routes, Route } from "react-router";
import Home from "@/pages/Home.tsx";
import { TestPage } from "@/pages/TestPage";
import { NavBar } from "@/components/NavBar";
//import { LocationsPage } from "@/pages/LocationsPage";

export function Router() {
  return (
    <Routes>
      <Route element={<NavBar />}>
        <Route index element={<Home />} />
        <Route path="test" element={<TestPage />} />
        <Route path="locations" element={<div>Locations List Page</div>} />
      </Route>
    </Routes>
  );
}
