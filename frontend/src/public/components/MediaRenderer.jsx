import {
  InstagramEmbed,
  FacebookEmbed,
  YouTubeEmbed
} from "react-social-media-embed";

export default function MediaRenderer({
  media,
  contentType,
  title,
  className = ""
}) {
  if (!media) return null;

  switch (contentType) {
    case "image":
      return (
        <img
          src={media}
          alt={title}
          className={className}
        />
      );

    case "instagram":
      return (
        <div className={className}>
          <InstagramEmbed
            url={media}
            width={350}
            height={400}
          />
        </div>
      );

    case "youtube":
      return (
        <div className={className}>
          <YouTubeEmbed
            url={media}
            width={450}
            height={300}
          />
        </div>
      );

    case "facebook":
      return (
        <div className={className}>
          <FacebookEmbed
            url={media}
            width={500}
          />
        </div>
      );

    default:
      return null;
  }
}