'use client';

import { motion } from 'framer-motion';
import React from 'react';

interface CardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ title, description, icon }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="relative rounded-[15px] z-10 group"
    >
      {/* 光る枠線の効果 */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-[#00bfff] via-[#87cefa] to-[#1e90ff] rounded-[16px] opacity-0 group-hover:opacity-100 transition duration-300 z-0"></div>
      
      {/* カードの背景 */}
      <div className="relative bg-[#1e1e1e] p-8 rounded-[14px] border border-[#333333] group-hover:border-transparent z-10">
        <div className="flex items-start space-x-4">
          {/* アイコン */}
          <div className="flex-shrink-0 w-10 h-10 bg-[#333333] rounded-full flex items-center justify-center">
            {icon}
          </div>
          
          {/* コンテンツ */}
          <div>
            <h2 className="text-xl font-bold text-white mb-2">{title}</h2>
            <p className="text-[#aaaaaa]">{description}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
