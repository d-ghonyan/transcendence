#!/bin/bash

command="${2:-/bin/bash}"

docker exec -it `docker ps | grep $1 | awk '{print $1}'` $command
