import axios from "axios";

const refreshApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,

  withCredentials: true,

  headers: {
    "Content-Type": "application/json",
  },
});

refreshApi.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const timezone =
        Intl.DateTimeFormat().resolvedOptions().timeZone;

      config.headers.set(
        "X-Timezone",
        timezone,
      );
    }

    return config;
  },
);

export { refreshApi }