"use client"
import React from "react";
import { Editor, EditorTextChangeEvent } from "primereact/editor";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
interface CustomEditorProps {
  text: string;
  setText: (value: string) => void;
}
export default function CustomEditor({ text, setText }:CustomEditorProps) {
  return (
    <Editor
      value={text}
      onTextChange={(e: EditorTextChangeEvent) => setText(e.htmlValue ?? "")}
      style={{ height: '320px' }}
      formats={[
        'header', 'font', 'size',
        'bold', 'italic', 'underline', 'strike',
        'color', 'background',
        'script',
        'blockquote', 'code-block',
        'list', 'list', 'indent',
        'link', 'image', 'video',
        'align', 'direction', 'code-block'
      ]}
    />
  );
}