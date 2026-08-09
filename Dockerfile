# syntax=docker/dockerfile:1.7
# ----------------------------------------------------------------
# Terminal portfolio — production image for Google Cloud Run
# Goal: $0/month, fast cold starts, small image.
# ----------------------------------------------------------------

FROM nginx:1.27-alpine

# Strip the default config and replace with ours.
RUN rm -f /etc/nginx/conf.d/default.conf

# Static assets + optional CV / resume PDFs.
# PDFs are optional: if the source is missing, COPY fails the build.
# We make the optionality explicit by removing any zero-byte placeholder
# the COPY might create, and warning instead of failing when the file
# is absent. To do that without BuildKit-only features, we copy the
# files in one step and clean up + warn in the next.
COPY index.html style.css main.js data.js cv.pdf resume.pdf /usr/share/nginx/html/

RUN for f in cv.pdf resume.pdf; do \
      if [ -s "/usr/share/nginx/html/$f" ]; then \
        echo "  + including /$f"; \
      else \
        rm -f "/usr/share/nginx/html/$f"; \
        echo "  - /$f not in build context, skipping"; \
      fi; \
    done

# nginx config + entrypoint.
COPY nginx.conf      /etc/nginx/nginx.conf
COPY entrypoint.sh   /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Healthcheck for Cloud Run readiness probes.
HEALTHCHECK --interval=30s --timeout=3s --retries=3 \
    CMD wget -qO- http://127.0.0.1:${PORT:-8080}/ >/dev/null 2>&1 || exit 1

EXPOSE 8080

ENTRYPOINT ["/entrypoint.sh"]
