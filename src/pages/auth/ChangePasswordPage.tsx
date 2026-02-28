import React from "react";
import { Eye, EyeOff } from "lucide-react";
import { useChangePassword } from "@/features/auth";
import { useToast } from "@/shared/components/feedback/ToastProvider";
import { parseApiError } from "@/shared/utils/apiError";

export const ChangePasswordPage: React.FC = () => {
  const toast = useToast();
  const change = useChangePassword();
  const [currentPassword, setCurrentPassword] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [showCurrent, setShowCurrent] = React.useState(false);
  const [showNext, setShowNext] = React.useState(false);
  const [showConfirm, setShowConfirm] = React.useState(false);

  const onSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    try {
      await change.mutateAsync({ currentPassword, password, confirmPassword });
      toast.success("Password changed");
      setCurrentPassword("");
      setPassword("");
      setConfirmPassword("");
    } catch (err) {
      toast.error(parseApiError(err).message);
    }
  };

  return (
    <div style={{ display: "grid", gap: 12, maxWidth: 520 }}>
      <h1 style={{ margin: 0 }}>Change Password</h1>
      <form onSubmit={onSubmit} style={{ display: "grid", gap: 8 }}>
        <div style={{ position: "relative" }}>
          <input
            type={showCurrent ? "text" : "password"}
            placeholder="Current password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            style={{ width: "100%", border: "1px solid var(--line)", background: "#fff", borderRadius: 10, padding: "10px 40px 10px 12px" }}
          />
          <button type="button" onClick={() => setShowCurrent((v) => !v)} aria-label={showCurrent ? "Hide current password" : "Show current password"} style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", border: "none", background: "transparent", color: "#64748b", padding: 4 }}>
            {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        <div style={{ position: "relative" }}>
          <input
            type={showNext ? "text" : "password"}
            placeholder="New password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: "100%", border: "1px solid var(--line)", background: "#fff", borderRadius: 10, padding: "10px 40px 10px 12px" }}
          />
          <button type="button" onClick={() => setShowNext((v) => !v)} aria-label={showNext ? "Hide new password" : "Show new password"} style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", border: "none", background: "transparent", color: "#64748b", padding: 4 }}>
            {showNext ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        <div style={{ position: "relative" }}>
          <input
            type={showConfirm ? "text" : "password"}
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            style={{ width: "100%", border: "1px solid var(--line)", background: "#fff", borderRadius: 10, padding: "10px 40px 10px 12px" }}
          />
          <button type="button" onClick={() => setShowConfirm((v) => !v)} aria-label={showConfirm ? "Hide confirm password" : "Show confirm password"} style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", border: "none", background: "transparent", color: "#64748b", padding: 4 }}>
            {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        <button type="submit" disabled={change.isPending}>{change.isPending ? "Updating..." : "Change Password"}</button>
      </form>
    </div>
  );
};
