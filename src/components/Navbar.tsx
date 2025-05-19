import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';
import { Menu, X } from 'lucide-react';
import AuthModal from './AuthModal';

const Navbar: React.FC = () => {
  // State to track if we've scrolled past a certain threshold
  const [scrolled, setScrolled] = useState(false);
  // State to control mobile menu
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  // State for auth modal
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalView, setAuthModalView] = useState<'login' | 'register'>('login');

  // Setup scroll event listener
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    // Add scroll event listener
    window.addEventListener('scroll', handleScroll);
    
    // Clean up event listener
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  // Close mobile menu after clicking a link
  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  // Open auth modal with specific view
  const openAuthModal = (view: 'login' | 'register') => {
    setAuthModalView(view);
    setAuthModalOpen(true);
    closeMobileMenu();
  };

  return (
    <>
      <nav 
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled 
            ? 'bg-white/80 backdrop-blur-md shadow-md' 
            : 'bg-white shadow-sm'
        }`}
      >
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          
          {/* Logo/Brand */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-purple-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
              R
            </div>
            <span className="text-purple-600 font-semibold text-lg">Recallr</span>
          </Link>

          {/* Desktop Navigation Links */}
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

          {/* Auth Buttons - Desktop */}
          <div className="hidden md:flex items-center space-x-3">
            <button
              onClick={() => openAuthModal('login')}
              className="px-4 py-2 text-sm font-medium text-purple-600 border border-purple-600 rounded-xl hover:bg-purple-50 transition"
            >
              Login
            </button>
            <button
              onClick={() => openAuthModal('register')}
              className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-xl hover:bg-purple-700 transition"
            >
              Register
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-gray-700 focus:outline-none burger-button"
            onClick={toggleMobileMenu}
            aria-label="Toggle mobile menu"
          >
            <div className="relative w-6 h-6">
              <span 
                className={`absolute block w-6 h-0.5 bg-gray-700 transform transition-all duration-300 ease-in-out ${
                  mobileMenuOpen ? 'rotate-45 top-3' : 'top-1.5'
                }`}
              ></span>
              <span 
                className={`absolute block w-6 h-0.5 bg-gray-700 top-3 transition-all duration-200 ${
                  mobileMenuOpen ? 'opacity-0' : 'opacity-100'
                }`}
              ></span>
              <span 
                className={`absolute block w-6 h-0.5 bg-gray-700 transform transition-all duration-300 ease-in-out ${
                  mobileMenuOpen ? '-rotate-45 top-3' : 'top-4.5'
                }`}
              ></span>
            </div>
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        <div 
          className={`md:hidden overflow-hidden transition-all duration-500 ease-in-out ${
            mobileMenuOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
          }`}
          style={{
            transitionProperty: 'max-height, opacity, padding',
            boxShadow: mobileMenuOpen ? '0 4px 6px -1px rgba(0, 0, 0, 0.1)' : 'none'
          }}
        >
          <div className={`container mx-auto px-4 py-4 flex flex-col space-y-4 mobile-menu-content ${
            mobileMenuOpen ? 'translate-y-0 mobile-menu-open' : '-translate-y-4'
          }`}>
            {/* Navigation Links */}
            <div className="flex flex-col space-y-1 border-b border-gray-100 pb-4">
              <HashLink 
                to="/#about" 
                className="px-4 py-3 text-gray-700 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition mobile-nav-item"
                smooth
                onClick={closeMobileMenu}
              >
                About
              </HashLink>
              <HashLink 
                to="/#team" 
                className="px-4 py-3 text-gray-700 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition mobile-nav-item"
                smooth
                onClick={closeMobileMenu}
              >
                Team
              </HashLink>
              <HashLink 
                to="/#contact" 
                className="px-4 py-3 text-gray-700 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition mobile-nav-item"
                smooth
                onClick={closeMobileMenu}
              >
                Contact
              </HashLink>
            </div>
            
            {/* Auth Buttons */}
            <div className="flex flex-col space-y-2 pt-2">
              <button
                onClick={() => openAuthModal('login')}
                className="px-4 py-3 text-center text-purple-600 border border-purple-600 rounded-xl hover:bg-purple-50 transition"
              >
                Login
              </button>
              <button
                onClick={() => openAuthModal('register')}
                className="px-4 py-3 text-center text-white bg-purple-600 rounded-xl hover:bg-purple-700 transition"
              >
                Register
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Auth Modal */}
      <AuthModal 
        isOpen={authModalOpen} 
        initialView={authModalView}
        onClose={() => setAuthModalOpen(false)}
      />
    </>
  );
};

export default Navbar;