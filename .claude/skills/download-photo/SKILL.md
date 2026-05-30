---
name: download-photo
description: Downloads a person's photo from a URL or webpage, resizes and converts to JPG, and places it in the public directory. Use when user says "download photo", "add photo for [person]", "get profile image", or provides a person's name with a URL to fetch their photo.
---

# Download Photo

Download a person's photo, resize it, convert to JPG, and place it under `public/`.

## Inputs

The user provides:
- **name**: Output filename without extension (e.g., `junhwa.hur`)
- **url**: Direct image URL or a webpage containing the person's photo
- **directory** (optional, default: `organizers`): Subdirectory under `public/` (e.g., `organizers`, `program`)
- **size** (optional, default: `302x302`): Output resolution in WxH format (e.g., `512x512`)

## Instructions

### Step 1: Identify the image URL

If the URL points directly to an image (ends with `.jpg`, `.jpeg`, `.png`, `.webp`, `.gif`, `.bmp`, `.svg`), use it as-is.

Otherwise, treat it as a webpage:
1. Fetch the page using WebFetch and look for a profile photo, portrait, or headshot of the person.
2. Identify the best candidate image URL — typically a headshot, avatar, or staff photo.
3. If multiple candidates exist or the choice is ambiguous, ask the user to confirm which image to use.

### Step 2: Download and convert

Run the bundled script:

```bash
bash .claude/skills/download-photo/scripts/download-photo.sh <name> <image-url> [directory] [size]
```

The script will:
- Download the image
- Resize to the specified dimensions (center crop to fill)
- Convert to JPEG at quality 95 (high quality by default)
- If the resulting file exceeds 200KB, re-compress at quality 85
- Save to `public/<directory>/<name>.jpg`

### Step 3: Verify and update data

1. Read the output file to visually confirm the image looks correct.
2. Check the relevant JSON data file (`src/data/people.json`) to ensure the person's `image` field matches the output path (`/<directory>/<name>.jpg`). Update if needed.
3. Report the result: filename, file size, and a visual confirmation.

## Examples

### Example 1: Direct image URL for an organizer

User says: "junhwa.hur の写真をダウンロードして https://example.com/photo.png"

Actions:
1. URL ends with `.png` → direct image
2. Run: `bash .claude/skills/download-photo/scripts/download-photo.sh junhwa.hur https://example.com/photo.png`
3. Verify `public/organizers/junhwa.hur.jpg` exists and check people.json

### Example 2: Webpage URL for a speaker

User says: "ranjay.krishna の写真を https://ranjaykrishna.com から取得して program 512x512"

Actions:
1. URL is a webpage → fetch and find profile image
2. Identify headshot image URL from the page
3. Run: `bash .claude/skills/download-photo/scripts/download-photo.sh ranjay.krishna <found-url> program 512x512`
4. Verify `public/program/ranjay.krishna.jpg` exists and check people.json

## Troubleshooting

### Error: curl fails to download
The URL may require authentication or may block automated access. Ask the user for an alternative URL or a direct image link.

### Error: magick command not found
ImageMagick is required. Install via: `brew install imagemagick`

### Error: image looks distorted
The source image may have an unusual aspect ratio. Try providing a source image that is closer to square, or adjust the size parameter.
