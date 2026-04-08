from .models import Book, BlogPost

def get_genres():
    genres = Book.query.with_entities(Book.genre).distinct().all()
    return [g[0] for g in genres]

def get_books_by_genre(genre_name):
    books = Book.query.filter_by(genre=genre_name).all()
    data = []
    for b in books:
        data.append({
            "id": b.id,
            "title": b.title,
            "synopsis": b.synopsis,
            "buy_link": b.buy_link,
        })
    return data

def get_blog_posts():
    posts = BlogPost.query.order_by(BlogPost.date_created.desc()).all()
    return [{
        "id": p.id,
        "title": p.title,
        "content": p.content,
        "date_created": p.date_created.isoformat()
    } for p in posts]