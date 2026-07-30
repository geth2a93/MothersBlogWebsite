export default function BlogBlockEditor({
  block,
  index,
  updateBlock,
  removeBlock
}) {
  return (
    <div className="admin-container">

      <h2>Content Blocks</h2>

      {blog.content_blocks.map((block, index) => (
        <div key={index} className="admin-container">
          <input
            placeholder="Block title"
            value={block.title_of_block}
            onChange={(e) =>
              updateBlock(index, {
                ...block,
                title_of_block: e.target.value
              })
            }
          />

          <textarea
            placeholder="Content"
            value={block.content || ""}
            onChange={(e) =>
              updateBlock(index, {
                ...block,
                content: e.target.value
              })
            }
          />

          <select value={block.alignment}
              onChange={(e) =>
              updateBlock(index, {
                ...block,
                alignment: e.target.value
              })
            }
          >
            <option value="left">Left</option>
            <option value="center">Center</option>
            <option value="right">Right</option>
          </select>

          <select
            value={block.url_content_type || ""}
            onChange={(e) =>
              updateBlock(index, {
                ...block,
                url_content_type: e.target.value || null
              })
            }
          >
            <option value="none">None</option>
            <option value="image">Image</option>
            <option value="youtube">Youtube</option>
            <option value="instagram">Instagram</option>
            <option value="facebook">Facebook</option>
            <option value="threads">Threads</option>
          </select>


        {block.url_content_type && block.url_content_type !== "image" && block.url_content_type !== "" && (
        <input
          type="text"
          placeholder="Paste link (YouTube, Instagram, X, etc.)"
          value={block.media_content_url}
          onChange={(e) =>
            updateBlock(index, {
            ...block,
            media_content_url: e.target.value
          })
        }
      />
  )}
          {block.url_content_type === "image" && (
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;

                updateBlock(index, {
                  ...block,
                  file,
                  preview_url: URL.createObjectURL(file)
                });
              }}
            />
          )}
          
          {block.preview_url && (
            <img src={block.preview_url} width="200" />
          )}

          {block.url_content_type == "image"  && (
          <select
            value={block.ownership.is_owner ? "true" : "false"}
            onChange={(e) =>
              updateBlock(index, {
                ...block,
                ownership: {
                  ...block.ownership,
                  is_owner: e.target.value === "true"
                }
              })
            }
          >
            <option value="true">Mine</option>
            <option value="false">Other</option>
            
          </select>
          )}

          {!block.ownership.is_owner && (
            <input
              placeholder="Owner name"
              value={block.ownership.name}
              onChange={(e) =>
                updateBlock(index, {
                  ...block,
                  ownership: {
                    ...block.ownership,
                    name: e.target.value
                  }
                })
              }
            />
          )}

          <button onClick={() => removeBlock(index)}>
            Delete Block
          </button>
        </div>
      ))}

      <button onClick={addBlock}>Add Block</button>

    <div>
      <button onClick={handlePreview}> Preview </button>
      <button onClick={() => { localStorage.clear(); window.location.href = "/admin/add-blog"; alert("Local storage cleared"); }}>
        Clear Form
      </button>
    </div>
    </div>
  );
}