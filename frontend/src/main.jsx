import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Login from './dashboard/Login.jsx';
import CreateUser from "./dashboard/createUser.jsx";

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

import AdminHome from "./dashboard/DashHome.jsx";
import AdminAboutMe from "./dashboard/AdminAboutMe.jsx";
import AdminWebResources from "./dashboard/AdminWebResources.jsx"

import NewBlog from "./dashboard/NewBlog.jsx";
import BlogPreview from "./dashboard/BlogPreview.jsx";
import AdminEditBlog from './dashboard/DisplayBlogs.jsx';
import EditBlog from "./dashboard/EditBlog.jsx";

import AdminEditBooks from "./dashboard/DisplayBooks.jsx";
import EditBook from "./dashboard/EditBook.jsx";
import NewBook from './dashboard/AddBook.jsx';

import DashboardLayout from './dashboard/DashWrapper.jsx';

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

  <Route path="/dashboard" element={<DashboardLayout />}>
      

      <Route index element={<AdminHome />} />
      <Route path="/dashboard/aboutme" element={<AdminAboutMe />} />
      <Route path="/dashboard/websiteresources" element={<AdminWebResources />} />

      <Route path="/dashboard/add-blog" element={<NewBlog/>} />
      <Route path="/dashboard/add-blog/:slug" element={<NewBlog />} />

      <Route path="/dashboard/blog-preview" element={<BlogPreview />} />
      <Route path="/dashboard/blog-preview/:slug" element={<BlogPreview />} />

      <Route path="/dashboard/blogs" element={<AdminEditBlog />} />
      <Route path="/dashboard/blog-editor" element={<NewBlog />} />
      <Route path="/dashboard/blog-editor/new" element={<NewBlog />} />
      <Route path="/dashboard/blog-edit/:slug" element={<EditBlog />} />
      
      <Route path="/dashboard/books" element={<AdminEditBooks />} />
      <Route path="/dashboard/book-edit/:title" element={<EditBook />} />
      <Route path="/dashboard/newbook" element={<NewBook />} />
      </Route>
    </Routes>
    
  </BrowserRouter>
);