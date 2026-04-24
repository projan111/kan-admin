import React from "react";
import { Outlet } from "react-router-dom";

export const AuthLayout: React.FC = () => {
  return (
    <div className="auth-shell min-h-screen bg-transparent px-4 py-8 md:py-12">
      <div className="mx-auto grid w-full max-w-5xl items-center gap-8 md:grid-cols-[1.1fr_0.9fr]">
        <section className="premium-animate-in hidden rounded-[28px] border border-[var(--line)] bg-white p-8 md:block">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--primary)]">Merchant Console</p>
          <h2 className="mt-3 text-4xl font-semibold leading-tight tracking-[-0.04em] text-[var(--text)]">
            Run your commerce operation with less visual noise.
          </h2>
          <p className="mt-4 max-w-md text-sm text-[var(--muted)]">
            Real-time insights, catalog management, team controls, and customer workflows in one premium command center.
          </p>
          <div className="mt-8 grid gap-3 text-sm">
            {[
              "Unified orders, customers, and content operations",
              "Clear visual hierarchy for high-speed decision making",
              "Secure role-based controls across all modules",
            ].map((feature) => (
              <div key={feature} className="rounded-[18px] border border-[var(--line)] bg-[var(--surface-soft)] px-4 py-3 text-[var(--text)]">
                {feature}
              </div>
            ))}
          </div>
        </section>

        <div className="premium-animate-in mx-auto w-full max-w-[430px] rounded-[24px] border border-[var(--line)] bg-white p-6 md:p-7">
          <div className="mb-5 grid place-items-center">
            <img src="/logo/bluelogo.png" alt="Ecommerce Template" className="h-12 w-auto" />
          </div>
          <Outlet />
        </div>
      </div>
    </div>
  );
};
