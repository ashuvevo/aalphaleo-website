from PIL import Image
import os
from collections import deque

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
src = os.path.join(ROOT, "assets", "images", "logo-source.png")
dests = [
    os.path.join(ROOT, "assets", "images", "logo.png"),
    os.path.join(ROOT, "out", "assets", "images", "logo.png"),
]


def is_background(r, g, b):
    # Remove black box and outer white matte; keep logo whites/colors/text.
    if max(r, g, b) <= 28:
        return True
    if min(r, g, b) >= 245:
        return True
    return False


def flood_transparent(img):
    w, h = img.size
    pixels = img.load()
    visited = [[False] * w for _ in range(h)]
    queue = deque()

    for x in range(w):
        for y in (0, h - 1):
            queue.append((x, y))
    for y in range(h):
        for x in (0, w - 1):
            queue.append((x, y))

    while queue:
        x, y = queue.popleft()
        if x < 0 or y < 0 or x >= w or y >= h or visited[y][x]:
            continue
        visited[y][x] = True
        r, g, b, a = pixels[x, y]
        if not is_background(r, g, b):
            continue
        pixels[x, y] = (r, g, b, 0)
        queue.extend([(x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)])

    return img


img = Image.open(src).convert("RGBA")
img = flood_transparent(img)

for dest in dests:
    os.makedirs(os.path.dirname(dest), exist_ok=True)
    img.save(dest, "PNG")
    print(f"Saved: {dest} ({img.size[0]}x{img.size[1]})")

transparent = sum(1 for y in range(img.size[1]) for x in range(img.size[0]) if img.getpixel((x, y))[3] == 0)
print(f"Transparent pixels: {transparent}")
