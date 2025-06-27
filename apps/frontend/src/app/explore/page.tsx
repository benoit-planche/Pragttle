"use client";

import { useState } from "react";
import { Search, TrendingUp, Hash, Users } from "lucide-react";
import Navigation from "@/components/Navigation";

const trendingTopics = [
  { id: 1, name: "#RAGnagna", posts: 1234, trending: true },
  { id: 2, name: "#TechNews", posts: 856, trending: true },
  { id: 3, name: "#Innovation", posts: 654, trending: false },
  { id: 4, name: "#WebDev", posts: 432, trending: false },
  { id: 5, name: "#Rust", posts: 321, trending: true },
  { id: 6, name: "#NextJS", posts: 298, trending: false },
];

const suggestedUsers = [
  { id: 1, username: "tech_guru", followers: 15420, verified: true },
  { id: 2, username: "code_master", followers: 8920, verified: false },
  { id: 3, username: "innovation_lab", followers: 5670, verified: true },
  { id: 4, username: "web_wizard", followers: 3450, verified: false },
];

export default function ExplorePage() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="text-2xl">🔍</div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                Explorer
              </h1>
            </div>
          </div>

          {/* Search Bar */}
          <div className="mt-4 relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Rechercher des posts, utilisateurs, hashtags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-2xl mx-auto px-4 py-6 w-full">
        {/* Trending Topics */}
        <section className="mb-8">
          <div className="flex items-center space-x-2 mb-4">
            <TrendingUp className="text-blue-600" size={20} />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Tendances
            </h2>
          </div>

          <div className="space-y-3">
            {trendingTopics.map((topic) => (
              <div
                key={topic.id}
                className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Hash className="text-blue-600" size={16} />
                    <span className="font-medium text-gray-900 dark:text-white">
                      {topic.name}
                    </span>
                    {topic.trending && (
                      <span className="bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-xs px-2 py-1 rounded-full">
                        Tendance
                      </span>
                    )}
                  </div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {topic.posts.toLocaleString()} posts
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Suggested Users */}
        <section className="mb-8">
          <div className="flex items-center space-x-2 mb-4">
            <Users className="text-green-600" size={20} />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Utilisateurs suggérés
            </h2>
          </div>

          <div className="space-y-3">
            {suggestedUsers.map((user) => (
              <div
                key={user.id}
                className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                      {user.username.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-gray-900 dark:text-white">
                          @{user.username}
                        </span>
                        {user.verified && (
                          <span className="bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-xs px-2 py-1 rounded-full">
                            ✓ Vérifié
                          </span>
                        )}
                      </div>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {user.followers.toLocaleString()} abonnés
                      </span>
                    </div>
                  </div>
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                    Suivre
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Categories */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Catégories
          </h2>

          <div className="grid grid-cols-2 gap-4">
            {[
              { name: "Technologie", icon: "💻", color: "bg-blue-500" },
              { name: "Innovation", icon: "🚀", color: "bg-purple-500" },
              { name: "Développement", icon: "⚡", color: "bg-green-500" },
              { name: "Design", icon: "🎨", color: "bg-pink-500" },
            ].map((category) => (
              <div
                key={category.name}
                className={`${category.color} rounded-lg p-6 text-white cursor-pointer hover:opacity-90 transition-opacity`}
              >
                <div className="text-3xl mb-2">{category.icon}</div>
                <h3 className="font-semibold">{category.name}</h3>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Bottom Navigation */}
      <Navigation />
    </div>
  );
}
