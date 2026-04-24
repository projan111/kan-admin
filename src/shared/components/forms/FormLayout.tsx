import React from "react";

type Props = Readonly<{
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
  aside?: React.ReactNode;
}>;

export const FormLayout: React.FC<Props> = ({ title, subtitle, actions, children, aside }) => {
  return (
    <div className="grid w-full max-w-280 gap-[18px]">
      <div className="flex items-center justify-between gap-4 rounded-[18px] border border-[var(--line)] bg-white px-5 py-[18px]">
        <div>
          <h2 className="m-0 text-[26px] font-semibold tracking-[-0.03em] text-[var(--text)]">{title}</h2>
          {subtitle ? <div className="mt-1.5 text-[13px] text-[var(--muted)]">{subtitle}</div> : null}
        </div>
        {actions}
      </div>

      <div className={`grid items-start gap-[18px] ${aside ? "xl:grid-cols-[minmax(0,1fr)_320px]" : "grid-cols-1"}`}>
        <div className="rounded-[18px] border border-[var(--line)] bg-white p-5">
          {children}
        </div>
        {aside ? <div>{aside}</div> : null}
      </div>
    </div>
  );
};
