#!/usr/bin/env bash
set -euo pipefail

NAME="${1:?Usage: download-photo.sh <name> <image-url> [directory] [size]}"
URL="${2:?Usage: download-photo.sh <name> <image-url> [directory] [size]}"
DIR="${3:-organizers}"
SIZE="${4:-302x302}"

PROJECT_ROOT="$(git rev-parse --show-toplevel)"
OUT_DIR="${PROJECT_ROOT}/public/${DIR}"
OUT_FILE="${OUT_DIR}/${NAME}.jpg"

mkdir -p "${OUT_DIR}"

TMPFILE="$(mktemp /tmp/download-photo.XXXXXX)"
trap 'rm -f "${TMPFILE}"' EXIT

echo "Downloading: ${URL}"
curl -fsSL -o "${TMPFILE}" "${URL}"

echo "Converting to ${SIZE} JPEG..."
magick "${TMPFILE}" -resize "${SIZE}^" -gravity center -extent "${SIZE}" -quality 95 "${OUT_FILE}"

MAX_BYTES=200000
FILE_SIZE=$(stat -f%z "${OUT_FILE}" 2>/dev/null || stat -c%s "${OUT_FILE}" 2>/dev/null)

if [ "${FILE_SIZE}" -gt "${MAX_BYTES}" ]; then
  echo "File size ${FILE_SIZE} bytes exceeds ${MAX_BYTES} bytes, re-compressing..."
  magick "${OUT_FILE}" -quality 85 "${OUT_FILE}"
  FILE_SIZE=$(stat -f%z "${OUT_FILE}" 2>/dev/null || stat -c%s "${OUT_FILE}" 2>/dev/null)
fi

echo "Saved: ${OUT_FILE} (${FILE_SIZE} bytes)"
