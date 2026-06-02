import { BrowserRouter as Router, Navigate, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Today from "./pages/Today";
import Favourites from "./pages/Favourites";
import About from "./pages/About";
import QuietRoom from "./pages/Testing";
import Header from "./components/Header";
import Footer from "./components/Footer";

import "./App.css";

const routerBasename = process.env.NODE_ENV === "production" ? process.env.PUBLIC_URL : "/";

function App() {
  return (
    <Router basename={routerBasename}>
      <Header />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/today" element={<Today />} />
        <Route path="/favourites" element={<Favourites />} />
        <Route path="/about" element={<About />} />
        <Route path="/quiet-room" element={<QuietRoom />} />
        <Route path="/testing" element={<Navigate to="/quiet-room" replace />} />
      </Routes>
      <Footer />

    </Router>
  );
}


export default App;
