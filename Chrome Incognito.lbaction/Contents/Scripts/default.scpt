#
#  Inspired by http://apple.stackexchange.com/a/123909
#

on run
	if is_running("Google Chrome") then
		# look for existing incognito window
		tell application "Google Chrome"
			repeat with w in (windows)
				if mode of w is "incognito" then
					set index of w to 1
					set myTab to make new tab at end of tabs of window 1
					activate
					return
				end if
			end repeat
		end tell
		
		# no existing incognito window found
		tell application "Google Chrome"
			make new window with properties {mode:"incognito"}
			activate
			return
		end tell
	else
		do shell script "open -a /Applications/Google\\ Chrome.app --args --incognito "
	end if
end run

on is_running(appName)
	tell application "System Events" to (name of processes) contains appName
end is_running

on handle_string(_string)
	if _string does not start with "http" then
		set _string to "http://" & _string
	end if
	
	set chrome_running to is_running("Google Chrome")
	
	if chrome_running then
		# look for existing incognito window
		tell application "Google Chrome"
			repeat with w in (windows)
				if mode of w is "incognito" then
					set index of w to 1
					set myTab to make new tab at end of tabs of window 1
					set URL of myTab to _string
					activate
					return
				end if
			end repeat
		end tell
		
		# no existing incognito window found
		tell application "Google Chrome"
			tell (make new window with properties {mode:"incognito"})
				set URL of active tab to _string
			end tell
			activate
		end tell
	else
		do shell script "open -a /Applications/Google\\ Chrome.app --args --incognito " & _string
	end if
end handle_string
