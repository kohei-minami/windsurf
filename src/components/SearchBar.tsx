'use client';

import React from 'react';
import { SearchIcon } from './Icons';

export const SearchBar: React.FC = () => {
  return (
    <div className="relative max-w-2xl mx-auto">
      <input
        type="text"
        placeholder="企業名や業種で検索..."
        className="w-full bg-[#2a2a2a] text-white border border-[#444444] rounded-full py-3 px-6 pl-12 focus:outline-none focus:ring-2 focus:ring-[#00bfff] transition duration-300"
      />
      <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
        <SearchIcon />
      </div>
    </div>
  );
};
