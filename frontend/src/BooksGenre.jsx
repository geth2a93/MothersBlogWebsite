import { useParams } from "react-router-dom";
import ContentListPage from "./ContentListPage";

export default function BooksByGenre() {
  const { genre } = useParams();

  return <ContentListPage type="booksByGenre" genre={genre} />;
}