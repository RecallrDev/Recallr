interface ColumnProps {
  title: string;
  links: string[];
}

const FooterColumn: React.FC<ColumnProps> = ({ title, links }) => (
  <div>
    <h3 className="mb-4 text-sm font-semibold text-gray-900">{title}</h3>
    <ul className="space-y-2">
      {links.map((link) => (
        <li key={link}>
          <a
            href="#"
            className="text-sm text-gray-500 hover:text-purple-600 transition-colors"
          >
            {link}
          </a>
        </li>
      ))}
    </ul>
  </div>
);

export default FooterColumn;