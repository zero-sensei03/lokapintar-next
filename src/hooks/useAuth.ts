"use client";

import { useAuthStore } from "@/stores/auth-store";

export function useAuth() {
  const user = useAuthStore((state) => state.user);
  const permissions = useAuthStore(
    (state) => state.permissions,
  );
  const isAuthenticated = useAuthStore(
    (state) => state.isAuthenticated,
  );

  const setUser = useAuthStore((state) => state.setUser);
  const setPermissions = useAuthStore(
    (state) => state.setPermissions,
  );
  const setAuth = useAuthStore((state) => state.setAuth);
  const clearAuth = useAuthStore(
    (state) => state.clearAuth,
  );

  const hasPermission = (permission: string) => {
    return permissions.includes(permission);
  };

  const hasAnyPermission = (
    requiredPermissions: string[],
  ) => {
    return requiredPermissions.some((permission) =>
      permissions.includes(permission),
    );
  };

  const hasAllPermissions = (
    requiredPermissions: string[],
  ) => {
    return requiredPermissions.every((permission) =>
      permissions.includes(permission),
    );
  };

  const hasRole = (role: string) => {
    if (!user) {
      return false;
    }

    const roles = Array.isArray(user.role)
      ? user.role
      : [user.role];

    return roles.includes(role);
  };

  return {
    user,
    permissions,
    isAuthenticated,

    setUser,
    setPermissions,
    setAuth,
    clearAuth,

    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    hasRole,
  };
}