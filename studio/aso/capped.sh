#!/bin/sh
export NODE_OPTIONS="${NODE_OPTIONS:---max-old-space-size=4096}"
if [ -n "$HTTPS_PROXY" ]; then
  export NODE_USE_ENV_PROXY=1
  [ -f /root/.ccr/ca-bundle.crt ] && export NODE_EXTRA_CA_CERTS=/root/.ccr/ca-bundle.crt
fi
exec "$@"
