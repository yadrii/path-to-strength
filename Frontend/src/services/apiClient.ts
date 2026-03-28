const API_BASE_URL =
  import.meta.env.VITE_BACKEND_URL || "http://localhost:5000/api";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  role: "user" | "ngo";
  phoneNumber?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data?: {
    user: {
      id: string;
      name: string;
      email: string;
      role: "user" | "ngo";
      isEmailVerified: boolean;
    };
    accessToken: string;
    refreshToken: string;
  };
}

export interface UserResponse {
  success: boolean;
  message: string;
  data?: {
    _id: string;
    name: string;
    email: string;
    role: "user" | "ngo";
    phoneNumber?: string;
    isEmailVerified: boolean;
    lastLogin?: string;
  };
}

class ApiClient {
  private baseURL: string;
  private accessToken: string | null;
  private refreshToken: string | null;

  constructor() {
    this.baseURL = API_BASE_URL;
    this.accessToken = localStorage.getItem("accessToken");
    this.refreshToken = localStorage.getItem("refreshToken");
  }

  setTokens(accessToken: string, refreshToken: string) {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
  }

  clearTokens() {
    this.accessToken = null;
    this.refreshToken = null;
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  }

  private getHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (this.accessToken) {
      headers["Authorization"] = `Bearer ${this.accessToken}`;
    }

    return headers;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...this.getHeaders(),
          ...(options.headers || {}),
        },
      });

      const data = await response.json();

      // If unauthorized, try to refresh token
      if (response.status === 401 && this.refreshToken) {
        const refreshed = await this.refreshAccessToken();
        if (refreshed) {
          // Retry the original request
          return this.request<T>(endpoint, options);
        }
      }

      if (!response.ok) {
        throw new Error(data.message || `HTTP ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error("API request failed:", error);
      throw error;
    }
  }

  // Auth endpoints
  async register(payload: RegisterRequest): Promise<AuthResponse> {
    return this.request<AuthResponse>("/auth/register", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }

  async login(payload: LoginRequest): Promise<AuthResponse> {
    return this.request<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }

  async logout(): Promise<any> {
    const response = await this.request<any>("/auth/logout", {
      method: "POST",
    });
    this.clearTokens();
    return response;
  }

  async getCurrentUser(): Promise<UserResponse> {
    return this.request<UserResponse>("/auth/me", {
      method: "GET",
    });
  }

  async refreshAccessToken(): Promise<boolean> {
    if (!this.refreshToken) return false;

    try {
      const response = await this.request<any>("/auth/refresh-token", {
        method: "POST",
        body: JSON.stringify({ refreshToken: this.refreshToken }),
      });

      if (response.data?.accessToken) {
        this.accessToken = response.data.accessToken;
        localStorage.setItem("accessToken", this.accessToken);
        return true;
      }
      return false;
    } catch (error) {
      this.clearTokens();
      return false;
    }
  }

  async updateProfile(payload: any): Promise<UserResponse> {
    return this.request<UserResponse>("/auth/update-profile", {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  }

  async changePassword(
    currentPassword: string,
    newPassword: string,
  ): Promise<any> {
    return this.request<any>("/auth/change-password", {
      method: "POST",
      body: JSON.stringify({ currentPassword, newPassword }),
    });
  }

  async forgotPassword(email: string): Promise<any> {
    return this.request<any>("/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
  }

  async resetPassword(
    email: string,
    token: string,
    newPassword: string,
  ): Promise<any> {
    return this.request<any>("/auth/reset-password", {
      method: "POST",
      body: JSON.stringify({ email, token, newPassword }),
    });
  }

  async verifyEmail(email: string, token: string): Promise<any> {
    return this.request<any>("/auth/verify-email", {
      method: "POST",
      body: JSON.stringify({ email, token }),
    });
  }

  async resendVerificationEmail(email: string): Promise<any> {
    return this.request<any>("/auth/resend-verification-email", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
  }
}

export const apiClient = new ApiClient();
