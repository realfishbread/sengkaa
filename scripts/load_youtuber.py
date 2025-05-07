import os
import json
from datetime import datetime
from django.core.files import File
from api.models import Genre, Star
from django.conf import settings

def parse_birthday(birthday_str):
    try:
        if '불명' in birthday_str or not birthday_str.strip():
            return None
        if birthday_str.count('-') == 1:
            return datetime.strptime(f'1900-{birthday_str}', '%Y-%m-%d').date()
        return datetime.strptime(birthday_str, '%Y-%m-%d').date()
    except Exception:
        return None

def run():
    youtuber_genre = Genre.objects.get(name='youtuber')
    image_folder_path = os.path.join(settings.BASE_DIR, 'images')

    with open('D:/zolzak/begin-react/youtuber.json', encoding='utf-8') as f:
        data = json.load(f)

    for item in data:
        if item.get('genre') != 'youtuber':
            continue

        image_filename = item.get('image', '')
        image_path = os.path.join(image_folder_path, image_filename)

        star = Star(
            name=item['name'],
            group=item.get('group', ''),
            display=item['display'],
            birthday=parse_birthday(item.get('birthday', '')),
            genre=youtuber_genre,
            keywords=[]
        )

        if os.path.exists(image_path):
            with open(image_path, 'rb') as img_file:
                star.image.save(image_filename, File(img_file), save=False)

        star.save()
