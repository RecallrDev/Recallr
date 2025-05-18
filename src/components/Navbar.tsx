import React from 'react';
import { Link } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';

const Navbar: React.FC = () => {
  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        
        {/* Logo/Brand */}
        <Link to="/" className="flex items-center space-x-2">
          <div className="bg-purple-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
            R
          </div>
          <span className="text-purple-600 font-semibold text-lg">Recallr</span>
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center space-x-6 text-sm text-gray-700">
          <HashLink 
            to="/#about" 
            className="hover:text-purple-600 transition"
            smooth
          >
            About
          </HashLink>
          <HashLink 
            to="/#team" 
            className="hover:text-purple-600 transition"
            smooth
          >
            Team
          </HashLink>
          <HashLink 
            to="/#contact" 
            className="hover:text-purple-600 transition"
            smooth
          >
            Contact
          </HashLink>
        </div>

        {/* Auth Buttons */}
        <div className="flex items-center space-x-3">
          <Link
            to="/login"
            className="px-4 py-2 text-sm font-medium text-purple-600 border border-purple-600 rounded-xl hover:bg-purple-50 transition"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-xl hover:bg-purple-700 transition"
          >
            Register
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;