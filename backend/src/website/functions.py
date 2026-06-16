from .models import *
from flask import request
from sqlalchemy import func

def build_url(path):
    if not path:
        return None
    return request.url_root.rstrip("/") + "/" + path.lstrip("/")

def get_home_latest_content():
    latest_book = Book.query.order_by(Book.date_added.desc()).first()
    latest_blog = BlogPost.query.order_by(BlogPost.date_created.desc()).first()

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
            "genre": latest_book.genre,
            "image": build_url(latest_book.book_image_url),
            "date": latest_book.date_added.isoformat()
        }

    if latest_blog:
        blog_data = {
            "type": "blog",
            "id": latest_blog.id,
            "title": latest_blog.title,
            "tags": [t.content for t in latest_blog.tags],
            "date": latest_blog.date_created.isoformat(),
            "title_pic": build_url(latest_blog.title_pic)
        }

        if latest_blog.preview:
            blog_data["preview"] = latest_blog.preview

        data["blog"] = blog_data

    return data

def get_newest_book_for_each_genre():
    genres = ["Young Adult", "Middle Grade", "Romance", "Short Story"] #owner doesnt write any new genres otherwise would be a query statement also could be define globally

    data = []

    for genre in genres:
        b = (Book.query.filter_by(genre=genre).order_by(Book.date_added.desc()).first())

        if b:
            data.append({
                "id": b.id,
                "title": b.title,
                "genre": b.genre,
                "synopsis": b.synopsis,
                "book_image_url": build_url(b.book_image_url),
                "buy_links": [{ "id": l.id, "url": l.links_url} for l in b.buy_links], 
                "date_added": b.date_added
            })

    return data

def get_books_by_genre(genre): #all books in the genre
    formatted_genre = genre.replace("-", " ").title()
    books = Book.query.filter_by(genre=formatted_genre).all() #404 error if genre no exist
    data = []
    for b in books:
        data.append({
            "id": b.id,
            "title": b.title,
            "genre": b.genre,
            "synopsis": b.synopsis,
            "book_image_url": build_url(b.book_image_url),
            "buy_links": [{"id": l.id, "url": l.links_url} for l in b.buy_links],
            "date_added": b.date_added
        })
    return data

def get_books_by_title(title):
    formatted_title = title.replace("-", " ") #url is book-title, db is Book Title

    book = Book.query.filter_by(title=formatted_title).first()
    data = {
        "id": book.id,
        "title": book.title,
        "genre": book.genre,
        "synopsis": book.synopsis,
        "book_image_url": build_url(book.book_image_url),
        "buy_links": [{ "url": l.links_url} for l in book.buy_links],
        "reviews": [{"link_url": r.link_url, "name": r.name, "title": r.title, "content": r.content, "rating": r.rating} for r in book.reviews],
        "date_added": book.date_added,
        "awards": [{"award_url": build_url(a.pic_of_award), "award_title": a.title} for a in book.awards],
    }
    return data

def get_blog_posts(page, per_page=5): #5 per page
    #dont show dates that havent come
    pagination = BlogPost.query.order_by(BlogPost.date_created.desc()).paginate(page=page, per_page=per_page, error_out=False)

    data = {
        "posts": [{
            "id": p.id,
            "title": p.title,
            "preview": p.preview,
            "date": p.date_created.isoformat(),
            "tags": [t.content for t in p.tags],
            "titlepic": build_url(p.title_pic),
            "ownnership": p.ownership,
            "name_of_owner": p.name_of_owner
            
        } for p in pagination.items],
        "has_next": pagination.has_next,
        "page": page
    }

    return data

def get_blog_by_date(date):
    formatted_date = date.replace("-", " ")
    p = BlogPost.query.filter(func.date(BlogPost.date_created) == date).first_or_404()
    #dont show dates that havent come
    blocks = []

    for b in p.content_blocks:
        blocks.append({
            "blocktitle": b.title_of_block,
            "content": b.content,
            "image_url": build_url(b.image_url),
            "alignment": b.alignment,
            "size": b.size,
            "ownership": b.ownership,
            "name_of_owner": b.name_of_owner,
            "order": b.order
        })

    return {
        "id": p.id,
        "title": p.title,
        "preview": p.preview,
        "title_pic": build_url(p.title_pic),
        "tags": [t.content for t in p.tags],
        "date_created": p.date_created.isoformat(),
        "ownership": p.ownership,
        "name_of_owner": p.name_of_owner,
        "content_blocks": blocks
    }


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