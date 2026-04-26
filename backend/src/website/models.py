from . import db
from flask_login import UserMixin
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash

class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True, unique=True)
    username = db.Column(db.String(25), unique=True)
    password = db.Column(db.String(200), nullable=False)
    email = db.Column(db.String(50))
   
class BlogPost(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(50), nullable=False)
    content = db.Column(db.Text, nullable=False)
    date_created = db.Column(db.DateTime, default=datetime.utcnow)
    blog_image_urls = db.relationship('Blog_Images', lazy=True)
    tags = db.relationship('Tags', backref='blog', lazy=True)

class Book(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    synopsis = db.Column(db.Text, nullable=False)
    genre = db.Column(db.Integer, nullable=False) #04 based on which book, YA =1 Romance = 2, 0 middle grade 3 anthologies.
    book_image_url = db.Column(db.String(200), nullable=True)
    buy_links = db.relationship('BuyLinks', backref='book', lazy=True)
    reviews = db.relationship('Reviews', backref='book', lazy=True)

class Subscribers(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(50), nullable=False)
    name = db.Column(db.String(20), nullable=True)#if someone doesnt add a name use email until @ symbol to say hello to


class Tags(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.Text, nullable=False)
    blog_id = db.Column(db.Integer, db.ForeignKey('blog_post.id'), nullable=False)

class BuyLinks(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    links_url = db.Column(db.String(200))
    book_id = db.Column(db.Integer, db.ForeignKey('book.id'), nullable=False)

class Reviews(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    link_url = db.Column(db.String(200), nullable=False)
    name = db.Column(db.String(25), nullable=False)
    title = db.Column(db.String(50), nullable=True)
    content = db.Column(db.Text, nullable=False)
    rating = db.Column(db.Integer, nullable=False)
    book_id = db.Column(db.Integer, db.ForeignKey('book.id'), nullable=False)

class Blog_Images(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    link_url = db.Column(db.String(200), nullable=False)
    ownership = db.Column(db.Boolean, default=False) #true owned false not
    blog_id = db.Column(db.Integer, db.ForeignKey('blog_post.id'), nullable=False)



