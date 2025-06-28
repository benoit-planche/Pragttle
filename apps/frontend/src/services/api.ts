const API_BASE_URL = "http://127.0.0.1:4000";

export interface Post {
  id: number;
  content: string;
  author_id: number;
  author_name: string;
  author_username: string;
  author_avatar_url?: string;
  likes_count: number;
  comments_count: number;
  shares_count: number;
  is_verified_by_ai: boolean;
  ai_verification_score?: number;
  created_at: string;
  updated_at: string;
}

export interface PostListResponse {
  posts: Post[];
  total: number;
  page: number;
  per_page: number;
}

export interface CreatePostRequest {
  content: string;
}

export interface CreatePostResponse {
  id: number;
  content: string;
  author_id: number;
  created_at: string;
}

export interface AuthRequest {
  username: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: number;
    username: string;
    email: string;
    name: string;
    avatar_url?: string;
    created_at: string;
  };
}

export interface LikeResponse {
  success: boolean;
  liked: boolean;
  message: string;
}

export interface UnlikeResponse {
  success: boolean;
  unliked: boolean;
  message: string;
}

class ApiService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_BASE_URL;
    console.log("🔧 API Service initialized with base URL:", this.baseUrl);
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    console.log("🌐 Making API request to:", url);

    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    };

    // Add auth token if available
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("auth_token");
      if (token) {
        config.headers = {
          ...config.headers,
          Authorization: `Bearer ${token}`,
        };
      }
    }

    try {
      console.log("📤 Request config:", config);
      const response = await fetch(url, config);
      console.log("📥 Response status:", response.status);
      console.log("📥 Response headers:", response.headers);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Handle empty responses
      const text = await response.text();
      console.log("📥 Response text:", text);

      if (!text) {
        return {} as T;
      }

      const parsed = JSON.parse(text);
      console.log("✅ Parsed response:", parsed);
      return parsed;
    } catch (error) {
      console.error("❌ API request failed:", error);
      throw error;
    }
  }

  // Posts
  async getPosts(page?: number, per_page?: number): Promise<PostListResponse> {
    const params = new URLSearchParams();
    if (page) params.append("page", page.toString());
    if (per_page) params.append("per_page", per_page.toString());

    const queryString = params.toString();
    const endpoint = queryString ? `/api/posts?${queryString}` : "/api/posts";

    return this.request<PostListResponse>(endpoint);
  }

  async createPost(data: CreatePostRequest): Promise<CreatePostResponse> {
    return this.request<CreatePostResponse>("/api/posts", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async likePost(postId: number): Promise<LikeResponse> {
    return this.request<LikeResponse>(`/api/posts/${postId}/like`, {
      method: "POST",
    });
  }

  async unlikePost(postId: number): Promise<UnlikeResponse> {
    return this.request<UnlikeResponse>(`/api/posts/${postId}/unlike`, {
      method: "POST",
    });
  }

  // Auth
  async login(data: AuthRequest): Promise<AuthResponse> {
    return this.request<AuthResponse>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async register(data: AuthRequest): Promise<AuthResponse> {
    return this.request<AuthResponse>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  // Health check
  async healthCheck(): Promise<{ status: string }> {
    return this.request<{ status: string }>("/health");
  }
}

export const apiService = new ApiService();
