import React from "react";

type Props = Readonly<{
  values: ReadonlyArray<number>;
  color?: string;
  height?: number;
}>;

export const Sparkline: React.FC<Props> = ({ values, color = "var(--primary)", height = 44 }) => {
  const safe = values.length > 1 ? values : [0, ...values];
  const min = Math.min(...safe);
  const max = Math.max(...safe);
  const range = Math.max(1, max - min);
  const points = safe
    .map((v, i) => {
      const x = (i / (safe.length - 1)) * 100;
      const y = 100 - ((v - min) / range) * 100;
      return `${x},${y}`;
    })
    .join(" ");
  return (
    <svg viewBox="0 0 100 100" style={{ width: "100%", height }}>
      <polyline fill="none" stroke={color} strokeWidth="4" points={points} />
    </svg>
  );
};
