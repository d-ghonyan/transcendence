#!/bin/sh

ganache-cli -h 0.0.0.0 --mnemonic $MNEMONIC --db /data --gasLimit=0x1fffffffffffff --allowUnlimitedContractSize -e 1000000000
