#!/bin/sh
# entrypoint.sh — Cloud Run provides $PORT (default 8080).
# We template the nginx config and run nginx in the foreground.
set -eu

PORT="${PORT:-8080}"

# Replace __PORT__ in the shipped config (don't edit it in place at build time
# — that would bake a port into the image).
sed -i "s/__PORT__/${PORT}/g" /etc/nginx/nginx.conf

# Validate config and exec nginx in the foreground so the container stays up.
nginx -t
exec nginx -g "daemon off;"
