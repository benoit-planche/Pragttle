"use client";

import { useState } from "react";
import { Send, Image, Smile, Hash, Globe } from "lucide-react";

interface CreatePostProps {
  onSubmit: (content: string) => void;
  placeholder?: string;
}

export default function CreatePost({
  onSubmit,
  placeholder = "Quoi de neuf sur le climat ?",
}: CreatePostProps) {
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

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

  const characterCount = content.length;
  const maxCharacters = 280;
  const isOverLimit = characterCount > maxCharacters;
  const isNearLimit = characterCount > maxCharacters * 0.8;

  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-2xl border-2 transition-all duration-200 ${
        isFocused
          ? "border-blue-500 shadow-lg shadow-blue-500/20"
          : "border-gray-200 dark:border-gray-700 shadow-sm"
      }`}
    >
      <form onSubmit={handleSubmit}>
        <div className="p-6">
          <div className="flex space-x-4">
            {/* Avatar */}
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-lg flex-shrink-0 border-2 border-blue-200 dark:border-blue-700">
                U
              </div>
              <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
            </div>

            {/* Content */}
            <div className="flex-1">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                onKeyPress={handleKeyPress}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder={placeholder}
                className="w-full resize-none border-0 bg-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-0 focus:outline-none text-lg leading-relaxed"
                rows={3}
                maxLength={maxCharacters}
              />

              {/* Character count and actions */}
              <div className="flex items-center justify-between mt-4">
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
                  <button
                    type="button"
                    className="text-gray-400 hover:text-green-500 transition-colors p-2 rounded-full hover:bg-green-50 dark:hover:bg-green-900/20"
                    aria-label="Ajouter un hashtag"
                  >
                    <Hash size={20} />
                  </button>
                  <button
                    type="button"
                    className="text-gray-400 hover:text-purple-500 transition-colors p-2 rounded-full hover:bg-purple-50 dark:hover:bg-purple-900/20"
                    aria-label="Paramètres de visibilité"
                  >
                    <Globe size={20} />
                  </button>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <span
                      className={`text-sm font-medium ${
                        isOverLimit
                          ? "text-red-500"
                          : isNearLimit
                          ? "text-yellow-500"
                          : "text-gray-400"
                      }`}
                    >
                      {characterCount}/{maxCharacters}
                    </span>
                    {isOverLimit && (
                      <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                    )}
                  </div>
                  <button
                    type="submit"
                    disabled={!content.trim() || isSubmitting || isOverLimit}
                    className={`flex items-center space-x-2 px-6 py-3 rounded-full font-semibold transition-all duration-200 ${
                      content.trim() && !isSubmitting && !isOverLimit
                        ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105"
                        : "bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    {isSubmitting ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <Send size={16} />
                    )}
                    <span>{isSubmitting ? "Publication..." : "Publier"}</span>
                  </button>
                </div>
              </div>

              {/* AI Verification Badge */}
              {content.trim() && (
                <div className="mt-4 flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span>
                    Ce post sera vérifié par notre IA pour la désinformation
                    climatique
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
