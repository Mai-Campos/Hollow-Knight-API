import "./App.css";
import { Routes, Route } from "react-router-dom";
import { useLocation } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import NavBar from "./components/NavBar";
import Home from "./pages/Home";
import Characters from "./pages/CharactersPages/Characters";
import CharacterDetail from "./pages/CharactersPages/CharacterDetail";
import Abilities from "./pages/AbilitiesPages/Abilities";
import AbilityDetails from "./pages/AbilitiesPages/AbilityDetails";
import Regions from "./pages/RegionsPages/Regions";
import RegionDetail from "./pages/RegionsPages/RegionDetails";
import Login from "./pages/AuthPages/Login";
import Register from "./pages/AuthPages/Register";
import ManageCharacters from "./pages/AdminPages/ManageCharacters";
import ManageRegions from "./pages/AdminPages/ManageRegions";
import Footer from "./components/Footer";
import AccessDenied from "./pages/ErrorsPages/AccesDenied";
import PageNotFound from "./pages/ErrorsPages/PageNotFound";
import ManageAbilities from "./pages/AdminPages/ManageAbilities";

function App() {
  const location = useLocation();
  const hideLayoutRoutes = ["/404"];
  const hideLayout = hideLayoutRoutes.includes(location.pathname);

  return (
    <>
      {!hideLayout && <NavBar />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/characters"
          element={
            <ProtectedRoute>
              <Characters />
            </ProtectedRoute>
          }
        ></Route>
        <Route
          path="/abilities"
          element={
            <ProtectedRoute>
              <Abilities />
            </ProtectedRoute>
          }
        ></Route>
        <Route
          path="/regions"
          element={
            <ProtectedRoute>
              <Regions />
            </ProtectedRoute>
          }
        ></Route>
        <Route
          path="/characters/:id"
          element={
            <ProtectedRoute>
              <CharacterDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/regions/:id"
          element={
            <ProtectedRoute>
              <RegionDetail />
            </ProtectedRoute>
          }
        />

        <Route
          path="/abilities/:id"
          element={
            <ProtectedRoute>
              <AbilityDetails />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/regions"
          element={
            <AdminRoute>
              <ManageRegions />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/abilities"
          element={
            <AdminRoute>
              <ManageAbilities />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/characters"
          element={
            <AdminRoute>
              <ManageCharacters />
            </AdminRoute>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/access-denied" element={<AccessDenied />} />

        <Route path="*" element={<PageNotFound />} />
      </Routes>
      {!hideLayout && <Footer />}
    </>
  );
}

export default App;
