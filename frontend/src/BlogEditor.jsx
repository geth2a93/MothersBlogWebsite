import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import ContentBlockEditor from "./ContentBlockEditor";
import { createEmptyBlock } from "./blogHelper";

// =========================
// DEFAULT STATE (SOURCE OF TRUTH)
// =========================
const defaultBlog = {
  title: "",
  preview: "",
  date: "",
  tags: [],
  url_content_type: "None",
  ownership: true,
  name_of_owner: "",
  title_image: null,

  hero: {
    file: null,
    preview_url: null,
    ownership: true,
    owner_name: ""
  },

  content_blocks: []
};

export default function BlogEditor() {
  const navigate = useNavigate();

  // =========================
  // SAFE HYDRATION (LOCALSTORAGE FIX)
  // =========================
  const [blog, setBlog] = useState(() => {
    const saved = localStorage.getItem("draftBlog");

    if (!saved) return defaultBlog;

    try {
      const parsed = JSON.parse(saved);

      return {
        ...defaultBlog,
        ...parsed,
        hero: {
          ...defaultBlog.hero,
          ...(parsed.hero || {})
        },
        content_blocks: parsed.content_blocks || []
      };
    } catch (e) {
      return defaultBlog;
    }
  });

  // =========================
  // AUTO SAVE (SAFE - NO FILE STORAGE)
  // =========================
  useEffect(() => {
    const safeBlog = {
      ...blog,
      hero: {
        ...blog.hero,
        file: null // File cannot be stored in localStorage
      }
    };

    localStorage.setItem("draftBlog", JSON.stringify(safeBlog));
  }, [blog]);

  // =========================
  // HERO IMAGE HANDLER
  // =========================
  const handleHeroImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);

    setBlog((prev) => {
      if (prev.hero.preview_url) {
        URL.revokeObjectURL(prev.hero.preview_url);
      }

      return {
        ...prev,
        hero: {
          ...prev.hero,
          file,
          preview_url: previewUrl
        }
      };
    });
  };

  // =========================
  // BLOCK OPERATIONS
  // =========================
  const addBlock = () => {
    setBlog((prev) => ({
      ...prev,
      content_blocks: [
        ...prev.content_blocks,
        createEmptyBlock(prev.content_blocks.length)
      ]
    }));
  };

  const updateBlock = (index, updatedBlock) => {
    setBlog((prev) => {
      const updated = [...prev.content_blocks];
      updated[index] = updatedBlock;

      return {
        ...prev,
        content_blocks: updated
      };
    });
  };

  const removeBlock = (index) => {
    setBlog((prev) => ({
      ...prev,
      content_blocks: prev.content_blocks.filter((_, i) => i !== index)
    }));
  };

  // =========================
  // PREVIEW NAVIGATION
  // =========================
  const handlePreview = () => {
    navigate("/admin/blog-preview");
  };

  // =========================
  // UI
  // =========================
  return (
    <div>
      <h1>Create Blog</h1>

      {/* TITLE */}
      <input
        placeholder="Title"
        value={blog.title}
        onChange={(e) =>
          setBlog((prev) => ({
            ...prev,
            title: e.target.value
          }))
        }
      />

      {/* PREVIEW TEXT */}
      <textarea
        placeholder="Preview"
        value={blog.preview}
        onChange={(e) =>
          setBlog((prev) => ({
            ...prev,
            preview: e.target.value
          }))
        }
      />

      {/* =========================
          HERO MEDIA
      ========================= */}
      <h2>Hero Media</h2>

      <input type="file" onChange={handleHeroImage} />

      {blog.hero.preview_url && (
        <div style={{ marginTop: "10px" }}>
          <p>Current hero image:</p>

          <img
            src={blog.hero.preview_url}
            alt="Hero preview"
            style={{
              maxWidth: "400px",
              height: "auto",
              borderRadius: "8px"
            }}
          />

          <button
            type="button"
            onClick={() =>
              setBlog((prev) => {
                if (prev.hero.preview_url) {
                  URL.revokeObjectURL(prev.hero.preview_url);
                }

                return {
                  ...prev,
                  hero: {
                    ...prev.hero,
                    file: null,
                    preview_url: null
                  }
                };
              })
            }
          >
            Remove Hero Image
          </button>

          <label>
            <input
              type="checkbox"
              checked={blog.hero.ownership}
              onChange={(e) =>
                setBlog((prev) => ({
                  ...prev,
                  hero: {
                    ...prev.hero,
                    ownership: e.target.checked
                  }
                }))
              }
            />
            I own this image
          </label>

          {!blog.hero.ownership && (
            <input
              placeholder="Owner name"
              value={blog.hero.owner_name}
              onChange={(e) =>
                setBlog((prev) => ({
                  ...prev,
                  hero: {
                    ...prev.hero,
                    owner_name: e.target.value
                  }
                }))
              }
            />
          )}
        </div>
      )}

      {/* =========================
          CONTENT BLOCKS
      ========================= */}
      <h2>Content Blocks</h2>

      {blog.content_blocks.map((block, index) => (
        <ContentBlockEditor
          key={block.id || index}
          block={block}
          index={index}
          updateBlock={updateBlock}
          removeBlock={removeBlock}
        />
      ))}

      <button type="button" onClick={addBlock}>
        Add Block
      </button>

      {/* PREVIEW */}
      <button type="button" onClick={handlePreview}>
        Preview
      </button>
    </div>
  );
}