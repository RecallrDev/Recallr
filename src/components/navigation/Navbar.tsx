import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';
import { User, LogOut, Book, Menu, X } from 'lucide-react';
import { useAuth } from '../../features/authentification/AuthContext';

interface NavbarProps {
  onLoginClick: () => void;
  onRegisterClick: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onLoginClick, onRegisterClick }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  const scrollWithOffset = (el: HTMLElement) => {
    const yCoordinate = el.getBoundingClientRect().top + window.pageYOffset;
    const yOffset = user ? -450 : -380;
    window.scrollTo({ top: yCoordinate + yOffset, behavior: 'smooth'});
  }

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
    closeMobileMenu();
  };

  return (
    <nav 
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-white/90 backdrop-blur-md shadow-lg' 
          : 'bg-white shadow-sm'
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Mobile/Tablet Layout - Flexbox */}
        <div className="flex items-center justify-between h-16 lg:h-18 lg:hidden">
          {/* Logo - Original Design */}
          <div className="flex-shrink-0">
            <HashLink
              to="/#"
              smooth
              className="flex items-center space-x-2"
            >
              <div className="h-8 flex items-center justify-center text-sm font-bold">
                <img src="../../../favicon/favicon.svg" alt="Recallr Logo" className="w-6 h-6" />
              </div>
              <span className="text-purple-600 font-semibold text-lg hidden sm:block">Recallr</span>
            </HashLink>
          </div>

          {/* Desktop Auth Buttons (nur md, nicht lg) */}
          <div className="hidden md:flex lg:hidden items-center space-x-3 flex-shrink-0">
            {user ? (
              <>
                <Link 
                  to="/study" 
                  className="flex items-center px-3 py-2 text-sm font-medium bg-purple-600 text-white border border-purple-300 rounded-xl hover:bg-purple-700 transition"
                >
                  <Book className="h-4 w-4 mr-2" />
                  Study
                </Link>
                <Link 
                  to="/profile" 
                  className="flex items-center px-3 py-2 text-sm font-medium text-purple-700 border border-purple-300 rounded-xl hover:bg-purple-50 transition"
                >
                  <User className="h-4 w-4 mr-2" />
                  Profile
                </Link>
                <button 
                  onClick={handleSignOut} 
                  className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-xl hover:bg-gray-50 transition"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Log out
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={onLoginClick}
                  className="px-4 py-2 text-sm font-medium text-purple-600 border border-purple-600 rounded-xl hover:bg-purple-50 transition"
                >
                  Login
                </button>
                <button
                  onClick={onRegisterClick}
                  className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-xl hover:bg-purple-700 transition"
                >
                  Sign up
                </button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="inline-flex items-center justify-center p-2 rounded-lg text-gray-700 hover:text-purple-600 hover:bg-gray-100 transition-all duration-200"
              aria-expanded="false"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Desktop Layout - Grid (nur lg und größer) - Original Design */}
        <div className="hidden lg:grid grid-cols-3 items-center py-3">
          {/* Logo/Brand - Left - Original Design */}
          <div className="flex justify-start">
            <HashLink
              to="/#"
              smooth
              className="flex items-center space-x-2"
            >
              <div className="h-8 flex items-center justify-center text-sm font-bold">
                <img src="../../../favicon/favicon.svg" alt="Recallr Logo" className="w-6 h-6" />
              </div>
              <span className="text-purple-600 font-semibold text-lg">Recallr</span>
            </HashLink>
          </div>

          {/* Desktop Navigation Links - Center - Original Design */}
          <div className="flex items-center justify-center space-x-6 text-sm text-gray-700">
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

          {/* Auth Buttons - Right - Original Design */}
          <div className="flex items-center justify-end space-x-3">
            {user ? (
              <>
                <Link 
                  to="/study" 
                  className="flex items-center px-3 py-2 text-sm font-medium bg-purple-600 text-white border border-purple-300 rounded-xl hover:bg-purple-700 transition"
                >
                  <Book className="h-4 w-4 mr-2" />
                  Study
                </Link>
                <Link 
                  to="/profile" 
                  className="flex items-center px-3 py-2 text-sm font-medium text-purple-700 border border-purple-300 rounded-xl hover:bg-purple-50 transition"
                >
                  <User className="h-4 w-4 mr-2" />
                  Profile
                </Link>
                <button 
                  onClick={handleSignOut} 
                  className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-xl hover:bg-gray-50 transition"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Log out
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={onLoginClick}
                  className="px-4 py-2 text-sm font-medium text-purple-600 border border-purple-600 rounded-xl hover:bg-purple-50 transition"
                >
                  Login
                </button>
                <button
                  onClick={onRegisterClick}
                  className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-xl hover:bg-purple-700 transition"
                >
                  Sign up
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu - Responsive Implementation */}
      <div className={`md:hidden transition-all duration-300 ease-in-out ${
        mobileMenuOpen 
          ? 'max-h-screen opacity-100 visible' 
          : 'max-h-0 opacity-0 invisible overflow-hidden'
      }`}>
        <div className="px-4 pt-2 pb-6 space-y-1 bg-white border-t border-gray-100 shadow-lg">
          
          {/* Mobile Navigation Links */}
          <div className="space-y-1 mb-4">
            <HashLink 
              to="/#about" 
              className="block px-4 py-3 text-base font-medium text-gray-700 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors duration-200"
              smooth
              scroll={el => scrollWithOffset(el)}
              onClick={closeMobileMenu}
            >
              About
            </HashLink>
            <HashLink 
              to="/#team" 
              className="block px-4 py-3 text-base font-medium text-gray-700 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors duration-200"
              smooth
              scroll={el => scrollWithOffset(el)}
              onClick={closeMobileMenu}
            >
              Team
            </HashLink>
            <HashLink 
              to="/#contact" 
              className="block px-4 py-3 text-base font-medium text-gray-700 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors duration-200"
              smooth
              scroll={el => scrollWithOffset(el)}
              onClick={closeMobileMenu}
            >
              Contact
            </HashLink>
          </div>
          
          {/* Mobile Auth Buttons - Original Styling */}
          <div className="space-y-3 pt-4 border-t border-gray-100">
            {user ? (
              <>
                <Link 
                  to="/study" 
                  className="flex items-center justify-center px-4 py-3 font-medium text-white border border-purple-600 rounded-xl bg-purple-600 hover:bg-purple-700 transition"
                  onClick={closeMobileMenu}
                >
                  <Book className="h-4 w-4 mr-2" />
                  Study
                </Link>
                <Link 
                  to="/profile" 
                  className="flex items-center justify-center px-4 py-3 text-purple-700 border border-purple-300 rounded-xl hover:bg-purple-50 transition"
                  onClick={closeMobileMenu}
                >
                  <User className="h-4 w-4 mr-2" />
                  Profile
                </Link>
                <button 
                  onClick={handleSignOut} 
                  className="flex items-center justify-center px-4 py-3 text-gray-700 border border-gray-300 rounded-xl hover:bg-gray-50 transition w-full"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Log out
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => {
                    onLoginClick();
                    closeMobileMenu();
                  }}
                  className="w-full px-4 py-3 text-center text-purple-600 border border-purple-600 rounded-xl hover:bg-purple-50 transition"
                >
                  Login
                </button>
                <button
                  onClick={() => {
                    onRegisterClick();
                    closeMobileMenu();
                  }}
                  className="w-full px-4 py-3 text-center text-white bg-purple-600 rounded-xl hover:bg-purple-700 transition"
                >
                  Sign up
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;