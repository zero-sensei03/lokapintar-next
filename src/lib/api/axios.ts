import axios, {
  type AxiosError,
  type InternalAxiosRequestConfig,
} from "axios";

import { refreshToken } from "@/services/auth/http";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL;

export const publicUrls = [
  "/auth/login",
  "/auth/register",
  "/auth/google",
  "/auth/captcha",
  "/auth/refresh",
];

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,

  headers: {
    "Content-Type": "application/json",
  },
});

function addTimezone(
  config: InternalAxiosRequestConfig,
) {
  if (typeof window === "undefined") {
    return;
  }

  const timezone =
    Intl.DateTimeFormat().resolvedOptions().timeZone;

  config.headers.set(
    "X-Timezone",
    timezone,
  );
}

api.interceptors.request.use(
  (config) => {
    addTimezone(config);

    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,

  async (error: AxiosError) => {
    const originalRequest =
      error.config as
        | (InternalAxiosRequestConfig & {
            _retry?: boolean;
          })
        | undefined;

    if (!originalRequest) {
      return Promise.reject(error);
    }

    if (error.response?.status !== 401) {
      return Promise.reject(error);
    }

    const requestUrl =
      originalRequest.url ?? "";

    /**
     * Public endpoint tidak memicu
     * refresh maupun logout.
     */
    const isPublicUrl = publicUrls.some(
      (url) => requestUrl === url,
    );

    if (isPublicUrl) {
      return Promise.reject(error);
    }

    /**
     * Request hanya boleh melakukan
     * refresh satu kali.
     */
    if (originalRequest._retry) {
      await logout();

      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      await refreshToken();

      return api(originalRequest);
    } catch (refreshError) {
      await logout();

      return Promise.reject(refreshError);
    }
  },
);

async function logout() {
  try {
    await api.post("/auth/logout");
  } catch {
    // Ignore logout error
  } finally {
    if (typeof window !== "undefined") {
      // eslint-disable-next-line @next/next/no-location-assign-relative-destination
      window.location.href = "/login";
    }
  }
}

export default api;