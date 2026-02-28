import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { useResetPassword } from "@/features/auth";
import { useToast } from "@/shared/components/feedback/ToastProvider";
import { parseApiError } from "@/shared/utils/apiError";

export const ResetPasswordPage: React.FC = () => {
  const nav = useNavigate();
  const toast = useToast();
  const reset = useResetPassword();
  const [token, setToken] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

  const onSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    try {
      await reset.mutateAsync({ token, password, confirmPassword });
      toast.success("Password reset successful");
      nav("/login", { replace: true });
    } catch (err) {
      toast.error(parseApiError(err).message);
    }
  };

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <h1 style={{ margin: 0 }}>Reset Password</h1>
      <p style={{ margin: 0, color: "var(--muted)", fontSize: 13 }}>Use the token from your email to set a new password.</p>
      <form onSubmit={onSubmit} style={{ display: "grid", gap: 8 }}>
        <input placeholder="Reset token" value={token} onChange={(e) => setToken(e.target.value)} />
        <div style={{ position: "relative" }}>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="New password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: "100%", paddingRight: 34 }}
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", border: "none", background: "transparent", color: "#64748b", padding: 2, cursor: "pointer" }}
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        <div style={{ position: "relative" }}>
          <input
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            style={{ width: "100%", paddingRight: 34 }}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword((v) => !v)}
            aria-label={showConfirmPassword ? "Hide password" : "Show password"}
            style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", border: "none", background: "transparent", color: "#64748b", padding: 2, cursor: "pointer" }}
          >
            {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        <button type="submit" disabled={reset.isPending}>{reset.isPending ? "Resetting..." : "Reset Password"}</button>
      </form>
      <Link to="/login" style={{ fontSize: 13 }}>Back to sign in</Link>
    </div>
  );
};
