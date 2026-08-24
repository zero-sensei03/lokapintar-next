import { AuthMode } from "@/interfaces/auth.interface";

export function ModeSwitcher({
  mode,
  onChange,
}: {
  mode: AuthMode;
  onChange: (mode: AuthMode) => void;
}) {
  return (
    <div className="relative grid grid-cols-2 rounded-xl border border-secondary bg-secondary/60 p-1">
      <div
        className={`absolute bottom-1 top-1 w-[calc(50%-4px)] rounded-lg border border-switcher-border bg-auth-secondary transition-[left] duration-300 ease-out ${
          mode === "login"
            ? "left-1"
            : "left-[calc(50%+2px)]"
        }`}
      />

      <button
        type="button"
        onClick={() => onChange("login")}
        className={`relative z-10 py-2.5 text-xs font-medium ${
          mode === "login"
            ? "text-green-600"
            : "text-gray-300"
        }`}
      >
        Sign in
      </button>

      <button
        type="button"
        onClick={() => onChange("register")}
        className={`relative z-10 py-2.5 text-xs font-medium ${
          mode === "register"
            ? "text-green-600"
            : "text-gray-300"
        }`}
      >
        Create account
      </button>
    </div>
  );
}