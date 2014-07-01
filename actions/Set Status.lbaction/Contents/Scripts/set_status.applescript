on run argv
	
	-- 0 = available
	-- 1 = away
	-- 2 = do not disturb
	-- 3 = invisible
	set new_state to first item of argv as number
	
	--Check App Status, to only act on apps if running
	set AdiumRunning to is_running("Adium")
	set SkypeRunning to is_running("Skype")
	
	if AdiumRunning then
		tell application "Adium"
			if new_state is 0 then
				go available
			else if new_state is 1 then
				go away
			else if new_state is 2 then
				go away with message "Do Not Disturb"
			else if new_state is 3 then
				go invisible
			end if
		end tell
	end if
	
	if SkypeRunning then
		tell application "Skype"
			if new_state is 0 then
				send command "SET USERSTATUS ONLINE" script name "LaunchBar"
			else if new_state is 1 then
				send command "SET USERSTATUS AWAY" script name "LaunchBar"
			else if new_state is 2 then
				send command "SET USERSTATUS DND" script name "LaunchBar"
			else if new_state is 3 then
				send command "SET USERSTATUS INVISIBLE" script name "LaunchBar"
			end if
		end tell
	end if
	
end run

on is_running(appName)
	tell application "System Events" to (name of processes) contains appName
end is_running