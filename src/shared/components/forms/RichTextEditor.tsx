import React from "react";

type Props = Readonly<{
  value: string;
  onChange: (value: string) => void;
  minHeight?: number;
}>;

export const RichTextEditor: React.FC<Props> = ({ value, onChange, minHeight = 160 }) => {
  const ref = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    if (!ref.current) return;
    if (ref.current.innerHTML !== value) ref.current.innerHTML = value;
  }, [value]);

  const run = (command: string, arg?: string) => {
    document.execCommand(command, false, arg);
    onChange(ref.current?.innerHTML ?? "");
  };

  return (
    <div style={{ border: "1px solid var(--line)", borderRadius: 12, overflow: "hidden", background: "var(--surface-2)" }}>
      <div style={{ display: "flex", gap: 6, padding: 8, borderBottom: "1px solid var(--line)", flexWrap: "wrap" }}>
        <button type="button" onClick={() => run("bold")} style={{ padding: "6px 10px", border: "1px solid var(--line)", background: "#fff" }}>B</button>
        <button type="button" onClick={() => run("italic")} style={{ padding: "6px 10px", border: "1px solid var(--line)", background: "#fff", fontStyle: "italic" }}>I</button>
        <button type="button" onClick={() => run("underline")} style={{ padding: "6px 10px", border: "1px solid var(--line)", background: "#fff", textDecoration: "underline" }}>U</button>
        <button type="button" onClick={() => run("insertUnorderedList")} style={{ padding: "6px 10px", border: "1px solid var(--line)", background: "#fff" }}>• List</button>
        <button type="button" onClick={() => run("formatBlock", "<h3>")} style={{ padding: "6px 10px", border: "1px solid var(--line)", background: "#fff" }}>H3</button>
        <button type="button" onClick={() => run("removeFormat")} style={{ padding: "6px 10px", border: "1px solid var(--line)", background: "#fff" }}>Clear</button>
      </div>
      <div
        ref={ref}
        contentEditable
        suppressContentEditableWarning
        onInput={() => onChange(ref.current?.innerHTML ?? "")}
        style={{ minHeight, padding: 12, outline: "none", background: "#fff" }}
      />
    </div>
  );
};
