'use client';

import { motion } from 'framer-motion';
import { Card } from '../components/Card';
import { SearchBar } from '../components/SearchBar';
import { PlusIcon, BuildingIcon, LocationIcon, ScaleIcon } from '../components/Icons';

// 業種カテゴリーのデータ
const industryCategories = [
  { title: '製造業', description: '製造業から企業情報を見つけることができます', icon: <PlusIcon /> },
  { title: 'IT・通信', description: 'IT・通信から企業情報を見つけることができます', icon: <PlusIcon /> },
  { title: '金融・保険', description: '金融・保険から企業情報を見つけることができます', icon: <PlusIcon /> },
  { title: '小売・卸売', description: '小売・卸売から企業情報を見つけることができます', icon: <PlusIcon /> },
  { title: '医療・福祉', description: '医療・福祉から企業情報を見つけることができます', icon: <PlusIcon /> },
  { title: '建設・不動産', description: '建設・不動産から企業情報を見つけることができます', icon: <PlusIcon /> },
];

// 検索カテゴリーのデータ
const searchCategories = [
  { title: '業界から探す', description: '業界から探すで企業を絞り込むことができます', icon: <BuildingIcon /> },
  { title: '地域から探す', description: '地域から探すで企業を絞り込むことができます', icon: <LocationIcon /> },
  { title: '規模から探す', description: '規模から探すで企業を絞り込むことができます', icon: <ScaleIcon /> },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-[#121212]">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl font-bold text-white mb-4">
            Company Information
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Search for companies by category
          </p>
        </motion.div>

        {/* 検索バー */}
        <div className="mb-12">
          <SearchBar />
        </div>

        {/* 業種カテゴリー */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {industryCategories.map((category) => (
            <Card 
              key={category.title}
              title={category.title}
              description={category.description}
              icon={category.icon}
            />
          ))}
        </div>

        {/* 検索カテゴリー */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {searchCategories.map((category) => (
            <Card 
              key={category.title}
              title={category.title}
              description={category.description}
              icon={category.icon}
            />
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="mt-16 text-center"
        >
          <p className="text-gray-400">
            10,000社以上の企業データを収録・毎日更新中
          </p>
        </motion.div>
      </main>
    </div>
  );
}
