import { useRef, useEffect, useState } from "react";
import "../css/editor.css";

function RichTextEditor({ value, onChange, className }) {
  const editorRef = useRef(null);

  const [boldActive, setBoldActive] = useState(false);
  const [italicActive, setItalicActive] = useState(false);
  const [underlineActive, setUnderlineActive] = useState(false);

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
    setUnderlineActive(document.queryCommandState("underline"));
  };

  const formatText = (command, value = null) => {
    editorRef.current.focus();
    document.execCommand(command, false, value);
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
          className={`rich-text-button ${underlineActive ? "active" : ""}`}
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => formatText("underline")}
        >
          <u>U</u>
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

        <select
          className="rich-text-font"
          onChange={(e) => formatText("fontName", e.target.value)}
          defaultValue=""
        >
          <option value="" disabled>
          Font
          </option>
          <option value="Arial">Arial</option>
          <option value="Georgia">Georgia</option>
          <option value="Times New Roman">Times New Roman</option>
          <option value="Verdana">Verdana</option>
          <option value="Courier New">Courier New</option>
          <option value="Trebuchet MS">Trebuchet MS</option>
        </select>

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