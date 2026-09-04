export const contentConfig = {
  blog: {
    title: "Blog Posts",
    endpoint: "/api/blog",
    itemKey: "posts",
    paginate: true,

    mapItem: (post) => ({
      id: post.id,
      title: post.title,
      preview: post.preview,
      preview_short: post.preview_short,
      title_media: post.title_media,
      url_content_type: post.url_content_type,
      link: `/blog/${post.slug}`,

      date: post.date,
      tags: post.tags || []
    })
  },

  book: {
    title: "Books",
    endpoint: "/api/books",
    itemKey: "books",

    mapItem: (book) => ({
      id: book.id,
      title: book.title,
      preview: book.synopsis,
      title_media: book.book_image_url,
      genre_name: book.genre_name,
      url_content_type: "image",
      link: `/books/title/${book.slug}`
    })
  },

  allBooks: {
  title: "Books",
  endpoint: "/api/books",
  itemKey: "books",
  paginate: true,

  mapItem: (book) => ({
    id: book.id,
    title: book.title,
    preview: book.synopsis,
    title_media: book.book_image_url,
    genre_name: book.genre_name,
    url_content_type: "image",
    link: `/books/title/${book.slug}`
  })
},

  booksByGenre: {
  title: "Books by Genre",
  endpoint: (genre) =>
    `/api/books/${genre}`,
  itemKey: null,
  paginate: true,

  mapItem: (book) => ({
    id: book.id,
    title: book.title,
    preview: book.synopsis,
    title_media: book.book_image_url,
    genre_name: book.genre_name,
    url_content_type: "image",
    link: `/books/title/${book.slug}`
  })
},

teaching: {
  title: "Teaching Resources",
  endpoint: "/api/teachingresources",
  itemKey: null,

  mapItem: (item) => ({
  id: item.title,
  title: item.title,
  title_media: item.book_image_url,
  preview: item.isbn,
  url_content_type: "image",
  slug: item.slug,
  link: `/teachingresources/${item.slug}`
})
}

};