import { useRef, useEffect, useState } from "react";
import "../css/editor.css";

function RichTextToolbar({ activeEditor }) {
	const [boldActive, setBoldActive] = useState(false);
  const [italicActive, setItalicActive] = useState(false);
  const [underlineActive, setUnderlineActive] = useState(false);
  const [fontSize, setFontSize] = useState("3");
  
  const updateFormatState = () => {
    setBoldActive(document.queryCommandState("bold"));
    setItalicActive(document.queryCommandState("italic"));
    setUnderlineActive(document.queryCommandState("underline"));
  };

  useEffect(() => {
  if (!activeEditor) return;

  if (activeEditor.classList.contains("title-rich")) {
    setFontSize("5");
  } else if (activeEditor.classList.contains("text-area-rich")) {
    setFontSize("3");
  }
}, [activeEditor]);
  
  const formatText = (command, value = null) => {
    if (!activeEditor) return;

    activeEditor.focus();
    document.execCommand(command, false, value);

    activeEditor.dispatchEvent(new Event("input", { bubbles: true }));
  };

  const removeAllFormatting = () => {
    if (!activeEditor) return;

    activeEditor.focus();

    const text = activeEditor.innerText;
    activeEditor.innerText = text;

    activeEditor.dispatchEvent(new Event("input", { bubbles: true }));
  };

  const addLink = () => {
  const url = prompt("Enter URL:");

  if (url) {
    document.execCommand("createLink", false, url);
  }
};
  
  return (
    <div className="editor-toolbar">

      <button
        type="button"
        className={`rich-text-button ${boldActive ? "active" : ""}`}
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => formatText("bold")}
      >
        <b>B</b>
      </button>

      <button
        type="button"
        className={`rich-text-button ${underlineActive ? "active" : ""}`}
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => formatText("underline")}
      >
        <u>U</u>
      </button>

      <button
        type="button"
        className={`rich-text-button ${italicActive ? "active" : ""}`}
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => formatText("italic")}
      >
        <i>I</i>
      </button>

      <button
        type="button"
        className="rich-text-button"
        onMouseDown={(e) => e.preventDefault()}
        onClick={removeAllFormatting}
      >
        Normal
      </button>

      <button
        type="button"
        className="rich-text-color-blue"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => formatText("foreColor", "#0F7BA8")}
      >
        Title Blue
      </button>

      <button
        type="button"
        className="rich-text-color-gray"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => formatText("foreColor", "#4B4B4B")}
      >
        Text Gray
      </button>

      <button
        type="button"
        className="rich-text-color-black"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => formatText("foreColor", "#000000")}
      >
        Black
      </button>

      <select
        className="rich-text-font"
        onChange={(e) => formatText("fontName", e.target.value)}
        defaultValue="Alegreya"
      >
        <option value="Alegreya">Alegreya</option>
        <option value="Alegreya Sans">Alegreya Sans</option>
        <option value="Arial">Arial</option>
        <option value="Times New Roman">Times New Roman</option>
        <option value="Impact">Impact</option>
        <option value="Dancing Script">Dancing Script</option>
      </select>

      <select
        className="rich-text-font"
        value={fontSize}
        onChange={(e) => {
        setFontSize(e.target.value);
        formatText("fontSize", e.target.value);
      }}
      >
        <option value="1">10px</option>
        <option value="2">12px</option>
        <option value="3">16px</option>
        <option value="4">18px</option>
        <option value="5">24px</option>
        <option value="6">32px</option>
        <option value="7">48px</option>
      </select>

      <button
        type="button"
        className="rich-text-button"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => formatText("justifyLeft")}
      >
        Left
      </button>

      <button
        type="button"
        className="rich-text-button"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => formatText("justifyCenter")}
      >
        Center
      </button>

      <button
        type="button"
        className="rich-text-button"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => formatText("justifyRight")}
      >
        Right
      </button>

      <button
        type="button"
        onMouseDown={(e) => e.preventDefault()}
        onClick={addLink}
      >
        🔗 Link
      </button>

    </div>
  );
}

function RichTextEditor({ value, onChange, className, onFocus }) {
  const editorRef = useRef(null);

  useEffect(() => {
    if (
      editorRef.current &&
      editorRef.current.innerHTML !== (value || "")
    ) {
      editorRef.current.innerHTML = value || "";
    }
  }, [value]);

  const handleKeyDown = (e) => {
    if (e.key === "Tab") {
      e.preventDefault();
      document.execCommand("insertText", false, "    ");
      onChange(editorRef.current.innerHTML);
    }
  };

  return (
    <div
      ref={editorRef}
      className={`editor-content ${className || ""}`}
      contentEditable
      onFocus={() => onFocus(editorRef.current)}
      onInput={(e) => onChange(e.currentTarget.innerHTML)}
      onKeyDown={handleKeyDown}
    />
  );
}

export { RichTextToolbar };
export default RichTextEditor;