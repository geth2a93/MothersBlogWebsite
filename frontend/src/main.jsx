import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Login from './dashboard/Login.jsx';

import Home from './public/Home.jsx';
import Layout from "./public/components/Components.jsx";
import BlogPostFull from './public/pages/BlogPostFull.jsx';
import BlogsList from './public/pages/BlogsList.jsx';
import BooksList from './public/pages/BooksList.jsx';
import About from './public/pages/AboutMe.jsx'
import BooksGenreWrapper from './public/pages/BooksGenre.jsx'
import BookDetail from './public/pages/BookFull.jsx'
import TeachingResourceFull from './public/pages/TeachingResourceFull.jsx'
import ContentListPage from "./public/components/ContentListPage.jsx";

import AdminHome from "./dashboard/DashHome.jsx";
import AdminAboutMe from "./dashboard/webresource/EditAboutMe.jsx";
import AdminWebResources from "./dashboard/webresource/EditWebResources.jsx"

import NewBlog from "./dashboard/blogs/AddBlog.jsx";
import BlogPreview from "./dashboard/blogs/BlogPreview.jsx";
import AdminEditBlog from './dashboard/blogs/DisplayBlogs.jsx';
import EditBlog from "./dashboard/blogs/EditBlog.jsx";

import AdminEditBooks from "./dashboard/books/DisplayBooks.jsx";
import EditBook from "./dashboard/books/EditBook.jsx";
import NewBook from './dashboard/books/AddBook.jsx';

import DashboardLayout from './dashboard/DashWrapper.jsx';
import DashNotFound from './dashboard/DashNotFound.jsx';
import DisplayEmails from './dashboard/email/DisplayEmail.jsx';
import AddEmail from './dashboard/email/AddEmail.jsx';
import EditEmail from './dashboard/email/EditEmail.jsx';

import DisplayTeachingResources from './dashboard/teaching/DisplayTeach.jsx';
import AddTeachingResource from './dashboard/teaching/AddTeach.jsx';
import EditTeachingResource from './dashboard/teaching/EditTeach.jsx';

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
        <Route path="/books/title/:slug" element={<BookDetail />} />

        <Route path="/teachingresources" element={<ContentListPage type="teaching" />} />
        <Route path="/teachingresources/:slug" element={<TeachingResourceFull />} />
      </Route>

      <Route path="/login" element={<Login />} />

    <Route path="/dashboard" element={<DashboardLayout />}> 
      <Route path="*" element={<DashNotFound />} />
      <Route index element={<AdminHome />} />

      <Route path="aboutme" element={<AdminAboutMe />} />
      <Route path="websiteresources" element={<AdminWebResources />} />

      <Route path="add-blog" element={<NewBlog />} />
      <Route path="add-blog/:slug" element={<NewBlog />} />

      <Route path="blog-preview" element={<BlogPreview />} />
      <Route path="blog-preview/:slug" element={<BlogPreview />} />

      <Route path="blogs" element={<AdminEditBlog />} />
      <Route path="blog-editor" element={<NewBlog />} />
      <Route path="blog-editor/new" element={<NewBlog />} />
      <Route path="blog-edit/:slug" element={<EditBlog />} />

      <Route path="books" element={<AdminEditBooks />} />
      <Route path="book-edit/:slug" element={<EditBook />} />
      <Route path="newbook" element={<NewBook />} />

      <Route path="displayemails" element={<DisplayEmails />} />
      <Route path="new-email" element={<AddEmail />} />
      <Route path="edit-email/:email_id" element={<EditEmail />} />

      <Route path="display-teaching" element={<DisplayTeachingResources />} />
      <Route path="add-teaching" element={<AddTeachingResource />} />
      <Route path="edit-teaching/:slug" element={<EditTeachingResource />} />
    </Route>
    </Routes>
  </BrowserRouter>
);