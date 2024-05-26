#!/bin/sh

ganache-cli -h 0.0.0.0 -d --mnemonic "$MNEMONIC" --db /data --allowUnlimitedContractSize --port 8545 -e 10000000
