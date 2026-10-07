#!/bin/sh
exec systemd-run --user --scope --quiet --collect -p MemoryMax="${ASO_MEM:-4G}" -p MemorySwapMax=0 "$@"
