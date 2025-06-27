"use client";

import { Heart, MessageCircle, Share, MoreHorizontal } from "lucide-react";

interface Post {
  id: string;
  content: string;
  author: {
    name: string;
    username: string;
    avatar?: string;
  };
  createdAt: string;
  likes: number;
  comments: number;
  isLiked?: boolean;
}

interface PostCardProps {
  post: Post;
  onLike?: (postId: string) => void;
  onComment?: (postId: string) => void;
  onShare?: (postId: string) => void;
}

export default function PostCard({
  post,
  onLike,
  onComment,
  onShare,
}: PostCardProps) {
  return (
    <div className="bg-white border-b border-gray-200 p-4">
      <div className="flex space-x-3">
        {/* Avatar */}
        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0">
          {post.author.name.charAt(0).toUpperCase()}
        </div>

        {/* Content */}
        <div className="flex-1">
          {/* Header */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <span className="font-semibold text-gray-900">
                {post.author.name}
              </span>
              <span className="text-gray-500">@{post.author.username}</span>
              <span className="text-gray-400">·</span>
              <span className="text-gray-400">{post.createdAt}</span>
            </div>
            <button className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100">
              <MoreHorizontal size={16} />
            </button>
          </div>

          {/* Post content */}
          <p className="text-gray-900 mb-3">{post.content}</p>

          {/* Actions */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <button
                onClick={() => onComment?.(post.id)}
                className="flex items-center space-x-2 text-gray-400 hover:text-blue-500 transition-colors"
              >
                <MessageCircle size={16} />
                <span className="text-sm">{post.comments}</span>
              </button>

              <button
                onClick={() => onLike?.(post.id)}
                className={`flex items-center space-x-2 transition-colors ${
                  post.isLiked
                    ? "text-red-500"
                    : "text-gray-400 hover:text-red-500"
                }`}
              >
                <Heart
                  size={16}
                  fill={post.isLiked ? "currentColor" : "none"}
                />
                <span className="text-sm">{post.likes}</span>
              </button>

              <button
                onClick={() => onShare?.(post.id)}
                className="flex items-center space-x-2 text-gray-400 hover:text-green-500 transition-colors"
              >
                <Share size={16} />
                <span className="text-sm">Share</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
