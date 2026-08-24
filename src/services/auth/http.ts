import { refreshApi } from "@/lib/api/refresh";
import api from "@/lib/api/axios"

import { BaseResponse } from "@/interfaces/base.interface";
import { SignInRequest, SignInResponse, SignUpRequest } from "@/interfaces/auth.interface";

export const refreshToken = async () => {
    const response = await refreshApi.post("/auth/refresh");
    return response.data;
}

export const signIn = async (payload: SignInRequest): Promise<BaseResponse<SignInResponse>> => {
    const response = await api.post("/auth/sign-in", payload);
    return response.data;
}

export const signUp = async (payload: SignUpRequest): Promise<BaseResponse<{data: boolean}>> => {
    const response = await api.post("/auth/sign-up", payload);
    return response.data;
}

export const requestSignUpOtp = async (payload: { email: string }): Promise<BaseResponse<{data: boolean}>> => {
    const response = await api.post("/auth/sign-up/otp/request", payload);
    return response.data;
}

export const verifySignUpOtp = async (payload: { email: string; otp: string; }): Promise<BaseResponse<{data: boolean}>> => {
    const response = await api.post("/auth/sign-up/otp/verify", payload);
    return response.data;
}