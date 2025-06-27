"use client";

import { useState } from "react";
import { Send, Image, Smile } from "lucide-react";

interface CreatePostProps {
  onSubmit: (content: string) => void;
  placeholder?: string;
}

export default function CreatePost({
  onSubmit,
  placeholder = "Quoi de neuf ?",
}: CreatePostProps) {
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setIsSubmitting(true);
    try {
      await onSubmit(content);
      setContent("");
    } catch (error) {
      console.error("Erreur lors de la création du post:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      handleSubmit(e);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-6">
      <form onSubmit={handleSubmit}>
        <div className="flex space-x-3">
          {/* Avatar */}
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0">
            U
          </div>

          {/* Content */}
          <div className="flex-1">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={placeholder}
              className="w-full resize-none border-0 bg-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-0 focus:outline-none text-lg"
              rows={3}
              maxLength={280}
            />

            {/* Character count */}
            <div className="flex items-center justify-between mt-3">
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  className="text-gray-400 hover:text-blue-500 transition-colors p-2 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/20"
                  aria-label="Ajouter une image"
                >
                  <Image size={20} />
                </button>
                <button
                  type="button"
                  className="text-gray-400 hover:text-yellow-500 transition-colors p-2 rounded-full hover:bg-yellow-50 dark:hover:bg-yellow-900/20"
                  aria-label="Ajouter un emoji"
                >
                  <Smile size={20} />
                </button>
              </div>

              <div className="flex items-center space-x-3">
                <span
                  className={`text-sm ${
                    content.length > 260 ? "text-red-500" : "text-gray-400"
                  }`}
                >
                  {content.length}/280
                </span>
                <button
                  type="submit"
                  disabled={!content.trim() || isSubmitting}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-full font-medium transition-colors ${
                    content.trim() && !isSubmitting
                      ? "bg-blue-600 hover:bg-blue-700 text-white"
                      : "bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  <Send size={16} />
                  <span>Publier</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
