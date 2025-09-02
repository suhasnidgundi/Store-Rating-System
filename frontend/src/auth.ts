import axios from 'axios';
import type { AuthTokens, AuthResponse, LoginRequest, RegisterRequest, RefreshTokenResponse } from './types/index';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

class AuthService {
  private tokens: AuthTokens | null = null;

  constructor() {
    // Load tokens from localStorage on initialization
    const storedTokens = localStorage.getItem('authTokens');
    if (storedTokens) {
      this.tokens = JSON.parse(storedTokens);
    }
  }

  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await axios.post<AuthResponse>(`${API_BASE_URL}/auth/login`, credentials);
    this.setTokens(response.data.tokens);
    return response.data;
  }

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    const response = await axios.post<AuthResponse>(`${API_BASE_URL}/auth/register`, userData);
    this.setTokens(response.data.tokens);
    return response.data;
  }

  async refreshToken(): Promise<AuthTokens | null> {
    if (!this.tokens?.refreshToken) {
      return null;
    }

    try {
      const response = await axios.post<RefreshTokenResponse>(
        `${API_BASE_URL}/auth/refresh`,
        { refreshToken: this.tokens.refreshToken }
      );
      this.setTokens(response.data.tokens);
      return response.data.tokens;
    } catch {
      this.clearTokens();
      return null;
    }
  }

  logout(): void {
    this.clearTokens();
  }

  getAccessToken(): string | null {
    return this.tokens?.accessToken || null;
  }

  getRefreshToken(): string | null {
    return this.tokens?.refreshToken || null;
  }

  isAuthenticated(): boolean {
    return !!this.tokens?.accessToken;
  }

  private setTokens(tokens: AuthTokens): void {
    this.tokens = tokens;
    localStorage.setItem('authTokens', JSON.stringify(tokens));
  }

  private clearTokens(): void {
    this.tokens = null;
    localStorage.removeItem('authTokens');
  }
}

export const authService = new AuthService();
export default authService;