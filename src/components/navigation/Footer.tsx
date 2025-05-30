import React from "react";
import { Link } from "react-router-dom";
import { HashLink } from "react-router-hash-link";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
  FaTiktok,
} from "react-icons/fa";

const Footer: React.FC = () => {
  // Product links
  const productLinks = [
    { name: "Features", path: "/#features" },
    { name: "How It Works", path: "/#how-it-works" },
    { name: "Prices", path: "/#pricing" },
    { name: "FAQ", path: "/#faq" }
  ];

  // Company links
  const companyLinks = [
    { name: "About Us", path: "/#about" },
    { name: "Team", path: "/#team" },
    { name: "Contact", path: "/#contact" }
  ];

  // Legal links
  const legalLinks = [
    { name: "Privacy Policy", path: "/privacy" },
    { name: "Terms of Service", path: "/terms" },
    { name: "Imprint", path: "/imprint" },
    { name: "Cookie Settings", path: "/cookies" }
  ];

  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link to="/" className="flex items-center space-x-2">
                <div className="bg-purple-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                    R
                </div>
                <span className="text-purple-600 font-semibold text-lg">Recallr</span>
            </Link>

            <p className="mt-4 text-sm text-gray-500">
              Revolutionize your learning with our improved Anki-Decks.
            </p>

            <div className="mt-6 flex gap-4 text-gray-500">
              <a href="#" aria-label="Facebook" className="hover:text-purple-600">
                <FaFacebookF />
              </a>
              <a href="#" aria-label="Twitter" className="hover:text-purple-600">
                <FaTwitter />
              </a>
              <a href="#" aria-label="Instagram" className="hover:text-purple-600">
                <FaInstagram />
              </a>
              <a href="#" aria-label="TikTok" className="hover:text-purple-600">
                <FaTiktok />
              </a>
              <a href="#" aria-label="LinkedIn" className="hover:text-purple-600">
                <FaLinkedinIn />
              </a>
            </div>
          </div>

          {/* Product Column */}
          <div>
            <h3 className="mb-4 text-sm font-semibold text-gray-900">Product</h3>
            <ul className="space-y-2">
              {productLinks.map((link) => (
                <li key={link.name}>
                  <HashLink
                    to={link.path}
                    smooth
                    className="text-sm text-gray-500 hover:text-purple-600 transition-colors"
                  >
                    {link.name}
                  </HashLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Column */}
          <div>
            <h3 className="mb-4 text-sm font-semibold text-gray-900">Company</h3>
            <ul className="space-y-2">
              {companyLinks.map((link) => (
                <li key={link.name}>
                  <HashLink
                    to={link.path}
                    smooth
                    className="text-sm text-gray-500 hover:text-purple-600 transition-colors"
                  >
                    {link.name}
                  </HashLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Column */}
          <div>
            <h3 className="mb-4 text-sm font-semibold text-gray-900">Legal</h3>
            <ul className="space-y-2">
              {legalLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-sm text-gray-500 hover:text-purple-600 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;