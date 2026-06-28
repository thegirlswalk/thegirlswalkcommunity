from __future__ import annotations

import base64
import io
import re
from pathlib import Path

from PIL import Image

APP_PATH = Path(__file__).resolve().parent.parent / 'src' / 'App.jsx'
ASSETS_DIR = APP_PATH.parent / 'assets'
IMAGE_FILES = {
    'park': 'photo-park-event.jpg',
    'brunch_arch': 'photo-brunch-arch.jpg',
    'brunch_person': 'photo-brunch-person.jpg',
    'cards': 'photo-tgw-cards.jpg',
}


def extract_data_uris(text: str) -> dict[str, tuple[str, str]]:
    matches = re.findall(r'(park|brunch_arch|brunch_person|cards):\s*"(data:image/([^;]+);base64,[^"]+)"', text)
    return {key: (data_uri, fmt.lower()) for key, data_uri, fmt in matches}


def save_as_jpeg(data_uri: str, original_format: str, output_path: Path) -> None:
    prefix, encoded = data_uri.split(',', 1)
    image_bytes = base64.b64decode(encoded)

    if original_format in {'jpeg', 'jpg'}:
        output_path.write_bytes(image_bytes)
        return

    with Image.open(io.BytesIO(image_bytes)) as image:
        rgb_image = image.convert('RGB')
        rgb_image.save(output_path, format='JPEG', quality=95)


if __name__ == '__main__':
    text = APP_PATH.read_text()
    extracted = extract_data_uris(text)

    missing = [key for key in IMAGE_FILES if key not in extracted]
    if missing:
        raise SystemExit(f'Missing inline images: {", ".join(missing)}')

    ASSETS_DIR.mkdir(parents=True, exist_ok=True)
    for key, filename in IMAGE_FILES.items():
        data_uri, original_format = extracted[key]
        save_as_jpeg(data_uri, original_format, ASSETS_DIR / filename)
        print(f'Saved {key} -> src/assets/{filename}')
