#!/usr/bin/env bash
set -Eeuo pipefail

PROJECT_DIR="/home/naufal/blog.nafeka.my.id"
RELEASES_DIR="$PROJECT_DIR/releases"
ACTIVE_LINK="$PROJECT_DIR/dist"

cd "$PROJECT_DIR"

# Mencegah deployment bersamaan
exec 9>"$PROJECT_DIR/.deploy.lock"

if ! flock -n 9; then
    echo "ERROR: Deployment lain sedang berjalan."
    exit 1
fi

# Pastikan website sudah menggunakan symlink
if [[ ! -L "$ACTIVE_LINK" ]]; then
    echo "ERROR: dist bukan symlink."
    exit 1
fi

# Pastikan API Directus merespons
if ! curl -fsS --max-time 10 \
    http://127.0.0.1:8055/server/info \
    >/dev/null; then
    echo "ERROR: API Directus tidak merespons."
    exit 1
fi

echo "API Directus merespons."

echo "[Cover] Sinkronisasi cover artikel terbit..."
if ! "$PROJECT_DIR/scripts/sync-covers.sh"; then
    echo "ERROR: Sinkronisasi cover gagal. Deployment dibatalkan."
    exit 1
fi
echo "[Cover] Sinkronisasi selesai."

# Buat nama release unik
TIMESTAMP="$(date +%Y%m%d-%H%M%S)"
RELEASE_DIR="$RELEASES_DIR/$TIMESTAMP"

if [[ -e "$RELEASE_DIR" ]]; then
    echo "ERROR: Nama release sudah digunakan."
    exit 1
fi

mkdir -p "$RELEASE_DIR"

echo "=================================="
echo " KataKode Deployment"
echo "=================================="

echo "[1/4] Build Astro..."

if ! npm run build -- --outDir "$RELEASE_DIR"; then
    echo "ERROR: Build gagal. Website aktif tidak berubah."
    rm -rf -- "$RELEASE_DIR"
    exit 1
fi

echo "[2/4] Validasi hasil build..."

REQUIRED_FILES=(
    "index.html"
    "artikel/index.html"
    "topik/index.html"
    "cari/index.html"
    "search-index.json"
    "rss.xml"
    "sitemap-index.xml"
)

for file in "${REQUIRED_FILES[@]}"; do
    if [[ ! -s "$RELEASE_DIR/$file" ]]; then
        echo "ERROR: File tidak valid: $file"
        echo "Website aktif tidak berubah."
        exit 1
    fi
done

# Periksa permission dasar hasil build
if [[ ! -r "$RELEASE_DIR/index.html" ]]; then
    echo "ERROR: File index.html tidak dapat dibaca."
    exit 1
fi

# Pastikan direktori release dapat diakses user lain
if [[ ! -x "$RELEASE_DIR" ]] || \
   [[ ! -r "$RELEASE_DIR/index.html" ]]; then
    echo "ERROR: Permission release tidak sesuai."
    exit 1
fi

echo "[3/4] Aktivasi release..."

PREVIOUS_RELEASE="$(readlink -f "$ACTIVE_LINK")"

# deploy.sh sudah memegang lock
export KATAKODE_DEPLOY_LOCKED=1

if ! ./scripts/activate.sh "$TIMESTAMP" --already-locked; then
    echo "ERROR: Aktivasi gagal."
    exit 1
fi

echo "[4/4] Verifikasi release aktif..."

if [[ "$(readlink -f "$ACTIVE_LINK")" != "$RELEASE_DIR" ]]; then
    echo "ERROR: Release aktif tidak sesuai."

    if [[ "$PREVIOUS_RELEASE" == "$RELEASES_DIR/"* ]]; then
        ./scripts/activate.sh \
            "$(basename "$PREVIOUS_RELEASE")" \
            --already-locked
    fi

    exit 1
fi

echo "Memeriksa HTTP website..."

CHECK_PATHS=(
    "/"
    "/artikel/"
    "/cari/"
    "/rss.xml"
    "/search-index.json"
)

HTTP_FAILED=0

for path in "${CHECK_PATHS[@]}"; do
    URL="http://127.0.0.1${path}"

    STATUS="$(curl -sS \
        --max-time 10 \
        -o /dev/null \
        -w '%{http_code}' \
        -H 'Host: blog.nafeka.my.id' \
        "$URL")" || STATUS="000"

    echo "HTTP $STATUS $path"

    if [[ "$STATUS" != "200" ]]; then
        HTTP_FAILED=1
    fi
done

if [[ "$HTTP_FAILED" -ne 0 ]]; then
    echo "ERROR: Verifikasi HTTP gagal."
    echo "Mengembalikan release sebelumnya..."

    ./scripts/activate.sh \
        "$(basename "$PREVIOUS_RELEASE")" \
        --already-locked

    echo "Rollback selesai. Periksa kondisi website."
    exit 1
fi

echo "Verifikasi HTTP berhasil."

echo ""
echo "=================================="
echo " Deployment berhasil!"
echo "=================================="
echo "Release baru: $RELEASE_DIR"
echo "Release sebelumnya: $PREVIOUS_RELEASE"
