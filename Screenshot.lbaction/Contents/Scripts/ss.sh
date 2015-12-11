#!/usr/bin/env bash

# This was refactored into a shell-script because LaunchBar.execute returns
# stdout, not program return codes.

screencapture -i "$1" && echo 1
