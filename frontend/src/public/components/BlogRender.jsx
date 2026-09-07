import { useState } from "react";
import { formatBookDate, formatDate } from "./dateHelper.js";
import {
  InstagramEmbed,
  FacebookEmbed,
  YouTubeEmbed,
  XEmbed
} from "react-social-media-embed";

import "../css/BlogPostFull.css";

export default function BlogRender({ post }) {
  console.log("BLOG RENDER POST:", post);
console.log("BLOG RENDER BLOCKS:", post?.content_blocks);
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

        <h1 className="blog-post-title" dangerouslySetInnerHTML={{ __html: post.title || "" }}/>

        {post.date_created && (
          <p className="blog-post-date">
            {formatDate(post.date_created)}
          </p>
        )}

        {(titleSrc || (post.ownership === false && post.name_of_owner)) && (
          <div className="blog-title-media">

          {titleSrc && (
            renderMedia(titleSrc, titleType, "title-media")
          )}

          {post.ownership === false && post.name_of_owner && (
            <p className="image-attribution">
              Image courtesy of {post.name_of_owner}
            </p>
            )}
          </div>
        )}

        {post.preview && (
          <h2 className="blog-post-preview" dangerouslySetInnerHTML={{ __html: post.preview || "" }}/>
        )}

        {sortedBlocks.map((block) => {
          const src = block.media_content_url;
          const type = block.url_content_type;

          const ratioKey = `${block.order}-${src}`;
          const ratio = imageRatios[ratioKey];

          const hasMedia = !!src;
          const hasText = !!block.content;

          const hasTitle = !!block.blocktitle;

          return (
            <div
              key={block.order}
              className={`blog-block ${block.alignment || "left"}`}
            >
              {(hasMedia || (block.ownership === false && block.name_of_owner)) && (
              <div
                className="image-container"
                style={{flex: ratio ? (ratio > 1.2 ? 1.6 : 1) : 1 }}>

              {hasMedia && (
                renderMedia(src, type, ratioKey)
              )}

              {block.ownership === false && block.name_of_owner && (
                <p className="image-attribution">
                  Image courtesy of {block.name_of_owner}
                </p>
              )}
              </div>
            )}

              {(hasTitle || hasText) && (
                <div className="text-container">

              {hasTitle && (
                <h2 className="blog-block-title" dangerouslySetInnerHTML={{ __html: block.blocktitle || "" }} /> )}

              {hasText && (
                <div className="blog-block-content" dangerouslySetInnerHTML={{ __html: block.content || "" }} /> )}
              
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