import React from "react";
import { useIsFetching } from "@tanstack/react-query";

export const GlobalLoadingBar: React.FC = () => {
  const isFetching = useIsFetching();
  const visible = isFetching > 0;

  return (
    <div
      aria-hidden={!visible}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: 2,
        zIndex: 9999,
        opacity: visible ? 1 : 0,
        transition: "opacity 150ms ease",
      }}
    >
      <div
        style={{
          height: "100%",
          width: "100%",
          transformOrigin: "0 0",
          transform: visible ? "scaleX(1)" : "scaleX(0)",
          transition: "transform 200ms ease",
          background: "#111",
        }}
      />
    </div>
  );
};