import React from 'react';

export type SectionHeaderProps = {
    title: string;
};

const SectionHeader: React.FC<SectionHeaderProps> = ({ title }) => {
    return (
        <span className="text-sm tracking-wide text-purple-800 font-medium bg-purple-100 rounded-lg px-3 py-1">
          {title}
        </span>
    );
};

export default SectionHeader;