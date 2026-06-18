import { useState } from "react";
import {
  InstagramEmbed,
  FacebookEmbed,
  YouTubeEmbed,
  XEmbed
} from "react-social-media-embed";

import "./BlogPostFull.css";
import "./Styles.css";

export default function BlogRender({ post }) {
  if (!post) return <div>Loading preview...</div>;

  console.log("BLOG POST:", post);

  const [imageRatios, setImageRatios] = useState({});

  const handleImageLoad = (e, key) => {
    const img = e.target;
    const ratio = img.naturalWidth / img.naturalHeight;

    setImageRatios((prev) => ({
      ...prev,
      [key]: ratio
    }));
  };

  // =========================
  // SAFE MEDIA RESOLVER
  // =========================
  const getSrc = (block) =>
    block.media_content_url?.trim() ||
    block.image_preview_url ||
    null;

  const renderMedia = (block, ratioKey) => {
    const src = getSrc(block);
    if (!src) return null;

    switch (block.url_content_type) {
      case "image":
        return (
          <img
            src={src}
            alt=""
            className="blog-image"
            onLoad={(e) => handleImageLoad(e, ratioKey)}
          />
        );

      case "instagram":
        return (
          <div className="embed-wrapper">
            <InstagramEmbed url={src} width="400px" />
          </div>
        );

      case "facebook":
        return (
          <div className="embed-wrapper">
            <FacebookEmbed url={src} width="100%" />
          </div>
        );

      case "youtube":
        return (
          <div className="embed-wrapper">
            <YouTubeEmbed url={src} width="100%" />
          </div>
        );

      case "X":
        return (
          <div className="embed-wrapper">
            <XEmbed url={src} width="100%" />
          </div>
        );

      default:
        return null;
    }
  };

  // =========================
  // SORT BLOCKS SAFELY
  // =========================
  const sortedBlocks = [...(post.content_blocks || [])].sort(
    (a, b) => (a.order ?? 0) - (b.order ?? 0)
  );

  // =========================
  // HERO IMAGE (SINGLE SOURCE)
  // =========================
 const hero = post.hero?.preview_url || null;

  return (
    <div className="blog-post-page">
      <div className="blog-post-container">

        {/* TITLE */}
        <h1 className="blog-post-title">{post.title}</h1>

        {/* DATE */}
        {post.date_created && (
          <p className="blog-post-date">
            {new Date(post.date_created).toLocaleDateString()}
          </p>
        )}

        {/* HERO IMAGE */}
        {hero && (
          <img
            src={hero}
            alt={post.title}
            className="blog-title-image"
          />
        )}

        {/* OWNER CREDIT */}
        {!post.ownership && post.name_of_owner && (
          <p className="image-attribution">
            Image courtesy of {post.name_of_owner}
          </p>
        )}

        {/* PREVIEW TEXT */}
        {post.preview && (
          <h2 className="blog-post-preview">
            {post.preview}
          </h2>
        )}

        {/* CONTENT BLOCKS */}
        {sortedBlocks.map((block) => {
          const src = getSrc(block);

          const hasMedia = Boolean(src);
          const hasText = Boolean(block.content);

          const ratioKey = `${block.order}-${block.media_content_url}`;
          const ratio = imageRatios[ratioKey];

          const showAttribution =
            hasMedia &&
            block.ownership === false &&
            block.name_of_owner;

          return (
            <div
              key={block.order}
              className={`blog-block ${block.alignment || "left"}`}
            >
              {/* MEDIA */}
              {hasMedia && (
                <div
                  className="image-container"
                  style={{
                    maxWidth: "420px",
                    flex: ratio ? (ratio > 1.2 ? 1.6 : 1) : 1
                  }}
                >
                  {renderMedia(block, ratioKey)}

                  {showAttribution && (
                    <p className="image-attribution">
                      Image courtesy of {block.name_of_owner}
                    </p>
                  )}
                </div>
              )}

              {/* TEXT */}
              {hasText && (
                <div className="text-container">
                  {block.title_of_block && (
                    <h2 className="blog-block-title">
                      {block.title_of_block}
                    </h2>
                  )}

                  <p className="blog-block-content">
                    {block.content}
                  </p>
                </div>
              )}
            </div>
          );
        })}

        {/* TAGS */}
        {post.tags?.length > 0 && (
          <div className="blog-tags-bottom">
            {post.tags.map((tag, i) => (
              <span key={i} className="tag-pill">
                {tag}
              </span>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}