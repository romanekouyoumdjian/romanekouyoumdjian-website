from pathlib import Path
import json
import unicodedata
import re

# Run this script from the project root (RomySite)
ROOT = Path.cwd()
PAINTINGS_DIR = ROOT / "assets" / "img" / "paintings"
OUT_DIR = ROOT / "assets" / "data"
OUT_FILE = OUT_DIR / "paintings.json"

EXTS = {".jpg", ".jpeg", ".png", ".webp"}

def slugify_filename(stem: str) -> str:
    # Remove accents, keep ascii, lowercase, replace invalid chars with '-'
    no_accents = unicodedata.normalize("NFKD", stem).encode("ascii", "ignore").decode("ascii")
    lowered = no_accents.lower()
    cleaned = re.sub(r"[^a-z0-9._-]+", "-", lowered)
    cleaned = re.sub(r"-{2,}", "-", cleaned).strip("-")
    return cleaned

def main():
    if not PAINTINGS_DIR.exists():
        raise SystemExit(f"ERROR: folder not found: {PAINTINGS_DIR}")

    items = []

    year_dirs = [p for p in PAINTINGS_DIR.iterdir() if p.is_dir()]
    for year_dir in sorted(year_dirs, key=lambda p: p.name):
        year = year_dir.name

        for img in sorted(year_dir.iterdir(), key=lambda p: p.name.lower()):
            if not img.is_file():
                continue
            if img.suffix.lower() not in EXTS:
                continue

            # Rename to a web-safe filename if needed
            safe_stem = slugify_filename(img.stem)
            safe_name = safe_stem + img.suffix.lower()

            if img.name != safe_name:
                target = img.with_name(safe_name)
                if target.exists():
                    raise SystemExit(f"ERROR: cannot rename, target exists: {target}")
                img.rename(target)
                img = target

            items.append({
                "year": year,
                "src": f"assets/img/paintings/{year}/{img.name}",
                "filename": img.name
            })

    OUT_DIR.mkdir(parents=True, exist_ok=True)
    OUT_FILE.write_text(json.dumps(items, indent=2, ensure_ascii=False), encoding="utf-8")
    print(f"OK: wrote {OUT_FILE} with {len(items)} images.")

if __name__ == "__main__":
    main()


