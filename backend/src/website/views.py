from flask import Blueprint, render_template, request, session, redirect, url_for
from . import db
from flask_login import login_required, current_user
#from .models import 
#from .functions import

views = Blueprint('views', __name__) 
@views.route('/')
@views.route('/home')

#home goes to blog

def home():
    return render_template("home.html", user=current_user)