from . import db
from flask_login import UserMixin
from datetime import datetime, timezone

class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True, unique=True)
    username = db.Column(db.String(25), unique=True)
    password = db.Column(db.String(200), nullable=False)
    email = db.Column(db.String(50), nullable=False)

class Website_Images(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    logo_image_url = db.Column(db.String(200))
    banner_image_url = db.Column(db.String(200))

class AboutMe(db.Model): 
    id = db.Column(db.Integer, primary_key=True)
    bio = db.Column(db.Text, nullable=False) 
    updated_at = db.Column(db.DateTime)
    photo_url = db.Column(db.String(200))

#Blog 
   
class BlogPost(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(50), nullable=False)
    slug = db.Column(db.String(120), unique=True, nullable=False, index=True) #shortened title used for finding specific blogs
    blog_date = db.Column(db.Date)
    title_text_content = db.Column(db.Text)
    title_media_content_url = db.Column(db.String(2000)) #either an outward url, or file location
    title_media_content_type = db.Column(db.String(20)) #image, youtube link, fb link, insta link 
    title_media_ownership = db.Column(db.Boolean)
    title_media_owner_name = db.Column(db.String(200))
    published = db.Column(db.Boolean, default=False, nullable=False)

    tags = db.relationship('Tags', backref='blog', lazy=True)
    content_blocks = db.relationship("BlogContentBlock", backref="blog_post", order_by="BlogContentBlock.order")

class BlogContentBlock(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    blog_id = db.Column(db.Integer, db.ForeignKey("blog_post.id"))
    order = db.Column(db.Integer, nullable=False) #block order
    title_of_block = db.Column(db.Text)
    block_text_content = db.Column(db.Text)
    block_media_content_url = db.Column(db.String(2000)) 
    block_media_content_type = db.Column(db.String(20)) 
    block_media_ownership = db.Column(db.Boolean)
    block_media_owner_name = db.Column(db.String(200))
    alignment = db.Column(db.String(10)) # content allignment

#Book

book_genres = db.Table('book_genres', db.Column('book_id', db.Integer, db.ForeignKey('book.id'), primary_key=True), db.Column('genre_id', db.Integer, db.ForeignKey('genre.id'), primary_key=True))

class Book(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    isbn = db.Column(db.String(15))
    title = db.Column(db.String(100), nullable=False)#cannont be null as this is what the routes use
    synopsis = db.Column(db.Text)
    book_image_url = db.Column(db.String(200))
    published = db.Column(db.Boolean)
    publish_date = db.Column(db.Date)
    slug = db.Column(db.String(120), unique=True, nullable=False, index=True)

    genres = db.relationship('Genre', secondary=book_genres, back_populates='books')
    buy_links = db.relationship('BuyLinks', backref='book', lazy=True)
    awards = db.relationship('Awards', backref='book', lazy=True) 
    reviews = db.relationship('Reviews', backref='book', lazy=True)

class Genre(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    genre = db.Column(db.String(50), unique=True, nullable=False)

    books = db.relationship('Book', secondary=book_genres, back_populates='genres')

class BuyLinks(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    url_of_link = db.Column(db.String(200))
    site_name = db.Column(db.String(50))
    book_id = db.Column(db.Integer, db.ForeignKey('book.id'), nullable=False)

class Awards(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    url_of_award = db.Column(db.String(200))
    title_of_award = db.Column(db.String(200))
    book_id = db.Column(db.Integer, db.ForeignKey('book.id'), nullable=False)

class Tags(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    tag = db.Column(db.Text, nullable=False)
    blog_id = db.Column(db.Integer, db.ForeignKey('blog_post.id'), nullable=False)

class Reviews(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    url_of_link = db.Column(db.String(200), nullable=True)
    reviewer_name = db.Column(db.String(25), nullable=True)
    review_title = db.Column(db.String(50), nullable=True)
    review_content = db.Column(db.Text, nullable=True)
    review_rating = db.Column(db.Integer, nullable=True)
    book_id = db.Column(db.Integer, db.ForeignKey('book.id'), nullable=False)

#Teaching Resources
    
class TeachingResource(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    book_title = db.Column(db.String(200), nullable=False) #routes use this for nav
    slug = db.Column(db.String(200), nullable=False)
    word_list = db.Column(db.Text, nullable=True)
    activities = db.Column(db.Text, nullable=True)
    questions = db.Column(db.Text, nullable=True)
    supplies = db.Column(db.Text, nullable=True)
    objectives = db.Column(db.Text, nullable=True)
    procedures = db.Column(db.Text, nullable=True)

    video_links = db.relationship('TeachingResourceVideoLink', backref='resource', lazy=True)
    book_links = db.relationship('TeachingResourceBookLink', backref='resource', lazy=True)

class TeachingResourceVideoLink(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    resource_id = db.Column(db.Integer, db.ForeignKey('teaching_resource.id'),nullable=False)
    video_link = db.Column(db.String(200), nullable=False)
    video_title = db.Column(db.String(200), nullable=False)

class TeachingResourceBookLink(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    resource_id = db.Column(db.Integer, db.ForeignKey('teaching_resource.id'), nullable=False)
    book_link = db.Column(db.String(200), nullable=True)
    book_title = db.Column(db.String(200), nullable=False)

#Email

class Subscribers(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(50), nullable=False)
    name = db.Column(db.String(20), nullable=True)#if someone doesnt add a name use email until @ symbol to say hello to in email

class SubscriberEmail(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    date_to_send = db.Column(db.Date)
    sent = db.Column(db.Boolean, default=False)
    subject = db.Column(db.Text)
    body = db.Column(db.Text)

    email_pics = db.relationship('EmailPics', backref='subscriberemail', lazy=True)

class EmailPics(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    url_of_image = db.Column(db.String(500), nullable=False)
    email_id = db.Column(db.Integer, db.ForeignKey('subscriber_email.id'), nullable=False)
