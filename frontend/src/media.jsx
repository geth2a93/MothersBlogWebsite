import { InstagramEmbed } from "react-social-media-embed";

export default function Embed() {
  return (
    <div style={{ padding: 40 }}>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
    <InstagramEmbed url="https://www.instagram.com/p/CUbHfhpswxt/" width={328} />
    </div>
    </div>
  );
}