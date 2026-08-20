import { AuthMode } from "@/interfaces/auth.interface";

export function ModeSwitcher({
  mode,
  onChange,
}: {
  mode: AuthMode;
  onChange: (mode: AuthMode) => void;
}) {
  return (
    <div className="relative grid grid-cols-2 rounded-xl border border-[#16291C] bg-[#060D08] p-1">
      <div
        className={`absolute bottom-1 top-1 w-[calc(50%-4px)] rounded-lg border border-[#285638] bg-[#12281A] transition-[left] duration-300 ease-out ${
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
            ? "text-[#D1FAE5]"
            : "text-[#536D5E]"
        }`}
      >
        Sign in
      </button>

      <button
        type="button"
        onClick={() => onChange("register")}
        className={`relative z-10 py-2.5 text-xs font-medium ${
          mode === "register"
            ? "text-[#D1FAE5]"
            : "text-[#536D5E]"
        }`}
      >
        Create account
      </button>
    </div>
  );
}