"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

const trendingTopics = [
  { id: 1, name: "#Pragttle", posts: 1234, trending: true },
  { id: 2, name: "#TechNews", posts: 856, trending: true },
  { id: 3, name: "#Innovation", posts: 654, trending: false },
  { id: 4, name: "#Programming", posts: 432, trending: true },
  { id: 5, name: "#AI", posts: 321, trending: false },
];

const suggestedUsers = [
  {
    id: 1,
    username: "tech_guru",
    name: "Tech Guru",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=tech_guru",
    followers: 15420,
  },
  {
    id: 2,
    username: "code_master",
    name: "Code Master",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=code_master",
    followers: 8920,
  },
  {
    id: 3,
    username: "ai_expert",
    name: "AI Expert",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=ai_expert",
    followers: 12340,
  },
];

export default function ExplorePage() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Explorer
            </h1>
            <Link
              href="/feed"
              className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
            >
              Retour au Feed
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Search */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Rechercher des posts, utilisateurs, hashtags..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Trending Topics */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Tendances
                </h2>
              </div>
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {trendingTopics.map((topic) => (
                  <div
                    key={topic.id}
                    className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-blue-600 dark:text-blue-400 font-medium">
                          {topic.name}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {topic.posts.toLocaleString()} posts
                        </p>
                      </div>
                      {topic.trending && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                          🔥 Trending
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Posts */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Posts récents
                </h2>
              </div>
              <div className="p-6">
                <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                  Les posts récents apparaîtront ici...
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Suggested Users */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Utilisateurs suggérés
                </h2>
              </div>
              <div className="p-6 space-y-4">
                {suggestedUsers.map((user) => (
                  <div key={user.id} className="flex items-center space-x-3">
                    <Image
                      src={user.avatar}
                      alt={user.name}
                      width={40}
                      height={40}
                      className="h-10 w-10 rounded-full"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {user.name}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                        @{user.username}
                      </p>
                    </div>
                    <button className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm font-medium">
                      Suivre
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Statistiques
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    Posts aujourd&apos;hui
                  </span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    1,234
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    Utilisateurs actifs
                  </span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    5,678
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    Hashtags populaires
                  </span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    89
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
