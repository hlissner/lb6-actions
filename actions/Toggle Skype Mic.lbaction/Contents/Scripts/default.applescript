on run
	tell application "Skype"
		if it is not running then return
		
		-- from https://gist.github.com/kylef/120887
		if (send command "GET MUTE" script name "LaunchBar") is equal to "MUTE ON" then
			send command "SET MUTE OFF" script name "LaunchBar"
		else
			send command "SET MUTE ON" script name "LaunchBar"
		end if
	end tell
end run
