import axios from "axios";

export type FieldErrors = Readonly<Record<string, string>>;

export type ParsedApiError = Readonly<{
  message: string;
  fieldErrors?: FieldErrors;
}>;

function toFieldErrors(input: unknown): FieldErrors | undefined {
  if (!input || typeof input !== "object") return undefined;

  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(input as Record<string, unknown>)) {
    if (typeof v === "string") out[k] = v;
    else if (Array.isArray(v) && v.length > 0 && typeof v[0] === "string") out[k] = v[0];
  }

  return Object.keys(out).length > 0 ? out : undefined;
}

export function parseApiError(error: unknown): ParsedApiError {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as
      | {
          message?: unknown;
          error?: unknown;
          errors?: unknown;
          fieldErrors?: unknown;
        }
      | undefined;

    const message =
      typeof data?.message === "string"
        ? data.message
        : typeof data?.error === "string"
          ? data.error
          : error.message || "Request failed";

    const fieldErrors = toFieldErrors(data?.fieldErrors) ?? toFieldErrors(data?.errors);

    return { message, fieldErrors };
  }

  if (error instanceof Error) {
    return { message: error.message };
  }

  return { message: "Something went wrong" };
}
