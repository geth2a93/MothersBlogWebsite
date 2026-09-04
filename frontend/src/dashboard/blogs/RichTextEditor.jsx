import { useRef } from "react";

function RichTextEditor({ value, onChange }) {
  const editorRef = useRef(null);

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
          onClick={() => formatText("bold")}
        >
          <b>B</b>
        </button>

        <button
          type="button"
          onClick={() => formatText("italic")}
        >
          <i>I</i>
        </button>

        <button
          type="button"
          onClick={() => formatText("removeFormat")}
        >
          Normal
        </button>
      </div>

      <div
        ref={editorRef}
        className="editor-content"
        contentEditable
        dangerouslySetInnerHTML={{ __html: value || "" }}
        onInput={(e) => onChange(e.currentTarget.innerHTML)}
      />
    </div>
  );
}

export default RichTextEditor;