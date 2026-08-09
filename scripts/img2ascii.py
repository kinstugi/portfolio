#!/usr/bin/env python3
"""
img2ascii.py — convert an image to ASCII art for the terminal portfolio logo.

Run with the project venv (uses scripts/pyproject.toml):

    uv run --project scripts scripts/img2ascii.py path/to/logo.png --width 50
    uv run --project scripts scripts/img2ascii.py path/to/logo.png --width 50 --as-js --out logo.txt

The output is a JS string literal that you paste into data.js, replacing
the hand-coded `LOGO` constant. The site colors the logo via CSS, so the
ASCII just needs to be the right shape.

Notes on rendering:
  - Monospace terminal characters are roughly 2x taller than wide. The
    script compensates with --aspect (default 0.5) so the output looks
    proportional in a terminal font like JetBrains Mono.
  - The character ramp goes from "dark" to "light". For most logos (dark
    mark on transparent/light background), use --invert.
  - --width controls the number of characters across. For the neofetch
    grid, 40-60 chars is a good range; the right column needs ~30-35
    chars of space.
"""

from __future__ import annotations

import argparse
import sys
from pathlib import Path

try:
    from PIL import Image
except ImportError:
    sys.exit(
        "Pillow is required. Install with one of:\n"
        "  uv run --project scripts scripts/img2ascii.py ...\n"
        "  pip install 'Pillow>=10.0'\n"
    )


# 70-char ramp from "lots of ink" to "very little ink".
# Classic and works well for most subjects.
DEFAULT_RAMP = (
    "$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/\\|()1{}[]?-_+~<>i!lI;:,\"^`'. "
)

# Simpler 10-char ramp, useful for clean logos.
SIMPLE_RAMP = " .:-=+*#%@"

# Block-character ramp using Unicode (renders nicely in JetBrains Mono).
BLOCK_RAMP = "  ░▒▓█"


def img_to_ascii(
    path: Path,
    width: int = 60,
    ramp: str = DEFAULT_RAMP,
    aspect: float = 0.5,
    invert: bool = False,
    bg: tuple[int, int, int] | None = None,
) -> str:
    img = Image.open(path)

    # Flatten alpha onto a background colour (default: black, which matches
    # the terminal's --bg-deep, so transparent pixels become the "ink" of
    # the ASCII art).
    if img.mode in ("RGBA", "LA") or (img.mode == "P" and "transparency" in img.info):
        background = Image.new("RGB", img.size, bg or (0, 0, 0))
        background.paste(img, mask=img.convert("RGBA").split()[-1])
        img = background
    else:
        img = img.convert("RGB")

    img = img.convert("L")  # grayscale

    w, h = img.size
    new_w = max(1, width)
    # Apply aspect correction so the result looks right in a monospace font.
    new_h = max(1, int(h * (new_w / w) * aspect))
    img = img.resize((new_w, new_h), Image.LANCZOS)

    if invert:
        img = Image.eval(img, lambda v: 255 - v)

    pixels = img.load()
    n = len(ramp)
    lines = []
    for y in range(new_h):
        row = []
        for x in range(new_w):
            v = pixels[x, y]
            # Clamp + map brightness (0..255) to a char index.
            idx = min(n - 1, max(0, int(v / 256 * n)))
            row.append(ramp[idx])
        lines.append("".join(row))
    return "\n".join(lines)


def to_js_literal(art: str, varname: str = "LOGO") -> str:
    # Standard JS double-quoted string escaping. Backticks and single quotes
    # in the source are fine inside "...". The default ramp contains a
    # backslash, which is the only thing that needs escaping here.
    lines = []
    for line in art.split("\n"):
        escaped = line.replace("\\", "\\\\").replace('"', '\\"')
        lines.append(f'  "{escaped}",')
    return f"const {varname} = [\n" + "\n".join(lines) + '\n].join("\\n");'


def main() -> int:
    ap = argparse.ArgumentParser(
        description="Convert an image to ASCII art for the terminal portfolio logo.",
    )
    ap.add_argument("image", type=Path, help="Path to the source image (PNG, JPG, SVG-render, etc.)")
    ap.add_argument(
        "--width",
        type=int,
        default=60,
        help="Output width in characters (default: 60)",
    )
    ap.add_argument(
        "--ramp",
        choices=("default", "simple", "block"),
        default="default",
        help="Character ramp: default (70 chars, classic), simple (10 chars), block (Unicode ░▒▓█)",
    )
    ap.add_argument(
        "--aspect",
        type=float,
        default=0.5,
        help="Vertical squish factor to compensate for terminal char aspect ratio (default: 0.5)",
    )
    ap.add_argument(
        "--invert",
        action="store_true",
        help="Invert brightness (use for dark-on-light source images)",
    )
    ap.add_argument(
        "--bg",
        default="#000000",
        help="Background colour for transparent images (default: #000000)",
    )
    ap.add_argument(
        "--out",
        type=Path,
        help="Write output to this file instead of stdout",
    )
    ap.add_argument(
        "--as-js",
        action="store_true",
        help="Wrap output as a JS const declaration ready to paste into data.js",
    )
    args = ap.parse_args()

    if not args.image.exists():
        sys.exit(f"image not found: {args.image}")

    ramp = {
        "default": DEFAULT_RAMP,
        "simple": SIMPLE_RAMP,
        "block": BLOCK_RAMP,
    }[args.ramp]

    bg_hex = args.bg.lstrip("#")
    bg_rgb = (
        int(bg_hex[0:2], 16),
        int(bg_hex[2:4], 16),
        int(bg_hex[4:6], 16),
    ) if len(bg_hex) == 6 else (0, 0, 0)

    art = img_to_ascii(
        args.image,
        width=args.width,
        ramp=ramp,
        aspect=args.aspect,
        invert=args.invert,
        bg=bg_rgb,
    )

    out = to_js_literal(art) if args.as_js else art

    if args.out:
        args.out.write_text(out + ("\n" if not out.endswith("\n") else ""))
        print(f"wrote {args.out} ({len(art.splitlines())} lines, {args.width} cols)")
    else:
        print(out)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
