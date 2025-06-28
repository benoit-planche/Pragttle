"use client";

import { useState } from "react";
import {
  Heart,
  MessageCircle,
  Share2,
  MoreHorizontal,
  Clock,
  CheckCircle,
} from "lucide-react";
import { Post, apiService } from "../services/api";

interface PostCardProps {
  post: Post;
  onLike?: (postId: number) => void;
  onComment?: (postId: number) => void;
  onShare?: (postId: number) => void;
}

export default function PostCard({
  post,
  onLike,
  onComment,
  onShare,
}: PostCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likes_count);
  const [isLoading, setIsLoading] = useState(false);

  const handleLike = async () => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      if (isLiked) {
        await apiService.unlikePost(post.id);
        setLikesCount(likesCount - 1);
      } else {
        await apiService.likePost(post.id);
        setLikesCount(likesCount + 1);
      }
      setIsLiked(!isLiked);
      onLike?.(post.id);
    } catch (error) {
      console.error("Failed to like/unlike post:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) return "À l'instant";
    if (diffInHours < 24) return `Il y a ${diffInHours}h`;
    if (diffInHours < 48) return "Hier";
    return date.toLocaleDateString("fr-FR");
  };

  const getVerificationColor = (score?: number) => {
    if (!score) return "from-gray-500 to-gray-600";
    if (score >= 0.9) return "from-green-500 to-emerald-500";
    if (score >= 0.7) return "from-blue-500 to-cyan-500";
    if (score >= 0.5) return "from-yellow-500 to-orange-500";
    return "from-red-500 to-pink-500";
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-lg transition-all duration-200 overflow-hidden">
      {/* Header */}
      <div className="p-6 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              {post.author_avatar_url ? (
                <img
                  src={post.author_avatar_url}
                  alt={post.author_name}
                  className="h-12 w-12 rounded-full object-cover border-2 border-blue-200 dark:border-blue-700"
                />
              ) : (
                <div className="h-12 w-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-lg border-2 border-blue-200 dark:border-blue-700">
                  {post.author_name.charAt(0).toUpperCase()}
                </div>
              )}
              {post.is_verified_by_ai && (
                <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-green-500 rounded-full border-2 border-white dark:border-gray-800 flex items-center justify-center">
                  <CheckCircle className="h-2.5 w-2.5 text-white" />
                </div>
              )}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">
                {post.author_name}
              </h3>
              <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                <span>@{post.author_username}</span>
                <span>•</span>
                <div className="flex items-center space-x-1">
                  <Clock className="h-3 w-3" />
                  <span>{formatTimestamp(post.created_at)}</span>
                </div>
              </div>
            </div>
          </div>
          <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
            <MoreHorizontal className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 pb-4">
        <p className="text-gray-900 dark:text-white text-lg leading-relaxed">
          {post.content}
        </p>
      </div>

      {/* Actions */}
      <div className="px-6 pb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            {/* Like Button */}
            <button
              onClick={handleLike}
              disabled={isLoading}
              className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-200 ${
                isLiked
                  ? "text-red-500 bg-red-50 dark:bg-red-900/20"
                  : "text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
              } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              <Heart className={`h-5 w-5 ${isLiked ? "fill-current" : ""}`} />
              <span className="font-medium">{likesCount}</span>
            </button>

            {/* Comment Button */}
            <button
              onClick={() => onComment?.(post.id)}
              className="flex items-center space-x-2 px-4 py-2 text-gray-500 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-full transition-all duration-200"
            >
              <MessageCircle className="h-5 w-5" />
              <span className="font-medium">{post.comments_count}</span>
            </button>

            {/* Share Button */}
            <button
              onClick={() => onShare?.(post.id)}
              className="flex items-center space-x-2 px-4 py-2 text-gray-500 hover:text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-full transition-all duration-200"
            >
              <Share2 className="h-5 w-5" />
              <span className="font-medium">{post.shares_count}</span>
            </button>
          </div>

          {/* AI Verification Badge */}
          {post.is_verified_by_ai && (
            <div
              className={`flex items-center space-x-2 px-3 py-1 bg-gradient-to-r ${getVerificationColor(
                post.ai_verification_score
              )} text-white text-xs font-semibold rounded-full`}
            >
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              <span>
                IA Vérifié
                {post.ai_verification_score && (
                  <span className="ml-1">
                    ({Math.round(post.ai_verification_score * 100)}%)
                  </span>
                )}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
