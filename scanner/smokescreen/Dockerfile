FROM alpine:3.22 AS fetch
ARG TARGETARCH
ARG SMOKESCREEN_VERSION=v0.1.0
ARG SHA256_AMD64=4e1e447449e3cc653dae956208588722b5c8fe8ce894f633adc756a851d1ec46
ARG SHA256_ARM64=f15ddd0dc2b2cbc6d7318f441928939eb9bedfab2a1881508af3096a1e24b7c9
WORKDIR /download
RUN set -eu; \
    arch="${TARGETARCH:-amd64}"; \
    if [ "$arch" = "arm64" ]; then sum="$SHA256_ARM64"; else sum="$SHA256_AMD64"; fi; \
    archive="smokescreen_${SMOKESCREEN_VERSION}_linux_${arch}.tar.gz"; \
    wget -q "https://github.com/stripe/smokescreen/releases/download/${SMOKESCREEN_VERSION}/${archive}"; \
    echo "${sum}  ${archive}" | sha256sum -c -; \
    tar xzf "${archive}"; \
    cp "smokescreen_${SMOKESCREEN_VERSION}_linux_${arch}/smokescreen" /smokescreen

FROM gcr.io/distroless/static:nonroot
COPY --from=fetch --chmod=0555 /smokescreen /smokescreen
COPY config.yaml acl.yaml /etc/smokescreen/
USER 65532:65532
EXPOSE 4750
ENTRYPOINT ["/smokescreen", "--config-file", "/etc/smokescreen/config.yaml"]
