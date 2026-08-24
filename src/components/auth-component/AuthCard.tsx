"use client";

import React, { useCallback, useEffect, useState } from "react";
import { Input, Button, Divider, addToast, Spinner, cn, Modal, ModalContent, ModalBody, InputOtp, ModalHeader, ModalFooter, useDisclosure } from "@heroui/react";
import { useRouter } from "next/navigation";
import { FormErrors, validateLogin, validateRegister } from "@/validations/auth.validation";
import { useCaptchaGenerate } from "@/services/captcha";
import Image from "next/image";
import { CheckCircle2, Clock3, Eye, EyeClosed, RefreshCw, ShieldCheck } from "lucide-react";
import { useRequestSignUp, useSignUp, useVeiryfySignUp } from "@/services/auth";
import { AxiosError } from "axios";
import { ErrorBaseResponse } from "@/interfaces/base.interface";

interface CaptchaData {
  token: string;
  image: string;
}

interface LoginProps {
  email: string;
  password: string;
  captchaToken: string;
  captchaAnswer: string;
}

interface RegisterProps {
  name: string;
  email: string;
  password: string;
  passwordVerification: string;
  captchaToken: string;
  captchaAnswer: string;
}

const INITIAL_LOGIN_FORM: LoginProps = {
  email: "",
  password: "",
  captchaToken: "",
  captchaAnswer: "",
};

const INITIAL_REGISTER_FORM: RegisterProps = {
  name: "",
  email: "",
  password: "",
  passwordVerification: "",
  captchaToken: "",
  captchaAnswer: "",
};

export function AuthCard() {
  const router = useRouter();
  const [isFlipped, setIsFlipped] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [captcha, setCaptcha] = useState<CaptchaData | null>(null);

  // Animasi States
  const [loginStatus, setLoginStatus] = useState<"idle" | "loading" | "error" | "success">("idle");
  const [registerStatus, setRegisterStatus] = useState<"idle" | "loading" | "success">("idle");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form States
  const [authEmail, setAuthEmail] = useState("");
  const [loginData, setLoginData] = useState<LoginProps>(INITIAL_LOGIN_FORM);
  const [registerData, setRegisterData] = useState<RegisterProps>(INITIAL_REGISTER_FORM);

  const [errors, setErrors] = useState<FormErrors>({});

  // Trigger Toast Notification
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // OnBlur Validation Handlers
  const handleLoginBlur = (field: keyof typeof loginData) => {
    const fullValidation = validateLogin(loginData);
    setErrors((prev) => ({
      ...prev,
      [field]: fullValidation[field as keyof FormErrors],
    }));
  };
  const handleRegisterBlur = (field: keyof typeof registerData) => {
    const fullValidation = validateRegister(registerData);
    setErrors((prev) => ({
      ...prev,
      [field]: fullValidation[field as keyof FormErrors],
    }));
  };

  // captcha
  const [captchaLoading, setCaptchaLoading] = useState(false)
  const { mutateAsync: mutateCaptcha } = useCaptchaGenerate();
  const fetchCaptcha = useCallback(async () => {
    setCaptchaLoading(true);

    try {
      await mutateCaptcha(null, {
        onSuccess: (data) => {
          const response = data.data;

          setCaptcha({
            token: response.captchaToken,
            image: response.base64Svg,
          });
        },
      });
    } catch {
      addToast({
        description: "Unable to load captcha. Please try again.",
        color: "warning"
      })
    } finally {
      setCaptchaLoading(false);
    }
  }, [mutateCaptcha]);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchCaptcha();
  }, [fetchCaptcha]);

  // Flip Toggle
  const handleToggleFlip = () => {
    setErrors({});
    setLoginStatus("idle");
    setRegisterStatus("idle");
    setIsFlipped(!isFlipped);
    setShowPassword(false);
    setShowConfirmPassword(false);
    fetchCaptcha();
  };

  // Submit Handlers
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateLogin(loginData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      // Trigger stickman hit door and bounce back
      setLoginStatus("loading");
      setTimeout(() => {
        setLoginStatus("error");
        setTimeout(() => setLoginStatus("idle"), 800);
      }, 600);
      return;
    }

    // Login Success Animation Sequence
    setLoginStatus("loading");
    setTimeout(() => {
      showToast("🎉 Congratulations! Welcome back!");
      setTimeout(() => {
        setLoginStatus("idle");
        // router.push("/dashboard");
      }, 1500);
    }, 1000);
  };


  // register -> otp
  const { isOpen: isOpenRegisterOtp, onOpenChange: onOpenChangeRegisterOtp, onOpen: onOpenRegisterOtp } = useDisclosure();
  const [otpRegisterLoading, setOtpRegisterLoading] = useState(false);
  const { mutateAsync: mutateSignUp } = useSignUp();
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateRegister(registerData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      addToast({
        description: "Validation failed, Please check your form again",
        color: "danger"
      })
      return false;
    }
    
    setRegisterStatus("loading");
    await mutateSignUp({
      name: registerData.name,
      email: registerData.email,
      password: registerData.password,
      passwordVerification: registerData.passwordVerification,
      captchaToken: captcha?.token || "",
      captchaAnswer: registerData.captchaAnswer
    }, {
      onSuccess: (data) => {
        addToast({
          title: "🚀 Account created successfully!",
          description: data.message,
          color: "success"
        })
        setAuthEmail(registerData.email)
        fetchCaptcha();
        setTimeout(() => {
          setRegisterData(INITIAL_REGISTER_FORM)
          onOpenRegisterOtp()
          setRegisterStatus("idle");
        }, 500);
      },
      onError: (error: AxiosError<ErrorBaseResponse>) => {
        setRegisterStatus("idle");
        fetchCaptcha();
        addToast({
          description: error.response?.data?.message || error.message || "Failed to sign up",
          color: "danger"
        })

        if(error.response?.data?.error) {
          const errorField = error.response?.data?.error
          if (Array.isArray(errorField)) {
            const errorsData: FormErrors = {};

            errorField.forEach(
              ({ field, message }: { field: keyof FormErrors; message: string }) => {
                errorsData[field] = errorsData[field]
                  ? `${errorsData[field]}\n${message}`
                  : message;
              },
            );

            setErrors(errorsData);
          }
        }
      }
    })
  };
  const { mutateAsync: mutateRequestSignUp } = useRequestSignUp();
  const resendOtp = async () => {
    
    setOtpRegisterLoading(true);
    await mutateRequestSignUp({ email: authEmail }, {
      onSuccess: (data) => {
        addToast({
          description: data.message,
          color: "success"
        })
        setTimeout(() => {
          setOtpRegisterLoading(false);
        }, 500);
      },
      onError: (error: AxiosError<ErrorBaseResponse>) => {
        setOtpRegisterLoading(false);
        addToast({
          description: error.response?.data?.message || error.message || "Failed to sign up",
          color: "danger"
        })
      }
    })
  };
  const { mutateAsync: mutateVerifySignUp } = useVeiryfySignUp();
  const verifyRegisterOtp = async (otp: string) => {
    
    setOtpRegisterLoading(true);
    await mutateVerifySignUp({ email: authEmail, otp }, {
      onSuccess: (data) => {
        addToast({
          title: "Congratulation",
          description: data.message,
          color: "success"
        })
        setIsFlipped(!isFlipped)
        setErrors({})
        setTimeout(() => {
          setOtpRegisterLoading(false);
          setAuthEmail("");
          onOpenChangeRegisterOtp();
        }, 500);
      },
      onError: (error: AxiosError<ErrorBaseResponse>) => {
        setOtpRegisterLoading(false);
        addToast({
          description: error.response?.data?.message || error.message || "Failed to sign up",
          color: "danger"
        })
      }
    })
  };

  return (
    <>
      <OTPCard
        isOpen={isOpenRegisterOtp}
        onOpenChange={onOpenChangeRegisterOtp}
        resendOtp={resendOtp}
        isLoading={otpRegisterLoading}
        handleSet={(otp: string) => verifyRegisterOtp(otp)}
      />
      <div className="perspective-1000 relative w-full">
        <div
          className={`flip-card-inner transform-style-3d relative w-full ${
            isFlipped ? "flipped" : ""
          }`}
        >
          {/* ==================================================
              FRONT SIDE: LOGIN FORM
          ================================================== */}
          <div className="backface-hidden w-full rounded-2xl border border-[#F3E2DC] bg-white/90 md:p-8 sm:p-6 p-4 shadow-xl backdrop-blur-md">
            <div className="mb-6 text-center">
              <h2 className="text-2xl font-bold text-[#2D2120]">Welcome Back!</h2>
              <p className="text-xs text-[#7A6664]">Enter your credentials to continue</p>
            </div>

            <form onSubmit={handleLoginSubmit} className="flex flex-col gap-4">
              <Input
                type="email"
                label="Email Address"
                placeholder="name@example.com"
                variant="bordered"
                isInvalid={!!errors.email}
                errorMessage={errors.email}
                value={loginData.email}
                onBlur={() => handleLoginBlur("email")}
                onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                classNames={{
                  inputWrapper: "border-[#F3E2DC] focus-within:!border-[#FF5E3A]",
                }}
              />

              <Input
                label="Password"
                placeholder="Enter your password"
                variant="bordered"
                isInvalid={!!errors.password}
                errorMessage={errors.password}
                value={loginData.password}
                onBlur={() => handleLoginBlur("password")}
                onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                type={showPassword ? "text" : "password"}
                endContent={
                  <Button onPress={() => setShowPassword(!showPassword)} isIconOnly size="sm" className="bg-transparent text-primary">
                    {showPassword ? <Eye size={16} /> : <EyeClosed size={16} />}
                  </Button>
                }
                classNames={{
                  inputWrapper: "border-[#F3E2DC] focus-within:!border-[#FF5E3A]",
                }}
              />

              {/* Captcha Field */}
              <div className={cn("rounded-xl border border-[#F3E2DC] p-3", { "border-danger": errors.captchaAnswer })}>
                <div className="mb-2 flex items-center justify-between">
                  <div>
                    <p className="text-[9px] uppercase tracking-[0.16em] text-foreground">
                      Security check
                    </p>
          
                    <p className="mt-1 text-xs text-muted">
                      Solve the captcha to continue.
                    </p>
                  </div>
          
                  <Button
                    isIconOnly
                    size="sm"
                    variant="light"
                    type="button"
                    onPress={fetchCaptcha}
                    isDisabled={captchaLoading}
                    aria-label="Refresh captcha"
                    color="primary"
                  >
                    <RefreshCw
                      className={`h-3.5 w-3.5 ${
                        captchaLoading ? "animate-spin" : ""
                      }`}
                    />
                  </Button>
                </div>
          
                <div className="flex gap-2 items-center">
                  <div className="flex h-10 items-center overflow-hidden rounded-lg border border-border overflow-hidden">
                    {captchaLoading ? (
                      <div className="flex w-full items-center justify-center p-1">
                        <Spinner size="sm" />
                      </div>
                    ) : captcha?.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={captcha.image}
                        alt="captcha-image"
                        className="object-contain rounded-xl h-10 w-auto"
                        loading="lazy"
                      />
                    ) : (
                      <div className="text-xs italic text-error-text bg-error-bg text-center py-1 px-2">
                        Captcha Error
                      </div>
                    )}
                  </div>
          
                  <Input
                    type="text"
                    inputMode="numeric"
                    radius="sm"
                    autoComplete="off"
                    isInvalid={!!errors.captchaAnswer}
                    value={loginData.captchaAnswer}
                    onBlur={() => handleLoginBlur("captchaAnswer")}
                    onChange={(e) => setLoginData({ ...loginData, captchaAnswer: e.target.value })}
                    placeholder="Answer"
                    variant="bordered"
                    classNames={{
                      inputWrapper: "border-[#F3E2DC] focus-within:!border-[#FF5E3A]",
                    }}
                  />
                </div>
                {errors.captchaAnswer && ( <small className="italic text-danger text-xs">{errors.captchaAnswer}</small> )}
              </div>

              {/* Button with Animated Stickman & Door Scene */}
              <Button
                type="submit"
                disabled={loginStatus !== "idle"}
                className="mt-2 relative h-12 w-full overflow-hidden bg-[#FF5E3A] font-semibold text-white shadow-md hover:bg-[#FF5E3A]/90"
              >
                {loginStatus === "idle" && "Sign In"}

                {loginStatus !== "idle" && (
                  <div className="flex items-center justify-center gap-6 h-full w-full">
                    {/* Stickman Graphic */}
                    <div
                      className={`transition-all duration-300 ${
                        loginStatus === "loading" ? "animate-stickman-run" : ""
                      } ${loginStatus === "error" ? "animate-stickman-bounce" : ""}`}
                    >
                      <svg className="h-6 w-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="5" r="3" />
                        <line x1="12" y1="8" x2="12" y2="16" />
                        <line x1="12" y1="11" x2="8" y2="14" />
                        <line x1="12" y1="11" x2="16" y2="14" />
                        <line x1="12" y1="16" x2="9" y2="21" />
                        <line x1="12" y1="16" x2="15" y2="21" />
                      </svg>
                    </div>

                    {/* Door Graphic */}
                    <div className="relative h-7 w-5 border-2 border-white rounded-sm bg-white/20">
                      <div
                        className={`h-full w-full bg-white transition-transform ${
                          loginStatus === "success" ? "animate-door-open" : ""
                        }`}
                      />
                    </div>
                  </div>
                )}
              </Button>
            </form>

            <div className="my-5 flex items-center gap-3">
              <Divider className="flex-1 bg-[#F3E2DC]" />
              <span className="text-[10px] text-[#7A6664]">OR</span>
              <Divider className="flex-1 bg-[#F3E2DC]" />
            </div>

            <Button
              variant="bordered"
              className="w-full border-[#F3E2DC] font-medium text-[#2D2120] hover:bg-neutral-50"
              startContent={
                <svg className="h-4 w-4" viewBox="0 0 24 24">
                  <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.3 9 5 12 5z" />
                  <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z" />
                  <path fill="#FBBC05" d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12 0 14.8s.7 5.1 1.9 7.5l3.7-2.9c-.6-.8-1-1.8-1-2.9z" />
                  <path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.3-6.4-5.2L1.9 16C3.7 19.7 7.5 23 12 23z" />
                </svg>
              }
            >
              Continue with Google
            </Button>

            <p className="mt-6 text-center text-xs text-[#7A6664]">
              Don&apos;t have an account?{" "}
              <button onClick={handleToggleFlip} className="font-semibold text-[#FF5E3A] hover:underline">
                Sign Up
              </button>
            </p>
          </div>

          {/* ==================================================
              BACK SIDE: REGISTER FORM
          ================================================== */}
          <div className="backface-hidden rotate-y-180 absolute inset-0 h-full w-full rounded-2xl border border-[#F3E2DC] bg-white/90 p-8 shadow-xl backdrop-blur-md">
            <div className="mb-4 text-center">
              <h2 className="text-2xl font-bold text-[#2D2120]">Create Account</h2>
              <p className="text-xs text-[#7A6664]">Join us today in a few steps</p>
            </div>

            <form onSubmit={handleRegisterSubmit} className="flex flex-col gap-3">
              <Input
                type="text"
                label="Full Name"
                placeholder="John Doe"
                variant="bordered"
                isInvalid={!!errors.name}
                errorMessage={errors.name}
                value={registerData.name}
                onBlur={() => handleRegisterBlur("name")}
                onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                classNames={{
                  inputWrapper: "border-[#F3E2DC] focus-within:!border-[#FF5E3A]",
                }}
              />

              <Input
                type="email"
                label="Email Address"
                placeholder="name@example.com"
                variant="bordered"
                isInvalid={!!errors.email}
                errorMessage={errors.email}
                value={registerData.email}
                onBlur={() => handleRegisterBlur("email")}
                onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                classNames={{
                  inputWrapper: "border-[#F3E2DC] focus-within:!border-[#FF5E3A]",
                }}
              />

              <Input
                label="Password"
                placeholder="Password"
                variant="bordered"
                isInvalid={!!errors.password}
                errorMessage={errors.password}
                value={registerData.password}
                type={showPassword ? "text" : "password"}
                endContent={
                  <Button onPress={() => setShowPassword(!showPassword)} isIconOnly size="sm" className="bg-transparent text-primary">
                    {showPassword ? <Eye size={16} /> : <EyeClosed size={16} />}
                  </Button>
                }
                onBlur={() => handleRegisterBlur("password")}
                onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                classNames={{
                  inputWrapper: "border-[#F3E2DC] focus-within:!border-[#FF5E3A]",
                }}
              />
              <Input
                label="Password Verification"
                placeholder="Password Verification"
                variant="bordered"
                isInvalid={!!errors.passwordVerification}
                errorMessage={errors.passwordVerification}
                value={registerData.passwordVerification}
                onBlur={() => handleRegisterBlur("passwordVerification")}
                onChange={(e) =>
                  setRegisterData({ ...registerData, passwordVerification: e.target.value })
                }
                type={showConfirmPassword ? "text" : "password"}
                endContent={
                  <Button onPress={() => setShowConfirmPassword(!showConfirmPassword)} isIconOnly size="sm" className="bg-transparent text-primary">
                    {showConfirmPassword ? <Eye size={16} /> : <EyeClosed size={16} />}
                  </Button>
                }
                classNames={{
                  inputWrapper: "border-[#F3E2DC] focus-within:!border-[#FF5E3A]",
                }}
              />

              {/* Captcha Field */}
              <div className={cn("rounded-xl border border-[#F3E2DC] p-3", { "border-danger": errors.captchaAnswer })}>
                <div className="mb-2 flex items-center justify-between">
                  <div>
                    <p className="text-[9px] uppercase tracking-[0.16em] text-foreground">
                      Security check
                    </p>
          
                    <p className="mt-1 text-xs text-muted">
                      Solve the captcha to continue.
                    </p>
                  </div>
          
                  <Button
                    isIconOnly
                    size="sm"
                    variant="light"
                    type="button"
                    onPress={fetchCaptcha}
                    isDisabled={captchaLoading}
                    aria-label="Refresh captcha"
                    color="primary"
                  >
                    <RefreshCw
                      className={`h-3.5 w-3.5 ${
                        captchaLoading ? "animate-spin" : ""
                      }`}
                    />
                  </Button>
                </div>
          
                <div className="flex gap-2 items-center">
                  <div className="flex h-10 items-center overflow-hidden rounded-lg border border-border overflow-hidden">
                    {captchaLoading ? (
                      <div className="flex w-full items-center justify-center p-1">
                        <Spinner size="sm" />
                      </div>
                    ) : captcha?.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={captcha.image}
                        alt="captcha-image"
                        className="object-contain rounded-xl h-10 w-auto"
                        loading="lazy"
                      />
                    ) : (
                      <div className="text-xs italic text-error-text bg-error-bg text-center py-1 px-2">
                        Captcha Error
                      </div>
                    )}
                  </div>
          
                  <Input
                    type="text"
                    inputMode="numeric"
                    radius="sm"
                    autoComplete="off"
                    isInvalid={!!errors.captchaAnswer}
                    value={registerData.captchaAnswer}
                    onBlur={() => handleRegisterBlur("captchaAnswer")}
                    onChange={(e) => setRegisterData({ ...registerData, captchaAnswer: e.target.value })}
                    placeholder="Answer"
                    variant="bordered"
                    classNames={{
                      inputWrapper: "border-[#F3E2DC] focus-within:!border-[#FF5E3A]",
                    }}
                  />
                </div>
                {errors.captchaAnswer && ( <small className="italic text-danger text-xs">{errors.captchaAnswer}</small> )}
              </div>

              {/* Register Button with Rocket Launch Animation */}
              <Button
                type="submit"
                isDisabled={registerStatus !== "idle"}
                className="mt-1 relative h-11 w-full overflow-hidden bg-[#FF5E3A] font-semibold text-white shadow-md hover:bg-[#FF5E3A]/90"
              >
                {registerStatus === "idle" && "Register Now"}
                {registerStatus !== "idle" && (
                  <div className="flex items-center justify-center gap-2 animate-rocket">
                    <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.5s-4.5 4.5-4.5 10.5c0 2.5 1 4.5 2 5.5l-1.5 3 4-1.5 4 1.5-1.5-3c1-1 2-3 2-5.5 0-6-4.5-10.5-4.5-10.5z" />
                    </svg>
                    <span>Launching...</span>
                  </div>
                )}
              </Button>
            </form>

            <p className="mt-4 text-center text-xs text-[#7A6664]">
              Already have an account?{" "}
              <button onClick={handleToggleFlip} className="font-semibold text-[#FF5E3A] hover:underline cursor-pointer">
                Sign In
              </button>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

const INITIAL_COOLDOWN = 30;
const COOLDOWN_STEP = 30;
const MAX_COOLDOWN = 5 * 60;

export const OTPCard = ({
  isOpen,
  onOpenChange,
  handleSet,
  resendOtp,
  isLoading,
}: {
  isOpen: boolean;
  onOpenChange: () => void;
  handleSet: (otp: string) => void;
  resendOtp: () => void;
  isLoading: boolean;
}) => {
  const [otp, setOtp] = useState("");
  const [cooldown, setCooldown] = useState(INITIAL_COOLDOWN);
  const [resendCount, setResendCount] = useState(0);

  useEffect(() => {
    if (!isOpen) return;

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOtp("");
    setCooldown(INITIAL_COOLDOWN);
    setResendCount(0);
  }, [isOpen]);

  /**
   * Countdown timer.
   *
   * The timer only runs while the modal is open
   * and there is an active cooldown.
   */
  useEffect(() => {
    if (!isOpen || cooldown <= 0) return;

    const timer = window.setInterval(() => {
      setCooldown((current) => Math.max(current - 1, 0));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [isOpen, cooldown]);

  const handleClose = () => {
    setOtp("");
    setCooldown(INITIAL_COOLDOWN);
    setResendCount(0);

    onOpenChange();
  };

  const handleSubmit = () => {
    if (otp.length !== 6 || isLoading) return;

    handleSet(otp);
  };

  const handleResend = () => {
    if (isLoading || cooldown > 0) return;

    setOtp("");

    const nextResendCount = resendCount + 1;

    const nextCooldown = Math.min(
      nextResendCount * COOLDOWN_STEP,
      MAX_COOLDOWN,
    );

    setResendCount(nextResendCount);
    setCooldown(nextCooldown);

    resendOtp();
  };

  const formatCooldown = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    return `${minutes}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={handleClose}
      placement="center"
      size="sm"
      backdrop="blur"
      classNames={{
        base: "border border-divider bg-background shadow-2xl",
        backdrop: "bg-black/50 backdrop-blur-sm",
      }}
    >
      <ModalContent>
        <>
          <ModalHeader className="flex flex-col items-center gap-4 pt-8 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <ShieldCheck size={28} strokeWidth={2} />
            </div>

            <div className="space-y-1.5">
              <h2 className="text-xl font-semibold tracking-tight">
                Verify Your OTP
              </h2>

              <p className="max-w-[280px] text-sm font-normal leading-relaxed text-default-500">
                Enter the 6-digit verification code we sent to you.
              </p>
            </div>
          </ModalHeader>

          <ModalBody className="px-6 pb-3">
            <div className="flex flex-col items-center gap-5">
              <InputOtp
                length={6}
                value={otp}
                onValueChange={setOtp}
                variant="bordered"
                radius="lg"
                isDisabled={isLoading}
              />

              <div className="flex items-center gap-2 text-xs text-default-400">
                <Clock3 size={14} />

                <span>
                  Your OTP is valid for a few minutes.
                </span>
              </div>
            </div>
          </ModalBody>

          <ModalFooter className="flex-col gap-3 px-6 pb-7">
            <Button
              fullWidth
              color="primary"
              size="lg"
              radius="lg"
              isLoading={isLoading}
              isDisabled={otp.length !== 6}
              startContent={
                !isLoading ? (
                  <CheckCircle2 size={18} />
                ) : undefined
              }
              onPress={handleSubmit}
            >
              Verify Code
            </Button>

            <Button
              variant="light"
              size="sm"
              isDisabled={isLoading || cooldown > 0}
              onPress={handleResend}
            >
              {cooldown > 0
                ? `Resend code in ${formatCooldown(cooldown)}`
                : "Resend code"}
            </Button>
          </ModalFooter>
        </>
      </ModalContent>
    </Modal>
  );
};