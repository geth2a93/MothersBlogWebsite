from . import db
from flask_login import UserMixin
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash

class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True, unique=True)
    username = db.Column(db.String(25), unique=True)
    password = db.Column(db.String(200), nullable=False)
    email = db.Column(db.String(50), nullable=False)
   
class BlogPost(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(50), nullable=False)
    date_created = db.Column(db.DateTime, default=datetime.utcnow)
    tags = db.relationship('Tags', backref='blog', lazy=True)
    preview = db.Column(db.Text)
    title_pic = db.Column(db.String(200), nullable=False) #delete nullable, when adding new blog posts, picture or video must exist, not both
    ownership = db.Column(db.Boolean, nullable=False)
    name_of_owner = db.Column(db.String(200))
    #video_url = db.Column(db.String(200), nullable=True) insta/fb

    content_blocks = db.relationship("BlogContentBlock", backref="blog_post", order_by="BlogContentBlock.order")

class BlogContentBlock(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    blog_id = db.Column(db.Integer, db.ForeignKey("blog_post.id"))
    order = db.Column(db.Integer, nullable=False)
    title_of_block = db.Column(db.Text)
    content = db.Column(db.Text)
    image_url = db.Column(db.String(200))
    size = db.Column(db.Integer)
    ownership = db.Column(db.Boolean)
    name_of_owner = db.Column(db.String(200), nullable=False)
    alignment = db.Column(db.String(10))
    #video_url = db.Column(db.String(200), nullable=True)

class Book(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    isbn = db.Column(db.String(15), nullable=False)
    title = db.Column(db.String(100), nullable=False)
    synopsis = db.Column(db.Text, nullable=False)
    genre = db.Column(db.String(20), nullable=False) 
    book_image_url = db.Column(db.String(200), nullable=False)
    buy_links = db.relationship('BuyLinks', backref='book', lazy=True)
    date_added = db.Column(db.DateTime, default=datetime.utcnow)
    reviews = db.relationship('Reviews', backref='book', lazy=True)
    awards = db.relationship('Awards', backref='book', lazy=True)

class Awards(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    pic_of_award = db.Column(db.String(200))
    title = db.Column(db.String(200))
    book_id = db.Column(db.Integer, db.ForeignKey('book.id'), nullable=False)

class Subscribers(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(50), nullable=False)
    name = db.Column(db.String(20), nullable=True)#if someone doesnt add a name use email until @ symbol to say hello to in email

class AboutMe(db.Model): 
    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.Text, nullable=False) 
    updated_at = db.Column(db.DateTime, default=datetime.utcnow)
    abtme_pic_url = db.Column(db.String(200))

class Tags(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.Text, nullable=False)
    blog_id = db.Column(db.Integer, db.ForeignKey('blog_post.id'), nullable=False)

class BuyLinks(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    links_url = db.Column(db.String(200))
    name_of_site = db.Column(db.String(50))
    book_id = db.Column(db.Integer, db.ForeignKey('book.id'), nullable=False)

class Reviews(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    link_url = db.Column(db.String(200), nullable=True)
    name = db.Column(db.String(25), nullable=True)
    title = db.Column(db.String(50), nullable=True)
    content = db.Column(db.Text, nullable=True)
    rating = db.Column(db.Integer, nullable=True)
    book_id = db.Column(db.Integer, db.ForeignKey('book.id'), nullable=False)

class Website_Images(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    logo_image_url = db.Column(db.String(200))
    banner_image_url = db.Column(db.String(200))
    
class TeachingResource(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    book_title = db.Column(db.String(200), nullable=False)#done this way because she might add teaching resources on books that dont exist
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
    book_link = db.Column(db.String(200), nullable=False)
    book_title = db.Column(db.String(200), nullable=False)
