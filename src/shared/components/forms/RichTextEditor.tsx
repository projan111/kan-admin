import React from "react";
import SharedRichTextEditor from "@/shared/components/RichTextEditor";

type Props = Readonly<{
  value: string;
  onChange: (value: string) => void;
  minHeight?: number;
}>;

export const RichTextEditor: React.FC<Props> = ({ value, onChange, minHeight = 160 }) => (
  <SharedRichTextEditor initialContent={value} onChange={onChange} minHeight={`${minHeight}px`} />
);
