import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";

import Navbar from "./components/Navbar";
import { GiHamburgerMenu } from "react-icons/gi";

import Home from "./pages/Home";
import LoginForm from "./pages/Login";
import Auth from "./components/Auth";
import OAuthSuccess from "./pages/OAuthSuccess";
import RegisterForm from "./pages/Register";
import Storage from "./pages/Storage"; // Assuming you have a VideoStorage component
import Statistic from "./pages/Statistic"; // Assuming you have a VideoStatsPage component

function App() {
  const [showNav, setShowNav] = useState(false);
  const [Login, setLogin] = useState(false);

  return (
    <Router>
      <header className="fixed w-full z-50 flex items-center justify-between p-4 bg-slate-950">
        <div className="flex items-center gap-4">
          <GiHamburgerMenu
            onClick={() => setShowNav(!showNav)}
            className="text-sky-100"
          />
          <div className="text-sky-100 text-2xl font-bold uppercase">kitty</div>
        </div>
        <Auth />
      </header>

      <Navbar show={showNav} />

      <div className="main h-full pt-15 ">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/oauth-success" element={<OAuthSuccess />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/storage" element={<Storage />} />
          <Route path="/statistic" element={<Statistic />} />
          {/* Add more routes as needed */}
        </Routes>
      </div>
      <footer className="mt-1 border-t text-center text-sm text-slate-500">
        © {new Date().getFullYear()} YourAppName. All rights reserved.
      </footer>
    </Router>
  );
}

export default App;
