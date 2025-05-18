import React from 'react';

export type SectionHeaderProps = {
    titlebox: string;
    title: string;
    subtitle: string
};

const SectionHeader: React.FC<SectionHeaderProps> = ({ titlebox, title, subtitle }) => {
    return (
        <div>
            <span className="text-sm tracking-wide text-purple-800 font-medium bg-purple-100 rounded-lg px-3 py-1">
              {titlebox}
            </span>
            <h2 className="mt-2 text-3xl md:text-4xl font-bold text-gray-900">
              {title}
            </h2>
            <p className="mt-2 text-gray-600 max-w-2xl mx-auto">
              {subtitle}
            </p>
        </div>
    );
};

export default SectionHeader;