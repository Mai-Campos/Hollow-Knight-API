import { BrowserRouter, Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import Home from "./pages/Home";
import Characters from "./pages/CharactersPages/Characters";
import Abilities from "./pages/AbilitiesPages/Abilities";
import Regions from "./pages/RegionsPages/Regions";
import Login from "./pages/AuthPages/Login";
import Register from "./pages/AuthPages/Register";
import "./App.css";
import Footer from "./components/Footer";

function App() {
  return (
    <BrowserRouter>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/characters" element={<Characters />} />
        <Route path="/abilities" element={<Abilities />} />
        <Route path="/regions" element={<Regions />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
