export type AuthMode = "login" | "register";

export interface SignUpRequest {
    name: string;
    email: string;
    password: string;
    passwordVerification: string;
    captchaToken: string;
    captchaAnswer: string;
}
export interface SignInRequest {
    email: string;
    password: string;
    captchaToken: string;
    captchaAnswer: string;
}

export interface SignInResponse {
    user: {
        name: string;
        role: string;
    }
}
