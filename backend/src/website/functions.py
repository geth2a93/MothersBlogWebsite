from .models import Book, BlogPost

def get_home_latest_content():
    latest_book = Book.query.order_by(Book.date_added.desc()).first()
    latest_blog = BlogPost.query.order_by(BlogPost.date_created.desc()).first()

    if latest_book and (not latest_blog or latest_book.date_added > latest_blog.date_created):
        return {
            "type": "book",
            "id": latest_book.id,
            "title": latest_book.title,
            "synopsis": latest_book.synopsis,
            "genre": latest_book.genre,
            "image": latest_book.book_image_url,
            "date": latest_book.date_added.isoformat()
        }

    if latest_blog:
        return {            
            "type": "blog",
            "id": latest_blog.id,
            "title": latest_blog.title,
            "content": latest_blog.content,
            "tags": [t.content for t in latest_blog.tags],
            "date": latest_blog.date_created.isoformat()
        }

    return None

def get_books(genre_name, range):
    books = Book.query.filter_by(genre=genre_name).limit(range).all()
    data = []
    for b in books:
        data.append({
            "id": b.id,
            "title": b.title,
            "genre": b.genre,
            "synopsis": b.synopsis,
            "book_image_url": b.book_image_url,
            "buy_links": [{"id": l.id, "url": l.links_url} for l in b.buy_links],
            "reviews": [{"id": r.id, "link_url": r.link_url, "name": r.name, "title": r.title, "content": r.content, "rating": r.rating} for r in b.reviews]
        })
    return data

def get_books_by_id(id):
    b = Book.query.get_or_404(id)

    data = {
        "id": b.id,
        "title": b.title,
        "genre": b.genre,
        "synopsis": b.synopsis,
        "book_image_url": b.book_image_url,
        "buy_links": [{"id": l.id, "url": l.links_url} for l in b.buy_links],
        "reviews": [{"id": r.id, "link_url": r.link_url, "name": r.name, "title": r.title,"content": r.content, "rating": r.rating} for r in b.reviews]
    }

    return data

def get_blog_posts(page, per_page=5): #infinite scroll
    pagination = BlogPost.query.order_by(BlogPost.date_created.desc()).paginate(page=page, per_page=per_page, error_out=False)

    data = {
        "posts": [{
            "id": p.id,
            "title": p.title,
            "content": p.content[:200],
            "tags": [t.content for t in p.tags],
            "date_created": p.date_created.isoformat(),
            "images": [(i.link_url, i.ownership) for i in p.blog_image_urls]
            
        } for p in pagination.items],
        "has_next": pagination.has_next,
        "page": page
    }

    return data

def get_blog_by_id(id): #grab specific blog post
    p = BlogPost.query.get_or_404(id)

    data = {
        "id": p.id,
        "title": p.title,
        "content": p.content,
        "tags": [t.content for t in p.tags],
        "date_created": p.date_created.isoformat(),
        "images": [(i.link_url, i.ownership) for i in p.blog_image_urls]
    }

    return data