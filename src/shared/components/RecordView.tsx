import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Pencil } from "lucide-react";

type Props = Readonly<{
  title: string;
  backHref: string;
  editHref?: string;
  data: Record<string, unknown>;
}>;

export const RecordView: React.FC<Props> = ({ title, backHref, editHref, data }) => {
  const [lightboxUrl, setLightboxUrl] = React.useState<string | null>(null);
  const isImageUrl = (value: string) => /^https?:\/\//i.test(value);
  const isImageKey = (key: string) => /image|logo|cover|profile|mediaasset/i.test(key);
  const extractImageUrl = (value: unknown): string => {
    if (typeof value === "string") return value;
    if (!value || typeof value !== "object") return "";
    const obj = value as Record<string, unknown>;
    const direct = [obj.url, obj.imageUrl, obj.coverImage, obj.logoUrl, obj.profileUrl, obj.path, obj.src].find((v) => typeof v === "string");
    return typeof direct === "string" ? direct : "";
  };
  const collectImageUrls = (value: unknown): string[] => {
    if (typeof value === "string") return isImageUrl(value) ? [value] : [];
    if (Array.isArray(value)) return value.flatMap((item) => collectImageUrls(item));
    if (!value || typeof value !== "object") return [];
    const obj = value as Record<string, unknown>;
    const own = extractImageUrl(obj);
    const nested = Object.values(obj).flatMap((v) => collectImageUrls(v));
    return [own, ...nested].filter((v): v is string => Boolean(v && isImageUrl(v)));
  };
  const renderImageGallery = (key: string, urls: ReadonlyArray<string>) => (
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
      {urls.map((url, idx) => (
        <img
          key={`${key}-${url}-${idx}`}
          src={url}
          alt={key}
          onClick={() => setLightboxUrl(url)}
          style={{ width: 120, height: 90, objectFit: "cover", borderRadius: 10, border: "1px solid var(--line)", cursor: "pointer" }}
        />
      ))}
    </div>
  );

  const renderValue = (key: string, value: unknown) => {
    if (typeof value === "string") {
      if (isImageKey(key)) {
        const urls = collectImageUrls(value);
        if (urls.length > 0) return renderImageGallery(key, urls);
      }
      if ((value.trim().startsWith("[") || value.trim().startsWith("{")) && isImageKey(key)) {
        try {
          const parsed = JSON.parse(value) as unknown;
          const urls = collectImageUrls(parsed);
          if (urls.length > 0) return renderImageGallery(key, urls);
        } catch {
          // fall through
        }
      }
      if (isImageKey(key) && isImageUrl(value)) {
        return <img src={value} alt={key} onClick={() => setLightboxUrl(value)} style={{ width: 220, maxWidth: "100%", borderRadius: 12, border: "1px solid var(--line)", cursor: "pointer" }} />;
      }
      if (value.includes("<") && value.includes(">")) return <span dangerouslySetInnerHTML={{ __html: value }} />;
      return value || "-";
    }

    if (Array.isArray(value)) {
      const imageUrls = collectImageUrls(value);

      if (imageUrls.length > 0) {
        return renderImageGallery(key, imageUrls);
      }
      return JSON.stringify(value);
    }

    if (typeof value === "object" && value !== null) {
      const urls = collectImageUrls(value);
      if (isImageKey(key) && urls.length > 0) {
        return urls.length === 1
          ? <img src={urls[0]} alt={key} onClick={() => setLightboxUrl(urls[0])} style={{ width: 220, maxWidth: "100%", borderRadius: 12, border: "1px solid var(--line)", cursor: "pointer" }} />
          : renderImageGallery(key, urls);
      }
      return JSON.stringify(value);
    }
    return String(value ?? "-");
  };

  return (
    <div style={{ display: "grid", gap: 12, maxWidth: 980, width: "100%" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "4px 4px" }}>
        <h2 style={{ margin: 0, fontSize: 24, fontWeight: 900 }}>{title}</h2>
        <div style={{ display: "flex", gap: 8 }}>
          {editHref ? (
            <Link
              to={editHref}
              title="Edit"
              aria-label="Edit"
              style={{ width: 36, height: 36, border: "1px solid var(--line)", background: "#eef2ff", color: "var(--primary)", textDecoration: "none", display: "inline-flex", alignItems: "center", justifyContent: "center", borderRadius: 999 }}
            >
              <Pencil size={15} />
            </Link>
          ) : null}
          <Link
            to={backHref}
            title="Back"
            aria-label="Back"
            style={{ width: 36, height: 36, border: "1px solid var(--line)", background: "#fff", color: "var(--text)", textDecoration: "none", display: "inline-flex", alignItems: "center", justifyContent: "center", borderRadius: 999 }}
          >
            <ArrowLeft size={15} />
          </Link>
        </div>
      </div>
      <div style={{ border: "1px solid var(--line)", borderRadius: 2, background: "var(--surface)", overflow: "hidden" }}>
        {Object.entries(data).map(([k, v]) => (
          <div key={k} style={{ display: "grid", gridTemplateColumns: "220px 1fr", gap: 8, padding: "10px 12px", borderBottom: "1px solid var(--line)" }}>
            <div style={{ color: "var(--muted)", fontSize: 13 }}>{k}</div>
            <div style={{ fontWeight: 600, whiteSpace: "pre-wrap" }}>
              {renderValue(k, v)}
            </div>
          </div>
        ))}
      </div>
      {lightboxUrl ? (
        <div
          onClick={() => setLightboxUrl(null)}
          style={{ position: "fixed", inset: 0, background: "rgba(2,6,23,0.8)", zIndex: 2000, display: "grid", placeItems: "center", padding: 20 }}
        >
          <img
            src={lightboxUrl}
            alt="Preview"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: "92vw", maxHeight: "92vh", borderRadius: 12, border: "1px solid #334155" }}
          />
        </div>
      ) : null}
    </div>
  );
};
