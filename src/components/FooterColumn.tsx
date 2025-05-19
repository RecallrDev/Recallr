import React from 'react';
import { HashLink } from 'react-router-hash-link';

interface FooterColumnProps {
  title: string;
  links: {
    name: string;
    path: string;
    isHashLink?: boolean;
  }[];
}

const FooterColumn: React.FC<FooterColumnProps> = ({ title, links }) => (
  <div>
    <h3 className="mb-4 text-sm font-semibold text-gray-900">{title}</h3>
    <ul className="space-y-2">
      {links.map((link) => (
        <li key={link.name}>
          {link.isHashLink !== false ? (
            <HashLink
              to={link.path}
              smooth
              className="text-sm text-gray-500 hover:text-purple-600 transition-colors"
            >
              {link.name}
            </HashLink>
          ) : (
            <a
              href={link.path}
              className="text-sm text-gray-500 hover:text-purple-600 transition-colors"
            >
              {link.name}
            </a>
          )}
        </li>
      ))}
    </ul>
  </div>
);

export default FooterColumn;