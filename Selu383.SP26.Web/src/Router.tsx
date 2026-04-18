import { Routes, Route } from "react-router";

import { NavBar } from "@/components/NavBar";
import { AuthProvider } from "@/context/UserLoggedInContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";

import Home from "@/pages/Home";
import Menu from "@/pages/Menu";
import Rewards from "@/pages/Rewards";
import LocationsPage from "@/pages/LocationsPage";
import Bag from "@/pages/Bag";
import Account from "@/pages/Account";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import Admin from "@/pages/Admin";

import { LocationDetailPage } from "@/pages/LocationDetailPage";

export function Router() {
  return (
    <AuthProvider>
      <Routes>
        <Route element={<NavBar />}>
          <Route index element={<Home />} />
          <Route path="menu" element={<Menu />} />
          <Route path="rewards" element={<Rewards />} />
          <Route path="locations" element={<LocationsPage />} />
          <Route path="bag" element={<Bag />} />
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<Signup />} />
          <Route path="account" element={<Account />} />
          <Route path="admin" element={
            <ProtectedRoute requiredRoles={["Admin"]}>
              <Admin />
            </ProtectedRoute>
          } />

          <Route path="locations/:locationId" element={<LocationDetailPage />} />

        </Route>
      </Routes>
    </AuthProvider>
  );
}
