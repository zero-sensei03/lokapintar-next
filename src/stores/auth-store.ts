"use client";

import { create } from "zustand";
import {
  removeAuthCookies,
  setAuthPermissionsCookie,
  setAuthUserCookie,
} from "@/lib/auth-cookie";
import type { AuthState } from "@/interfaces/auth.interface";

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  permissions: [],
  isAuthenticated: false,

  setUser: (user) => {
    setAuthUserCookie(user);

    set({
      user,
      isAuthenticated: true,
    });
  },

  setPermissions: (permissions) => {
    setAuthPermissionsCookie(permissions);

    set({
      permissions,
    });
  },

  setAuth: ({ user, permissions }) => {
    setAuthUserCookie(user);
    setAuthPermissionsCookie(permissions);

    set({
      user,
      permissions,
      isAuthenticated: true,
    });
  },

  clearAuth: () => {
    removeAuthCookies();

    set({
      user: null,
      permissions: [],
      isAuthenticated: false,
    });
  },
}));