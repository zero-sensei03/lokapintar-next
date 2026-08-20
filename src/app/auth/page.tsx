"use client";

import { ArrowRight, Check, Eye, EyeOff, Lock, Mail, RefreshCw, User } from "lucide-react";
import { animate, createTimeline } from "animejs";
import { FormEvent, ReactNode, useCallback, useEffect, useRef, useState } from "react";
import { AuthMode } from "@/interfaces/auth.interface";
import { ModeSwitcher } from "@/components/auth-component/ModeSwitcher";
import { useCaptchaGenerate } from "@/services/captcha";
import Image from "next/image";

interface AuthForm {
  name: string;
  email: string;
  password: string;
  passwordVerification: string;
  captchaToken: string;
  captchaAnswer: string;
}

interface CaptchaData {
  token: string;
  image: string;
}

const INITIAL_FORM: AuthForm = {
  name: "",
  email: "",
  password: "",
  passwordVerification: "",
  captchaAnswer: "",
  captchaToken: ""
};


export default function AuthPage() {
  const cardRef = useRef<HTMLDivElement>(null);

  const [mode, setMode] = useState<AuthMode>("login");
  const [form, setForm] = useState<AuthForm>(INITIAL_FORM);
  const [captcha, setCaptcha] = useState<CaptchaData | null>(null);
  const [captchaLoading, setCaptchaLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showpasswordVerification, setShowpasswordVerification] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    const card = cardRef.current;

    if (!card) {
      return;
    }

    const timeline = createTimeline({
      defaults: {
        ease: "out(4)",
      },
    });

    timeline
      .add(
        card,
        {
          opacity: {
            from: 0,
            to: 1,
          },
          translateY: {
            from: 40,
            to: 0,
          },
          scale: {
            from: 0.97,
            to: 1,
          },
          duration: 850,
          ease: "out(5)",
        },
        "-=400",
      );

    return () => {
      timeline.pause();
    };
  }, []);

  const { mutateAsync: mutateCaptcha } = useCaptchaGenerate();

  const fetchCaptcha = useCallback(async () => {
    setCaptchaLoading(true);
    setError("");

    try {
      await mutateCaptcha(null,
        {
          onSuccess: (data) => {
            const res = data.data;
            setCaptcha({
              token: res.captchaToken,
              image: res.base64Svg
            })
          }
        }
      )

    } catch {
      setError(
        "Unable to load captcha. Please try again.",
      );
    } finally {
      setCaptchaLoading(false);
    }
  }, [mutateCaptcha]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchCaptcha();
  }, [fetchCaptcha]);

  const changeMode = (nextMode: AuthMode) => {
    if (nextMode === mode) {
      return;
    }

    setMode(nextMode);
    setError("");
    setSuccess("");
    setShowPassword(false);
    setShowpasswordVerification(false);

    animate(".auth-content", {
      opacity: [
        {
          to: 0,
          duration: 120,
        },
        {
          to: 1,
          duration: 350,
        },
      ],
      translateX: [
        {
          from:
            nextMode === "login"
              ? "15px"
              : "-15px",
          to: "0px",
        },
      ],
      ease: "out(4)",
    });
  };

  const updateField = (
    field: keyof AuthForm,
    value: string,
  ) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));

    if (error) {
      setError("");
    }

    if (success) {
      setSuccess("");
    }
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!captcha) {
      setError("Captcha is not available.");
      return;
    }

    if (!form.email.trim()) {
      setError("Email is required.");
      return;
    }

    if (!form.password) {
      setError("Password is required.");
      return;
    }

    if (!form.captchaAnswer.trim()) {
      setError("Please answer the captcha.");
      return;
    }

    if (mode === "register") {
      if (!form.name.trim()) {
        setError("Name is required.");
        return;
      }

      if (form.password.length < 8) {
        setError(
          "Password must contain at least 8 characters.",
        );
        return;
      }

      if (
        form.password !== form.passwordVerification
      ) {
        setError(
          "Password confirmation does not match.",
        );
        return;
      }
    }

    setLoading(true);

    try {
      const endpoint =
        mode === "login"
          ? "/auth/login"
          : "/auth/register";

      const payload =
        mode === "login"
          ? {
              email: form.email,
              password: form.password,
              captchaToken: captcha.token,
              captchaAnswer: form.captchaAnswer,
              rememberMe,
            }
          : {
              name: form.name,
              email: form.email,
              password: form.password,
              captchaToken: captcha.token,
              captchaAnswer: form.captchaAnswer,
            };

      // const response = await fetch(
      //   `${API_URL}${endpoint}`,
      //   {
      //     method: "POST",
      //     credentials: "include",
      //     headers: {
      //       "Content-Type": "application/json",
      //       Accept: "application/json",
      //     },
      //     body: JSON.stringify(payload),
      //   },
      // );

      // const result = await response.json();

      // if (!response.ok) {
      //   throw new Error(
      //     result.message ??
      //       "Authentication failed.",
      //   );
      // }

      setSuccess(
        mode === "login"
          ? "Welcome back."
          : "Your account has been created.",
      );

      await fetchCaptcha();

      setForm((previous) => ({
        ...previous,
        password: "",
        passwordVerification: "",
        captchaAnswer: "",
      }));
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Something went wrong.",
      );

      await fetchCaptcha();
    } finally {
      setLoading(false);
    }
  };

  /* ==========================================================
     GOOGLE
  ========================================================== */

  const handleGoogleLogin = () => {
    // window.location.href =
    //   `${API_URL}/auth/google`;
  };

  /* ==========================================================
     RENDER
  ========================================================== */

  return (
    <div
      ref={cardRef}
      className="auth-card relative overflow-hidden rounded-[28px] border border-[#1A3021] bg-[#0A120D]"
    >
      <div className="border-b border-[#14271B] px-6 pt-6 sm:px-8 sm:pt-8">
        <ModeSwitcher
          mode={mode}
          onChange={changeMode}
        />
      </div>

      <div className="auth-content px-6 pb-6 pt-6 sm:px-8 sm:pb-8">
        <div>
          <h2 className="text-xl font-semibold text-[#ECFDF5]">
            {mode === "login"
              ? "Welcome back."
              : "Create your account."}
          </h2>

          <p className="mt-2 text-sm text-[#587163]">
            {mode === "login"
              ? "Enter your credentials to continue."
              : "Start your journey with us today."}
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-7 space-y-4"
        >
          {mode === "register" && (
            <AuthInput
              icon={<User />}
              label="Full name"
              placeholder="John Doe"
              value={form.name}
              onChange={(value) =>
                updateField("name", value)
              }
            />
          )}

          <AuthInput
            icon={<Mail />}
            label="Email address"
            type="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={(value) =>
              updateField("email", value)
            }
          />

          <AuthInput
            icon={<Lock />}
            label="Password"
            type={
              showPassword
                ? "text"
                : "password"
            }
            placeholder="••••••••"
            value={form.password}
            onChange={(value) =>
              updateField("password", value)
            }
            action={
              <button
                type="button"
                onClick={() =>
                  setShowPassword(
                    (value) => !value,
                  )
                }
                className="text-[#527565] transition-colors hover:text-[#A7F3D0]"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            }
          />

          {mode === "register" && (
            <AuthInput
              icon={<Lock />}
              label="Confirm password"
              type={
                showpasswordVerification
                  ? "text"
                  : "password"
              }
              placeholder="••••••••"
              value={form.passwordVerification}
              onChange={(value) =>
                updateField(
                  "passwordVerification",
                  value,
                )
              }
              action={
                <button
                  type="button"
                  onClick={() =>
                    setShowpasswordVerification(
                      (value) => !value,
                    )
                  }
                  className="text-[#527565] transition-colors hover:text-[#A7F3D0]"
                >
                  {showpasswordVerification ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              }
            />
          )}

          {/* CAPTCHA */}

          <Captcha
            captcha={captcha}
            answer={form.captchaAnswer}
            loading={captchaLoading}
            onChange={(value) =>
              updateField(
                "captchaAnswer",
                value,
              )
            }
            onRefresh={fetchCaptcha}
          />

          {/* LOGIN OPTIONS */}

          {mode === "login" && (
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setRememberMe(
                      (value) => !value,
                    )
                  }
                  className={`flex h-4 w-4 items-center justify-center rounded border ${
                    rememberMe
                      ? "border-[#22C55E] bg-[#22C55E]"
                      : "border-[#294735] bg-transparent"
                  }`}
                >
                  {rememberMe && (
                    <Check className="h-3 w-3 text-[#041008]" />
                  )}
                </button>

                <span className="text-xs text-[#5B7465]">
                  Remember me
                </span>
              </label>

              <button
                type="button"
                className="text-xs text-[#4ADE80] hover:text-[#86EFAC]"
              >
                Forgot password?
              </button>
            </div>
          )}

          {/* ERROR */}

          {error && (
            <div className="rounded-xl border border-[#5A2828] bg-[#1D1010] px-3 py-2.5 text-xs text-[#FCA5A5]">
              {error}
            </div>
          )}

          {/* SUCCESS */}

          {success && (
            <div className="rounded-xl border border-[#245D39] bg-[#0E2115] px-3 py-2.5 text-xs text-[#86EFAC]">
              {success}
            </div>
          )}

          {/* SUBMIT */}

          <SubmitButton
            mode={mode}
            loading={loading}
          />
        </form>

        {/* GOOGLE */}

        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-[#17291E]" />

          <span className="text-[9px] uppercase tracking-[0.2em] text-[#405748]">
            or
          </span>

          <div className="h-px flex-1 bg-[#17291E]" />
        </div>

        <button
          type="button"
          onClick={handleGoogleLogin}
          className="flex h-12 w-full items-center justify-center gap-3 rounded-xl border border-[#1E3525] bg-[#0B160F] text-sm font-medium text-[#91A99A] transition-all duration-200 hover:-translate-y-0.5 hover:border-[#31563D] hover:bg-[#0F1D14] active:translate-y-0"
        >
          <GoogleIcon />

          Continue with Google
        </button>

        <p className="mt-6 text-center text-[10px] text-[#405748]">
          Secure authentication · Your data stays yours
        </p>
      </div>
    </div>          
  );
}


/* ============================================================
   INPUT
============================================================ */

function AuthInput({
  icon,
  label,
  placeholder,
  value,
  onChange,
  type = "text",
  action,
}: {
  icon: ReactNode;
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  action?: ReactNode;
}) {
  const inputRef =
    useRef<HTMLDivElement>(null);

  const focusAnimation = () => {
    if (!inputRef.current) {
      return;
    }

    animate(inputRef.current, {
      borderColor: "#2D6B42",
      translateY: -1,
      duration: 180,
      ease: "out(3)",
    });
  };

  const blurAnimation = () => {
    if (!inputRef.current) {
      return;
    }

    animate(inputRef.current, {
      borderColor: "#1D3325",
      translateY: 0,
      duration: 180,
      ease: "out(3)",
    });
  };

  return (
    <div>
      <label className="mb-2 block text-[10px] font-medium uppercase tracking-[0.14em] text-[#587163]">
        {label}
      </label>

      <div
        ref={inputRef}
        className="flex items-center gap-3 rounded-xl border border-[#1D3325] bg-[#08120C] px-3.5"
      >
        <span className="text-[#527565]">
          <span className="[&>svg]:h-4 [&>svg]:w-4">
            {icon}
          </span>
        </span>

        <input
          type={type}
          value={value}
          placeholder={placeholder}
          onChange={(event) =>
            onChange(event.target.value)
          }
          onFocus={focusAnimation}
          onBlur={blurAnimation}
          className="h-12 min-w-0 flex-1 bg-transparent text-sm text-[#ECFDF5] outline-none placeholder:text-[#344A3B]"
        />

        {action}
      </div>
    </div>
  );
}

/* ============================================================
   CAPTCHA
============================================================ */

function Captcha({
  captcha,
  answer,
  loading,
  onChange,
  onRefresh,
}: {
  captcha: CaptchaData | null;
  answer: string;
  loading: boolean;
  onChange: (value: string) => void;
  onRefresh: () => void;
}) {
  return (
    <div className="rounded-xl border border-[#1A3021] bg-[#08120C] p-3">
      <div className="mb-2 flex items-center justify-between">
        <div>
          <p className="text-[9px] uppercase tracking-[0.16em] text-[#557062]">
            Security check
          </p>

          <p className="mt-1 text-xs text-[#88A191]">
            Solve the captcha to continue.
          </p>
        </div>

        <button
          type="button"
          onClick={onRefresh}
          disabled={loading}
          aria-label="Refresh captcha"
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#1E3525] text-[#527565] transition hover:border-[#31563D] hover:text-[#86EFAC] disabled:opacity-50"
        >
          <RefreshCw
            className={`h-3.5 w-3.5 ${
              loading ? "animate-spin" : ""
            }`}
          />
        </button>
      </div>

      <div className="grid grid-cols-[1fr_100px] gap-2">
        <div className="flex h-11 items-center rounded-lg border border-[#1A3021] bg-[#0B160F] px-3">
          {loading ? (
            <span className="text-xs text-[#526C5D]">
              Loading captcha...
            </span>
          ) : (
            <Image src={captcha?.image || ""} alt="captcha-image" height={11} />
          )}
        </div>

        <input
          type="text"
          inputMode="numeric"
          autoComplete="off"
          value={answer}
          onChange={(event) =>
            onChange(event.target.value)
          }
          placeholder="Answer"
          className="h-11 w-full rounded-lg border border-[#1A3021] bg-[#0B160F] px-3 text-center text-sm text-[#ECFDF5] outline-none placeholder:text-[#344A3B] focus:border-[#2D6B42]"
        />
      </div>
    </div>
  );
}

/* ============================================================
   SUBMIT
============================================================ */

function SubmitButton({
  mode,
  loading,
}: {
  mode: AuthMode;
  loading: boolean;
}) {
  const buttonRef =
    useRef<HTMLButtonElement>(null);

  const handleEnter = () => {
    if (!buttonRef.current || loading) {
      return;
    }

    animate(buttonRef.current, {
      translateY: -2,
      duration: 180,
      ease: "out(3)",
    });
  };

  const handleLeave = () => {
    if (!buttonRef.current || loading) {
      return;
    }

    animate(buttonRef.current, {
      translateY: 0,
      duration: 180,
      ease: "out(3)",
    });
  };

  return (
    <button
      ref={buttonRef}
      type="submit"
      disabled={loading}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#22C55E] text-sm font-semibold text-[#041008] transition-colors hover:bg-[#4ADE80] disabled:cursor-not-allowed disabled:opacity-60"
    >
      {loading ? (
        <>
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#041008]/25 border-t-[#041008]" />

          <span>Processing...</span>
        </>
      ) : (
        <>
          <span>
            {mode === "login"
              ? "Enter workspace"
              : "Create account"}
          </span>

          <ArrowRight className="h-4 w-4" />
        </>
      )}
    </button>
  );
}

/* ============================================================
   GOOGLE ICON
============================================================ */

function GoogleIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path
        fill="#4285F4"
        d="M21.35 12.27c0-.79-.07-1.54-.2-2.27H12v4.3h5.24a4.48 4.48 0 0 1-1.94 2.94v2.45h3.14c1.84-1.7 2.91-4.2 2.91-7.42Z"
      />

      <path
        fill="#34A853"
        d="M12 21.75c2.63 0 4.84-.87 6.45-2.36l-3.14-2.45c-.87.58-1.98.92-3.31.92-2.54 0-4.69-1.72-5.46-4.03H3.3v2.53A9.74 9.74 0 0 0 12 21.75Z"
      />

      <path
        fill="#FBBC05"
        d="M6.54 13.83a5.85 5.85 0 0 1 0-3.66V7.64H3.3a9.76 9.76 0 0 0 0 8.72l3.24-2.53Z"
      />

      <path
        fill="#EA4335"
        d="M12 6.14c1.43 0 2.71.49 3.72 1.45l2.79-2.79C16.84 3.23 14.63 2.25 12 2.25a9.74 9.74 0 0 0-8.7 5.39l3.24 2.53C7.31 7.86 9.46 6.14 12 6.14Z"
      />
    </svg>
  );
}