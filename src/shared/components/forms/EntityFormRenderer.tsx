import React from "react";
import { Eye, EyeOff, Trash2 } from "lucide-react";
import RichTextEditor from "@/shared/components/RichTextEditor";

export type EntityFieldOption = Readonly<{ label: string; value: string }>;

export type EntityFieldConfig = Readonly<{
  name: string;
  label: string;
  type: "text" | "textarea" | "select" | "checkbox" | "file" | "date" | "password" | "richtext";
  required?: boolean;
  placeholder?: string;
  options?: ReadonlyArray<EntityFieldOption>;
  accept?: string;
  multiple?: boolean;
  maxFiles?: number;
  rows?: number;
}>;

type Props = Readonly<{
  fields: ReadonlyArray<EntityFieldConfig>;
  values: Record<string, unknown>;
  errors?: Record<string, string>;
  onFieldChange: (name: string, value: unknown) => void;
  filePreviewUrls?: Record<string, unknown>;
  onRemoveExistingPreview?: (name: string, index: number) => void;
}>;

const FileInputField: React.FC<Readonly<{
  field: EntityFieldConfig;
  value: unknown;
  existingPreview?: unknown;
  error?: string;
  onFieldChange: (name: string, value: unknown) => void;
  onRemoveExistingPreview?: (name: string, index: number) => void;
}>> = ({ field, value, existingPreview, error, onFieldChange, onRemoveExistingPreview }) => {
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const [limitMessage, setLimitMessage] = React.useState("");
  const files = React.useMemo(() => {
    if (Array.isArray(value)) return value.filter((v): v is File => v instanceof File);
    if (value instanceof File) return [value];
    return [] as File[];
  }, [value]);

  const previewUrls = React.useMemo(() => files.map((file) => URL.createObjectURL(file)), [files]);

  React.useEffect(() => {
    return () => {
      for (const url of previewUrls) URL.revokeObjectURL(url);
    };
  }, [previewUrls]);

  const existingUrls = React.useMemo(() => {
    const isImageLikeUrl = (value: string): boolean =>
      /^https?:\/\//i.test(value) || /^data:image\//i.test(value);

    const pickUrls = (value: unknown): string[] => {
      if (!value) return [];
      if (typeof value === "string") return isImageLikeUrl(value) ? [value] : [];
      if (Array.isArray(value)) return value.flatMap((v) => pickUrls(v));
      if (typeof value === "object") {
        const obj = value as Record<string, unknown>;
        const direct = [obj.url, obj.fileUrl, obj.imageUrl, obj.image, obj.coverImageUrl, obj.logoUrl, obj.path, obj.src]
          .filter((v): v is string => typeof v === "string" && isImageLikeUrl(v));
        if (direct.length > 0) return direct;
        return Object.values(obj).flatMap((v) => pickUrls(v));
      }
      return [];
    };
    return pickUrls(existingPreview);
  }, [existingPreview]);
  const previews = [
    ...previewUrls.map((url, index) => ({ url, kind: "new" as const, index })),
    ...existingUrls.map((url, index) => ({ url, kind: "existing" as const, index })),
  ];
  const maxFiles = field.multiple ? field.maxFiles : undefined;
  const totalFilesCount = files.length + existingUrls.length;
  const isRequired = field.required ?? (!field.name.startsWith("remove") && field.name !== "sortOrder");

  const removeNewAt = (fileIndex: number) => {
    if (field.multiple) {
      const next = files.filter((_, i) => i !== fileIndex);
      onFieldChange(field.name, next);
      return;
    }
    onFieldChange(field.name, null);
  };

  return (
    <label key={field.name} style={{ display: "grid", gap: 6 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, flexWrap: "nowrap" }}>
        <span style={{ fontSize: 13 }}>
          {field.label}
          {isRequired ? <span style={{ color: "var(--primary)", marginLeft: 4 }}>*</span> : null}
        </span>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          style={{
            padding: "0 12px",
            height: 32,
            borderRadius: 0,
            border: "1px solid #cbd5e1",
            background: "#f1f5f9",
            color: "#334155",
            fontWeight: 600,
            fontSize: 12,
            cursor: "pointer",
          }}
        >
          {field.multiple ? "Add Files" : "Choose File"}
        </button>
      </div>
      <input ref={inputRef} type="file" accept={field.accept} multiple={Boolean(field.multiple)} style={{ display: "none" }}
        onChange={(e) => {
          if (field.multiple) {
            const incoming = Array.from(e.target.files ?? []);
            const existing = Array.isArray(value) ? value.filter((v): v is File => v instanceof File) : [];
            const unique = [...existing, ...incoming].filter(
              (file, index, arr) =>
                arr.findIndex(
                  (f) =>
                    f.name === file.name &&
                    f.size === file.size &&
                    f.lastModified === file.lastModified
                ) === index
            );
            const availableSlots = typeof maxFiles === "number" ? Math.max(maxFiles - existingUrls.length, 0) : Number.POSITIVE_INFINITY;
            const next = unique.slice(0, availableSlots);
            if (typeof maxFiles === "number" && unique.length > next.length) {
              setLimitMessage(`Max ${maxFiles} files allowed.`);
            } else {
              setLimitMessage("");
            }
            onFieldChange(field.name, next);
            e.currentTarget.value = "";
            return;
          }
          onFieldChange(field.name, e.target.files?.[0] ?? null);
        }}
      />
      {files.length > 0 ? (
        <div style={{ fontSize: 12, color: "var(--muted)" }}>
          Selected: {files.map((f) => f.name).join(", ")}
        </div>
      ) : null}
      {field.multiple && typeof maxFiles === "number" ? (
        <div style={{ fontSize: 12, color: "var(--muted)" }}>
          {Math.min(totalFilesCount, maxFiles)}/{maxFiles}
        </div>
      ) : null}
      {previews.length > 0 ? (
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {previews.map((item, idx) => (
            <div key={`${field.name}-preview-${item.kind}-${idx}`} style={{ position: "relative" }}>
              <img
                src={item.url}
                alt={`${field.label} preview ${idx + 1}`}
                style={{ width: 92, height: 92, objectFit: "cover", borderRadius: 10, border: "1px solid var(--line)" }}
              />
              {item.kind === "new" ? (
                <button
                  type="button"
                  onClick={() => removeNewAt(item.index)}
                  title="Remove"
                  style={{
                    position: "absolute",
                    top: -6,
                    right: -6,
                    width: 20,
                    height: 20,
                    borderRadius: "50%",
                    border: "1px solid #fecaca",
                    background: "#fff1f2",
                    color: "#be123c",
                    fontWeight: 700,
                    lineHeight: 1,
                    cursor: "pointer",
                    padding: 0,
                  }}
                >
                  <Trash2 size={11} />
                </button>
              ) : onRemoveExistingPreview ? (
                <button
                  type="button"
                  onClick={() => onRemoveExistingPreview(field.name, item.index)}
                  title="Remove existing"
                  style={{
                    position: "absolute",
                    top: -6,
                    right: -6,
                    width: 20,
                    height: 20,
                    borderRadius: "50%",
                    border: "1px solid #fecaca",
                    background: "#fff1f2",
                    color: "#be123c",
                    fontWeight: 700,
                    lineHeight: 1,
                    cursor: "pointer",
                    padding: 0,
                  }}
                >
                  <Trash2 size={11} />
                </button>
              ) : null}
            </div>
          ))}
        </div>
      ) : null}
      {limitMessage ? <span style={{ color: "#b45309", fontSize: 12 }}>{limitMessage}</span> : null}
      {error ? <span style={{ color: "crimson", fontSize: 12 }}>{error}</span> : null}
    </label>
  );
};

export const EntityFormRenderer: React.FC<Props> = ({ fields, values, errors, onFieldChange, filePreviewUrls, onRemoveExistingPreview }) => {
  const [passwordVisible, setPasswordVisible] = React.useState<Record<string, boolean>>({});
  const fieldInputStyle: React.CSSProperties = {
    padding: "8px 10px",
    borderRadius: 0,
    border: "1px solid #cbd5e1",
    background: "#ffffff",
    boxShadow: "inset 0 1px 0 rgba(15,23,42,0.02)",
    fontSize: 13,
  };

  const isWideField = (field: EntityFieldConfig): boolean =>
    field.type === "textarea" ||
    field.type === "richtext" ||
    field.type === "file" ||
    field.type === "checkbox" ||
    field.name.toLowerCase().includes("description") ||
    field.name.toLowerCase().includes("message") ||
    field.name.toLowerCase().includes("address");

  const optionalFieldNames = new Set([
    "middlename",
    "sortOrder",
    "facebook",
    "twitter",
    "linkedin",
    "instagram",
    "isVerified",
    "isActive",
    "addToHome",
    "isLeader",
  ]);

  const renderLabel = (field: EntityFieldConfig) => {
    const required =
      field.required ??
      (!optionalFieldNames.has(field.name) &&
        !field.name.startsWith("remove") &&
        field.type !== "checkbox");
    return (
      <span style={{ fontSize: 13 }}>
        {field.label}
        {required ? <span style={{ color: "var(--primary)", marginLeft: 4 }}>*</span> : null}
      </span>
    );
  };

  return (
    <div style={{ display: "grid", gap: 10, gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))" }}>
      {fields.map((f) => {
        if (f.type === "checkbox") {
          return (
            <label key={f.name} style={{ gridColumn: "1 / -1", display: "flex", gap: 8, alignItems: "center", padding: "8px 10px", border: "1px solid var(--line)", borderRadius: 0, background: "var(--surface-2)" }}>
              <input
                type="checkbox"
                checked={Boolean(values[f.name])}
                onChange={(e) => onFieldChange(f.name, e.target.checked)}
              />
              <span>{f.label}</span>
            </label>
          );
        }

        if (f.type === "textarea") {
          return (
            <label key={f.name} style={{ gridColumn: "1 / -1", display: "grid", gap: 6 }}>
              {renderLabel(f)}
              <textarea
                rows={f.rows ?? 4}
                value={String(values[f.name] ?? "")}
                placeholder={f.placeholder}
                onChange={(e) => onFieldChange(f.name, e.target.value)}
                style={fieldInputStyle}
              />
              {errors?.[f.name] ? <span style={{ color: "crimson", fontSize: 12 }}>{errors[f.name]}</span> : null}
            </label>
          );
        }

        if (f.type === "richtext") {
          return (
            <label key={f.name} style={{ gridColumn: "1 / -1", display: "grid", gap: 6 }}>
              {renderLabel(f)}
              <RichTextEditor initialContent={String(values[f.name] ?? "")} onChange={(v) => onFieldChange(f.name, v)} />
              {errors?.[f.name] ? <span style={{ color: "crimson", fontSize: 12 }}>{errors[f.name]}</span> : null}
            </label>
          );
        }

        if (f.type === "select") {
          return (
            <label key={f.name} style={{ gridColumn: isWideField(f) ? "1 / -1" : "auto", display: "grid", gap: 6 }}>
              {renderLabel(f)}
              <select
                value={String(values[f.name] ?? "")}
                onChange={(e) => onFieldChange(f.name, e.target.value)}
                style={fieldInputStyle}
              >
                {(f.options ?? []).map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              {errors?.[f.name] ? <span style={{ color: "crimson", fontSize: 12 }}>{errors[f.name]}</span> : null}
            </label>
          );
        }

        if (f.type === "file") {
          return (
            <div key={f.name} style={{ gridColumn: "1 / -1" }}>
              <FileInputField
                field={f}
                value={values[f.name]}
                existingPreview={filePreviewUrls?.[f.name] ?? null}
                error={errors?.[f.name]}
                onFieldChange={onFieldChange}
                onRemoveExistingPreview={onRemoveExistingPreview}
              />
            </div>
          );
        }

        return (
          <label key={f.name} style={{ gridColumn: isWideField(f) ? "1 / -1" : "auto", display: "grid", gap: 6 }}>
            {renderLabel(f)}
            {f.type === "password" ? (
              <div style={{ position: "relative" }}>
                <input
                  type={passwordVisible[f.name] ? "text" : "password"}
                  value={String(values[f.name] ?? "")}
                  placeholder={f.placeholder}
                  onChange={(e) => onFieldChange(f.name, e.target.value)}
                  style={{ ...fieldInputStyle, paddingRight: 34, width: "100%" }}
                />
                <button
                  type="button"
                  onClick={() => setPasswordVisible((prev) => ({ ...prev, [f.name]: !prev[f.name] }))}
                  aria-label={passwordVisible[f.name] ? "Hide password" : "Show password"}
                  style={{
                    position: "absolute",
                    right: 8,
                    top: "50%",
                    transform: "translateY(-50%)",
                    border: "none",
                    background: "transparent",
                    cursor: "pointer",
                    padding: 2,
                    color: "#64748b",
                  }}
                >
                  {passwordVisible[f.name] ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            ) : (
              <input
                type={f.type}
                value={String(values[f.name] ?? "")}
                placeholder={f.placeholder}
                onChange={(e) => onFieldChange(f.name, e.target.value)}
                style={fieldInputStyle}
              />
            )}
            {errors?.[f.name] ? <span style={{ color: "crimson", fontSize: 12 }}>{errors[f.name]}</span> : null}
          </label>
        );
      })}
    </div>
  );
};
