export const contentConfig = {
  blog: {
    title: "Blog Posts",
    endpoint: "http://localhost:5055/api/blog",
    itemKey: "posts",

    mapItem: (post) => ({
      id: post.id,
      title: post.title,
      preview: post.preview,
      image: post.titlepic || post.title_pic,
      link: `/blog/${post.id}`
    })
  },

  book: {
    title: "Books",
    endpoint: "http://localhost:5055/api/books",
    itemKey: "books",

    mapItem: (book) => ({
      id: book.id,
      title: book.title,
      preview: book.synopsis,
      image: book.book_image_url,
      link: `/book/${book.id}`
    })
  },

  allBooks: {
  title: "Books",
  endpoint: "http://localhost:5055/api/books",
  itemKey: "books",
  paginate: false,

  mapItem: (book) => ({
    id: book.id,
    title: book.title,
    preview: book.synopsis,
    image: book.book_image_url,
    link: `/book/${book.title.replaceAll(" ", "-")}`
  })
},

  booksByGenre: {
  title: "Books by Genre",
  endpoint: (genre) =>
    `http://localhost:5055/api/books/${genre}`,
  itemKey: null,
  paginate: false,

  mapItem: (book) => ({
    id: book.id,
    title: book.title,
    preview: book.synopsis,
    image: book.book_image_url,
    link: `/book/${book.title.replaceAll(" ", "-")}`
  })
}

};