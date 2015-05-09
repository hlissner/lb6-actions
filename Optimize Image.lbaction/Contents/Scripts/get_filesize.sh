#!/bin/sh

ls -nl "$1" | awk '{print $5}'
