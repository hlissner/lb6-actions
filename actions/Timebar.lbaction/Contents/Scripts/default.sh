#!/bin/bash

bin="./timebar"

case `echo "$1" | tr '[:upper:]' '[:lower:]'` in
    stop) 
        "$bin" --stop  >/dev/null
        ;;
    version)
        OUT=$("$bin" --version)
        /usr/bin/osascript -e "tell application \"LaunchBar\" to display in large type \"$OUT\""
        ;;
    *) 
        "$bin" "--parse" "$@" >/dev/null
        ;;
esac

if [[ $? != 0 ]]; then
    /usr/bin/osascript -e 'display notification "That was not a valid command" with title "TimeBar Error"'
fi

# Silence LB's whining in case of error
exit 0
