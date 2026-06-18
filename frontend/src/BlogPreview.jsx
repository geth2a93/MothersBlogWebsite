import { useNavigate } from "react-router-dom";
import BlogRender from "./BlogRender";

export default function BlogPreview() {
  const navigate = useNavigate();

  let blog = null;

  try {
    const saved = localStorage.getItem("draftBlog");
    blog = saved ? JSON.parse(saved) : null;
  } catch (err) {
    console.error("Draft parse error:", err);
    blog = null;
  }

const handlePublish = async () => {
  const formData = new FormData();

  formData.append("title", blog.title);
  formData.append("preview", blog.preview);
  formData.append("url_content_type", blog.url_content_type || "None");
  formData.append("date", blog.date || "");

  // HERO IMAGE FILE
  if (blog.hero?.file) {
    formData.append("title_image", blog.hero.file);
  }

  // BLOCK DATA (JSON metadata only)
  /* formData.append(
    "content_blocks",
    JSON.stringify(
      blog.content_blocks.map((b, i) => ({
        order: i,
        title_of_block: b.title_of_block,
        content: b.content,
        alignment: b.alignment,
        url_content_type: b.url_content_type,
        ownership: b.ownership,
        name_of_owner: b.name_of_owner,
        media_content_url: b.media_content_url
      }))
    )
  );*/ 

    // STRIP FILES FROM JSON (metadata only)
  const cleanedBlocks = blog.content_blocks.map((b, i) => ({
    order: i,
    title_of_block: b.title_of_block,
    content: b.content,
    alignment: b.alignment,
    url_content_type: b.url_content_type || null,
    ownership: b.ownership,
    name_of_owner: b.name_of_owner,
    media_content_url: b.media_content_url || null
  }));

  formData.append("content_blocks", JSON.stringify(cleanedBlocks));

  // FILES MUST BE APPENDED SEPARATELY
  blog.content_blocks.forEach((b, i) => {
    if (b.url_content_type === "image" && b.image_file instanceof File) {
      formData.append(`image_${i}`, b.image_file);
    }
  });

  const res = await fetch("http://localhost:5055/admin/newblogpost", {
    method: "PUT",
    body: formData,
    credentials: "include"
  });

  const data = await res.json();

  if (!res.ok) {
    console.error(data);
    alert(data.error || "Publish failed");
    return;
  }

  navigate(`/blog/${data.slug}`);
};
  if (!blog) {
    return <div>No preview data found.</div>;
  }

  return (
    <div className="preview-page">
      <div className="preview-content">
        <BlogRender post={blog} />
      </div>

      <div className="preview-actions">
        <button onClick={() => navigate("/admin/blog-editor")}>
          Back
        </button>

        <button onClick={handlePublish}>
          Publish
        </button>
      </div>
    </div>
  );
}