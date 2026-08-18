import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Login from './admin/Login.jsx';
import CreateUser from "./admin/createUser.jsx";

import Home from './public/Home.jsx';
import Layout from "./public/Components.jsx";
import BlogPostFull from './public/BlogPostFull.jsx';
import BlogsList from './public/BlogsList.jsx';
import BooksList from './public/BooksList.jsx';
import About from './public/AboutMe.jsx'
import BooksGenreWrapper from './public/BooksGenre.jsx'
import BookDetail from './public/BookFull.jsx'
import TeachingResourceFull from './public/TeachingResourceFull.jsx'
import ContentListPage from "./public/ContentListPage.jsx";
import AdminHome from "./admin/AdminHome.jsx";
import AdminAboutMe from "./admin/AdminAboutMe.jsx";
import AdminWebResources from "./admin/AdminWebResources.jsx"

import NewBlog from "./admin/NewBlog.jsx";
import BlogPreview from "./admin/BlogPreview.jsx";
import AdminEditBlog from './admin/AdminEditBlog.jsx';
import EditBlog from "./admin/EditBlog.jsx";

import AdminEditBooks from "./admin/AdminEditBooks.jsx";
import EditBook from "./admin/EditBook.jsx";
import NewBook from './admin/AddBook.jsx';

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />

        <Route path="/blog/:slug" element={<BlogPostFull />} />
        <Route path="/blog" element={<BlogsList />} />

        <Route path="/books" element={<BooksList />} />
        <Route path="/books/:genre" element={<BooksGenreWrapper />} />
        <Route path="/books/title/:title" element={<BookDetail />} />

        <Route path="/teachingresources" element={<ContentListPage type="teaching" />} />
        <Route path="/teachingresources/:title" element={<TeachingResourceFull />} />
      </Route>

      <Route path="/login" element={<Login />} />
      <Route path="/createuser" element={<CreateUser />} />

      <Route path="/admin" element={<AdminHome />} />
      <Route path="/admin/aboutme" element={<AdminAboutMe />} />
      <Route path="/admin/websiteresources" element={<AdminWebResources />} />

      <Route path="/admin/add-blog" element={<NewBlog/>} />
      <Route path="/admin/add-blog/:slug" element={<NewBlog />} />

      <Route path="/admin/blog-preview" element={<BlogPreview />} />
      <Route path="/admin/blog-preview/:slug" element={<BlogPreview />} />

      <Route path="/admin/blogs" element={<AdminEditBlog />} />

      <Route path="/admin/blog-editor" element={<NewBlog />} />
      <Route path="/admin/blog-editor/new" element={<NewBlog />} />
      <Route path="/admin/blog-edit/:slug" element={<EditBlog />} />

      <Route path="/admin/blogs" element={<AdminEditBlog />} />
      <Route path="/admin/blog-edit/:slug" element={<EditBlog />} />

      <Route path="/admin/books" element={<AdminEditBooks />} />
      <Route path="/admin/book-edit/:title" element={<EditBook />} />
      <Route path="/admin/newbook" element={<NewBook />} />
    </Routes>
  </BrowserRouter>
);