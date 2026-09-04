import { useRef, useEffect, useState } from "react";
import "../css/editor.css";

function RichTextEditor({ value, onChange, className }) {
  const editorRef = useRef(null);

  const [boldActive, setBoldActive] = useState(false);
  const [italicActive, setItalicActive] = useState(false);

  useEffect(() => {
    if (
      editorRef.current &&
      editorRef.current.innerHTML !== (value || "")
    ) {
      editorRef.current.innerHTML = value || "";
    }
  }, [value]);

  const updateFormatState = () => {
    setBoldActive(document.queryCommandState("bold"));
    setItalicActive(document.queryCommandState("italic"));
  };

  const formatText = (command) => {
    editorRef.current.focus();

    document.execCommand(command, false, null);

    onChange(editorRef.current.innerHTML);

    updateFormatState();
  };

  return (
    <div className="rich-text-editor">
      <div className="editor-toolbar">

        <button
          className={`rich-text-button ${boldActive ? "active" : ""}`}
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => formatText("bold")}
        >
          <b>B</b>
        </button>

        <button
          className={`rich-text-button ${italicActive ? "active" : ""}`}
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => formatText("italic")}
        >
          <i>I</i>
        </button>

        <button
          className="rich-text-button"
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => formatText("removeFormat")}
        >
          Normal
        </button>

      </div>

      <div
        ref={editorRef}
        className={`editor-content ${className || ""}`}
        contentEditable
        onInput={(e) => {
          onChange(e.currentTarget.innerHTML);
          updateFormatState();
        }}
        onKeyUp={updateFormatState}
        onMouseUp={updateFormatState}
      />
    </div>
  );
}

export default RichTextEditor;