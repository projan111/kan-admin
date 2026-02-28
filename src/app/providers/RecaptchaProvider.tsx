import React from "react";
import type { ReactNode } from "react";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";

type Props = Readonly<{ children: ReactNode }>;

export const RecaptchaProvider: React.FC<Props> = ({ children }) => {
  const siteKey = (import.meta.env.VITE_RECAPTCHA_SITE_KEY as string | undefined) ?? "";

  if (!siteKey) {
    console.warn("reCAPTCHA site key is missing");
    return <>{children}</>;
  }

  return (
    <GoogleReCaptchaProvider
      reCaptchaKey={siteKey}
      scriptProps={{
        async: true,
        defer: true,
        appendTo: "head",
      }}
    >
      {children}
    </GoogleReCaptchaProvider>
  );
};