"use client";

import { useState, useEffect } from "react";
import CreatePost from "@/components/CreatePost";
import PostCard from "@/components/PostCard";
import Navigation from "@/components/Navigation";
import { apiService, Post } from "@/services/api";

export default function FeedPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      setLoading(true);
      const fetchedPosts = await apiService.getPosts();
      setPosts(fetchedPosts);
    } catch (err) {
      console.error("Failed to load posts:", err);
      setError("Impossible de charger les posts");
      // Fallback to mock data for demo
      setPosts([
        {
          id: "1",
          content:
            "🧠🔥 Bienvenue sur RAGnagna ! Le futur des réseaux sociaux est enfin arrivé. Partagez vos pensées, connectez-vous avec le monde, et découvrez des contenus qui vous inspirent.",
          author: { username: "ragna_admin" },
          likes: 42,
          comments: 7,
          createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
        },
        {
          id: "2",
          content:
            "Juste en train de tester cette nouvelle plateforme. L'interface est vraiment intuitive et moderne ! 🚀",
          author: { username: "test_user" },
          likes: 15,
          comments: 3,
          createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
        },
        {
          id: "3",
          content:
            "Les fonctionnalités de cette plateforme sont incroyables. J'adore la façon dont on peut partager nos idées de manière si fluide. Bravo à l'équipe ! 👏",
          author: { username: "early_adopter" },
          likes: 28,
          comments: 5,
          createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async (content: string) => {
    try {
      const newPost = await apiService.createPost({ content });
      setPosts([newPost, ...posts]);
    } catch (err) {
      console.error("Failed to create post:", err);
      // Fallback: add post locally for demo
      const fallbackPost: Post = {
        id: Date.now().toString(),
        content,
        author: { username: "current_user" },
        likes: 0,
        comments: 0,
        createdAt: new Date().toISOString(),
      };
      setPosts([fallbackPost, ...posts]);
    }
  };

  const handleLike = async (postId: string) => {
    try {
      await apiService.likePost(postId);
      // Update local state
      setPosts(
        posts.map((post) =>
          post.id === postId
            ? { ...post, likes: post.likes + 1, isLiked: true }
            : post
        )
      );
    } catch (err) {
      console.error("Failed to like post:", err);
    }
  };

  const handleComment = (postId: string) => {
    console.log("Comment on post:", postId);
    // TODO: Implement comment functionality
  };

  const handleShare = (postId: string) => {
    console.log("Share post:", postId);
    // TODO: Implement share functionality
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">
            Chargement des posts...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="text-2xl">🧠🔥</div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                RAGnagna
              </h1>
            </div>
            <div className="flex items-center space-x-2">
              <button className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                U
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-2xl mx-auto px-4 py-6 w-full">
        {error && (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-6">
            <p className="text-yellow-800 dark:text-yellow-200 text-sm">
              {error} - Utilisation des données de démonstration
            </p>
          </div>
        )}

        <CreatePost onSubmit={handleCreatePost} />

        <div className="space-y-4">
          {posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onLike={handleLike}
              onComment={handleComment}
              onShare={handleShare}
            />
          ))}
        </div>

        {posts.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">
              Aucun post pour le moment. Soyez le premier à partager quelque
              chose !
            </p>
          </div>
        )}
      </main>

      {/* Bottom Navigation */}
      <Navigation />
    </div>
  );
}
