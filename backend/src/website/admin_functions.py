from .functions import *

def url_check(media_content_url, url_content_type):
    url = media_content_url.lower()
    valid_urls = {
        "youtube": ["youtube.com"],
        "instagram": ["instagram.com"],
        "facebook": ["facebook.com"],
        "threads": ["threads.com"],
        "x.com": ["x.com", "twitter.com"]
    }

    return any(site in url for site in valid_urls[url_content_type])

def generate_unique_slug(model, text):
    base_slug = slugify(text)
    slug = base_slug
    counter = 1

    while model.query.filter_by(slug=slug).first():
        slug = f"{base_slug}-{counter}"
        counter += 1

    return slug