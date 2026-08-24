export type AuthMode = "login" | "register";

export interface SignUpRequest {
    name: string;
    email: string;
    password: string;
    passwordVerification: string;
    captchaToken: string;
    captchaAnswer: string;
}
export interface SignInRequest {
    email: string;
    password: string;
    captchaToken: string;
    captchaAnswer: string;
}

export interface AuthUser {
  name: string;
  role: string | string[];
}

export interface SignInResponse {
    user: AuthUser
}

export interface AuthState {
  user: AuthUser | null;
  permissions: string[];
  isAuthenticated: boolean;

  setUser: (user: AuthUser) => void;
  setPermissions: (permissions: string[]) => void;

  setAuth: (data: {
    user: AuthUser;
    permissions: string[];
  }) => void;

  clearAuth: () => void;
}
