import React from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import {
  Alignment,
  AutoImage,
  AutoLink,
  Base64UploadAdapter,
  BlockQuote,
  Bold,
  ClassicEditor,
  Code,
  CodeBlock,
  Essentials,
  FontColor,
  FontFamily,
  FontSize,
  Heading,
  HorizontalLine,
  ImageBlock,
  ImageCaption,
  ImageInsert,
  ImageInsertViaUrl,
  ImageResize,
  ImageStyle,
  ImageToolbar,
  ImageUpload,
  Indent,
  IndentBlock,
  Italic,
  Link,
  LinkImage,
  List,
  ListProperties,
  Paragraph,
  PasteFromOffice,
  RemoveFormat,
  Strikethrough,
  Table,
  TableCaption,
  TableCellProperties,
  TableColumnResize,
  TableProperties,
  TableSelection,
  TableToolbar,
  TextTransformation,
  Underline,
  type EditorConfig,
} from "ckeditor5";

import "ckeditor5/ckeditor5.css";
import "@/styles/ckeditor-custom.css";

type Props = Readonly<{
  initialContent: string;
  onChange: (content: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  minHeight?: string;
}>;

const RichTextEditor: React.FC<Props> = ({
  initialContent = "",
  onChange,
  placeholder = "Start typing...",
  className,
  disabled = false,
  minHeight = "400px",
}) => {
  const lastEmittedRef = React.useRef(initialContent);
  const editorRef = React.useRef<{ getData: () => string; setData: (data: string) => void } | null>(null);

  React.useEffect(() => {
    const editor = editorRef.current;
    if (!editor) return;
    const current = editor.getData();
    if (initialContent !== current && initialContent !== lastEmittedRef.current) {
      editor.setData(initialContent);
      lastEmittedRef.current = initialContent;
    }
  }, [initialContent]);

  const editorConfig: EditorConfig = React.useMemo(
    () => ({
      licenseKey: "GPL",
      toolbar: {
        items: [
          "heading",
          "|",
          "fontSize",
          "fontFamily",
          "fontColor",
          "|",
          "bold",
          "italic",
          "underline",
          "strikethrough",
          "code",
          "removeFormat",
          "|",
          "alignment",
          "|",
          "bulletedList",
          "numberedList",
          "|",
          "outdent",
          "indent",
          "|",
          "link",
          "insertImage",
          "insertTable",
          "blockQuote",
          "codeBlock",
          "horizontalLine",
        ],
        shouldNotGroupWhenFull: true,
      },
      plugins: [
        Alignment,
        AutoImage,
        AutoLink,
        Base64UploadAdapter,
        BlockQuote,
        Bold,
        Code,
        CodeBlock,
        Essentials,
        FontColor,
        FontFamily,
        FontSize,
        Heading,
        HorizontalLine,
        ImageBlock,
        ImageCaption,
        ImageInsert,
        ImageInsertViaUrl,
        ImageResize,
        ImageStyle,
        ImageToolbar,
        ImageUpload,
        Indent,
        IndentBlock,
        Italic,
        Link,
        LinkImage,
        List,
        ListProperties,
        Paragraph,
        PasteFromOffice,
        RemoveFormat,
        Strikethrough,
        Table,
        TableCaption,
        TableCellProperties,
        TableColumnResize,
        TableProperties,
        TableToolbar,
        TableSelection,
        TextTransformation,
        Underline,
      ],
      balloonToolbar: ["bold", "italic", "|", "link"],
      fontFamily: {
        options: [
          "default",
          "Arial, Helvetica, sans-serif",
          "Courier New, Courier, monospace",
          "Georgia, serif",
          "Lucida Sans Unicode, Lucida Grande, sans-serif",
          "Tahoma, Geneva, sans-serif",
          "Times New Roman, Times, serif",
          "Trebuchet MS, Helvetica, sans-serif",
          "Verdana, Geneva, sans-serif",
        ],
        supportAllValues: true,
      },
      fontSize: {
        options: [10, 12, 14, "default", 18, 20, 22, 24, 26, 28, 36, 48, 72],
        supportAllValues: true,
      },
      heading: {
        options: [
          { model: "paragraph", title: "Paragraph", class: "ck-heading_paragraph" },
          { model: "heading1", view: "h1", title: "Heading 1", class: "ck-heading_heading1" },
          { model: "heading2", view: "h2", title: "Heading 2", class: "ck-heading_heading2" },
          { model: "heading3", view: "h3", title: "Heading 3", class: "ck-heading_heading3" },
          { model: "heading4", view: "h4", title: "Heading 4", class: "ck-heading_heading4" },
          { model: "heading5", view: "h5", title: "Heading 5", class: "ck-heading_heading5" },
          { model: "heading6", view: "h6", title: "Heading 6", class: "ck-heading_heading6" },
        ],
      },
      image: {
        toolbar: [
          "toggleImageCaption",
          "imageTextAlternative",
          "|",
          "imageStyle:alignLeft",
          "imageStyle:alignCenter",
          "imageStyle:alignRight",
          "|",
          "resizeImage",
          "|",
          "linkImage",
        ],
        insert: { integrations: ["upload", "url"] },
        resizeUnit: "px",
        resizeOptions: [
          { name: "resizeImage:original", label: "Original", value: null },
          { name: "resizeImage:25", label: "25%", value: "25" },
          { name: "resizeImage:50", label: "50%", value: "50" },
          { name: "resizeImage:75", label: "75%", value: "75" },
          { name: "resizeImage:100", label: "100%", value: "100" },
        ],
        styles: {
          options: ["alignLeft", "alignCenter", "alignRight", "alignBlockLeft", "alignBlockRight", "block", "side"],
        },
      },
      link: {
        addTargetToExternalLinks: true,
        defaultProtocol: "https://",
        decorators: {
          toggleDownloadable: {
            mode: "manual",
            label: "Downloadable",
            attributes: { download: "file" },
          },
          openInNewTab: {
            mode: "manual",
            label: "Open in a new tab",
            defaultValue: true,
            attributes: { target: "_blank", rel: "noopener noreferrer" },
          },
        },
      },
      list: {
        properties: {
          styles: true,
          startIndex: true,
          reversed: true,
        },
      },
      placeholder,
      table: {
        contentToolbar: [
          "tableColumn",
          "tableRow",
          "mergeTableCells",
          "tableProperties",
          "tableCellProperties",
          "toggleTableCaption",
        ],
      },
    }),
    [placeholder]
  );

  return (
    <div className={["ckeditor-wrapper", className].filter(Boolean).join(" ")} style={{ minHeight }}>
      <CKEditor
        editor={ClassicEditor}
        config={editorConfig}
        data={initialContent}
        disabled={disabled}
        disableWatchdog
        onReady={(editor: { getData: () => string; setData: (data: string) => void }) => {
          editorRef.current = editor;
        }}
        onChange={(_event: unknown, editor: { getData: () => string }) => {
          const data = editor.getData();
          lastEmittedRef.current = data;
          onChange(data);
        }}
      />
    </div>
  );
};

export default RichTextEditor;
