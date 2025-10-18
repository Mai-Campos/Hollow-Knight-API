import { Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import Home from "./pages/Home";
import Characters from "./pages/CharactersPages/Characters";
import CharacterDetail from "./pages/CharactersPages/CharacterDetail";
import Abilities from "./pages/AbilitiesPages/Abilities";
import Regions from "./pages/RegionsPages/Regions";
import RegionDetail from "./pages/RegionsPages/RegionDetails";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/AuthPages/Login";
import Register from "./pages/AuthPages/Register";
import "./App.css";
import Footer from "./components/Footer";
import AccessDenied from "./pages/ErrorsPages/AccesDenied";
import PageNotFound from "./pages/ErrorsPages/PageNotFound";
import { useLocation } from "react-router-dom";

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
