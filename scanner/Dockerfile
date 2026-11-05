FROM mcr.microsoft.com/playwright:v1.64.1-noble

ENV NODE_ENV=production \
    PLAYWRIGHT_BROWSERS_PATH=/ms-playwright \
    HOME=/tmp

COPY scanner/verapdf-auto-install.xml /tmp/auto-install.xml
RUN apt-get update \
 && apt-get install -y --no-install-recommends openjdk-21-jre-headless unzip \
 && curl -fsSL -o /tmp/verapdf.zip https://software.verapdf.org/rel/1.30/verapdf-greenfield-1.30.3-installer.zip \
 && echo 'b512bf24945503a33fc10738ecffc1f2dccaaf8593a448e94ee9ac86a9559a59  /tmp/verapdf.zip' | sha256sum -c - \
 && unzip -q /tmp/verapdf.zip -d /tmp/verapdf \
 && java -jar /tmp/verapdf/*/verapdf-izpack-installer-*.jar /tmp/auto-install.xml \
 && ln -s /opt/verapdf/verapdf /usr/local/bin/verapdf \
 && rm -rf /tmp/verapdf /tmp/verapdf.zip /tmp/auto-install.xml /var/lib/apt/lists/*

WORKDIR /app
COPY scanner/package.json scanner/package-lock.json ./
RUN npm ci --omit=dev --ignore-scripts && rm -rf /ms-playwright/firefox-* /ms-playwright/webkit-*
COPY scanner/src ./src
COPY src/scanner/consent.json ./consent.json

USER pwuser
CMD ["node", "src/main.js"]
