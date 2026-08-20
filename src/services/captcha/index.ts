import { BaseResponse, ErrorBaseResponse } from "@/interfaces/base.interface";
import { CaptchaResponse } from "@/interfaces/captcha.interface";
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { AxiosError } from "axios";
import { captchaGenerate } from "./http";

export const useCaptchaGenerate = () => {
    // const queryClient = useQueryClient();
    return useMutation<BaseResponse<CaptchaResponse>, AxiosError<ErrorBaseResponse>, null>({
        mutationFn: () => captchaGenerate(),
        onError: (error) => {
            throw error;
        },
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