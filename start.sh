#!/bin/bash

auth_path="./src/connection/auth"

if command -v termux-info &> /dev/null; then
    if ! command -v jq &> /dev/null; then
        pkg install jq -y
    fi
fi

clear

if [ "$(ls -A "$auth_path" | wc -l)" -le 1 ]; then
    node src/utils/selectConnectionMethod.js
    usePairingCode=$(jq -r '.usePairingCode' ./src/connection/connectionInfo.json)
    if [ "$usePairingCode" = "true" ]; then
        node src/index.js --use-pairing-code
    else
        node src/index.js
    fi
else 
    node src/index.js
fi
