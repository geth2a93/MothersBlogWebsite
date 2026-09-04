import { useRef, useEffect } from "react";

function RichTextEditor({ value, onChange, className }) {
  const editorRef = useRef(null);

  useEffect(() => {
    if (
      editorRef.current &&
      editorRef.current.innerHTML !== (value || "")
    ) {
      editorRef.current.innerHTML = value || "";
    }
  }, [value]);

  const formatText = (command) => {
    editorRef.current.focus();
    document.execCommand(command, false, null);

    onChange(editorRef.current.innerHTML);
  };

  return (
    <div className="rich-text-editor">
      <div className="editor-toolbar">
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => formatText("bold")}
        >
          <b>B</b>
        </button>

        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => formatText("italic")}
        >
          <i>I</i>
        </button>

        <button
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
        onInput={(e) => onChange(e.currentTarget.innerHTML)}
      />
    </div>
  );
}

export default RichTextEditor;