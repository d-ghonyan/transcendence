#!/bin/sh

ganache-cli -h 0.0.0.0 --mnemonic "$MNEMONIC" --db /data --allowUnlimitedContractSize --gasPrice 0x01 --port 8545
