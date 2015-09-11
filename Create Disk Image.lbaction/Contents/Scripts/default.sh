#!/bin/sh
#
# LaunchBar Action Script
#
#

# No arguments provided. Open log folder.
test $# -eq 0 && echo "{\"path\": \"$LB_CACHE_PATH/\"}" && exit 0

# Idea from Tunghsiao Liu
# t@sparanoid.com
function createDMG () {
    # Create .dmg
    dmgName=$1
    dmgDirectory=$2
    dmgCWD=${dmgDirectory%/$(basename "$dmgDirectory")*}
    dmgLog=$dmgCWD/$dmgName.log

    # Remove old .dmg
    test -f "$dmgCWD/$dmgName.dmg" && rm -rf "$dmgCWD/$dmgName.dmg"
    
# Debug
echo "========== INFO ==========
DMG VOLUME NAME
$dmgName

TARGET DIRECTORY
$dmgDirectory

CREATE DATE" >> "$dmgLog"
date >> "$dmgLog"

echo "
========== LOGS ==========" >> "$dmgLog"
    
    ## Disk Image creation. First an hybrid image, then compressed.
    hdiutil makehybrid -hfs -hfs-volume-name "$dmgName" -hfs-openfolder "$dmgDirectory" "$dmgDirectory" -o "$dmgCWD/$1_tmp.dmg" >> "$dmgLog"
    hdiutil convert -format UDZO -imagekey zlib-level=9 "$dmgCWD/$1_tmp.dmg" -o "$dmgCWD/$dmgName.dmg" >> "$dmgLog"
    
    # Remove tmp .dmg
    test -f "$dmgCWD/$1_tmp.dmg" && rm -rf "$dmgCWD/$1_tmp.dmg"

echo "--    " >> "$dmgLog"
    
    if [ $3 -eq 0 ] 
    then
        mv -f "$dmgLog" "$LB_CACHE_PATH"
        dmgLog="$LB_CACHE_PATH/$dmgName.log"
    else
        cp -f "$dmgLog" "$LB_CACHE_PATH"
    fi
    
    echo "$dmgCWD/$dmgName.dmg, $dmgLog"
}

function askName {
    test $# -eq 1 && directoryName=$(basename "$1") || directoryName="Disk Image Name"
    
    theResult=$(osascript \
    -e 'try' \
    -e 'tell application "LaunchBar" to return (display dialog "Disk Image Name" default answer "'"${directoryName//\"/}"'" buttons {"Cancel", "OK"} default button "OK" cancel button "Cancel" with title "Create Disk Image") as list' \
    -e 'on error' \
    -e 'return {"Cancel", "User canceled. (-128)"}' \
    -e 'end try')

    buttonReturned=${theResult%, *}
    nameReturned=${theResult#*, }
    
    test -z "$nameReturned" && nameReturned="$directoryName"
    echo "$nameReturned"
}

# Check that file isn't larger than 1 GB 
totalSize=$(du -hsc "$@" | grep '**total')

if [[ $totalSize =~ ([0-9]+[\.]?[0-9]+)([a-zA-Z]) ]]
then
    value=${BASH_REMATCH[1]}
    unit="${BASH_REMATCH[2]}"
    
    if [[ $(echo $value'>'1 | bc -l) && "$unit" =~ ([GTP]) ]]
    then
        echo "{\"title\": \"File size is $value $unit.\", \"subtitle\": \"Cannot be larger than 1 GB\"}"
        exit 0
    fi
fi


if [ $# -gt 1 ]
then
    bundleID=$(defaults read "$LB_ACTION_PATH/Contents/Info" CFBundleIdentifier)
    dmgDir=$(mktemp -dt "$bundleID")
    cp -aR "$@" "$dmgDir"
    
    name=$(askName)
    resultDir=$(createDMG "$name" "$dmgDir" "$LB_OPTION_COMMAND_KEY")
    result[0]="${resultDir%, *}"
    
# LaunchBar not parsing the results properly, when you return two items.
    # If command key is down, do not remove DMG log.
#    if [ "$LB_OPTION_COMMAND_KEY" -eq 1 ]
#    then
#        result[1]="${resultDir#*, }"
#    fi

    for i in "${result[@]}"
    do
        mv -f "$i" "$HOME/Desktop/" && echo "{\"path\": \"$HOME/Desktop/$(basename "$i")\"}"
    done
    exit 0
elif [ $# -eq 1 ]
then
    dmgDir="$1"

    # If shift key is pressed ask the user for a name.
    if [ "$LB_OPTION_SHIFT_KEY" -eq 1 ]
    then
        name=$(askName "$dmgDir")
        if test "$name" == "User canceled. (-128)"
        then
            exit 0
        fi
    else
        name=$(basename "$dmgDir")
    fi

    resultDir=$(createDMG "$name" "$dmgDir" "$LB_OPTION_COMMAND_KEY")
    result[0]="${resultDir%, *}"
    result[1]="${resultDir#*, }"
    
    echo "{\"path\": \"${result[0]}\"}"
    
# LaunchBar not parsing the results properly, when you return two items.
#    if [ "$LB_OPTION_COMMAND_KEY" -eq 1 ]
#    then
#        echo "{\"path\": \"${result[1]}\"}"
#    fi
    exit 0
fi    
exit 9