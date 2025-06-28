"use client";

import Link from "next/link";
import Image from "next/image";
import { Home, Search, Bell, User } from "lucide-react";

export default function Navigation() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 z-50">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center justify-around py-2">
          <Link
            href="/"
            className="flex flex-col items-center space-y-1 p-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            <Home className="h-6 w-6" />
            <span className="text-xs">Accueil</span>
          </Link>

          <Link
            href="/feed"
            className="flex flex-col items-center space-y-1 p-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            <div className="relative">
                  <Link href="/" className="relative bg-white dark:bg-gray-800 shadow-2xl flex items-center space-x-3 hover:shadow-3xl transition-all duration-200">
                    <Image
                      src="/pragttle.png"
                      alt="Pragttle Logo"
                      width={100}
                      height={30}
                      className="h-10 w-auto"
                    />
                    <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      Pragttle
                    </span>
                  </Link>
                </div>
            <span className="text-xs">Feed</span>
          </Link>

          <Link
            href="/explore"
            className="flex flex-col items-center space-y-1 p-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            <Search className="h-6 w-6" />
            <span className="text-xs">Explorer</span>
          </Link>

          <Link
            href="/notifications"
            className="flex flex-col items-center space-y-1 p-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            <Bell className="h-6 w-6" />
            <span className="text-xs">Notifications</span>
          </Link>

          <Link
            href="/profile"
            className="flex flex-col items-center space-y-1 p-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            <User className="h-6 w-6" />
            <span className="text-xs">Profil</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}
