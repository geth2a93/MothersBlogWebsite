from .models import *
from flask import request
from sqlalchemy import func
from datetime import datetime, timezone
import re

def build_url(path):
    if not path:
        return None
    return request.url_root.rstrip("/") + "/" + path.lstrip("/")

def get_home_latest_content():
    latest_book = Book.query.order_by(Book.date_added.desc()).first()
    latest_blog = BlogPost.query.filter(BlogPost.published == True).order_by(BlogPost.date_created.desc()).first()

    data = {
        "book": None,
        "blog": None
    }

    if latest_book:
        data["book"] = {
            "type": "book",
            "id": latest_book.id,
            "title": latest_book.title,
            "synopsis": latest_book.synopsis,
            "genres": [g.genre for g in latest_book.genres],
            "image": build_url(latest_book.book_image_url),
            "date": latest_book.date_added.isoformat()
        }
    if(latest_blog.url_content_type) == "image":
        title_media=build_url(latest_blog.title_media_content_url)
    elif(latest_blog.url_content_type) in ["instagram", "facebook", "threads", "youtube"]:
        title_media=latest_blog.title_media_content_url
    else:
        title_media = None
    if latest_blog:
        blog_data = {
            "type": "blog",
            "id": latest_blog.id,
            "title": latest_blog.title,
            "slug": latest_blog.slug,
            "tags": [t.content for t in latest_blog.tags],
            "date": latest_blog.date_created.isoformat(),
            "title_media": title_media,
            "url_content_type": latest_blog.url_content_type,
        }

        if latest_blog.preview:
            blog_data["preview"] = latest_blog.preview

        data["blog"] = blog_data

    return data

def get_newest_book_for_each_genre():
    data = []

    for genre in Genre.query.order_by(Genre.genre).all():
        b = (Book.query.join(Book.genres) .filter(Genre.id == genre.id).order_by(Book.date_added.desc()).first())

        if b:
            data.append({
                "id": b.id,
                "title": b.title,
                "genre": genre.genre,
                "synopsis": b.synopsis,
                "book_image_url": build_url(b.book_image_url),
                "buy_links": [{"id": l.id, "url": l.links_url} for l in b.buy_links],
                "date_added": b.date_added.isoformat()
            })

    return data

def get_books_by_genre(genre):  # all books in the genre
    formatted_genre = genre.replace("-", " ").title()
    books = (Book.query.join(Book.genres).filter(Genre.genre == formatted_genre).order_by(Book.date_added.desc()).all())

    data = []
    for b in books:
        data.append({
            "id": b.id,
            "title": b.title,
            "genres": [g.genre for g in b.genres],
            "synopsis": b.synopsis,
            "book_image_url": build_url(b.book_image_url),
            "buy_links": [{"id": l.id, "url": l.links_url} for l in b.buy_links],
            "date_added": b.date_added.isoformat()
        })

    return data

def get_books_by_title(title):
    formatted_title = title.replace("-", " ") #url is book-title, db is Book Title

    book = Book.query.filter_by(title=formatted_title).first()
    data = {
        "id": book.id,
        "isbn": book.isbn,
        "title": book.title,
        "genre": [g.genre for g in book.genres],
        "synopsis": book.synopsis,
        "book_image_url": build_url(book.book_image_url),
        "buy_links": [{ "url": l.links_url} for l in book.buy_links],
        "reviews": [{"link_url": r.link_url, "name": r.name, "title": r.title, "content": r.content, "rating": r.rating} for r in book.reviews],
        "date_added": book.date_added,
        "awards": [{"award_url": build_url(a.pic_of_award), "award_title": a.title} for a in book.awards],
    }
    return data

def get_blog_posts(page, per_page=5): #5 per page
  
    pagination = BlogPost.query.filter(BlogPost.published == True).order_by(BlogPost.date_created.desc()).paginate(page=page, per_page=per_page, error_out=False)

    posts = []
    for p in pagination.items:
        if p.url_content_type == "image":
            title_media = build_url(p.title_media_content_url)
        elif p.url_content_type in ["instagram", "facebook", "threads", "youtube"]:
            title_media = p.title_media_content_url
        else:
            title_media = None

        posts.append({
            "id": p.id,
            "slug": p.slug,
            "title": p.title,
            "preview": p.preview,
            "date": p.date_created.isoformat(),
            "tags": [t.content for t in p.tags],
            "title_media": title_media,
            "url_content_type": p.url_content_type,
            "ownership": p.ownership,
            "name_of_owner": p.name_of_owner,
        })
    

    return {"posts":posts,
        "has_next": pagination.has_next,
        "page": page}




def get_teaching_resources_by_book(title):
    formatted_title = title.replace("-", " ")
    t = TeachingResource.query.filter_by(book_title=formatted_title).first_or_404()
    b = Book.query.filter_by(title=t.book_title).first()

    return {
        "book_title": t.book_title,
        "book_image_url": (b.book_image_url if b else None),
        "word_list": t.word_list,
        "activities": t.activities,
        "questions": t.questions,
        "supplies": t.supplies,
        "objectives": t.objectives,
        "procedures": t.procedures,
        "video_links": [{"video_title": video.video_title, "video_link": video.video_link} for video in t.video_links],
        "book_links": [{"book_link": bl.book_link, "book_title": bl.book_title} for bl in t.book_links]
    }

def get_teaching_resources():
    titles = TeachingResource.query.all()
    data = []

    for t in titles:
        book = Book.query.filter_by(title=t.book_title).first() #find if title is a book title, may not be

        data.append({
            "title": t.book_title,
            "book_image_url": (book.book_image_url if book else None)
        })

    return data

def slugify(text):
    text = text.lower()
    text = re.sub(r"[^a-z0-9\s-]", "", text)
    text = re.sub(r"\s+", "-", text)
    return text.strip("-")

def get_blog_by_slug(slug):
    p = BlogPost.query.filter_by(slug=slug).first_or_404()
    if(p.url_content_type) == "image":
        title_media=build_url(p.title_media_content_url)
    elif(p.url_content_type) in ["instagram", "facebook", "threads", "youtube"]:
        title_media=p.title_media_content_url
    else:
        title_media = None

    blocks = []
    for b in p.content_blocks:
        if(b.url_content_type) == "image":
            media_content_url=build_url(b.media_content_url)
        elif(b.url_content_type) in ["instagram", "facebook", "threads", "youtube"]:
            media_content_url=b.media_content_url
        else:
            media_content_url = None
        blocks.append({
            "blocktitle": b.title_of_block,
            "content": b.content,
            "media_content_url": media_content_url,
            "url_content_type": b.url_content_type,
            "alignment": b.alignment,
            "ownership": b.ownership,
            "name_of_owner": b.name_of_owner,
            "order": b.order
        })

    return {
        "id": p.id, 
        "title": p.title,
        "slug": p.slug,
        "preview": p.preview,
        "title_media": title_media,
        "url_content_type": p.url_content_type,
        "tags": [t.content for t in p.tags],
        "date_created": p.date_created.isoformat(),
        "ownership": p.ownership,
        "name_of_owner": p.name_of_owner,
        "content_blocks": blocks
    }

