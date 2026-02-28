import React from "react";
import { EditorContent, useEditor, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import Image from "@tiptap/extension-image";
import TextAlign from "@tiptap/extension-text-align";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Heading1,
  Heading2,
  Image as ImageIcon,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  Loader2,
  Underline as UnderlineIcon,
} from "lucide-react";
import { api } from "@/shared/api/api";

type UploadState = Readonly<{
  isUploading: boolean;
  message: string;
  type: "idle" | "success" | "error";
}>;

type UploadResponse = Readonly<{
  url?: string;
  data?: Readonly<{ url?: string }>;
  result?: Readonly<{ url?: string }>;
}>;

type Props = Readonly<{
  initialContent: string;
  onChange: (content: string) => void;
  placeholder?: string;
  className?: string;
}>;

const toolBtn = (active = false): React.CSSProperties => ({
  width: 32,
  height: 32,
  borderRadius: 999,
  border: "1px solid var(--line)",
  background: active ? "#e0e7ff" : "#fff",
  color: active ? "var(--primary)" : "var(--text)",
  display: "grid",
  placeItems: "center",
  cursor: "pointer",
});

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result === "string") resolve(result);
      else reject(new Error("Failed to read file"));
    };
    reader.onerror = () => reject(reader.error ?? new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
}

function insertLink(editor: Editor): void {
  const previous = editor.getAttributes("link").href as string | undefined;
  const next = window.prompt("Enter URL", previous ?? "https://");
  if (!next) return;
  editor.chain().focus().extendMarkRange("link").setLink({ href: next }).run();
}

const RichTextEditor: React.FC<Props> = ({ initialContent, onChange, placeholder, className }) => {
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);
  const [upload, setUpload] = React.useState<UploadState>({
    isUploading: false,
    message: "",
    type: "idle",
  });

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [1, 2] } }),
      Underline,
      Link.configure({ openOnClick: false }),
      Image,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Placeholder.configure({ placeholder: placeholder ?? "Write something..." }),
    ],
    content: initialContent || "",
    onUpdate: ({ editor: ed }) => onChange(ed.getHTML()),
    editorProps: {
      attributes: {
        class: "prose max-w-none min-h-[220px] focus:outline-none",
      },
    },
    immediatelyRender: false,
  });

  React.useEffect(() => {
    if (!editor) return;
    const current = editor.getHTML();
    if (current !== (initialContent || "")) editor.commands.setContent(initialContent || "");
  }, [editor, initialContent]);

  const uploadImage = React.useCallback(
    async (file: File) => {
      if (!editor) return;
      if (!file.type.startsWith("image/")) {
        setUpload({ isUploading: false, message: "Please select an image file.", type: "error" });
        return;
      }

      setUpload({ isUploading: true, message: "Uploading image...", type: "idle" });
      try {
        const fd = new FormData();
        fd.append("image", file);
        const res = await api.post<UploadResponse>("/images/upload", fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        const imageUrl = res.data?.url ?? res.data?.data?.url ?? res.data?.result?.url;
        if (!imageUrl) throw new Error("Invalid upload response");

        editor.chain().focus().setImage({ src: imageUrl }).run();
        setUpload({ isUploading: false, message: "Image uploaded.", type: "success" });
      } catch {
        try {
          const localPreview = await fileToDataUrl(file);
          editor.chain().focus().setImage({ src: localPreview }).run();
          setUpload({ isUploading: false, message: "Image added locally (upload API unavailable).", type: "success" });
        } catch {
          setUpload({ isUploading: false, message: "Image upload failed.", type: "error" });
        }
      }
    },
    [editor]
  );

  if (!editor) return null;

  return (
    <div className={className} style={{ border: "1px solid var(--line)", borderRadius: 12, overflow: "hidden", background: "#fff" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6, padding: 8, flexWrap: "wrap", borderBottom: "1px solid var(--line)", background: "var(--surface-2)" }}>
        <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} style={toolBtn(editor.isActive("bold"))}><Bold size={15} /></button>
        <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} style={toolBtn(editor.isActive("italic"))}><Italic size={15} /></button>
        <button type="button" onClick={() => editor.chain().focus().toggleUnderline().run()} style={toolBtn(editor.isActive("underline"))}><UnderlineIcon size={15} /></button>
        <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} style={toolBtn(editor.isActive("heading", { level: 1 }))}><Heading1 size={15} /></button>
        <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} style={toolBtn(editor.isActive("heading", { level: 2 }))}><Heading2 size={15} /></button>
        <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} style={toolBtn(editor.isActive("bulletList"))}><List size={15} /></button>
        <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()} style={toolBtn(editor.isActive("orderedList"))}><ListOrdered size={15} /></button>
        <button type="button" onClick={() => insertLink(editor)} style={toolBtn(editor.isActive("link"))}><LinkIcon size={15} /></button>
        <button type="button" onClick={() => fileInputRef.current?.click()} style={toolBtn()}><ImageIcon size={15} /></button>
        <button type="button" onClick={() => editor.chain().focus().setTextAlign("left").run()} style={toolBtn(editor.isActive({ textAlign: "left" }))}><AlignLeft size={15} /></button>
        <button type="button" onClick={() => editor.chain().focus().setTextAlign("center").run()} style={toolBtn(editor.isActive({ textAlign: "center" }))}><AlignCenter size={15} /></button>
        <button type="button" onClick={() => editor.chain().focus().setTextAlign("right").run()} style={toolBtn(editor.isActive({ textAlign: "right" }))}><AlignRight size={15} /></button>
        {upload.isUploading ? <Loader2 size={15} className="animate-spin" /> : null}
        {upload.message ? <span style={{ fontSize: 12, color: upload.type === "error" ? "#b91c1c" : upload.type === "success" ? "#166534" : "var(--muted)" }}>{upload.message}</span> : null}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) void uploadImage(file);
          if (fileInputRef.current) fileInputRef.current.value = "";
        }}
      />

      <div style={{ minHeight: 220, padding: 12 }}>
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};

export default RichTextEditor;
