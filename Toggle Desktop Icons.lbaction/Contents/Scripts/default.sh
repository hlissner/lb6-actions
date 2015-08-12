#!/bin/sh
#
# Check the if currently hiding Desktop icons. If so then delete the
# CreateDesktop variable in the defaults as it doens't exist by default.
# Otherwise hide the icons and restart Finder
# 

currentState=$( defaults read com.apple.finder CreateDesktop 2> /dev/null )

if [ $currentState -eq 0 ]
then
    defaults delete com.apple.finder CreateDesktop
    osascript -e "tell application \"LaunchBar\" to display in notification center \"Showing Desktop Icons\""
else
    defaults write com.apple.finder CreateDesktop -bool false
    osascript -e "tell application \"LaunchBar\" to display in notification center \"Desktop Icons Hidden\""
fi

killall Finder