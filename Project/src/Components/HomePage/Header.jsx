import React, { useState } from "react";
import axios from "axios";
import logo from "../../assets/Home/CapitalValleyLogo.png";
import {
  FaHome,
  FaCommentAlt,
  FaBell,
  FaUserCircle,
  FaTimes,
  FaSearch,
} from "react-icons/fa"; // Font Awesome icons
import { FiAlignJustify } from "react-icons/fi"; // Feather Icons for FiAlignJustify
import { IoIosSettings } from "react-icons/io";
import { Link } from "react-router-dom";
import SubscriptionForm from "/src/Components/Subscription/SubscriptionForm.jsx";

const Header = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async () => {
    if (!query) return;

    setIsSearching(true);
    try {
      const { data } = await axios.get(`http://localhost:3000/search?query=${query}`);
      console.log("Search results:", data);
      setResults([...data.investors, ...data.startups]);
    } catch (error) {
      console.error("Error during search:", error);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="bg-white shadow-md">
      <header className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between relative z-10">
        {/* Logo and Branding */}
        <div className="flex items-center space-x-4">
          <Link to="/" className="flex items-center">
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
        <div className="flex-1 flex items-center justify-center mx-6 relative">
          <div className="relative w-full max-w-xl">
            <input
              type="text"
              placeholder="Search users..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-400 focus:border-green-400 transition-all bg-gray-50 text-gray-900 placeholder-gray-500"
            />
            <FaSearch
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer hover:text-green-600 transition-colors"
              size={18}
              onClick={handleSearch}
            />
            {/* Search Results Dropdown */}
            {results.length > 0 && (
              <div className="absolute top-full left-0 w-full bg-white border border-gray-200 rounded-lg shadow-lg mt-2 max-h-60 overflow-y-auto z-20">
                {results.map((result) => (
                  <Link
                    to={`/profile/${result._id}`}
                    key={result._id}
                    className="block px-4 py-2 text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors"
                    onClick={() => setResults([])} // Clear results on click
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

        {/* Navigation Icons */}
        <div className="flex items-center space-x-6">
          <Link to="/">
            <FaHome className="text-gray-600 hover:text-green-600 transition-colors cursor-pointer" size={20} />
          </Link>
          <Link to="/chat">
            <FaCommentAlt className="text-gray-600 hover:text-green-600 transition-colors cursor-pointer" size={20} />
          </Link>
          <SubscriptionForm />
          <Link to="/notifications">
            <FaBell className="text-gray-600 hover:text-green-600 transition-colors cursor-pointer" size={20} />
          </Link>
          <Link to={`/profile/${JSON.parse(localStorage.getItem("user"))?.id || "me"}`}>
            <FaUserCircle className="text-gray-600 hover:text-green-600 transition-colors cursor-pointer" size={20} />
          </Link>
          {/* <Link to="/settings">
            <IoIosSettings className="text-gray-600 hover:text-green-600 transition-colors cursor-pointer" size={24} />
          </Link> */}
        </div>

        {/* Mobile Sidebar Toggle */}
        <button
          className="text-gray-600 hover:text-green-600 lg:hidden transition-colors ml-4"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          {isSidebarOpen ? <FaTimes size={24} /> : <FiAlignJustify size={24} />}
        </button>
      </header>

      {/* Sidebar Menu */}
      {isSidebarOpen && (
        <div className="fixed top-0 right-0 w-64 h-full bg-white shadow-lg z-20 border-l border-gray-200 transform transition-transform duration-300">
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
                  to="/"
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
                  to={`/profile/${JSON.parse(localStorage.getItem("user"))?.id || "me"}`}
                  className="flex items-center text-gray-700 hover:text-green-600 hover:bg-gray-100 p-2 rounded-lg transition-colors"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  <FaUserCircle size={20} className="mr-3" /> Profile
                </Link>
              </li>
              {/* <li>
                <Link
                  to="/settings"
                  className="flex items-center text-gray-700 hover:text-green-600 hover:bg-gray-100 p-2 rounded-lg transition-colors"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  <IoIosSettings size={24} className="mr-3" /> Settings
                </Link>
              </li> */}
            </ul>
          </nav>
        </div>
      )}
    </div>
  );
};

export default Header;