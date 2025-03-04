import React, { useState } from "react";
import axios from "axios";
import logo from '../../assets/Home/CapitalValleyLogo.png';
import { FiAlignJustify } from "react-icons/fi";
import { FaHome, FaCommentAlt, FaBell, FaUserCircle, FaTimes, FaSearch } from "react-icons/fa";
import { IoIosSettings } from "react-icons/io";
import { Settings, House, MessageCircle, Bell, CircleUser } from "lucide-react";
import { Link } from 'react-router-dom';

const Header = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [query, setQuery] = useState('');
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
    <div className="bg-gray-100 pt-10">
      <header className="bg-gradient-to-r from-green-800 to-green-600 shadow-lg px-4 py-3 flex items-center justify-between fixed top-0 left-0 w-full z-10">
        <div className="flex items-center space-x-3">
          <a href="/" className="flex items-center">
            <img src={logo} alt="Logo" className="h-10 w-auto rounded-full shadow-lg" />
            <span className="ml-2 text-lg font-semibold text-white ">Capital Valley</span>
          </a>
        </div>


        {/* Search Bar */}
        <div className="flex-1 flex items-center justify-center mx-4 relative">
          <input
            type="text"
            placeholder="Search..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            className="w-full max-w-sm pl-10 pr-4 border border-gray-300 rounded-lg p-2 outline-none focus:ring-2 focus:ring-purple-400 transition duration-300"
          />
          <FaSearch
            className="aleft text-white pl-1 cursor-pointer"
            size={18}
            onClick={handleSearch}
          />
          {/* Search Results Dropdown */}
          {results.length > 0 && (
            <div className="absolute top-12 left-0 w-full bg-white border border-gray-300 rounded-lg shadow-md max-h-60 overflow-y-auto">
              {results.map((result) => (
                <Link
                  to={`/profile/${result._id}`}
                  key={result._id}
                  className="block px-4 py-2 text-gray-700 hover:bg-purple-100"
                >
                  {result.username}
                </Link>
              ))}
            </div>
          )}
          {isSearching && (
            <div className="absolute top-12 left-0 w-full bg-white border border-gray-300 rounded-lg shadow-md">
              <p className="p-4 text-gray-700">Searching...</p>
            </div>
          )}
          {!isSearching && query && results.length === 0 && (
            <div className="absolute top-12 left-0 w-full bg-white border border-gray-300 rounded-lg shadow-md">
              <p className="p-4 text-gray-700">No results found</p>
            </div>
          )}
        </div>

        {/* Navigation Links */}
        <div className="hidden lg:flex items-center space-x-6">
          <Link to="/">
            <button className="text-grey hover:text-white flex items-center transition duration-300">
              <House />
            </button>
          </Link>
          <Link to="/chat">
            <button className="text-grey hover:text-white flex items-center transition duration-300">
              <MessageCircle />
            </button>
          </Link>
          <button className="text-grey hover:text-white flex items-center transition duration-300">
            <Bell />
          </button>
          <button className="text-grey hover:text-white flex items-center transition duration-300">
            <Link to="/profile">
              <CircleUser />
            </Link>
          </button>
          <button className="text-grey hover:text-white flex items-center transition duration-300">
            <Link to="/settings">
              <Settings />
            </Link>
          </button>
        </div>

        {/* Sidebar Toggle */}
        <button
          className="text-white hover:text-gray-200 lg:hidden transition duration-300"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          {isSidebarOpen ? <FaTimes size={24} /> : <FiAlignJustify size={24} />}
        </button>
      </header >

      {/* Sidebar Menu */}
      {
        isSidebarOpen && (
          <div className="fixed top-0 right-0 w-64 h-full bg-gradient-to-r from-green-800 to-green-600  shadow-lg z-20">
            <div className="p-4 flex justify-between items-center border-b border-purple-300">
              <h2 className="font-bold text-white text-lg">Menu</h2>
              <button
                className="text-white hover:text-gray-200 transition duration-300"
                onClick={() => setIsSidebarOpen(false)}
              >
                <FaTimes size={20} />
              </button>
            </div>
            <nav className="p-4">
              <ul className="space-y-4">
                <li className="text-white hover:text-gray-200 flex items-center transition duration-300">
                  <Link to="/">
                    <button className="text-grey hover:text-white flex items-center transition duration-300">
                      <FaHome size={20} className="mr-2" />  Home
                    </button>
                  </Link>
                </li>
                <li className="text-white hover:text-gray-200 flex items-center transition duration-300">
                  <FaCommentAlt className="mr-2" /> Chat
                </li>
                <li className="text-white hover:text-gray-200 flex items-center transition duration-300">
                  <FaBell className="mr-2" /> Notifications
                </li>
                <li className="text-white hover:text-gray-200 flex items-center transition duration-300">
                  <Link to="/profile">
                    <button className="text-grey hover:text-white flex items-center transition duration-300">
                      <FaUserCircle size={20} className="mr-2" />Profile
                    </button>
                  </Link>

                </li>
              </ul>
            </nav>
          </div>
        )
      }
    </div >
  );
};

export default Header;

