from website import create_app
from website.admin_functions import scheduler

app = create_app()

with app.app_context():
    scheduler()