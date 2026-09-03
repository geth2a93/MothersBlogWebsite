import { useParams } from "react-router-dom";
import ContentListPage from "../components/ContentListPage";

export default function BooksGenreWrapper() {
  const { genre } = useParams();

  return <ContentListPage type="booksByGenre" genre={genre} />;
}