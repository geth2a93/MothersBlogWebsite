from .models import *
from flask import request
import re
from bs4 import BeautifulSoup

def build_url(path):
    if not path:
        return None
    return request.url_root.rstrip("/") + "/" + path.lstrip("/")

def get_home_latest_content():
    latest_book = Book.query.filter(Book.published == True).order_by(Book.publish_date.desc()).first_or_404()
    latest_blog = BlogPost.query.filter(BlogPost.published == True).order_by(BlogPost.blog_date.desc()).first_or_404()

    data = {
        "book": None,
        "blog": None
    }

    if latest_book:
        data["book"] = {
            "type": "book",
            "id": latest_book.id,
            "title": latest_book.title,
            "slug": latest_book.slug,
            "synopsis": truncate_html(latest_book.synopsis, 500),
            "genres": [g.genre for g in latest_book.genres],
            "genre_name": [display_genre(g.genre) for g in latest_book.genres],
            "image": build_url(latest_book.book_image_url),
            "date": latest_book.publish_date.isoformat(),
            "date_displayed": latest_book.publish_date_displayed
        }
    if latest_blog and latest_blog.title_media_content_type == "image":
        title_media=build_url(latest_blog.title_media_content_url)
    elif latest_blog and (latest_blog.title_media_content_type) in ["instagram", "facebook", "threads", "youtube"]:
        title_media=latest_blog.title_media_content_url
    else:
        title_media = None
    if latest_blog:
        blog_data = {
            "type": "blog",
            "id": latest_blog.id,
            "title": latest_blog.title,
            "slug": latest_blog.slug,
            "tags": [t.tag for t in latest_blog.tags],
            "date": latest_blog.blog_date.isoformat(),
            "title_media": title_media, #change front end  if not too annoying?
            "url_content_type": latest_blog.title_media_content_type,
        }

        if latest_blog.title_text_content:
            blog_data["preview"] = latest_blog.title_text_content
            blog_data["preview_short"] = truncate_html( latest_blog.title_text_content, 500)

        data["blog"] = blog_data

    return data

def get_all_books(page, per_page=5):
    data = []
    pagination = Book.query.filter(Book.published == True).order_by(Book.publish_date.desc()).paginate(page=page, per_page=per_page, error_out=False)

    if pagination:
        for b in pagination.items:
            data.append({
                "id": b.id,
                "title": b.title,
                "genre_name": [display_genre(g.genre) for g in b.genres],
                "slug": b.slug,
                "synopsis": truncate_html(b.synopsis, 500),
                "book_image_url": build_url(b.book_image_url),
                "buy_links": [{"id": l.id, "url": l.url_of_link, "site_name": l.site_name} for l in b.buy_links], 
                "date_added": b.publish_date.isoformat(),
                "date_displayed": b.publish_date_displayed
            })

    return data

def get_books_by_genre(genre, page, per_page=5):  # all books in the genre
    pagination = Book.query.join(Book.genres).filter(Genre.genre == genre, Book.published == True).order_by(Book.publish_date.desc()).paginate(page=page, per_page=per_page, error_out=False)

    data = []
    for b in pagination.items:
        data.append({
            "id": b.id,
            "title": b.title,
            "slug": b.slug,
            "genres": [g.genre for g in b.genres],
            "genre_name": [display_genre(g.genre) for g in b.genres],
            "synopsis": truncate_html(b.synopsis, 500),
            "book_image_url": build_url(b.book_image_url),
            "buy_links": [{"id": l.id, "url": l.url_of_link, "site_name": l.site_name} for l in b.buy_links],  
            "date_added": b.publish_date.isoformat(), 
            "date_displayed": b.publish_date_displayed
        })

    return data

def get_books_by_title(slug, published):

    book = Book.query.filter_by(slug=slug, published = published).first_or_404()
    data = {
        "id": book.id,
        "slug": book.slug,
        "isbn": book.isbn,
        "title": book.title,
        "genre": [g.genre for g in book.genres],
        "genre_name": [display_genre(g.genre) for g in book.genres],
        "synopsis": book.synopsis,
        "book_image_url": build_url(book.book_image_url),
        "buy_links": [{ "url": l.url_of_link, "name": l.site_name} for l in book.buy_links],
        "reviews": [{"link_url": r.url_of_link, "name": r.reviewer_name, "title": r.review_title, "content": r.review_content, "rating": r.review_rating} for r in book.reviews],
        "date_added": book.publish_date.isoformat(),
        "date_displayed": book.publish_date_displayed,
        "awards": [{"award_url": build_url(a.url_of_award), "award_title": a.title_of_award} for a in book.awards],
    }
    return data

def get_blog_posts(page, per_page=5):
  
    pagination = BlogPost.query.filter(BlogPost.published == True).order_by(BlogPost.blog_date.desc()).paginate(page=page, per_page=per_page, error_out=False)

    posts = []
    for p in pagination.items:
        if p.title_media_content_type == "image":
            title_media = build_url(p.title_media_content_url)
        elif p.title_media_content_type in ["instagram", "facebook", "threads", "youtube"]:
            title_media = p.title_media_content_url
        else:
            title_media = None

        posts.append({
            "id": p.id,
            "slug": p.slug,
            "title": p.title,
            "preview": p.title_text_content,
            "date": p.blog_date.isoformat(),
            "tags": [t.tag for t in p.tags],
            "title_media": title_media,
            "url_content_type": p.title_media_content_type,
            "ownership": p.title_media_ownership,
            "name_of_owner": p.title_media_owner_name,
        })
    

    return {"posts":posts,
        "has_next": pagination.has_next,
        "page": page}

def slugify(text):
    text = text.lower()
    text = re.sub(r"[^a-z0-9\s-]", "", text)
    text = re.sub(r"\s+", "-", text)
    return text.strip("-")

def get_blog_by_slug(slug):
    p = BlogPost.query.filter_by(slug=slug).first_or_404()
    if(p.title_media_content_type) == "image":
        title_media=build_url(p.title_media_content_url)
    elif(p.title_media_content_type) in ["instagram", "facebook", "threads", "youtube"]:
        title_media=p.title_media_content_url
    else:
        title_media = None
    #add urls for edit blogpost
    blocks = []
    for b in p.content_blocks:
        if(b.block_media_content_type) == "image":
            block_media_content_url=build_url(b.block_media_content_url)
        elif(b.block_media_content_type) in ["instagram", "facebook", "threads", "youtube"]:
            block_media_content_url=b.block_media_content_url
        else:
            block_media_content_url = None
        blocks.append({
            "block_content_url": b.block_media_content_url,#just used for edit otherwise ignore
            "blocktitle": b.title_of_block,
            "content": b.block_text_content,
            "media_content_url": block_media_content_url,
            "url_content_type": b.block_media_content_type,
            "alignment": b.alignment,
            "ownership": b.block_media_ownership,
            "name_of_owner": b.block_media_owner_name,
            "order": b.order
        })
    #nextblog = p.id+1
    #if  p = BlogPost.query.filter_by(id=nextblog).first_or_404()
    return {
        "id": p.id, 
        "titlemediaurl": p.title_media_content_url, #just used for edit otherwise ignore
        "title": p.title,
        "slug": p.slug,
        "preview": p.title_text_content,
        "title_media": title_media,
        "url_content_type": p.title_media_content_type,
        "tags": [t.tag for t in p.tags],
        "date_created": p.blog_date.isoformat(),
        "ownership": p.title_media_ownership,
        "name_of_owner": p.title_media_owner_name,
        "content_blocks": blocks,
        #"nextblog": 
    }

def get_teaching_resources_by_book(slug):
    t = TeachingResource.query.filter_by(slug=slug).first_or_404()
    b = Book.query.filter_by(title=t.book_title).first_or_404()

    return {
        "book_title": t.book_title,
        "isbn": b.isbn if b.isbn else None,
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
    titles = TeachingResource.query.order_by(TeachingResource.id.asc()).all()
    data = []

    for t in titles:
        book = Book.query.filter_by(title=t.book_title).first() #find if title is a book title, may not be

        data.append({
            "title": t.book_title,
            "isbn": book.isbn if book.isbn else None,
            "slug": t.slug,
            "book_image_url": (build_url(book.book_image_url) if book else None),
        })
    return data

def normalize_genre(genre_name):
    text = genre_name.strip().lower()
    text = re.sub(r"[^a-z0-9\s-]", "", text)
    text = re.sub(r"\s+", "-", text)
    return text.strip("-")


def display_genre(genre_name):
    return genre_name.replace("-", " ").title()

def get_genres_for_menu():
    genres = Genre.query.order_by(Genre.genre).all()
    data = []
    for genre in genres:
        data.append
        ({
            "id": genre.id,
            "name": genre.genre,
            "display": display_genre(genre.genre)
        })
    return data

def truncate_html(html, max_length):
    if not html:
        return ""

    soup = BeautifulSoup(html, "html.parser")
    text = soup.get_text()

    if len(text) <= max_length:
        return html

    return text[:max_length] + "..."