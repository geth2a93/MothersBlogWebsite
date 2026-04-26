import os
import uuid
import boto3
from botocore.exceptions import NoCredentialsError
from werkzeug.utils import secure_filename
from flask import current_app

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

    elif storage_type == "s3":
        return upload_file_to_s3(file, filename, subfolder)

    else:
        raise ValueError("Invalid STORAGE_TYPE")


def _save_local(file, filename, subfolder):
    base_path = current_app.config["UPLOAD_FOLDER"]
    path = os.path.join(base_path, subfolder)

    os.makedirs(path, exist_ok=True)

    filepath = os.path.join(path, filename)
    file.save(filepath)

    return f"/static/uploads/{subfolder}/{filename}"


def upload_file_to_s3(file_name, bucket, object_name=None):
    if object_name is None:
        object_name = file_name

    s3_client = boto3.client('s3')
    try:
        response = s3_client.upload_file(file_name, bucket, object_name)
    except NoCredentialsError:
        print("Credentials not available")
        return False
    except Exception as e:
        print(f"An error occurred: {e}")
        return False
    return True