import os
import uuid
from werkzeug.utils import secure_filename
from flask import current_app

#import boto3
#from botocore.exceptions import NoCredentialsError
#pip install boto3
#https://docs.aws.amazon.com/boto3/latest/guide/s3-uploading-files.html
#https://sqlpey.com/python/top-12-methods-to-upload-files-to-s3-bucket-using-python-boto3/#method-2-employing-boto3-for-better-support

def save_file(file, subfolder=""):
    if not file or file.filename == "":
        return None

    filename = f"{uuid.uuid4()}_{secure_filename(file.filename)}"
    storage_type = current_app.config["STORAGE_TYPE"]

    if storage_type == "local":
        return _save_local(file, filename, subfolder)

    elif storage_type == "cloud":
        return 

    else:
        raise ValueError("Invalid STORAGE_TYPE")


def _save_local(file, filename, subfolder):
    base_path = current_app.config["UPLOAD_FOLDER"]
    path = os.path.join(base_path, subfolder)

    os.makedirs(path, exist_ok=True)

    filepath = os.path.join(path, filename)
    file.save(filepath)

    return f"/static/uploads/{subfolder}/{filename}"