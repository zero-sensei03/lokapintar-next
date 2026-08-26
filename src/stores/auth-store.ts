"use client";

import { create } from "zustand";
import {
  getAuthPermissionsCookie,
  getAuthUserCookie,
  removeAuthCookies,
  setAuthPermissionsCookie,
  setAuthUserCookie,
} from "@/lib/auth-cookie";
import type { AuthState } from "@/interfaces/auth.interface";

const initialUser = getAuthUserCookie();
const initialPermissions = getAuthPermissionsCookie();

export const useAuthStore = create<AuthState>((set) => ({
  user: initialUser,
  permissions: initialPermissions,
  isAuthenticated: initialUser !== null,

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