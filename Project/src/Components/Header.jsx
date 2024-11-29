import React, { useState } from "react";
import logo from "../img/logo.png"; // Adjust the path if needed
import { FiAlignJustify } from "react-icons/fi"; // Sidebar toggle icon
import { FaHome, FaCommentAlt, FaBell, FaUserCircle, FaTimes } from "react-icons/fa"; // Additional FaTimes for close icon
import { FaSearch } from "react-icons/fa"; // Search icon

const Header = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="bg-gray-100 pt-10">
      {/* Header */}
      <header className="bg-white shadow-md px-4 py-3 flex items-center justify-between fixed top-0 left-0 w-full z-10">
        {/* Logo */}
        <div className="flex items-center">
          <img src={logo} alt="Logo" className="h-10 rounded-full" />
        </div>

        {/* Search Bar (Visible on all screen sizes) */}
        <div className="flex-1 mx-4 flex items-center relative">
          <FaSearch className="absolute left-3 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-10 border border-gray-300 rounded-lg p-2 outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Icons for PC */}
        <div className="hidden lg:flex items-center space-x-6">
          <button className="text-gray-600 hover:text-blue-500 flex items-center">
            <FaHome size={20} />
          </button>
          <button className="text-gray-600 hover:text-blue-500 flex items-center">
            <FaCommentAlt size={20} />
          </button>
          <button className="text-gray-600 hover:text-blue-500 flex items-center">
            <FaBell size={20} />
          </button>
          <button className="text-gray-600 hover:text-blue-500 flex items-center">
            <FaUserCircle size={20} />
          </button>
        </div>

        {/* Sidebar Toggle for Small Screens */}
        <button
          className="text-gray-600 hover:text-blue-500 lg:hidden"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          {isSidebarOpen ? <FaTimes size={24} /> : <FiAlignJustify size={24} />}
        </button>
      </header>

      {/* Sidebar */}
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
