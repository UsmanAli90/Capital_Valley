import React, { useState, useEffect } from "react";
import axios from "axios";
import logo from "../../assets/Home/CapitalValleyLogo.png";
import {
  FaHome,
  FaCommentAlt,
  FaBell,
  FaUserCircle,
  FaTimes,
  FaSearch,
} from "react-icons/fa";
import { FiAlignJustify } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import SubscriptionForm from "/src/Components/Subscription/SubscriptionForm.jsx";

const Header = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      console.log("Stored user in Header:", storedUser); // Debug
      setUser(storedUser);
    }
  }, []);

  const handleSearch = async () => {
    if (!query) return;
    setIsSearching(true);
    try {
      const { data } = await axios.get(
        `http://localhost:3000/search?query=${query}`
      );
      console.log("Search results:", data);
      setResults([...data.investors, ...data.startups]);
    } catch (error) {
      console.error("Error during search:", error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post(
        "http://localhost:3000/logout",
        {},
        { withCredentials: true }
      );
    } catch (error) {
      console.error("Logout error:", error);
    }
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    navigate("/signin");
  };

  return (
    <div className="bg-white shadow-md sticky top-0 z-50">
      <header className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between relative">
        {/* Logo and Branding */}
        <div className="flex items-center space-x-4">
          <Link to="/home" className="flex items-center">
            <img
              src={logo}
              alt="Capital Valley Logo"
              className="h-12 w-auto rounded-full shadow-md transition-transform hover:scale-105"
            />
            <span className="ml-3 text-xl font-bold text-gray-800 hover:text-green-600 transition-colors">
              Capital Valley
            </span>
          </Link>
        </div>

        {/* Search Bar */}
        <div className="flex-1 flex items-center justify-center mx-4 relative hidden lg:block">
          <div className="relative w-full max-w-xl">
            <input
              type="text"
              placeholder="Search users..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-full focus:ring-2 focus:ring-green-400 focus:border-green-400 transition-all bg-gray-50 text-gray-900 placeholder-gray-500"
            />
            <FaSearch
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer hover:text-green-600 transition-colors"
              size={18}
              onClick={handleSearch}
            />
            {results.length > 0 && (
              <div className="absolute top-full left-0 w-full bg-white border border-gray-200 rounded-lg shadow-lg mt-2 max-h-40 overflow-y-auto z-20">
                {results.map((result) => (
                  <Link
                    to={`/profile/${result._id}`}
                    key={result._id}
                    className="block px-4 py-2 text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors"
                    onClick={() => setResults([])}
                  >
                    {result.username || result.email}
                  </Link>
                ))}
              </div>
            )}
            {isSearching && (
              <div className="absolute top-full left-0 w-full bg-white border border-gray-200 rounded-lg shadow-lg mt-2">
                <p className="p-2 text-gray-700">Searching...</p>
              </div>
            )}
            {!isSearching && query && results.length === 0 && (
              <div className="absolute top-full left-0 w-full bg-white border border-gray-200 rounded-lg shadow-lg mt-2">
                <p className="p-2 text-gray-700">No results found</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation and User Icons */}
        <div className="flex items-center space-x-4">
          <Link to="/home" className="text-gray-600 hover:text-green-600 transition-colors hidden md:block">
            <FaHome size={20} />
          </Link>
          <Link to="/chat" className="text-gray-600 hover:text-green-600 transition-colors hidden md:block">
            <FaCommentAlt size={20} />
          </Link>
          <SubscriptionForm />
          <Link to="/notifications" className="text-gray-600 hover:text-green-600 transition-colors hidden md:block">
            <FaBell size={20} />
          </Link>
          {user ? (
            <>
              <Link to={`/profile/${user.id}`} className="hidden md:block">
                {user.avatar ? (
                  <img
                    src={`http://localhost:5173${user.avatar}`} // Updated to backend URL
                    alt="User Avatar"
                    className="h-10 w-10 rounded-full object-cover border-2 border-gray-300 hover:border-green-600 transition-all"
                    onError={(e) =>
                      (e.target.src =
                        "http://localhost:3000/avatars/default-avatar.png")
                    } // Fallback
                  />
                ) : (
                  <FaUserCircle
                    className="text-gray-600 hover:text-green-600 transition-colors"
                    size={32}
                  />
                )}
              </Link>
              <button
                onClick={handleLogout}
                className="bg-gradient-to-r from-red-500 to-red-700 text-white font-semibold py-1.5 px-4 rounded-full shadow-md hover:from-red-600 hover:to-red-800 transition-all duration-300 transform hover:scale-105 hidden md:block"
              >
                Logout
              </button>
            </>
          ) : (
            <Link to="/signin" className="hidden md:block">
              <FaUserCircle
                className="text-gray-600 hover:text-green-600 transition-colors"
                size={32}
              />
            </Link>
          )}
          <button
            className="text-gray-600 hover:text-green-600 transition-colors md:hidden"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            {isSidebarOpen ? <FaTimes size={24} /> : <FiAlignJustify size={24} />}
          </button>
        </div>

        {/* Sidebar */}
        {isSidebarOpen && (
          <div className="fixed top-0 right-0 w-64 h-full bg-white shadow-lg z-50 border-l border-gray-200 transform transition-transform duration-300">
            <div className="p-4 flex justify-between items-center border-b border-gray-200">
              <h2 className="font-semibold text-gray-800 text-lg">Menu</h2>
              <button
                className="text-gray-600 hover:text-green-600 transition-colors"
                onClick={() => setIsSidebarOpen(false)}
              >
                <FaTimes size={20} />
              </button>
            </div>
            <nav className="p-4">
              <ul className="space-y-4">
                <li>
                  <Link
                    to="/home"
                    className="flex items-center text-gray-700 hover:text-green-600 hover:bg-gray-100 p-2 rounded-lg transition-colors"
                    onClick={() => setIsSidebarOpen(false)}
                  >
                    <FaHome size={20} className="mr-3" /> Home
                  </Link>
                </li>
                <li>
                  <Link
                    to="/chat"
                    className="flex items-center text-gray-700 hover:text-green-600 hover:bg-gray-100 p-2 rounded-lg transition-colors"
                    onClick={() => setIsSidebarOpen(false)}
                  >
                    <FaCommentAlt size={20} className="mr-3" /> Chat
                  </Link>
                </li>
                <li>
                  <Link
                    to="/notifications"
                    className="flex items-center text-gray-700 hover:text-green-600 hover:bg-gray-100 p-2 rounded-lg transition-colors"
                    onClick={() => setIsSidebarOpen(false)}
                  >
                    <FaBell size={20} className="mr-3" /> Notifications
                  </Link>
                </li>
                <li>
                  <Link
                    to={`/profile/${user?.id || "me"}`}
                    className="flex items-center text-gray-700 hover:text-green-600 hover:bg-gray-100 p-2 rounded-lg transition-colors"
                    onClick={() => setIsSidebarOpen(false)}
                  >
                    {user?.avatar ? (
                      <img
                        src={`http://localhost:3000${user.avatar}`} // Updated to backend URL
                        alt="User Avatar"
                        className="h-10 w-10 rounded-full object-cover border-2 border-gray-300 mr-3"
                        onError={(e) =>
                          (e.target.src =
                            "http://localhost:3000/avatars/default-avatar.png")
                        } // Fallback
                      />
                    ) : (
                      <FaUserCircle size={32} className="mr-3" />
                    )}
                    Profile
                  </Link>
                </li>
                {user && (
                  <li>
                    <button
                      onClick={handleLogout}
                      className="w-full bg-gradient-to-r from-red-500 to-red-700 text-white font-semibold py-2 px-4 rounded-full shadow-md hover:from-red-600 hover:to-red-800 transition-all duration-300 transform hover:scale-105"
                    >
                      Logout
                    </button>
                  </li>
                )}
              </ul>
            </nav>
          </div>
        )}
      </header>
    </div>
  );
};

export default Header;