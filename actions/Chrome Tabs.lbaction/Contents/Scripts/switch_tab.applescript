on run argv
    set win_id to item 1 of argv as number
    set tab_id to item 2 of argv as number
    set focus to item 3 of argv as number as boolean

    tell application "Google Chrome"
        set (active tab index of (window win_id)) to tab_id
        if focus then activate
    end tell
end run
