import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";



const createEmptyBlock = (order = 0) => ({
  order,
  title_of_block: "",
  content: "",
  alignment: "center",

  url_content_type: null, // image | youtube | etc
  media_content_url: "",

  file: null,
  preview_url: null,

  ownership: {
    is_owner: true,
    name: ""
  }
});

const defaultBlog = {
  id: null,
  slug: null,
  title: "",
  preview: "",

  status: "draft", // draft | scheduled | published

  publish_date: "",

  tags: [],

  title_media: {
    type: "none",
    file: null,
    preview_url: null,
    url: "",

    ownership: {
      is_owner: true,
      name: ""
    }
  },

  content_blocks: []
};



export default function NewBlog() {
  const navigate = useNavigate();
  const [tagInput, setTagInput] = useState("");

  const [blog, setBlog] = useState(() => {
  const saved =
    localStorage.getItem("blogDraft");

  if (!saved) {
    return defaultBlog;
  }

  try {
    return JSON.parse(saved);
  } catch {
    return defaultBlog;
  }
}); 

 useEffect(() => {
  const safeBlog = {
    ...blog,

    // strip files (they break localStorage)
    title_media: {
      ...blog.title_media,
      file: null
    },

    content_blocks: blog.content_blocks.map(block => ({
      ...block,
      file: null
    }))
  };

  localStorage.setItem(
    "blogDraft",
    JSON.stringify(safeBlog)
  );
}, [blog]); 


  const addTag = () => {
  const tag = tagInput.trim();

  if (!tag) return;
  if (blog.tags.includes(tag)) return;

  setBlog(prev => ({
    ...prev,
    tags: [...prev.tags, tag]
  }));

  setTagInput("");
};

const removeTag = (tagToRemove) => {
  setBlog(prev => ({
    ...prev,
    tags: prev.tags.filter(tag => tag !== tagToRemove)
  }));
};


  const handleHeroFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setBlog((prev) => ({
      ...prev,
      title_media: {
        ...prev.title_media,
        file,
        preview_url: URL.createObjectURL(file)
      }
    }));
  };

  const addBlock = () => {
    setBlog((prev) => ({
      ...prev,
      content_blocks: [
        ...prev.content_blocks,
        createEmptyBlock(prev.content_blocks.length)
      ]
    }));
  };

  const updateBlock = (index, updated) => {
    setBlog((prev) => {
      const copy = [...prev.content_blocks];
      copy[index] = updated;

      return {
        ...prev,
        content_blocks: copy
      };
    });
  };

  const removeBlock = (index) => {
    setBlog((prev) => ({
      ...prev,
      content_blocks: prev.content_blocks.filter((_, i) => i !== index)
    }));
  };


  const setHeroType = (type) => {
    setBlog((prev) => ({
      ...prev,
      title_media: {
        ...prev.title_media,
        type
      }
    }));
  };

  const setHeroOwnership = (isOwner) => {
    setBlog((prev) => ({
      ...prev,
      title_media: {
        ...prev.title_media,
        ownership: {
          ...prev.title_media.ownership,
          is_owner: isOwner
        }
      }
    }));
  };
  
  const setHeroOwnerName = (name) => {
    setBlog((prev) => ({
      ...prev,
      title_media: {
        ...prev.title_media,
        ownership: {
          ...prev.title_media.ownership,
          name
        }
      }
    }));
  };


  const saveDraft = async () => {
  const formData = buildFormData();

  const res = await fetch(
    "http://localhost:5055/admin/newblogpost",
    {
      method: "PUT",
      credentials: "include",
      body: formData
    }
  );

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error);
  }

  return data.slug;
};

const buildFormData = () => {
  const formData = new FormData();

  formData.append("title", blog.title);
  formData.append("preview", blog.preview);

  if (blog.id) {
  formData.append("blog_id", blog.id);
  } 

  formData.append("date", blog.publish_date);

  blog.tags.forEach(tag => {
    formData.append("tags", tag);
  });

  formData.append(
    "title_url_content_type", blog.title_media.type
  );

  if (blog.title_media.type === "image") {
    formData.append(
      "ownership",
      blog.title_media.ownership.is_owner ? "true" : "false"
    );

    formData.append(
      "name_of_owner",
      blog.title_media.ownership.name || ""
    );

    if (blog.title_media.file) {
      formData.append(
        "title_image",
        blog.title_media.file
      );
    }
  }

  if (
    ["youtube", "instagram", "facebook", "threads"]
      .includes(blog.title_media.type)
  ) {
    formData.append(
      "title_media_content_url",
      blog.title_media.url
    );
  }

  const cleanedBlocks =
    blog.content_blocks.map((block, index) => ({
      order: index,
      title_of_block: block.title_of_block,
      content: block.content,
      alignment: block.alignment,
      url_content_type: block.url_content_type || "none",
      media_content_url: block.media_content_url,
      ownership: block.ownership.is_owner ? "true" : "false",
      name_of_owner: block.ownership.name
    }));

    console.log(
  "CONTENT BLOCKS:",
  JSON.stringify(cleanedBlocks, null, 2)
);

  formData.append(
    "content_blocks",
    JSON.stringify(cleanedBlocks)
  );

  blog.content_blocks.forEach((block, index) => {
    if (
      block.url_content_type === "image" &&
      block.file
    ) {
      formData.append(
        `image_${index}`,
        block.file
      );
    }
  });

  return formData;
};

const handlePreview = async () => {
  try {
    const formData = buildFormData(false);

  console.log("FORM DATA");
    for (const [key, value] of formData.entries()) {
    console.log(
      key,
      value instanceof File
        ? {
            name: value.name,
            size: value.size,
            type: value.type
          }
        : value
    );
  }


    const res = await fetch(
      "http://localhost:5055/admin/newblogpost",
      {
        method: "PUT",
        credentials: "include",
        body: formData
      }
    );

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || "Preview failed");
      return;
    }
        setBlog(prev => ({
  ...prev,
  id: data.blog_id,
  slug: data.slug
}));
    navigate(`/admin/blog-preview/${data.slug}`);
  } catch (err) {
    console.error(err);
  }
};

const isEmbed =
  ["youtube", "instagram", "facebook", "threads"]
  .includes(blog.title_media.type);

const handlePublish = async () => {
  try {
    const formData = buildFormData(true);
    
    const res = await fetch(
      "http://localhost:5055/admin/newblogpost",
      {
        method: "PUT",
        credentials: "include",
        body: formData
      }
    );

    const data = await res.json();
    console.log("POST OBJECT:", post);
    console.log("POST ID:", post?.id);
    if (!res.ok) {
      alert(data.error || "Publish failed");
      return;
    }

    setBlog(prev => ({
  ...prev,
  id: data.blog_id,
  slug: data.slug
}));

    alert("Published!");
  } catch (err) {
    console.error(err);
    alert("Publish failed");
  }
};

return (

  
    <div className="admin-container">
      <h1>Create Blog</h1>


      <div className="admin-card">
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
    <div>
      <textarea
        placeholder="Add Paragraph 1"
        value={blog.preview}
        onChange={(e) =>
          setBlog((prev) => ({
            ...prev,
            preview: e.target.value
          }))
        }
      />
      <h2>Publishing Date</h2>
    </div>

<input
  type="datetime-local"
  value={blog.publish_date}
  onChange={(e) =>
    setBlog(prev => ({
      ...prev,
      publish_date: e.target.value
    }))
  }
/>

<h2>Tags</h2>
  <input value={tagInput}
  placeholder="Add tag"
  onChange={(e) => setTagInput(e.target.value)}
/>

<button onClick={addTag}>
  Add Tag
</button>

<div className="tag-container">
  {blog.tags.map((tag) => (
    <span
      key={tag}
      className="tag-pill"
      onClick={() => removeTag(tag)}
      style={{ cursor: "pointer" }}
    >
      {tag} ✕
    </span>
  ))}
</div>

<h2>Title Media</h2>
  <select
    value={blog.title_media.type}
      onChange={(e) => setHeroType(e.target.value)}>
      <option value="none">None</option>
      <option value="image">Image</option>
      <option value="youtube">Youtube</option>
      <option value="instagram">Instagram</option>
      <option value="facebook">Facebook</option>
      <option value="threads">Threads</option>
    </select>

  {isEmbed &&(
    <input
      placeholder="Paste link here"
      value={blog.title_media.url}
      onChange={(e) =>
        setBlog(prev => ({
        ...prev,
        title_media: {
          ...prev.title_media,
          url: e.target.value
        }
      }))
    }
  />
  )}

  {blog.title_media.type === "image" && (
        <>
          <input
            type="file"
            accept="image/*"
            onChange={handleHeroFile}
          />

          {blog.title_media.preview_url && (
            <img
              src={blog.title_media.preview_url}
              width="300"
              alt="hero preview"
            />
          )}
          
          <select
            value={blog.title_media.ownership.is_owner ? "true" : "false"}
            onChange={(e) =>
              setHeroOwnership(e.target.value === "true")
            }
          >
            <option value="true">Mine</option>
            <option value="false">Other</option>
          </select>

          {!blog.title_media.ownership.is_owner && (
            <input
              placeholder="Owner name"
              value={blog.title_media.ownership.name}
              onChange={(e) => setHeroOwnerName(e.target.value)}
            />
          )}
        </>
      )}


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
      <button onClick={() => { localStorage.clear(); window.location.href = "/admin/blog-editor"; alert("Local storage cleared"); }}>
        Clear Form
      </button>
    </div>
  </div>
  </div>
  );
}