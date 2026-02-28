import React from "react";
import { ZodError } from "zod";
import { useToast } from "@/shared/components/feedback/ToastProvider";
import { parseApiError, type FieldErrors } from "@/shared/utils/apiError";

type UseEntityFormOptions<TValues extends Record<string, unknown>, TParsed> = Readonly<{
  schema: { parse: (values: TValues) => TParsed };
  initialValues: TValues;
  onSubmit: (values: TParsed) => Promise<unknown>;
  successMessage?: string;
}>;

export function useEntityForm<TValues extends Record<string, unknown>, TParsed = TValues>(
  options: UseEntityFormOptions<TValues, TParsed>
) {
  const { schema, initialValues, onSubmit } = options;
  const toast = useToast();

  const [values, setValues] = React.useState<TValues>(initialValues);
  const [errors, setErrors] = React.useState<FieldErrors>({});
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const initialValuesRef = React.useRef(initialValues);

  React.useEffect(() => {
    initialValuesRef.current = initialValues;
  }, [initialValues]);

  const initialSerialized = React.useMemo(() => JSON.stringify(initialValues), [initialValues]);
  const currentSerialized = React.useMemo(() => JSON.stringify(values), [values]);
  const isDirty = initialSerialized !== currentSerialized;

  React.useEffect(() => {
    const onBeforeUnload = (event: BeforeUnloadEvent) => {
      if (!isDirty) return;
      event.preventDefault();
      event.returnValue = "";
    };

    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [isDirty]);

  const setField = React.useCallback(
    <K extends keyof TValues>(key: K, value: TValues[K]) => {
      setValues((prev) => ({ ...prev, [key]: value }));
      setErrors((prev) => {
        if (!prev[key as string]) return prev;
        const next = { ...prev };
        delete next[key as string];
        return next;
      });
    },
    []
  );

  const reset = React.useCallback((next?: TValues) => {
    setValues(next ?? initialValuesRef.current);
    setErrors({});
  }, []);

  const submit = React.useCallback(async () => {
    setIsSubmitting(true);
    setErrors({});

    try {
      const parsed = schema.parse(values);
      await onSubmit(parsed);
      return true;
    } catch (error: unknown) {
      if (error instanceof ZodError) {
        const nextErrors: Record<string, string> = {};
        for (const issue of error.issues) {
          const key = String(issue.path[0] ?? "");
          if (key) nextErrors[key] = issue.message;
        }
        setErrors(nextErrors);
        toast.error("Please fix the highlighted fields.");
      } else {
        const parsed = parseApiError(error);
        if (parsed.fieldErrors) setErrors(parsed.fieldErrors);
      }
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }, [onSubmit, schema, toast, values]);

  return {
    values,
    setValues,
    setField,
    errors,
    setErrors,
    isSubmitting,
    isDirty,
    reset,
    submit,
  };
}
