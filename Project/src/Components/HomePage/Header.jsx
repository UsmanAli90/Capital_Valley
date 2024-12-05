import React, { useState } from "react";
import axios from "axios";
import logo from '../../assets/Home/logo.png';
import { FiAlignJustify } from "react-icons/fi";
import { FaHome, FaCommentAlt, FaBell, FaUserCircle, FaTimes, FaSearch } from "react-icons/fa";
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
  const handleSearchClick = (id, role) => {
    navigate(`/profile/${id}?role=${role}`);
  };

  return (
    <div className="bg-gray-100 pt-10">
      <header className="bg-white shadow-md px-4 py-3 flex items-center justify-between fixed top-0 left-0 w-full z-10">
        <div className="flex items-center">
          <img src={logo} alt="Logo" className="h-10 rounded-full" />
        </div>

        {/* Search Bar */}
        <div className="flex-1 flex items-center justify-center mx-4 relative">
          <input
            type="text"
            placeholder="Search..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            className="w-full max-w-sm pl-10 pr-4 border border-gray-300 rounded-lg p-2 outline-none focus:ring-2 focus:ring-blue-400"
          />
          <FaSearch className="left text-gray-400 cursor-pointer" size={18} onClick={handleSearch} />
          {/* Search Results Dropdown */}
          {results.length > 0 && (
            <div className="absolute top-12 left-0 w-full bg-white border border-gray-300 rounded-lg shadow-md max-h-60 overflow-y-auto">
              {results.map((result) => (
                <Link
                  to={`/profile/${result._id}`}
                  key={result._id}
                  className="block px-4 py-2 text-gray-700 hover:bg-blue-100"
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
          <Link to='/'>
            <button className="text-gray-600 hover:text-blue-500 flex items-center">
              <FaHome size={20} />
            </button>
          </Link>
          <button className="text-gray-600 hover:text-blue-500 flex items-center">
            <FaCommentAlt size={20} />
          </button>
          <button className="text-gray-600 hover:text-blue-500 flex items-center">
            <FaBell size={20} />
          </button>
          <button className="text-gray-600 hover:text-blue-500 flex items-center">
            <Link to="/profile">
              <FaUserCircle size={20} />
            </Link>
          </button>
        </div>

        {/* Sidebar Toggle */}
        <button
          className="text-gray-600 hover:text-blue-500 lg:hidden"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          {isSidebarOpen ? <FaTimes size={24} /> : <FiAlignJustify size={24} />}
        </button>
      </header>

      {/* Sidebar Menu */}
      {isSidebarOpen && (
        <div className="fixed top-0 right-0 w-64 h-full bg-white shadow-lg z-20">
          <div className="p-4 flex justify-between items-center border-b">
            <h2 className="font-bold text-lg">Menu</h2>
            <button
              className="text-gray-600 hover:text-blue-500"
              onClick={() => setIsSidebarOpen(false)}
            >
              <FaTimes size={20} />
            </button>
          </div>
          <nav className="p-4">
            <ul className="space-y-4">
              <li className="text-gray-700 hover:text-blue-500 flex items-center">
                <FaHome className="mr-2" /> Home
              </li>
              <li className="text-gray-700 hover:text-blue-500 flex items-center">
                <FaCommentAlt className="mr-2" /> Chat
              </li>
              <li className="text-gray-700 hover:text-blue-500 flex items-center">
                <FaBell className="mr-2" /> Notifications
              </li>
              <li className="text-gray-700 hover:text-blue-500 flex items-center">
                <FaUserCircle className="mr-2" /> Profile
              </li>
            </ul>
          </nav>
        </div>
      )}
    </div>
  );
};

export default Header;
