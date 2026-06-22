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
  if (!post) return null;

  const [imageRatios, setImageRatios] = useState({});

  const handleImageLoad = (e, key) => {
    const img = e.target;
    const ratio = img.naturalWidth / img.naturalHeight;

    setImageRatios((prev) => ({
      ...prev,
      [key]: ratio
    }));
  };

  const renderMedia = (src, type, ratioKey) => {
    if (!src) return null;

    switch (type) {
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
            <InstagramEmbed url={src} width="100%" />
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

      case "threads":
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

  const titleSrc =
    typeof post.title_media === "string"
      ? post.title_media
      : null;
  const titleType =
  post.url_content_type ||
  "image";

  const sortedBlocks = [...(post.content_blocks || [])].sort(
    (a, b) => (a.order ?? 0) - (b.order ?? 0)
  );

  return (
    <div className="blog-post-page">
      <div className="blog-post-container">

        <h1 className="blog-post-title">{post.title}</h1>

        {post.date_created && (
          <p className="blog-post-date">
            {new Date(post.date_created).toLocaleDateString()}
          </p>
        )}

        {titleSrc && (
        <div className="blog-title-media">
            {renderMedia(titleSrc, titleType, "title-media")}
        </div>
        )}
        
        {post.ownership === false && post.name_of_owner && (
          <p className="image-attribution">
            Image courtesy of {post.name_of_owner}
          </p>
        )}

        {post.preview && (
          <h2 className="blog-post-preview">
            {post.preview}
          </h2>
        )}

        {sortedBlocks.map((block) => {
          const src = block.media_content_url;
          const type = block.url_content_type;

          const ratioKey = `${block.order}-${src}`;
          const ratio = imageRatios[ratioKey];

          const hasMedia = !!src;
          const hasText = !!block.content;

          return (
            <div
              key={block.order}
              className={`blog-block ${block.alignment || "left"}`}
            >
              {hasMedia && (
                <div
                  className="image-container"
                  style={{
                    maxWidth: "420px",
                    flex: ratio ? (ratio > 1.2 ? 1.6 : 1) : 1
                  }}
                >
                  {renderMedia(src, type, ratioKey)}

                  {block.ownership === false && block.name_of_owner && (
                    <p className="image-attribution">
                      Image courtesy of {block.name_of_owner}
                    </p>
                  )}
                </div>
              )}

              {hasText && (
                <div className="text-container">
                  {block.blocktitle && (
                    <h2 className="blog-block-title">
                      {block.blocktitle}
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