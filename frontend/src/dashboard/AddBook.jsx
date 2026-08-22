import { useState } from "react";
import { useNavigate } from "react-router-dom";

const emptyBook = {
  title: "",
  isbn: "",
  synopsis: "",
  date_added: "",
  cover: {
    preview_url: "",
    file: null
  },
  genres: [],
  buy_links: [],
  reviews: [],
  awards: []
};

export default function NewBook() {
  const navigate = useNavigate();

  const [book, setBook] = useState(emptyBook);
  const [genreInput, setGenreInput] = useState("");

  const updateBook = (field, value) => {
    setBook(prev => ({
      ...prev,
      [field]: value
    }));
  };


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

  const addGenre = () => {
    const genre = genreInput.trim();

    if (!genre) return;

    if (book.genres.includes(genre)) {
      setGenreInput("");
      return;
    }

    setBook(prev => ({
      ...prev,
      genres: [
        ...prev.genres,
        genre
      ]
    }));

    setGenreInput("");
  };

  const removeGenre = (genre) => {
    setBook(prev => ({
      ...prev,
      genres: prev.genres.filter(g => g !== genre)
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

  const removeAward = (index) => {
    setBook(prev => ({
      ...prev,
      awards: prev.awards.filter(
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

  const buildFormData = () => {
    const formData = new FormData();

    formData.append("title", book.title);
    formData.append("isbn", book.isbn);
    formData.append("synopsis", book.synopsis);
    formData.append("date", book.date_added);


    if (book.cover.file) {
      formData.append(
        "cover_image",
        book.cover.file
      );
    }


    book.genres.forEach(genre => {
      formData.append("Genres", genre);
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
        book.awards.map(award => ({
          title: award.title,
          pic_of_award: award.pic_of_award
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
    if (!book.title.trim()) {
      alert("Please enter a book title.");
      return;
    }

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

    try {
      const res = await fetch(
        `/admin/createnewbook`,
        {
          method: "PUT",
          credentials: "include",
          body: formData
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Failed to create book.");
        return;
      }

      alert(data.message || "Book added!");

      navigate("/dashboard/books");

    } catch (err) {
      console.error(err);
      alert("An error occurred while creating the book.");
    }
  };

  return (
    <div className="admin-container">
      <h1>New Book</h1>

      <div className="admin-card">


        <h2>Title</h2>

        <input
          value={book.title}
          onChange={(e) =>
            updateBook("title", e.target.value)
          }
          placeholder="Book title"
        />

        <h2>ISBN</h2>

        <input
          value={book.isbn}
          onChange={(e) =>
            updateBook("isbn", e.target.value)
          }
          placeholder="ISBN"
        />

        <h2>Synopsis</h2>

        <textarea
          rows={8}
          value={book.synopsis}
          onChange={(e) =>
            updateBook("synopsis", e.target.value)
          }
          placeholder="Book synopsis"
        />

        <h2>Date Added</h2>

        <input
          type="datetime-local"
          value={book.date_added}
          onChange={(e) =>
            updateBook("date_added", e.target.value)
          }
        />

        <h2>Cover Image</h2>

        {book.cover.preview_url && (
          <img
            src={book.cover.preview_url}
            width="250"
            alt="Cover preview"
          />
        )}

        <input
          type="file"
          accept="image/*"
          onChange={handleCoverImage}
        />

        <h2>Genres</h2>

        <input
          value={genreInput}
          onChange={(e) =>
            setGenreInput(e.target.value)
          }
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addGenre();
            }
          }}
          placeholder="Genre"
        />

        <button onClick={addGenre}>
          Add Genre
        </button>

        <div>
          {book.genres.map((genre) => (
            <span
              key={genre}
              style={{
                marginRight: 10,
                cursor: "pointer"
              }}
              onClick={() =>
                removeGenre(genre)
              }
            >
              {genre} ✕
            </span>
          ))}
        </div>

        <h2>Buy Links</h2>

        {book.buy_links.map((link, index) => (
          <div
            key={index}
            className="admin-container"
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
          <div
            key={index}
            className="admin-container"
          >
            <input
              placeholder="Reviewer"
              value={review.name}
              onChange={(e) =>
                updateReview(index, {
                  ...review,
                  name: e.target.value
                })
              }
            />

            <input
              placeholder="Review Title"
              value={review.title}
              onChange={(e) =>
                updateReview(index, {
                  ...review,
                  title: e.target.value
                })
              }
            />

            <textarea
              placeholder="Review"
              value={review.content}
              onChange={(e) =>
                updateReview(index, {
                  ...review,
                  content: e.target.value
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
            className="admin-container"
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
                alt="Award preview"
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

      <button onClick={handleSave}>
        Add Book
      </button>
    </div>
  );
}