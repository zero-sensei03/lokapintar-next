import { refreshApi } from "@/lib/api/refresh";


export const refreshToken = async () => {
    const response = await refreshApi.post("/auth/refresh");
    return response.data;
}