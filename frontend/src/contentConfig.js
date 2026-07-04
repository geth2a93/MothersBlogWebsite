export const contentConfig = {
  blog: {
    title: "Blog Posts",
    endpoint: "http://localhost:5055/api/blog",
    itemKey: "posts",
    paginate: true,

    mapItem: (post) => ({
      id: post.id,
      title: post.title,
      preview: post.preview,
      title_media: post.title_media,
      url_content_type: post.url_content_type,
      link: `/blog/${post.slug}`,

      date: post.date,
      tags: post.tags || []

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
      title_media: book.book_image_url,
      url_content_type: "image",
      link: `/books/title/${book.title.replaceAll(" ", "-")}`
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
    title_media: book.book_image_url,
    url_content_type: "image",
    link: `/books/title/${book.title.replaceAll(" ", "-")}`
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
    link: `/books/title/${book.title.replaceAll(" ", "-")}`
  })
},

teaching: {
  title: "Teaching Resources",
  endpoint: "http://localhost:5055/api/teachingresources",
  itemKey: null,

  mapItem: (item) => ({
  id: item.title,
  title: item.title,
  preview: "Click to view resource",
  image: item.book_image_url,
  slug: item.title.replaceAll(" ", "-"),
  link: `/teachingresources/${item.title.replaceAll(" ", "-")}`
})
}

};