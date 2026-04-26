from .models import Book, BlogPost

def get_genres():
    genres = Book.query.with_entities(Book.genre).distinct().all()
    return [g[0] for g in genres]

def get_books(genre_name, range):
    books = Book.query.filter_by(genre=genre_name).limit(range).all()
    data = []
    for b in books:
        data.append({
            "title": b.title,
            "synopsis": b.synopsis,
            #"buy_links": b.buy_link,
            #"book_image_url": b.book_image_url,
            #"reviews": b.reviews
        })
    return data

def get_blog_posts(range):
    posts = BlogPost.query.order_by(BlogPost.date_created.desc()).limit(range).all()
    return [{
        "title": p.title,
        "content": p.content,
       "tags": [t.content for t in p.tags],
        "date_created": p.date_created.isoformat(),
        "blog_image_urls": [(i.link_url, i.ownership) for i in p.blog_image_urls],
    } for p in posts]