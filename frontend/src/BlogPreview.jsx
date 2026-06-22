/* import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import BlogRender from "./BlogRender";

export default function BlogPreview() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [blog, setBlog] = useState(null);

  useEffect(() => {
    fetch(
      `http://localhost:5055/api/blog/${slug}`
    )
      .then(res => res.json())
      .then(setBlog);
  }, [slug]);

  if (!blog) {
    return <p>Loading...</p>;
  }

  
  const buildFormData = (previewAccepted = false) => {
  const formData = new FormData();

  formData.append("title", blog.title);
  formData.append("preview", blog.preview);

  if (blog.publish_date) {
    formData.append("date", blog.publish_date);
  }

  formData.append(
    "preview_accepted",
    previewAccepted
  );

  blog.tags.forEach(tag => {
    formData.append("tags", tag);
  });

  formData.append(
    "url_content_type",
    blog.title_media.type === "none"
      ? "None"
      : blog.title_media.type
  );

  if (blog.title_media.type === "image") {
    formData.append(
      "ownership",
      blog.title_media.ownership.is_owner
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
      url_content_type: block.url_content_type,
      media_content_url: block.media_content_url,
      ownership: block.ownership.is_owner,
      name_of_owner: block.ownership.name
    }));

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

    if (!res.ok) {
      alert(data.error || "Publish failed");
      return;
    }

    alert("Published!");
  } catch (err) {
    console.error(err);
    alert("Publish failed");
  }
};

  return (
    <>
      <h2>Preview Mode</h2>

      <BlogRender post={blog} />

      <button
  onClick={() =>
    navigate('admin/blog-editor/${slug}', {
      state: {
        slug: blog.slug
      }
    })
  }
>
  Back To Editor
</button>

<button
  type="button"
  onClick={handlePublish}
>
  Publish
</button>
    </>

    
  );
} */