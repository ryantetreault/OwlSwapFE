export interface User {
  userId: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  averageRating: number | null;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken?: string;
}

export interface SignInRequest {
  username: string;
  password: string;
}

export interface SignUpRequest {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  password: string;
  confirmPassword?: string; // Frontend validation only
}

// Backend actual response from AuthResponse.java (login only returns token)
export interface AuthResponse {
  token: string;
}

export interface AuthError {
  message: string;
  field?: string;
}
