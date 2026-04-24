/* eslint-disable react-refresh/only-export-components */
import React from "react";
import { CheckCircle2, Info, TriangleAlert, X } from "lucide-react";
import { Button } from "@/shared/components/ui/button";

type ToastKind = "success" | "error" | "info";

type ToastItem = Readonly<{
  id: number;
  kind: ToastKind;
  message: string;
}>;

type ToastContextValue = Readonly<{
  push: (message: string, kind?: ToastKind) => void;
}>;

const ToastContext = React.createContext<ToastContextValue | null>(null);

export const ToastProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [toasts, setToasts] = React.useState<ReadonlyArray<ToastItem>>([]);
  const lastToastRef = React.useRef<Readonly<{ kind: ToastKind; message: string; at: number }> | null>(null);

  const push = React.useCallback((message: string, kind: ToastKind = "info") => {
    const now = Date.now();
    const last = lastToastRef.current;
    if (last && last.kind === kind && last.message === message && now - last.at < 1200) {
      return;
    }

    lastToastRef.current = { kind, message, at: now };
    const id = Date.now() + Math.floor(Math.random() * 10000);
    setToasts((prev) => [...prev, { id, kind, message }]);

    window.setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }, []);

  return (
    <ToastContext.Provider value={{ push }}>
      {children}
      <div
        style={{
          position: "fixed",
          bottom: 14,
          right: 14,
          zIndex: 3000,
          display: "grid",
          gap: 8,
          maxWidth: 420,
        }}
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            style={{
              borderRadius: 12,
              border: t.kind === "error" ? "1px solid #fecaca" : t.kind === "success" ? "1px solid #bbf7d0" : "1px solid #cbd5e1",
              background: "#ffffff",
              color: "#0f172a",
              padding: "10px 12px 8px",
              boxShadow: "0 12px 30px rgba(15,23,42,0.14)",
              fontSize: 14,
              display: "grid",
              gap: 8,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              {t.kind === "success" ? <CheckCircle2 size={16} color="#166534" /> : t.kind === "error" ? <TriangleAlert size={16} color="#be123c" /> : <Info size={16} color="#0f172a" />}
              <div style={{ flex: 1 }}>{t.message}</div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setToasts((prev) => prev.filter((x) => x.id !== t.id))}
                className="h-8 w-8 border-none bg-transparent p-0 text-[var(--muted)] shadow-none hover:bg-[var(--surface-soft)]"
              >
                <X size={14} />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export function useToast() {
  const ctx = React.useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");

  return {
    success: (message: string) => ctx.push(message, "success"),
    error: (message: string) => ctx.push(message, "error"),
    info: (message: string) => ctx.push(message, "info"),
  };
}
