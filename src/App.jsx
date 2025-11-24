/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import JadwalApelPage from "./pages/JadwalApelPage";
import BeritaPage from "./pages/BeritaPage";
import Home from "./pages/Home";

function Layout({ children }) {
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState(null);

  // Load user dari localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar user={user} setUser={setUser} scrolled={scrolled} />
      <main className="pt-5 sm:pt-10 md:pt-15">{children}</main>
      <Footer />
    </div>
  );
}

function AppContent() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/jadwal-apel" element={<JadwalApelPage />} />
      <Route path="/berita" element={<BeritaPage />} />
    </Routes>
  );
}

// Wrapper dengan Router
export default function App() {
  return (
    <Router>
      <Layout>
        <AppContent />
      </Layout>
    </Router>
  );
}
