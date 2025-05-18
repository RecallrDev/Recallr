import React from "react";
import { Link } from "react-router-dom";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
  FaTiktok,
} from "react-icons/fa";
import FooterColumn from "./FooterColumn";

const Footer: React.FC = () => {
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

          <FooterColumn
            title="Product"
            links={["Features", "Prices", "FAQ"]}
          />
          <FooterColumn
            title="Company"
            links={["About Us", "Team", "Contact"]}
          />
          <FooterColumn
            title="Legal"
            links={["Privacy Policy", "Terms of Service", "Imprint", "Cookie Settings"]}
          />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
