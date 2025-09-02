// Authentication types
export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  address?: string;
  role: 'ADMIN' | 'USER' | 'OWNER';
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  user: User;
  tokens: AuthTokens;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  address?: string;
  role: 'USER' | 'OWNER';
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  tokens: AuthTokens;
}