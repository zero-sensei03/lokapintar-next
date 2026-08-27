"use client";

import { ErrorBaseResponse } from "@/interfaces/base.interface";
import { useForgotPassword, useResetPassword, useVeiryfyForgot } from "@/services/auth";
import { FormErrors, validateForgot, validateReset } from "@/validations/auth.validation";
import { addToast, Button, Input, useDisclosure } from "@heroui/react";
import { AxiosError } from "axios";
import { Eye, EyeClosed } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";
import { OTPModalCard } from "../modals/OTPModal";

interface ForgotProps {
  email: string;
}

interface ResetProps {
    otp: string;
    email: string;
    password: string;
    passwordVerification: string;
}

const INITIAL_FORGOT: ForgotProps = {
  email: "",
};
const INITIAL_RESET: ResetProps = {
  otp: "",
  email: "",
  password: "",
  passwordVerification: ""
};

export const ForgotPasswordCard = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const email = searchParams.get("email");
  const token = searchParams.get("token");

  const isResetPassword = Boolean(email && token);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [forgotData, setForgotData] = useState<ForgotProps>(INITIAL_FORGOT);
  const [resetData, setResetData] = useState<ResetProps>(INITIAL_RESET);

  const [errors, setErrors] = useState<FormErrors>({});

  const handleForgotBlur = (field: keyof typeof forgotData) => {
    const fullValidation = validateForgot(forgotData);
    setErrors((prev) => ({
      ...prev,
      [field]: fullValidation[field as keyof FormErrors],
    }));
  };

  const handleResetBlur = (field: keyof typeof resetData) => {
    const fullValidation = validateReset(resetData);
    setErrors((prev) => ({
      ...prev,
      [field]: fullValidation[field as keyof FormErrors],
    }));
  };

  const [isLoadingForgot, setLoadingForgot] = useState<boolean>(false)
  const { isOpen: isOpenOtp, onOpenChange: onOpenChangeOtp, onOpen: onOpenOtp, onClose: onCloseRegisterOtp } = useDisclosure();
  const { mutateAsync: mutateForgot } = useForgotPassword();
  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateForgot(forgotData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      addToast({
        description: "Validation failed, Please check your form again",
        color: "danger"
      })
      return false;
    }
    
    setLoadingForgot(true);
    await mutateForgot({
      email: forgotData.email
    }, {
      onSuccess: async (data) => {
        addToast({
          description: data.message,
          color: "success"
        })
        onOpenOtp();
        setLoadingForgot(false)
      },
      onError: (error: AxiosError<ErrorBaseResponse>) => {
        setLoadingForgot(false)
        addToast({
          description: error.response?.data?.message || error.message || "Failed to sign up",
          color: "danger"
        })

        if(error.response?.data?.error) {
          const errorField = error.response?.data?.error
          if (Array.isArray(errorField)) {
            const errorsData: FormErrors = {};

            for (const { field, message } of errorField as {
              field: keyof FormErrors;
              message: string;
            }[]) {
              if (errorsData[field] === undefined) {
                errorsData[field] = message;
              }
            }

            setErrors(errorsData);
          }
        }
      }
    })
  }

  const [otpAuthLoading, setOtpAuthLoading] = useState(false);
  const resendOtp = async () => {   
    setOtpAuthLoading(true);
    await mutateForgot({ email: forgotData.email }, {
      onSuccess: (data) => {
        addToast({
          description: data.message,
          color: "success"
        })
        setTimeout(() => {
          setOtpAuthLoading(false);
        }, 500);
      },
      onError: (error: AxiosError<ErrorBaseResponse>) => {
        setOtpAuthLoading(false);
        addToast({
          description: error.response?.data?.message || error.message || "Failed to resend new otp",
          color: "danger"
        })
      }
    })
  };
  const { mutateAsync: verifyForgot } = useVeiryfyForgot();
  const verifyRegisterOtp = async (otp: string) => {
    setOtpAuthLoading(true);
    await verifyForgot({ email: forgotData.email, otp }, {
      onSuccess: async (data) => {
        addToast({
          title: "🎉 Congratulation",
          description: data.message,
          color: "success"
        })
        setOtpAuthLoading(false);
        router.push(
          `/auth/forgot-password?email=${encodeURIComponent(forgotData.email)}&token=${encodeURIComponent(btoa(otp))}`
        );
        onCloseRegisterOtp();
        setForgotData(INITIAL_FORGOT);
      },
      onError: (error: AxiosError<ErrorBaseResponse>) => {
        setOtpAuthLoading(false);
        addToast({
          description: error.response?.data?.message || error.message || "Failed to verify your otp",
          color: "danger"
        })
      }
    })
  };

  const [isLoadingReset, setLoadingReset] = useState<boolean>(false)
  const { mutateAsync: mutateReset } = useResetPassword();
  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
        email: email || "",
        otp: atob(token || ""),
        password: resetData.password,
        passwordVerification: resetData.passwordVerification
    }
    const validationErrors = validateForgot(payload);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      addToast({
        description: "Validation failed, Please check your form again",
        color: "danger"
      })
      return false;
    }
    
    setLoadingReset(true);
    await mutateReset(payload, {
      onSuccess: async (data) => {
        addToast({
          description: data.message,
          color: "success"
        })
        setLoadingReset(false)
        router.push("/auth")
      },
      onError: (error: AxiosError<ErrorBaseResponse>) => {
        setLoadingReset(false)
        addToast({
          description: error.response?.data?.message || error.message || "Failed to sign up",
          color: "danger"
        })

        if(error.response?.data?.error) {
          const errorField = error.response?.data?.error
          if (Array.isArray(errorField)) {
            const errorsData: FormErrors = {};

            for (const { field, message } of errorField as {
              field: keyof FormErrors;
              message: string;
            }[]) {
              if (errorsData[field] === undefined) {
                errorsData[field] = message;
              }
            }

            setErrors(errorsData);
          }
        }
      }
    })
  }

  return (
    <>
      <OTPModalCard
        isOpen={isOpenOtp}
        onOpenChange={() => {
          onOpenChangeOtp();
        }}
        resendOtp={resendOtp}
        isLoading={otpAuthLoading}
        handleSet={(otp: string) => verifyRegisterOtp(otp)}
      />
      <div className="perspective-1000 relative w-full">
        {isResetPassword ? (
          <div className="backface-hidden w-full rounded-2xl border border-[#F3E2DC] bg-white/90 md:p-8 sm:p-6 p-4 shadow-xl backdrop-blur-md">
            <div className="mb-6 text-center">
              <h2 className="text-2xl font-bold text-[#2D2120]">
                Reset Your Password
              </h2>
              <p className="text-xs text-[#7A6664]">
                Create a new password to secure your account.
              </p>
            </div>
            
            <form onSubmit={handleResetSubmit} className="flex flex-col gap-4">
              <Input
                label="Password"
                placeholder="Enter your new password"
                variant="bordered"
                isInvalid={!!errors.password}
                errorMessage={errors.password}
                value={resetData.password}
                onBlur={() => handleResetBlur("password")}
                onChange={(e) => setResetData({ ...resetData, password: e.target.value })}
                type={showPassword ? "text" : "password"}
                endContent={
                  <Button type="button" onPress={() => setShowPassword(!showPassword)} isIconOnly size="sm" className="bg-transparent text-primary">
                    {showPassword ? <Eye size={16} /> : <EyeClosed size={16} />}
                  </Button>
                }
                classNames={{
                  inputWrapper: "border-[#F3E2DC] focus-within:!border-[#FF5E3A]",
                }}
              />
              <Input
                label="Password Verification"
                placeholder="Enter your password verification"
                variant="bordered"
                isInvalid={!!errors.passwordVerification}
                errorMessage={errors.passwordVerification}
                value={resetData.passwordVerification}
                onBlur={() => handleResetBlur("passwordVerification")}
                onChange={(e) => setResetData({ ...resetData, passwordVerification: e.target.value })}
                type={showConfirmPassword ? "text" : "password"}
                endContent={
                  <Button type="button" onPress={() => setShowConfirmPassword(!showConfirmPassword)} isIconOnly size="sm" className="bg-transparent text-primary">
                    {showConfirmPassword ? <Eye size={16} /> : <EyeClosed size={16} />}
                  </Button>
                }
                classNames={{
                  inputWrapper: "border-[#F3E2DC] focus-within:!border-[#FF5E3A]",
                }}
              />
            
              <Button
                type="submit"
                isLoading={isLoadingReset}
                disabled={isLoadingReset}
                className="mt-2 relative h-12 w-full overflow-hidden bg-[#FF5E3A] font-semibold text-white shadow-md hover:bg-[#FF5E3A]/90"
              >
                {isLoadingReset ? "Loading ..." : "Submit"}
              </Button>

              <div className="mt-4 text-center">
                <Link
                  href="/auth"
                  className="text-xs font-medium text-[#7A6664] transition-colors hover:text-[#FF5E3A]"
                >
                  ← Back to Login
                </Link>
              </div>
            </form>
          </div>
        ) : (
          <div className="backface-hidden w-full rounded-2xl border border-[#F3E2DC] bg-white/90 md:p-8 sm:p-6 p-4 shadow-xl backdrop-blur-md">
            <div className="mb-6 text-center">
              <h2 className="text-2xl font-bold text-[#2D2120]">
                Forgot Your Password?
              </h2>
              <p className="text-xs text-[#7A6664]">
                Enter your email address and we&apos;ll send you a link to reset your password.
              </p>
            </div>
            
            <form onSubmit={handleForgotSubmit} className="flex flex-col gap-4">
              <Input
                type="email"
                label="Email Address"
                placeholder="name@example.com"
                variant="bordered"
                isInvalid={!!errors.email}
                errorMessage={errors.email}
                value={forgotData.email}
                onBlur={() => handleForgotBlur("email")}
                onChange={(e) => setForgotData({ ...forgotData, email: e.target.value })}
                classNames={{
                  inputWrapper: "border-[#F3E2DC] focus-within:!border-[#FF5E3A]",
                }}
              />
            
              <Button
                type="submit"
                isLoading={isLoadingForgot}
                disabled={isLoadingForgot}
                className="mt-2 relative h-12 w-full overflow-hidden bg-[#FF5E3A] font-semibold text-white shadow-md hover:bg-[#FF5E3A]/90"
              >
                {isLoadingForgot ? "Loading ..." : "Submit"}
              </Button>

              <div className="mt-4 text-center">
                <Link
                  href="/auth"
                  className="text-xs font-medium text-[#7A6664] transition-colors hover:text-[#FF5E3A]"
                >
                  ← Back to Login
                </Link>
              </div>
            </form>
          </div>
        )}
      </div>
    </>
  );
};