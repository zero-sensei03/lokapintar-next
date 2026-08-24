export type AuthMode = "login" | "register";

export interface SignUpRequest {
    name: string;
    email: string;
    password: string;
    passwordVerification: string;
    captchaToken: string;
    captchaAnswer: string;
}
