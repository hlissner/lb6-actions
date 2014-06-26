#!/bin/sh

ls -lrt "$1" | awk '{print $5}'
