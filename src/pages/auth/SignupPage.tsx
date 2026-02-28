import React from "react";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { useSignup } from "@/features/auth";
import { useToast } from "@/shared/components/feedback/ToastProvider";
import { parseApiError } from "@/shared/utils/apiError";

const schema = z.object({
  firstname: z.string().min(1),
  middlename: z.string().optional(),
  lastname: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(1),
  password: z.string().min(8),
  address: z.string().min(1),
  gender: z.enum(["MALE", "FEMALE", "OTHER"]),
  role: z.enum(["SUDOADMIN", "ADMIN", "USER"]).optional(),
  isVerified: z.boolean().default(true),
  sortOrder: z.string().optional().transform((v) => (v ? Number(v) : undefined)),
  profile: z.instanceof(File).nullable().optional(),
});

type FormValues = z.input<typeof schema>;

export const SignupPage: React.FC = () => {
  const nav = useNavigate();
  const toast = useToast();
  const signup = useSignup();
  const [values, setValues] = React.useState<FormValues>({
    firstname: "",
    middlename: "",
    lastname: "",
    email: "",
    phone: "",
    password: "",
    address: "",
    gender: "MALE",
    role: "USER",
    isVerified: true,
    sortOrder: "",
    profile: null,
  });
  const [showPassword, setShowPassword] = React.useState(false);

  const onSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    const parsed = schema.safeParse(values);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Invalid form");
      return;
    }
    try {
      await signup.mutateAsync({ ...parsed.data, profile: parsed.data.profile ?? null });
      toast.success("User created");
      nav("/dashboard/users", { replace: true });
    } catch (err) {
      toast.error(parseApiError(err).message);
    }
  };

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <h1 style={{ margin: 0 }}>Create Admin User</h1>
      <form onSubmit={onSubmit} style={{ display: "grid", gap: 8 }}>
        <input placeholder="First name" value={values.firstname} onChange={(e) => setValues((p) => ({ ...p, firstname: e.target.value }))} />
        <input placeholder="Middle name" value={values.middlename ?? ""} onChange={(e) => setValues((p) => ({ ...p, middlename: e.target.value }))} />
        <input placeholder="Last name" value={values.lastname} onChange={(e) => setValues((p) => ({ ...p, lastname: e.target.value }))} />
        <input placeholder="Email" value={values.email} onChange={(e) => setValues((p) => ({ ...p, email: e.target.value }))} />
        <input placeholder="Phone" value={values.phone} onChange={(e) => setValues((p) => ({ ...p, phone: e.target.value }))} />
        <div style={{ position: "relative" }}>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={values.password}
            onChange={(e) => setValues((p) => ({ ...p, password: e.target.value }))}
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
        <input placeholder="Address" value={values.address} onChange={(e) => setValues((p) => ({ ...p, address: e.target.value }))} />
        <select value={values.gender} onChange={(e) => setValues((p) => ({ ...p, gender: e.target.value as FormValues["gender"] }))}>
          <option value="MALE">MALE</option><option value="FEMALE">FEMALE</option><option value="OTHER">OTHER</option>
        </select>
        <select value={values.role ?? "USER"} onChange={(e) => setValues((p) => ({ ...p, role: e.target.value as FormValues["role"] }))}>
          <option value="USER">USER</option><option value="ADMIN">ADMIN</option><option value="SUDOADMIN">SUDOADMIN</option>
        </select>
        <label><input type="checkbox" checked={Boolean(values.isVerified)} onChange={(e) => setValues((p) => ({ ...p, isVerified: e.target.checked }))} /> Verified</label>
        <input placeholder="Sort order" value={values.sortOrder ?? ""} onChange={(e) => setValues((p) => ({ ...p, sortOrder: e.target.value }))} />
        <input type="file" accept="image/*" onChange={(e) => setValues((p) => ({ ...p, profile: e.target.files?.[0] ?? null }))} />
        <button type="submit" disabled={signup.isPending}>{signup.isPending ? "Saving..." : "Create"}</button>
      </form>
    </div>
  );
};
