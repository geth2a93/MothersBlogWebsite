from .models import *

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
            "image": latest_book.book_image_url,
            "date": latest_book.date_added.isoformat()
        }

    if latest_blog:
        blog_data = {
            "type": "blog",
            "id": latest_blog.id,
            "title": latest_blog.title,
            "tags": [t.content for t in latest_blog.tags],
            "date": latest_blog.date_created.isoformat(),
            "title_pic": latest_blog.title_pic
        }

        if latest_blog.preview:
            blog_data["preview"] = latest_blog.preview

        data["blog"] = blog_data

    return data

def get_newest_book_for_each_genre():
    genres = ["Young Adult", "Middle Grade", "Romance", "Short Stories"]

    data = []

    for genre in genres:
        b = (Book.query.filter_by(genre=genre).order_by(Book.date_added.desc()).first())

        if b:
            data.append({
                "id": b.id,
                "title": b.title,
                "genre": b.genre,
                "synopsis": b.synopsis,
                "book_image_url": b.book_image_url,
                "buy_links": [{ "id": l.id, "url": l.links_url} for l in b.buy_links],
                "date_added": b.date_added
            })

    return data

def get_books_by_genre(genre): #all books in the genre
    books = Book.query.filter_by(genre=genre).all()
    data = []
    for b in books:
        data.append({
            "id": b.id,
            "title": b.title,
            "genre": b.genre,
            "synopsis": b.synopsis,
            "book_image_url": b.book_image_url,
            "buy_links": [{"id": l.id, "url": l.links_url} for l in b.buy_links],
            "date_added": b.date_added
        })
    return data

def get_books_by_title(title):
    formatted_title = title.replace("-", " ").title() #url is book-title, db is Book Title
    book = Book.query.filter_by(title=formatted_title).first()
    data = {
        "id": book.id,
        "title": book.title,
        "genre": book.genre,
        "synopsis": book.synopsis,
        "book_image_url": book.book_image_url,
        "buy_links": [{"id": l.id, "url": l.links_url} for l in book.buy_links],
        "reviews": [{"id": r.id, "link_url": r.link_url, "name": r.name, "title": r.title, "content": r.content, "rating": r.rating} for r in book.reviews],
        "date_added": book.date_added
    }
    return data

def get_blog_posts(page, per_page=5): #5 per page
    pagination = BlogPost.query.order_by(BlogPost.date_created.desc()).paginate(page=page, per_page=per_page, error_out=False)

    data = {
        "posts": [{
            "id": p.id,
            "title": p.title,
            "preview": p.preview,
            "tags": [t.content for t in p.tags],
            "titlepic": p.title_pic
            
        } for p in pagination.items],
        "has_next": pagination.has_next,
        "page": page
    }

    return data

def get_blog_by_id(id):
    p = BlogPost.query.get_or_404(id)
    blocks = []

    for b in p.content_blocks:
        blocks.append({
            "content": b.content,
            "image_url": b.image_url,
            "alignment": b.alignment,
            "size": b.size,
            "ownership": b.ownership,
            "order": b.order
        })

    return {
        "id": p.id,
        "title": p.title,
        "preview": p.preview,
        "title_pic": p.title_pic,
        "tags": [t.content for t in p.tags],
        "date_created": p.date_created.isoformat(),
        "content_blocks": blocks
    }


#def get_teaching_resources_by_book(title):
#def get_teaching_resources():