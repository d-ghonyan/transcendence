#!/bin/sh

ganache-cli -h 0.0.0.0 -d --mnemonic "$MNEMONIC" --db /data --allowUnlimitedContractSize --port $GANACHE_PORT -e 10000000
