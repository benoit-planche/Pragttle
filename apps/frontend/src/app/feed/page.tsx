"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import PostCard from "@/components/PostCard";
import CreatePost from "@/components/CreatePost";
import { Search, TrendingUp, Bell, Settings, Loader2 } from "lucide-react";
import Link from "next/link";
import { apiService, Post } from "@/services/api";

export default function FeedPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("for-you");

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log("🔄 Fetching posts from API...");
      const response = await apiService.getPosts();
      console.log("✅ Posts fetched successfully:", response);
      setPosts(response.posts);
    } catch (err) {
      console.error("❌ Failed to fetch posts:", err);
      setError("Impossible de charger les publications");
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async (content: string) => {
    try {
      await apiService.createPost({ content });
      // Refresh posts to get the updated list
      await fetchPosts();
    } catch (err) {
      console.error("Failed to create post:", err);
      setError("Impossible de créer la publication");
    }
  };

  const handleLike = (postId: number) => {
    // The PostCard component handles the like/unlike logic
    console.log("Post liked:", postId);
  };

  const handleComment = (postId: number) => {
    console.log("Comment on post:", postId);
  };

  const handleShare = (postId: number) => {
    console.log("Share post:", postId);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
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

            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <Search className="h-5 w-5" />
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <Bell className="h-5 w-5" />
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <Settings className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="flex space-x-1 bg-white dark:bg-gray-800 rounded-xl p-1 mb-8 shadow-sm">
          <button
            onClick={() => setActiveTab("for-you")}
            className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
              activeTab === "for-you"
                ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg"
                : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            }`}
          >
            Pour vous
          </button>
          <button
            onClick={() => setActiveTab("trending")}
            className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
              activeTab === "trending"
                ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg"
                : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            }`}
          >
            <div className="flex items-center justify-center space-x-2">
              <TrendingUp className="h-4 w-4" />
              <span>Tendances</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab("verified")}
            className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
              activeTab === "verified"
                ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg"
                : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            }`}
          >
            Vérifié IA
          </button>
        </div>

        {/* Create Post */}
        <div className="mb-8">
          <CreatePost onSubmit={handleCreatePost} />
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center space-x-2">
              <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
              <span className="text-gray-600 dark:text-gray-400">
                Chargement des publications...
              </span>
            </div>
          </div>
        )}

        {/* Posts Feed */}
        {!loading && (
          <div className="space-y-6">
            {posts.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 dark:text-gray-500 text-lg">
                  Aucune publication pour le moment
                </div>
                <p className="text-gray-500 dark:text-gray-400 mt-2">
                  Soyez le premier à partager quelque chose !
                </p>
              </div>
            ) : (
              posts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  onLike={handleLike}
                  onComment={handleComment}
                  onShare={handleShare}
                />
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
