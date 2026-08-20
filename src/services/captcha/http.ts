import { BaseResponse } from "@/interfaces/base.interface";
import { CaptchaResponse } from "@/interfaces/captcha.interface";
import api from "@/lib/api/axios"

export const captchaGenerate = async (): Promise<BaseResponse<CaptchaResponse>> => {
    const response = await api.post("/captcha");
    return response.data;
}