import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../css/editor.css";
import RichTextEditor from "../blogs/RichTextEditor";

const normalizeBook = (data) => ({
  id: data.id,
  title: data.title || "",
  isbn: data.isbn || "",
  synopsis: data.synopsis || "",

  date_added: data.date_added || "",
  date_displayed: data.date_displayed,
  cover: {
    preview_url: data.book_image_url || "",
    file: null
  },

  genres: data.genres || [],
  genres_display: data.genres_display || [],
  selected_genres: data.selected_genres || [],

buy_links: (data.buy_links || []).map(link => ({
    name_of_site: link.name || "",
    links_url: link.url || ""
})),

  reviews: (data.reviews || []).map(review => ({
    link_url: review.link_url || "",
    name: review.name || "",
    title: review.title || "",
    content: review.content || "",
    rating: review.rating
  })),

  awards: (data.awards || []).map(award => ({
    title: award.award_title || "",
    pic_of_award: award.award_url || "",
    preview_url: award.award_url || "",
    file: null
  }))
});

export default function EditBook(){
const navigate=useNavigate();

const updateBook = (field, value) => {
    setBook(prev => ({
        ...prev,
        [field]: value
    }));
};

const updateAward = (index, updatedAward) => {
    setBook(prev => {
        const awards = [...prev.awards];
        awards[index] = updatedAward;

        return {
            ...prev,
            awards
        };
    });
};

const addAward = () => {
    setBook(prev => ({
        ...prev,
        awards: [
            ...prev.awards,
            {
                title: "",
                pic_of_award: "",
                preview_url: "",
                file: null
            }
        ]
    }));
};

const removeAward = (index) => {
    setBook(prev => ({
        ...prev,
        awards: prev.awards.filter((_, i) => i !== index)
    }));
};

const buildFormData = () => {
    const formData = new FormData();

    formData.append("title", book.title);
    formData.append("isbn", book.isbn);
    formData.append("synopsis", book.synopsis);
    formData.append("date", book.date_added);
    formData.append("date_displayed", book.date_displayed);

    if (book.cover.file) {
        formData.append("cover_image", book.cover.file);
    }

    book.selected_genres.forEach(g => {
        formData.append("genres", g);
    });

    formData.append(
        "buy_links",
        JSON.stringify(book.buy_links)
    );

    formData.append(
        "reviews",
        JSON.stringify(book.reviews)
    );

    formData.append(
        "awards",
        JSON.stringify(
            book.awards.map(a => ({
                title: a.title,
                pic_of_award: a.pic_of_award
            }))
        )
    );

    book.awards.forEach((award, index) => {

        if (award.file) {
            formData.append(
                `award_image_${index}`,
                award.file
            );
        }
    });

    return formData;
};

const handleSave = async () => {
const formData = buildFormData();
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
    `/admin/editbook/${slug}`,
    {
      method: "PUT",
      credentials: "include",
      body: formData
    }
  );
   
  const data = await res.json();

  if (!res.ok) {
    alert(data.error || "Save failed");
    return;
  }

  alert("Saved!");
  navigate("/dashboard/books");
}

const { slug } = useParams();
const [book, setBook] = useState(null);
const [loading, setLoading] = useState(true);

useEffect(() => {
  const loadBook = async () => {
    try {
      const res = await fetch(
        `/admin/editbook/${slug}`,
        {
          credentials: "include"
        }
      );

      const data = await res.json();
      setBook(normalizeBook(data));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  loadBook();
}, [slug]);


const handleCoverImage = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setBook(prev => ({
        ...prev,
        cover: {
            ...prev.cover,
            file,
            preview_url: URL.createObjectURL(file)
        }
    }));
};

const [genreInput, setGenreInput] = useState("");

const addGenre = () => {
    const genre = genreInput.trim();

    if (!genre) 
        return;

    if (book.selected_genres.includes(genre))
        return;

    setBook(prev => ({
        ...prev,
        selected_genres: [
            ...prev.selected_genres,
            genre
        ]
    }));

    setGenreInput("");
};

const removeGenre = (genre) => {
    setBook(prev => ({
        ...prev,
        selected_genres: prev.selected_genres.filter(
            g => g !== genre
        )
    }));
};

const addBuyLink = () => {
    setBook(prev => ({
        ...prev,
        buy_links: [
            ...prev.buy_links,
            {
                name_of_site: "",
                links_url: ""
            }
        ]
    }));
};

const updateBuyLink = (index, updatedLink) => {
    setBook(prev => {
        const buy_links = [...prev.buy_links];
        buy_links[index] = updatedLink;

        return {
            ...prev,
            buy_links
        };
    });
};

const removeBuyLink = (index) => {
    setBook(prev => ({
        ...prev,
        buy_links: prev.buy_links.filter(
            (_, i) => i !== index
        )
    }));
};

const addReview = () => {
    setBook(prev => ({
        ...prev,
        reviews: [
            ...prev.reviews,
            {
                name: "",
                title: "",
                content: "",
                link_url: "",
                rating: null
            }
        ]
    }));
};

const updateReview = (index, updatedReview) => {
    setBook(prev => {
        const reviews = [...prev.reviews];
        reviews[index] = updatedReview;

        return {
            ...prev,
            reviews
        };
    });
};

const removeReview = (index) => {
    setBook(prev => ({
        ...prev,
        reviews: prev.reviews.filter(
            (_, i) => i !== index
        )
    }));
};
const handleAwardImage = (index, e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    updateAward(index, {
        ...book.awards[index],
        file,
        preview_url: URL.createObjectURL(file)
    });
};


if (loading || !book) {
    return (
        <div className="editor-container">
            <h2>Loading...</h2>
        </div>
    );
}

return (
  <>
  <div className="editor-container">
    <h1>Edit Book</h1>

    <div className="editor-card">

      <h2>Title</h2>

      <RichTextEditor className="title-rich"
        value={book.title}
        onChange={(value) => updateBook("title", value)}/>

      <h2>ISBN</h2>

      <input
        value={book.isbn}
        onChange={(e) =>
          updateBook("isbn", e.target.value)
        }
      />

      <h2>Synopsis</h2>

      <RichTextEditor className="text-area-rich"
        value={book.synopsis}
        onChange={(value) =>
          updateBook("synopsis", value)
        }
      />

      <div className="date-row">
        <div>
          <h2>Date Added</h2>

          <input type="date" value={book.date_added} onChange={(e) => updateBook("date_added", e.target.value)}/>
        </div>

        <label className="display-date-checkbox">
          <input type="checkbox" checked={book.date_displayed} onChange={(e) => updateBook("date_displayed", e.target.checked)}/>
          Display publish date
        </label>
      </div>

      <h2>Cover Image</h2>

      {book.cover.preview_url && (
        <img
          src={book.cover.preview_url}
          width="250"
          alt=""
        />
      )}

      <input
        type="file"
        accept="image/*"
        onChange={handleCoverImage}
      />

      <h2>Genres</h2>

      <div className="genre-list">
      {book.genres.map((genre) => (
    <label key={genre.id} className="genre-option">
      <input
      type="checkbox"
      checked={book.selected_genres.includes(genre.name)}
      onChange={(e) => {
        if (e.target.checked) {
          updateBook("selected_genres", [
            ...book.selected_genres,
            genre.name
          ]);
        } else {
          updateBook(
            "selected_genres",
            book.selected_genres.filter(
              (g) => g !== genre.name
            )
          );
        }
      }}
    />

    {genre.display}
  </label>
))}
      </div>

      <div className="new-genre">
        <label>Add new genre</label>
        <input type="text" value={genreInput} onChange={(e) => setGenreInput(e.target.value)} placeholder="Enter a new genre"/>
        <button type="button" onClick={addGenre}> Add Genre</button>
      </div>

      <div>
        {book.selected_genres.map((genre) => (
        <span className="tag-pill" key={genre} 
         style={{
            marginRight: 10,
            cursor: "pointer"
          }}

          onClick={() => removeGenre(genre)}
        >
         {genre} ✕
      </span>
      ))}
    </div>

      <h2>Buy Links</h2>

      {book.buy_links.map((link, index) => (
        <div
          key={index}
          className="editor-container-alt"
        >
          <input
            placeholder="Website"
            value={link.name_of_site}
            onChange={(e) =>
              updateBuyLink(index, {
                ...link,
                name_of_site: e.target.value
              })
            }
          />

          <input
            placeholder="URL"
            value={link.links_url}
            onChange={(e) =>
              updateBuyLink(index, {
                ...link,
                links_url: e.target.value
              })
            }
          />

          <button
          className = "delete-button"
            onClick={() =>
              removeBuyLink(index)
            }
          >
            Delete Link
          </button>
        </div>
      ))}

      <button onClick={addBuyLink}>
        Add Buy Link
      </button>

      <h2>Reviews</h2>

      {book.reviews.map((review, index) => (
        <div key={index} className="editor-container-alt">
          
          <RichTextEditor className="title-rich"
            value={review.name}
            onChange={(value) =>
              updateReview(index, {...review, name: value})
            }/>

          <RichTextEditor className="title-rich"
            value={review.title}
            onChange={(value) =>
              updateReview(index, {...review,title: value})
            }
          />

          <RichTextEditor className="text-area-rich"
            value={review.content}
            onChange={(value) =>
              updateReview(index, {
                ...review,
                content: value
              })
            }
          />

          <input
            placeholder="Review URL"
            value={review.link_url}
            onChange={(e) =>
              updateReview(index, {
                ...review,
                link_url: e.target.value
              })
            }
          />

          <select
            value={review.rating ?? ""}
            onChange={(e) =>
              updateReview(index, {
                ...review,
                rating:
                  e.target.value === ""
                    ? null
                    : Number(e.target.value)
              })
            }
          >
            <option value="">
              No Rating
            </option>

            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
          </select>

          <button
            className = "delete-button"
            onClick={() =>
              removeReview(index)
            }
          >
            Delete Review
          </button>
        </div>
      ))}

      <button onClick={addReview}>
        Add Review
      </button>

      <h2>Awards</h2>

      {book.awards.map((award, index) => (
        <div
          key={index}
          className="editor-container-alt"
        >
          <input
            placeholder="Award Title"
            value={award.title}
            onChange={(e) =>
              updateAward(index, {
                ...award,
                title: e.target.value
              })
            }
          />

          {award.preview_url && (
            <img
              src={award.preview_url}
              width="150"
              alt=""
            />
          )}

          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              handleAwardImage(index, e)
            }
          />

          <button
            className = "delete-button"
            onClick={() =>
              removeAward(index)
            }
          >
            Delete Award
          </button>
        </div>
      ))}

      <button onClick={addAward}>
        Add Award
      </button>

    </div>

    
  </div>
  <div  className = "button-container-3">
  <button  className="editor-button-3" onClick={handleSave}>
        Save Changes
    </button> 
  </div> </>
);
}