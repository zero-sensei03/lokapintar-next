"use client";

import {
  useEffect,
  useRef,
  type ReactNode,
} from "react";

import { useAuthStore } from "@/stores/auth-store";
import { getAuthUserCookie } from "@/lib/auth-cookie";
// import { getMe } from "@/services/auth.service";

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({
  children,
}: AuthProviderProps) {
  const initialized = useRef(false);

  const setAuth = useAuthStore(
    (state) => state.setAuth,
  );

  const setPermissions = useAuthStore(
    (state) => state.setPermissions,
  );

  const clearAuth = useAuthStore(
    (state) => state.clearAuth,
  );

  useEffect(() => {
    if (initialized.current) {
      return;
    }

    initialized.current = true;

    const initializeAuth = async () => {
      const user = getAuthUserCookie();

      if (!user) {
        return;
      }

    //   try {
    //     const response = await getMe();

    //     setAuth({
    //       user,
    //       permissions: response.permissions,
    //     });
    //   } catch {
    //     clearAuth();
    //   }
    };

    void initializeAuth();
  }, [setAuth, setPermissions, clearAuth]);

  return children;
}