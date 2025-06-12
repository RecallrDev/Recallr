import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';
import { User, LogOut, Book, Menu, X } from 'lucide-react';
import { useAuth } from '../../features/authentification/AuthContext';

interface NavbarProps {
  onLoginClick: () => void;
  onRegisterClick: () => void;
}

// CSS für Custom Animationen
const customStyles = `
  @keyframes fadeInStagger {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

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
    <>
      {/* Custom Styles für Animationen */}
      <style>{customStyles}</style>
      
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
          {/* Logo - Original Design mit Animation */}
          <div className="flex-shrink-0">
            <HashLink
              to="/#"
              smooth
              className="flex items-center space-x-2 group"
            >
              <div className="h-8 flex items-center justify-center text-sm font-bold transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12">
                <img src="../../../favicon/favicon.svg" alt="Recallr Logo" className="w-6 h-6" />
              </div>
              <span className="text-purple-600 font-semibold text-lg hidden sm:block transition-all duration-300 group-hover:text-purple-700 group-hover:scale-105">Recallr</span>
            </HashLink>
          </div>

          {/* Desktop Auth Buttons (nur md, nicht lg) */}
          <div className="hidden md:flex lg:hidden items-center space-x-3 flex-shrink-0">
            {user ? (
              <>
                <Link 
                  to="/study" 
                  className="flex items-center px-3 py-2 text-sm font-medium bg-purple-600 text-white border border-purple-300 rounded-xl hover:bg-purple-700 transition-colors duration-300"
                >
                  <Book className="h-4 w-4 mr-2" />
                  Study
                </Link>
                <Link 
                  to="/profile" 
                  className="flex items-center px-3 py-2 text-sm font-medium text-purple-700 border border-purple-300 rounded-xl hover:bg-purple-50 transition-colors duration-300"
                >
                  <User className="h-4 w-4 mr-2" />
                  Profile
                </Link>
                <button 
                  onClick={handleSignOut} 
                  className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors duration-300"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Log out
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={onLoginClick}
                  className="px-4 py-2 text-sm font-medium text-purple-600 border border-purple-600 rounded-xl hover:bg-purple-50 transition-colors duration-300"
                >
                  Login
                </button>
                <button
                  onClick={onRegisterClick}
                  className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-xl hover:bg-purple-700 transition-colors duration-300"
                >
                  Sign up
                </button>
              </>
            )}
          </div>

          {/* Mobile menu button mit coolen Animationen */}
          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="relative inline-flex items-center justify-center p-2 rounded-lg text-gray-700 hover:text-purple-600 hover:bg-purple-50 transition-all duration-300 transform hover:scale-110 active:scale-95"
              aria-expanded="false"
              aria-label="Toggle navigation menu"
            >
              <div className="relative w-6 h-6">
                {/* Animiertes Burger Menu */}
                <span 
                  className={`absolute block w-6 h-0.5 bg-current transform transition-all duration-300 ease-in-out ${
                    mobileMenuOpen ? 'rotate-45 top-3' : 'top-1.5'
                  }`}
                ></span>
                <span 
                  className={`absolute block w-6 h-0.5 bg-current top-3 transition-all duration-300 ${
                    mobileMenuOpen ? 'opacity-0 scale-0' : 'opacity-100 scale-100'
                  }`}
                ></span>
                <span 
                  className={`absolute block w-6 h-0.5 bg-current transform transition-all duration-300 ease-in-out ${
                    mobileMenuOpen ? '-rotate-45 top-3' : 'top-4.5'
                  }`}
                ></span>
              </div>
            </button>
          </div>
        </div>

        {/* Desktop Layout - Grid (nur lg und größer) - Original Design */}
        <div className="hidden lg:grid grid-cols-3 items-center py-3">
          {/* Logo/Brand - Left - Original Design mit Animation */}
          <div className="flex justify-start">
            <HashLink
              to="/#"
              smooth
              className="flex items-center space-x-2 group"
            >
              <div className="h-8 flex items-center justify-center text-sm font-bold transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12">
                <img src="../../../favicon/favicon.svg" alt="Recallr Logo" className="w-6 h-6" />
              </div>
              <span className="text-purple-600 font-semibold text-lg transition-all duration-300 group-hover:text-purple-700 group-hover:scale-105">Recallr</span>
            </HashLink>
          </div>

          {/* Desktop Navigation Links - Center mit subtilen Animationen */}
          <div className="flex items-center justify-center space-x-6 text-sm text-gray-700">
            <HashLink 
              to="/#about" 
              className="relative hover:text-purple-600 transition-colors duration-300 group"
              smooth
            >
              About
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-600 transition-all duration-300 group-hover:w-full"></span>
            </HashLink>
            <HashLink 
              to="/#team" 
              className="relative hover:text-purple-600 transition-colors duration-300 group"
              smooth
            >
              Team
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-600 transition-all duration-300 group-hover:w-full"></span>
            </HashLink>
            <HashLink 
              to="/#contact" 
              className="relative hover:text-purple-600 transition-colors duration-300 group"
              smooth
            >
              Contact
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-600 transition-all duration-300 group-hover:w-full"></span>
            </HashLink>
          </div>

          {/* Auth Buttons - Right mit subtilen Animationen */}
          <div className="flex items-center justify-end space-x-3">
            {user ? (
              <>
                <Link 
                  to="/study" 
                  className="flex items-center px-3 py-2 text-sm font-medium bg-purple-600 text-white border border-purple-300 rounded-xl hover:bg-purple-700 transition-colors duration-300"
                >
                  <Book className="h-4 w-4 mr-2" />
                  Study
                </Link>
                <Link 
                  to="/profile" 
                  className="flex items-center px-3 py-2 text-sm font-medium text-purple-700 border border-purple-300 rounded-xl hover:bg-purple-50 transition-colors duration-300"
                >
                  <User className="h-4 w-4 mr-2" />
                  Profile
                </Link>
                <button 
                  onClick={handleSignOut} 
                  className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors duration-300"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Log out
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={onLoginClick}
                  className="px-4 py-2 text-sm font-medium text-purple-600 border border-purple-600 rounded-xl hover:bg-purple-50 transition-colors duration-300"
                >
                  Login
                </button>
                <button
                  onClick={onRegisterClick}
                  className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-xl hover:bg-purple-700 transition-colors duration-300"
                >
                  Sign up
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu - Responsive Implementation mit Animationen */}
      <div className={`md:hidden transition-all duration-500 ease-in-out transform ${
        mobileMenuOpen 
          ? 'max-h-screen opacity-100 visible translate-y-0' 
          : 'max-h-0 opacity-0 invisible overflow-hidden -translate-y-4'
      }`}>
        <div className="px-4 pt-2 pb-6 space-y-1 bg-white border-t border-gray-100 shadow-xl">
          
          {/* Mobile Navigation Links mit sauberer staggered Animation */}
          <div className="space-y-1 mb-4">
            <HashLink 
              to="/#about" 
              className="block px-4 py-3 text-base font-medium text-gray-700 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors duration-200"
              style={{ 
                animation: mobileMenuOpen ? 'fadeInStagger 0.3s ease-out 0.1s forwards' : 'none',
                opacity: 0
              }}
              smooth
              scroll={el => scrollWithOffset(el)}
              onClick={closeMobileMenu}
            >
              About
            </HashLink>
            <HashLink 
              to="/#team" 
              className="block px-4 py-3 text-base font-medium text-gray-700 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors duration-200"
              style={{ 
                animation: mobileMenuOpen ? 'fadeInStagger 0.3s ease-out 0.2s forwards' : 'none',
                opacity: 0
              }}
              smooth
              scroll={el => scrollWithOffset(el)}
              onClick={closeMobileMenu}
            >
              Team
            </HashLink>
            <HashLink 
              to="/#contact" 
              className="block px-4 py-3 text-base font-medium text-gray-700 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors duration-200"
              style={{ 
                animation: mobileMenuOpen ? 'fadeInStagger 0.3s ease-out 0.3s forwards' : 'none',
                opacity: 0
              }}
              smooth
              scroll={el => scrollWithOffset(el)}
              onClick={closeMobileMenu}
            >
              Contact
            </HashLink>
          </div>
          
          {/* Mobile Auth Buttons mit sauberer staggered Animation */}
          <div className="space-y-3 pt-4 border-t border-gray-100">
            {user ? (
              <>
                <Link 
                  to="/study" 
                  className="flex items-center justify-center px-4 py-3 font-medium text-white border border-purple-600 rounded-xl bg-purple-600 hover:bg-purple-700 transition-colors duration-200"
                  style={{ 
                    animation: mobileMenuOpen ? 'fadeInStagger 0.3s ease-out 0.4s forwards' : 'none',
                    opacity: 0
                  }}
                  onClick={closeMobileMenu}
                >
                  <Book className="h-4 w-4 mr-2" />
                  Study
                </Link>
                <Link 
                  to="/profile" 
                  className="flex items-center justify-center px-4 py-3 text-purple-700 border border-purple-300 rounded-xl hover:bg-purple-50 transition-colors duration-200"
                  style={{ 
                    animation: mobileMenuOpen ? 'fadeInStagger 0.3s ease-out 0.5s forwards' : 'none',
                    opacity: 0
                  }}
                  onClick={closeMobileMenu}
                >
                  <User className="h-4 w-4 mr-2" />
                  Profile
                </Link>
                <button 
                  onClick={handleSignOut} 
                  className="flex items-center justify-center px-4 py-3 text-gray-700 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors duration-200 w-full"
                  style={{ 
                    animation: mobileMenuOpen ? 'fadeInStagger 0.3s ease-out 0.6s forwards' : 'none',
                    opacity: 0
                  }}
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
                  className="w-full px-4 py-3 text-center text-purple-600 border border-purple-600 rounded-xl hover:bg-purple-50 transition-colors duration-200"
                  style={{ 
                    animation: mobileMenuOpen ? 'fadeInStagger 0.3s ease-out 0.4s forwards' : 'none',
                    opacity: 0
                  }}
                >
                  Login
                </button>
                <button
                  onClick={() => {
                    onRegisterClick();
                    closeMobileMenu();
                  }}
                  className="w-full px-4 py-3 text-center text-white bg-purple-600 rounded-xl hover:bg-purple-700 transition-colors duration-200"
                  style={{ 
                    animation: mobileMenuOpen ? 'fadeInStagger 0.3s ease-out 0.5s forwards' : 'none',
                    opacity: 0
                  }}
                >
                  Sign up
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
    </>
  );
};

export default Navbar;