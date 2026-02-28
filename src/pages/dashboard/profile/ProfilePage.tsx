import React from "react";
import { useAuth } from "@/app/providers/AuthContext";
import { FormLayout } from "@/shared/components/forms/FormLayout";
import { Link } from "react-router-dom";

export const ProfilePage: React.FC = () => {
  const { state } = useAuth();
  const user = state.user;
  const emailName = user?.email?.split("@")[0]?.trim() ?? "";
  const displayName = [user?.firstname, user?.lastname].filter(Boolean).join(" ").trim() || emailName || "N/A";

  return (
    <FormLayout title="My Profile" subtitle="Signed-in account details">
      <div style={{ display: "flex", gap: 8 }}>
        <Link to="/dashboard/change-password" style={{ padding: "8px 12px", borderRadius: 999, border: "1px solid var(--line)", textDecoration: "none", color: "var(--text)" }}>
          Change Password
        </Link>
        {state.role === "SUDOADMIN" ? (
          <Link to="/dashboard/auth/signup" style={{ padding: "8px 12px", borderRadius: 999, border: "1px solid #99f6e4", background: "#ecfeff", textDecoration: "none", color: "var(--text)" }}>
            Create Admin User
          </Link>
        ) : null}
      </div>
      <div style={{ display: "grid", gap: 10 }}>
        <div style={{ padding: 12, borderRadius: 12, border: "1px solid var(--line)", background: "var(--surface-2)" }}>
          <div style={{ fontSize: 12, color: "var(--muted)" }}>Name</div>
          <div style={{ fontWeight: 700 }}>{displayName}</div>
        </div>
        <div style={{ padding: 12, borderRadius: 12, border: "1px solid var(--line)", background: "var(--surface-2)" }}>
          <div style={{ fontSize: 12, color: "var(--muted)" }}>Email</div>
          <div style={{ fontWeight: 700 }}>{user?.email ?? "N/A"}</div>
        </div>
        <div style={{ padding: 12, borderRadius: 12, border: "1px solid var(--line)", background: "var(--surface-2)" }}>
          <div style={{ fontSize: 12, color: "var(--muted)" }}>Role</div>
          <div style={{ fontWeight: 700 }}>{state.role ?? "N/A"}</div>
        </div>
      </div>
    </FormLayout>
  );
};
