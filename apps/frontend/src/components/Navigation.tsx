"use client";

import Link from "next/link";
import { Home, Search, Bell, User } from "lucide-react";

export default function Navigation() {
  return (
    <nav className="bg-white border-b border-gray-200 fixed bottom-0 left-0 right-0 z-50">
      <div className="max-w-md mx-auto px-4">
        <div className="flex justify-around py-2">
          <Link
            href="/"
            className="flex flex-col items-center p-2 text-gray-600 hover:text-blue-500"
          >
            <Home size={24} />
            <span className="text-xs mt-1">Home</span>
          </Link>
          <Link
            href="/explore"
            className="flex flex-col items-center p-2 text-gray-600 hover:text-blue-500"
          >
            <Search size={24} />
            <span className="text-xs mt-1">Explore</span>
          </Link>
          <Link
            href="/notifications"
            className="flex flex-col items-center p-2 text-gray-600 hover:text-blue-500"
          >
            <Bell size={24} />
            <span className="text-xs mt-1">Notifications</span>
          </Link>
          <Link
            href="/profile"
            className="flex flex-col items-center p-2 text-gray-600 hover:text-blue-500"
          >
            <User size={24} />
            <span className="text-xs mt-1">Profile</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}
