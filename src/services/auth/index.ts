import { ResetRequest, SignInRequest, SignInResponse, SignUpRequest } from "@/interfaces/auth.interface";
import { BaseResponse, ErrorBaseResponse } from "@/interfaces/base.interface";
import { useMutation } from "@tanstack/react-query"
import { AxiosError } from "axios";
import { forgotPassword, requestSignUpOtp, resetPassword, signIn, signUp, verifyForgotOtp, verifySignUpOtp } from "./http";

export const useSignIn = () => {
    return useMutation<BaseResponse<SignInResponse>, AxiosError<ErrorBaseResponse>, SignInRequest>({
        mutationFn: (payload) => signIn(payload)
    })
}
export const useSignUp = () => {
    return useMutation<BaseResponse<{ data: boolean }>, AxiosError<ErrorBaseResponse>, SignUpRequest>({
        mutationFn: (payload) => signUp(payload)
    })
}
export const useRequestSignUp = () => {
    return useMutation<BaseResponse<{ data: boolean }>, AxiosError<ErrorBaseResponse>, { email: string }>({
        mutationFn: (payload) => requestSignUpOtp(payload)
    })
}
export const useVeiryfySignUp = () => {
    return useMutation<BaseResponse<{ data: boolean }>, AxiosError<ErrorBaseResponse>, { email: string; otp: string; }>({
        mutationFn: (payload) => verifySignUpOtp(payload)
    })
}
export const useForgotPassword = () => {
    return useMutation<BaseResponse<{ data: boolean }>, AxiosError<ErrorBaseResponse>, { email: string }>({
        mutationFn: (payload) => forgotPassword(payload)
    })
}
export const useVeiryfyForgot = () => {
    return useMutation<BaseResponse<{ data: boolean }>, AxiosError<ErrorBaseResponse>, { email: string; otp: string; }>({
        mutationFn: (payload) => verifyForgotOtp(payload)
    })
}
export const useResetPassword = () => {
    return useMutation<BaseResponse<{ data: boolean }>, AxiosError<ErrorBaseResponse>, ResetRequest>({
        mutationFn: (payload) => resetPassword(payload)
    })
}

// export const useGetProfile = () => {
//   return useQuery({
//     queryKey: ["authProfile"],
//     queryFn: () => authProfile(),
//     staleTime: 0,
//     refetchOnMount: true,
//     refetchOnWindowFocus: true,
//   });
// };

// export const useAuthSignIn = () => {
//   const queryClient = useQueryClient();
//   return useMutation<SignInRes, AxiosError<BaseErrorResponse>, SignInStore>({
//     mutationFn: (formData) => authSignIn(formData),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["authSignIn"] });
//     },
//     onError: (error) => {
//       throw error;
//     },
//   });
// };