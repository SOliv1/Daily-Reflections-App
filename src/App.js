import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Today from "./pages/Today";
import Favourites from "./pages/Favourites";
import About from "./pages/About";
import Header from "./components/Header";
import Footer from "./components/Footer";


import "./App.css";

function App() {
  return (
    <Router>
      <Header />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/today" element={<Today />} />
        <Route path="/favourites" element={<Favourites />} />
        <Route path="/about" element={<About />} />
      </Routes>
      <Footer />

    </Router>
  );
}


export default App;
