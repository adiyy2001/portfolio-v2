FROM mcr.microsoft.com/playwright:v1.64.1-noble

ENV NODE_ENV=production \
    PLAYWRIGHT_BROWSERS_PATH=/ms-playwright \
    HOME=/tmp

WORKDIR /app
COPY scanner/package.json scanner/package-lock.json ./
RUN npm ci --omit=dev --ignore-scripts && rm -rf /ms-playwright/firefox-* /ms-playwright/webkit-*
COPY scanner/src ./src
COPY src/scanner/consent.json ./consent.json

USER pwuser
CMD ["node", "src/main.js"]
