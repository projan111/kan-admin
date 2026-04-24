import React, { useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { z } from "zod";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "../app/providers/AuthContext";
import { Button } from "@/shared/components/ui/button";

const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

type LoginValues = z.infer<typeof loginSchema>;
type FieldErrors = Partial<Record<keyof LoginValues, string>>;

function toFieldErrors(err: z.ZodError<LoginValues>): FieldErrors {
  const out: FieldErrors = {};
  for (const issue of err.issues) {
    const key = issue.path[0];
    if (key === "email" || key === "password") out[key] = issue.message;
  }
  return out;
}

export const LoginPage: React.FC = () => {
  const [values, setValues] = useState<LoginValues>({ email: "", password: "" });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const from = useMemo(() => {
    const st = location.state as { from?: string } | null;
    return st?.from ?? "/dashboard";
  }, [location.state]);

  const { setAuthenticated } = useAuth();

  const onSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    const parsed = loginSchema.safeParse(values);
    if (!parsed.success) {
      setErrors(toFieldErrors(parsed.error));
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    const email = parsed.data.email.trim().toLowerCase();
    const nameSeed = email.split("@")[0] || "Demo";
    const firstname = nameSeed.charAt(0).toUpperCase() + nameSeed.slice(1);

    // Demo-mode login: bypass backend auth and store a local user session.
    setAuthenticated({
      id: "demo-user",
      firstname,
      lastname: "User",
      email,
      phone: "",
      address: "",
      gender: "OTHER",
      role: "SUDOADMIN",
      isVerified: true,
    });

    navigate(from, { replace: true });
    setIsSubmitting(false);
  };

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <h1 style={{ fontSize: 22, fontWeight: 800 }}>Sign in</h1>
      <p style={{ margin: 0, color: "var(--muted)", fontSize: 13 }}>Demo mode is enabled. Enter any valid email/password to continue.</p>

      <form onSubmit={onSubmit} style={{ display: "grid", gap: 10 }} noValidate>
        <label style={{ display: "grid", gap: 6 }}>
          <span>Email</span>
          <input
            value={values.email}
            onChange={(e) => setValues((p) => ({ ...p, email: e.target.value }))}
            type="email"
            autoComplete="email"
            style={{ padding: 10, borderRadius: 10, border: "1px solid #ddd" }}
          />
          {errors.email ? <span style={{ color: "crimson", fontSize: 12 }}>{errors.email}</span> : null}
        </label>

        <label style={{ display: "grid", gap: 6 }}>
          <span>Password</span>
          <div style={{ position: "relative" }}>
            <input
              value={values.password}
              onChange={(e) => setValues((p) => ({ ...p, password: e.target.value }))}
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              style={{ width: "100%", padding: "10px 40px 10px 10px", borderRadius: 10, border: "1px solid #ddd" }}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-1 top-1/2 h-8 w-8 -translate-y-1/2 border-none bg-transparent p-0 text-[var(--muted)] shadow-none hover:bg-transparent"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </Button>
          </div>
          {errors.password ? <span style={{ color: "crimson", fontSize: 12 }}>{errors.password}</span> : null}
        </label>

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Signing in..." : "Sign in"}
        </button>

        <Link to="/forgot-password" style={{ fontSize: 13, color: "var(--primary)" }}>
          Forgot password?
        </Link>
      </form>
    </div>
  );
};
