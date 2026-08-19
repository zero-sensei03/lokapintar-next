"use client";

import {
  ArrowRight,
  Check,
  Eye,
  EyeOff,
  Lock,
  Mail,
  User,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { FormEvent, ReactNode, useEffect, useState } from "react";

type AuthMode = "login" | "register";

interface FormState {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface InputProps {
  icon: ReactNode;
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  action?: ReactNode;
}

const INITIAL_FORM: FormState = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
};

export default function AuthPage() {
  const [mode, setMode] = useState<AuthMode>("login");
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const changeMode = (nextMode: AuthMode) => {
    if (nextMode === mode) return;

    setMode(nextMode);
    setError("");
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  const updateField = (field: keyof FormState, value: string) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));

    if (error) {
      setError("");
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError("");

    if (!form.email.trim() || !form.password) {
      setError("Please fill in all required fields.");
      return;
    }

    if (mode === "register") {
      if (!form.name.trim()) {
        setError("Please enter your name.");
        return;
      }

      if (form.password.length < 8) {
        setError("Password must contain at least 8 characters.");
        return;
      }

      if (form.password !== form.confirmPassword) {
        setError("Password confirmation does not match.");
        return;
      }
    }

    setLoading(true);

    // =====================================================
    // TEMPORARY DEMO
    // Replace this with your actual API request.
    // =====================================================

    await new Promise((resolve) => setTimeout(resolve, 1200));

    console.log(
      mode === "login"
        ? {
            email: form.email,
            password: form.password,
            rememberMe,
          }
        : {
            name: form.name,
            email: form.email,
            password: form.password,
          },
    );

    setLoading(false);
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#07110B] text-[#F0FDF4]">
      <Background />

      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-10 sm:px-6">
        <div className="w-full max-w-[440px]">
          <Brand />

          <motion.div
            layout
            initial={{
              opacity: 0,
              y: 24,
              scale: 0.97,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            transition={{
              duration: 0.65,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="relative overflow-hidden rounded-[28px] border border-[#1D3325] bg-[#0D1912] p-2"
          >
            {/* Animated border line */}

            <motion.div
              animate={{
                x: ["-100%", "400%"],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "linear",
              }}
              className="pointer-events-none absolute left-0 top-0 h-px w-1/4 bg-[#4ADE80]"
            />

            <div className="rounded-[21px] border border-[#17291E] bg-[#0A140E] p-6 sm:p-8">
              <ModeSwitcher mode={mode} onChange={changeMode} />

              <AnimatePresence mode="wait">
                <motion.div
                  key={mode}
                  initial={{
                    opacity: 0,
                    x: mode === "login" ? -15 : 15,
                  }}
                  animate={{
                    opacity: 1,
                    x: 0,
                  }}
                  exit={{
                    opacity: 0,
                    x: mode === "login" ? 15 : -15,
                  }}
                  transition={{
                    duration: 0.3,
                  }}
                >
                  <Header mode={mode} />

                  <form
                    onSubmit={handleSubmit}
                    className="mt-7 space-y-4"
                  >
                    {mode === "register" && (
                      <AnimatedField
                        icon={<User />}
                        label="Full name"
                        placeholder="John Doe"
                        value={form.name}
                        onChange={(value) =>
                          updateField("name", value)
                        }
                      />
                    )}

                    <AnimatedField
                      icon={<Mail />}
                      label="Email address"
                      type="email"
                      placeholder="you@example.com"
                      value={form.email}
                      onChange={(value) =>
                        updateField("email", value)
                      }
                    />

                    <AnimatedField
                      icon={<Lock />}
                      label="Password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={form.password}
                      onChange={(value) =>
                        updateField("password", value)
                      }
                      action={
                        <button
                          type="button"
                          aria-label={
                            showPassword
                              ? "Hide password"
                              : "Show password"
                          }
                          onClick={() =>
                            setShowPassword((previous) => !previous)
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
                      <AnimatedField
                        icon={<Lock />}
                        label="Confirm password"
                        type={
                          showConfirmPassword
                            ? "text"
                            : "password"
                        }
                        placeholder="••••••••"
                        value={form.confirmPassword}
                        onChange={(value) =>
                          updateField("confirmPassword", value)
                        }
                        action={
                          <button
                            type="button"
                            aria-label={
                              showConfirmPassword
                                ? "Hide password"
                                : "Show password"
                            }
                            onClick={() =>
                              setShowConfirmPassword(
                                (previous) => !previous,
                              )
                            }
                            className="text-[#527565] transition-colors hover:text-[#A7F3D0]"
                          >
                            {showConfirmPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </button>
                        }
                      />
                    )}

                    {mode === "login" && (
                      <div className="flex items-center justify-between pt-1">
                        <label className="flex cursor-pointer items-center gap-2">
                          <button
                            type="button"
                            aria-label="Remember me"
                            onClick={() =>
                              setRememberMe(
                                (previous) => !previous,
                              )
                            }
                            className={`flex h-4 w-4 items-center justify-center rounded-[5px] border transition ${
                              rememberMe
                                ? "border-[#22C55E] bg-[#22C55E]"
                                : "border-[#31503C] bg-[#0D1912]"
                            }`}
                          >
                            <AnimatePresence>
                              {rememberMe && (
                                <motion.div
                                  initial={{
                                    opacity: 0,
                                    scale: 0.5,
                                  }}
                                  animate={{
                                    opacity: 1,
                                    scale: 1,
                                  }}
                                >
                                  <Check className="h-3 w-3 text-[#041008]" />
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </button>

                          <span className="text-xs text-[#6F8979]">
                            Remember me
                          </span>
                        </label>

                        <button
                          type="button"
                          className="text-xs text-[#4ADE80] transition-colors hover:text-[#86EFAC]"
                        >
                          Forgot password?
                        </button>
                      </div>
                    )}

                    {mode === "register" && (
                      <div className="flex gap-3 rounded-xl border border-[#1B3022] bg-[#0D1912] p-3">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#22C55E]" />

                        <p className="text-[11px] leading-relaxed text-[#6F8979]">
                          By creating an account, you agree to our{" "}
                          <button
                            type="button"
                            className="text-[#86EFAC] hover:underline"
                          >
                            Terms
                          </button>{" "}
                          and{" "}
                          <button
                            type="button"
                            className="text-[#86EFAC] hover:underline"
                          >
                            Privacy Policy
                          </button>
                          .
                        </p>
                      </div>
                    )}

                    <AnimatePresence>
                      {error && (
                        <motion.div
                          initial={{
                            opacity: 0,
                            height: 0,
                            y: -5,
                          }}
                          animate={{
                            opacity: 1,
                            height: "auto",
                            y: 0,
                          }}
                          exit={{
                            opacity: 0,
                            height: 0,
                          }}
                          className="overflow-hidden"
                        >
                          <div className="rounded-xl border border-red-900/50 bg-red-950/20 px-3 py-2.5 text-xs text-red-300">
                            {error}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <SubmitButton
                      mode={mode}
                      loading={loading}
                    />
                  </form>
                </motion.div>
              </AnimatePresence>

              <Divider />

              <SocialButtons />

              <p className="mt-6 text-center text-[10px] tracking-wide text-[#405748]">
                Secure authentication · Your data stays yours
              </p>
            </div>
          </motion.div>

          <Footer />
        </div>
      </div>
    </main>
  );
}

/* ============================================================
   BACKGROUND
============================================================ */

function Background() {
  const particles = [
    { left: "8%", top: "14%", delay: 0 },
    { left: "18%", top: "72%", delay: 1.2 },
    { left: "28%", top: "31%", delay: 2 },
    { left: "38%", top: "86%", delay: 0.5 },
    { left: "49%", top: "12%", delay: 2.8 },
    { left: "58%", top: "68%", delay: 1.6 },
    { left: "69%", top: "24%", delay: 3 },
    { left: "79%", top: "81%", delay: 0.8 },
    { left: "88%", top: "42%", delay: 2.4 },
    { left: "94%", top: "15%", delay: 1.4 },
    { left: "13%", top: "45%", delay: 3.2 },
    { left: "84%", top: "65%", delay: 0.2 },
  ];

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Grid */}

      <div
        className="absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage: `
            linear-gradient(#86A392 1px, transparent 1px),
            linear-gradient(90deg, #86A392 1px, transparent 1px)
          `,
          backgroundSize: "44px 44px",
        }}
      />

      {/* Moving shapes */}

      <motion.div
        animate={{
          x: [0, 25, 0, -20, 0],
          y: [0, -20, 15, 0, 0],
          rotate: [0, 10, -5, 5, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute left-[8%] top-[12%] h-32 w-32 rounded-[35%] border border-[#183522] bg-[#0A180E]"
      />

      <motion.div
        animate={{
          x: [0, -30, 0, 25, 0],
          y: [0, 20, -15, 0, 0],
          rotate: [0, -8, 5, -3, 0],
        }}
        transition={{
          duration: 24,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute bottom-[12%] right-[8%] h-40 w-40 rounded-full border border-[#173522] bg-[#09170D]"
      />

      {/* Small particles */}

      {particles.map((particle, index) => (
        <motion.span
          key={index}
          initial={{
            opacity: 0.1,
            y: 0,
          }}
          animate={{
            opacity: [0.1, 0.35, 0.1],
            y: [-10, 10, -10],
          }}
          transition={{
            duration: 5 + (index % 4),
            delay: particle.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{
            left: particle.left,
            top: particle.top,
          }}
          className="absolute h-1 w-1 rounded-full bg-[#527565]"
        />
      ))}
    </div>
  );
}

/* ============================================================
   BRAND
============================================================ */

function Brand() {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: -15,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.6,
      }}
      className="mb-7 text-center"
    >
      <div className="mb-5 flex justify-center">
        <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl border border-[#245D39] bg-[#102619]">
          <motion.div
            animate={{
              rotate: [45, 135, 225, 315, 405],
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "linear",
            }}
            className="h-5 w-5 rotate-45 rounded-[5px] border-2 border-[#4ADE80]"
          />

          <div className="absolute h-1.5 w-1.5 rounded-full bg-[#A3E635]" />
        </div>
      </div>

      <h1 className="text-2xl font-semibold tracking-tight text-[#ECFDF5]">
        Your Brand
      </h1>

      <p className="mt-2 text-sm text-[#5F7869]">
        Simple. Secure. Yours.
      </p>
    </motion.div>
  );
}

/* ============================================================
   MODE SWITCHER
============================================================ */

function ModeSwitcher({
  mode,
  onChange,
}: {
  mode: AuthMode;
  onChange: (mode: AuthMode) => void;
}) {
  return (
    <div className="relative mb-7 grid grid-cols-2 rounded-xl border border-[#17291E] bg-[#07110B] p-1">
      <motion.div
        layout
        transition={{
          type: "spring",
          stiffness: 400,
          damping: 30,
        }}
        className={`absolute bottom-1 top-1 w-[calc(50%-4px)] rounded-lg border border-[#245D39] bg-[#16351F] ${
          mode === "login"
            ? "left-1"
            : "left-[calc(50%+2px)]"
        }`}
      />

      <button
        type="button"
        onClick={() => onChange("login")}
        className={`relative z-10 rounded-lg py-2.5 text-xs font-medium transition-colors ${
          mode === "login"
            ? "text-[#D1FAE5]"
            : "text-[#557062]"
        }`}
      >
        Sign in
      </button>

      <button
        type="button"
        onClick={() => onChange("register")}
        className={`relative z-10 rounded-lg py-2.5 text-xs font-medium transition-colors ${
          mode === "register"
            ? "text-[#D1FAE5]"
            : "text-[#557062]"
        }`}
      >
        Create account
      </button>
    </div>
  );
}

/* ============================================================
   HEADER
============================================================ */

function Header({ mode }: { mode: AuthMode }) {
  return (
    <div>
      <h2 className="text-xl font-semibold tracking-tight text-[#ECFDF5]">
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
  );
}

/* ============================================================
   INPUT
============================================================ */

function AnimatedField({
  icon,
  label,
  placeholder,
  value,
  onChange,
  type = "text",
  action,
}: InputProps) {
  const [focused, setFocused] = useState(false);

  return (
    <div>
      <label className="mb-2 block text-[11px] font-medium uppercase tracking-wider text-[#5C7667]">
        {label}
      </label>

      <motion.div
        animate={{
          borderColor: focused
            ? "#2D7847"
            : "#1D3325",
          backgroundColor: focused
            ? "#0B180F"
            : "#09140D",
        }}
        transition={{
          duration: 0.2,
        }}
        className="flex items-center gap-3 rounded-xl border px-3.5"
      >
        <motion.div
          animate={{
            color: focused ? "#4ADE80" : "#527565",
            scale: focused ? 1.05 : 1,
          }}
          transition={{
            duration: 0.2,
          }}
        >
          <span className="[&>svg]:h-4 [&>svg]:w-4">
            {icon}
          </span>
        </motion.div>

        <input
          type={type}
          value={value}
          placeholder={placeholder}
          onChange={(event) => onChange(event.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="h-12 min-w-0 flex-1 bg-transparent text-sm text-[#ECFDF5] outline-none placeholder:text-[#344B3D]"
        />

        {action}
      </motion.div>
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
  return (
    <motion.button
      type="submit"
      disabled={loading}
      whileHover={{
        y: -2,
      }}
      whileTap={{
        scale: 0.98,
      }}
      className="group relative mt-2 flex h-12 w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-[#22C55E] text-sm font-semibold text-[#041008] transition-colors hover:bg-[#4ADE80] disabled:cursor-not-allowed disabled:opacity-60"
    >
      <motion.span
        animate={{
          x: ["-120%", "220%"],
        }}
        transition={{
          duration: 2.8,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute h-full w-10 skew-x-[-20deg] bg-white/20"
      />

      {loading ? (
        <>
          <motion.span
            animate={{
              rotate: 360,
            }}
            transition={{
              duration: 0.8,
              repeat: Infinity,
              ease: "linear",
            }}
            className="h-4 w-4 rounded-full border-2 border-[#041008]/30 border-t-[#041008]"
          />

          <span>Processing...</span>
        </>
      ) : (
        <>
          <span>
            {mode === "login"
              ? "Enter workspace"
              : "Create account"}
          </span>

          <motion.span
            animate={{
              x: [0, 3, 0],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
            }}
          >
            <ArrowRight className="h-4 w-4" />
          </motion.span>
        </>
      )}
    </motion.button>
  );
}

/* ============================================================
   DIVIDER
============================================================ */

function Divider() {
  return (
    <div className="my-6 flex items-center gap-3">
      <div className="h-px flex-1 bg-[#17291E]" />

      <span className="text-[9px] uppercase tracking-[0.2em] text-[#405748]">
        or continue with
      </span>

      <div className="h-px flex-1 bg-[#17291E]" />
    </div>
  );
}

/* ============================================================
   SOCIAL
============================================================ */

function SocialButtons() {
  return (
    <div className="grid grid-cols-2 gap-3">
      <SocialButton>
        <GoogleIcon />
        Google
      </SocialButton>
    </div>
  );
}

function SocialButton({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <motion.button
      type="button"
      whileHover={{
        y: -2,
        backgroundColor: "#101F15",
        borderColor: "#294A34",
      }}
      whileTap={{
        scale: 0.97,
      }}
      className="flex h-11 items-center justify-center gap-2 rounded-xl border border-[#1B3022] bg-[#09140D] text-xs font-medium text-[#789183] transition-colors"
    >
      {children}
    </motion.button>
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

/* ============================================================
   FOOTER
============================================================ */

function Footer() {
  return (
    <motion.div
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
      }}
      transition={{
        delay: 0.8,
      }}
      className="mt-6 flex items-center justify-center gap-2 text-[10px] text-[#405748]"
    >
      <span className="h-1.5 w-1.5 rounded-full bg-[#22C55E]" />

      <span>Protected by secure authentication</span>
    </motion.div>
  );
}