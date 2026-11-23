#!/usr/bin/env bash
set -Eeuo pipefail

PROJECT_DIR="/home/naufal/blog.nafeka.my.id"
RELEASES_DIR="$PROJECT_DIR/releases"
ACTIVE_LINK="$PROJECT_DIR/dist"

if [[ $# -lt 1 || $# -gt 2 ]]; then
    echo "Usage: $0 <release-name> [--already-locked]"
    exit 1
fi

RELEASE_NAME="$1"
MODE="${2:-}"

if [[ ! "$RELEASE_NAME" =~ ^([0-9]{8}-[0-9]{6}|production-before-cms)$ ]]; then
    echo "ERROR: Nama release tidak valid."
    exit 1
fi

if [[ -n "$MODE" && "$MODE" != "--already-locked" ]]; then
    echo "ERROR: Mode tidak valid."
    exit 1
fi

# Aktivasi manual mengambil lock sendiri.
# Mode internal hanya digunakan oleh deploy.sh.
if [[ "$MODE" != "--already-locked" ]]; then
    exec 9>"$PROJECT_DIR/.deploy.lock"
    flock -x 9
else
    if [[ "${KATAKODE_DEPLOY_LOCKED:-}" != "1" ]]; then
        echo "ERROR: Mode internal hanya untuk deploy.sh."
        exit 1
    fi
fi

TARGET="$RELEASES_DIR/$RELEASE_NAME"

if [[ ! -d "$TARGET" || -L "$TARGET" ]]; then
    echo "ERROR: Release tidak valid."
    exit 1
fi

for file in \
    index.html \
    artikel/index.html \
    topik/index.html \
    cari/index.html \
    search-index.json \
    rss.xml \
    sitemap-index.xml
do
    if [[ ! -s "$TARGET/$file" ]]; then
        echo "ERROR: File tidak valid: $file"
        exit 1
    fi
done

if [[ ! -L "$ACTIVE_LINK" ]]; then
    echo "ERROR: dist bukan symlink."
    exit 1
fi

PREVIOUS="$(readlink -f "$ACTIVE_LINK")"

echo "Release sebelumnya: $PREVIOUS"
echo "Release baru: $TARGET"

if [[ "$PREVIOUS" == "$TARGET" ]]; then
    echo "Release sudah aktif. Tidak ada perubahan."
    exit 0
fi

TEMP_LINK="$PROJECT_DIR/.dist-next-$$"

trap 'rm -f -- "$TEMP_LINK"' EXIT

ln -s "$TARGET" "$TEMP_LINK"
mv -Tf "$TEMP_LINK" "$ACTIVE_LINK"

echo "Aktivasi berhasil."
echo "Release aktif: $(readlink -f "$ACTIVE_LINK")"
echo "Rollback target: $PREVIOUS"
