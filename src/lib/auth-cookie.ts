import Cookies from "js-cookie";

export const AUTH_USER_COOKIE = "auth_user";
export const AUTH_PERMISSIONS_COOKIE = "auth_permissions";

const COOKIE_OPTIONS: Cookies.CookieAttributes = {
  expires: 7,
  sameSite: "lax",
  secure: process.env.NODE_ENV === "production",
  path: "/",
};

export function setAuthUserCookie(user: {
  name: string;
  role: string | string[];
}) {
  Cookies.set(
    AUTH_USER_COOKIE,
    JSON.stringify(user),
    COOKIE_OPTIONS,
  );
}

export function getAuthUserCookie(): {
  name: string;
  role: string | string[];
} | null {
  const value = Cookies.get(AUTH_USER_COOKIE);

  if (!value) {
    return null;
  }

  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

export function setAuthPermissionsCookie(
  permissions: string[],
) {
  Cookies.set(
    AUTH_PERMISSIONS_COOKIE,
    JSON.stringify(permissions),
    COOKIE_OPTIONS,
  );
}

export function getAuthPermissionsCookie(): string[] {
  const value = Cookies.get(AUTH_PERMISSIONS_COOKIE);

  if (!value) {
    return [];
  }

  try {
    const parsed: unknown = JSON.parse(value);

    return Array.isArray(parsed)
      ? parsed.filter(
          (permission): permission is string =>
            typeof permission === "string",
        )
      : [];
  } catch {
    return [];
  }
}

export function removeAuthCookies() {
  Cookies.remove(AUTH_USER_COOKIE, {
    path: "/",
  });

  Cookies.remove(AUTH_PERMISSIONS_COOKIE, {
    path: "/",
  });
}