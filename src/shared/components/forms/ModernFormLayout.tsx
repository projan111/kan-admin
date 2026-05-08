import React from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/shared/components/ui/button";

type ModernFormLayoutProps = Readonly<{
  title: string;
  subtitle?: string;
  eyebrow?: string;
  onBack?: () => void;
  stats?: ReadonlyArray<{ label: string; value: string }>;
  children: React.ReactNode;
}>;

export const ModernFormLayout: React.FC<ModernFormLayoutProps> = ({
  title,
  subtitle,
  eyebrow = "Form",
  onBack,
  stats,
  children,
}) => {
  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="mx-auto max-w-[1400px] p-6">
        {/* Header Section */}
        <section className="overflow-hidden rounded-2xl border border-zinc-200 bg-gradient-to-b from-white to-zinc-50 shadow-sm">
          <div className="p-6 sm:p-8">
            {onBack && (
              <Button
                variant="ghost"
                className="mb-4 px-0 text-slate-600 hover:text-zinc-900"
                onClick={onBack}
              >
                <ArrowLeft size={16} />
                Back
              </Button>
            )}

            <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                  {eyebrow}
                </p>
                <h1 className="mt-3 text-3xl font-semibold tracking-tight text-zinc-900">
                  {title}
                </h1>
                {subtitle && (
                  <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-600">
                    {subtitle}
                  </p>
                )}
              </div>

              {stats && stats.length > 0 && (
                <div className="grid gap-4 sm:grid-cols-2">
                  {stats.map((stat) => (
                    <div
                      key={stat.label}
                      className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm"
                    >
                      <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                        {stat.label}
                      </p>
                      <p className="mt-2 text-xl font-semibold tracking-tight text-zinc-900">
                        {stat.value}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Form Content */}
        <div className="mt-6">{children}</div>
      </div>
    </div>
  );
};

type FormSectionProps = Readonly<{
  title: string;
  description?: string;
  children: React.ReactNode;
}>;

export const FormSection: React.FC<FormSectionProps> = ({
  title,
  description,
  children,
}) => {
  return (
    <section className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
      <div className="mb-5 border-b border-zinc-100 pb-4">
        <h2 className="text-lg font-semibold text-zinc-900">{title}</h2>
        {description && (
          <p className="mt-1 text-sm text-slate-600">{description}</p>
        )}
      </div>
      <div className="space-y-4">{children}</div>
    </section>
  );
};

type FormFieldProps = Readonly<{
  label: string;
  required?: boolean;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}>;

export const FormField: React.FC<FormFieldProps> = ({
  label,
  required = false,
  error,
  hint,
  children,
}) => {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-zinc-900">
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </label>
      {children}
      {hint && !error && <p className="text-xs text-slate-500">{hint}</p>}
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
};

type FormActionsProps = Readonly<{
  submitLabel?: string;
  cancelLabel?: string;
  isSubmitting?: boolean;
  onCancel?: () => void;
  submitIcon?: React.ReactNode;
}>;

export const FormActions: React.FC<FormActionsProps> = ({
  submitLabel = "Save",
  cancelLabel = "Cancel",
  isSubmitting = false,
  onCancel,
  submitIcon,
}) => {
  return (
    <div className="flex items-center justify-end gap-3 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
      {onCancel && (
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
          className="border-zinc-300 text-slate-600 hover:bg-zinc-50"
        >
          {cancelLabel}
        </Button>
      )}
      <Button
        type="submit"
        disabled={isSubmitting}
        className="bg-zinc-900 text-white hover:bg-zinc-800"
      >
        {submitIcon}
        {isSubmitting ? "Saving..." : submitLabel}
      </Button>
    </div>
  );
};
