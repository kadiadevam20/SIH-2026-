"""Find and extract the 4 Canva home icons by color clustering."""
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw

ROOT = Path(r"d:\druga ai\durga-ai\assets\images\ui")
im = Image.open(ROOT / "3.png").convert("RGBA")
arr = np.array(im)
h, w = arr.shape[:2]
rgb = arr[:, :, :3].astype(float)
cream = np.array([245.0, 241.0, 232.0])

# Only search bottom icon band (below goddess body)
y0, y1 = 640, 860
band = rgb[y0:y1]
diff = np.linalg.norm(band - cream, axis=2)
ink = diff > 30

# Maroon-ish (phone/notes)
r, g, b = band[:, :, 0], band[:, :, 1], band[:, :, 2]
maroon = (r > 80) & (r < 180) & (g < 90) & (b < 90) & (r > g + 20) & (r > b + 20)
# Yellow warning
yellow = (r > 180) & (g > 150) & (b < 120) & (r + g > 360)
# Dusty rose pin
rose = (r > 140) & (r < 220) & (g > 90) & (g < 170) & (b > 100) & (b < 180) & (r > g) & (abs(r - b) < 60)
# Black (warn border / bang)
black = (r < 50) & (g < 50) & (b < 50)

interesting = (maroon | yellow | rose | black) & (diff > 35)

ys, xs = np.where(interesting)
print("ink pixels", len(xs))
print("x range", xs.min(), xs.max(), "y range", ys.min() + y0, ys.max() + y0)

# Split into 2x2 quadrants of the band
mid_x = w // 2
mid_y = (y0 + y1) // 2
quads = {
    "phone": (0, mid_x, y0, mid_y),
    "notes": (mid_x, w, y0, mid_y),
    "warn": (0, mid_x, mid_y, y1),
    "pin": (mid_x, w, mid_y, y1),
}

# Mark preview
preview = im.copy()
draw = ImageDraw.Draw(preview)


def bbox_in_quad(qx0, qx1, qy0, qy1, pad=10):
    local = interesting[(qy0 - y0) : (qy1 - y0), qx0:qx1]
    ly, lx = np.where(local)
    if len(lx) == 0:
        return None
    return (
        max(0, lx.min() + qx0 - pad),
        max(0, ly.min() + qy0 - pad),
        min(w, lx.max() + qx0 + pad + 1),
        min(h, ly.max() + qy0 + pad + 1),
    )


def to_transparent(crop: Image.Image) -> Image.Image:
    a = np.array(crop.convert("RGBA"))
    d = np.linalg.norm(a[:, :, :3].astype(float) - cream, axis=2)
    alpha = np.clip((d - 10) / 20 * 255, 0, 255).astype(np.uint8)
    a[:, :, 3] = alpha
    a[d < 12, 3] = 0
    return Image.fromarray(a)


def square_pad(img: Image.Image, side: int | None = None) -> Image.Image:
    a = np.array(img)
    ys, xs = np.where(a[:, :, 3] > 25)
    if len(xs) == 0:
        return img
    x0, x1 = xs.min(), xs.max() + 1
    y0b, y1b = ys.min(), ys.max() + 1
    tight = img.crop((x0, y0b, x1, y1b))
    side = side or max(tight.width, tight.height) + 16
    canvas = Image.new("RGBA", (side, side), (0, 0, 0, 0))
    canvas.paste(tight, ((side - tight.width) // 2, (side - tight.height) // 2), tight)
    return canvas


for name, (qx0, qx1, qy0, qy1) in quads.items():
    box = bbox_in_quad(qx0, qx1, qy0, qy1, pad=12)
    print(name, box)
    if not box:
        continue
    draw.rectangle(box, outline=(0, 255, 0, 255), width=2)
    crop = to_transparent(im.crop(box))
    out = square_pad(crop, 160)
    out.save(ROOT / f"home-icon-{name}.png")
    print(" saved", name, out.size)

preview.crop((0, 620, w, h)).save(ROOT / "_band_preview.png")

# strip preview on cream
strip = Image.new("RGBA", (520, 150), (245, 241, 232, 255))
x = 20
for name in ("phone", "notes", "warn", "pin"):
    p = ROOT / f"home-icon-{name}.png"
    if p.exists():
        ic = Image.open(p).resize((110, 110), Image.Resampling.LANCZOS)
        strip.paste(ic, (x, 20), ic)
    x += 125
strip.save(ROOT / "_icons_preview.png")
print("done")
