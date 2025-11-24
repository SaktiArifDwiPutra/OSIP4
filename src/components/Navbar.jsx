import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import LoginForm from "./LoginForm";

export default function Navbar({ scrolled, user, setUser }) {
  const [mobileMenuIsOpen, setMobileMenuIsOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
    navigate("/"); // opsional: kembali ke home setelah logout
  };

  const navItems = [
    { name: "Home", to: "/" },
    { name: "Berita", to: "/berita" },
    { name: "Jadwal Apel", to: "/jadwal-apel" },
    { name: "Tentang Kami", to: "#tentang" }, // tetap sebagai anchor jika perlu
  ];

  const NavLink = ({ item, isMobile = false }) => {
    const commonClasses = `text-sm lg:text-base ${
      isMobile ? "block w-full text-left py-2" : ""
    } text-gray-300 hover:text-white`;

    if (item.to.startsWith("#")) {
      return (
        <a
          href={item.to}
          onClick={() => isMobile && setMobileMenuIsOpen(false)}
          className={commonClasses}
        >
          {item.name}
        </a>
      );
    }

    return (
      <Link
        to={item.to}
        onClick={() => isMobile && setMobileMenuIsOpen(false)}
        className={commonClasses}
      >
        {item.name}
      </Link>
    );
  };

  return (
    <>
      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          scrolled
            ? "bg-slate-950/80 backdrop-blur-lg border-b border-slate-800"
            : "bg-slate-950/20 backdrop-blur-sm"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16 md:h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-1">
              <img
                src="/logo.png"
                alt="OSIP4"
                className="w-6 h-6 sm:w-8 sm:h-8"
              />
              <span className="text-lg sm:text-xl md:text-2xl font-medium">
                <span className="text-white">OSIP</span>
                <span className="text-blue-400">4</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
              {navItems.map((item) => (
                <NavLink key={item.to} item={item} />
              ))}

              {user ? (
                <button
                  onClick={handleLogout}
                  className="text-sm lg:text-base text-gray-300 hover:text-white"
                >
                  Logout ({user.username})
                </button>
              ) : (
                <button
                  onClick={() => setShowLogin(true)}
                  className="text-sm lg:text-base text-gray-300 hover:text-white"
                >
                  Login
                </button>
              )}
            </div>

            {/* Mobile toggle */}
            <button
              className="md:hidden p-2 text-gray-300 hover:text-white"
              onClick={() => setMobileMenuIsOpen((prev) => !prev)}
            >
              {mobileMenuIsOpen ? (
                <X className="w-5 h-5 sm:w-6 sm:h-6" />
              ) : (
                <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuIsOpen && (
          <div className="md:hidden bg-slate-900/95 backdrop-blur-lg border-t border-slate-800">
            <div className="px-4 py-4 sm:py-6 space-y-2">
              {navItems.map((item) => (
                <NavLink key={item.to} item={item} isMobile={true} />
              ))}

              {user ? (
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuIsOpen(false);
                  }}
                  className="block w-full text-left text-gray-300 hover:text-white text-sm"
                >
                  Logout ({user.username})
                </button>
              ) : (
                <button
                  onClick={() => {
                    setShowLogin(true);
                    setMobileMenuIsOpen(false);
                  }}
                  className="block w-full text-left text-gray-300 hover:text-white text-sm"
                >
                  Login
                </button>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Login Modal */}
      {showLogin && (
        <LoginForm
          onLoginSuccess={(userData) => {
            setUser(userData);
            localStorage.setItem("user", JSON.stringify(userData));
            setShowLogin(false);
          }}
          onClose={() => setShowLogin(false)}
        />
      )}
    </>
  );
}
