import React, { useState } from 'react';

interface CategoryToggleProps {
  title: string;
  items: string[];
}

const CategoryToggle: React.FC<CategoryToggleProps> = ({ title, items }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border rounded-lg mb-4">
      <button
        className="w-full px-4 py-2 text-left bg-gray-100 hover:bg-gray-200 flex justify-between items-center"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="font-medium">{title}</span>
        <span className={`transform transition-transform ${isOpen ? 'rotate-180' : ''}`}>
          ▼
        </span>
      </button>
      {isOpen && (
        <ul className="p-2">
          {items.map((item, index) => (
            <li key={index} className="py-1 px-4 hover:bg-gray-50 cursor-pointer">
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CategoryToggle; 