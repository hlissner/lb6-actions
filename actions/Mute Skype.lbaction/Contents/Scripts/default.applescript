on run
	tell application "Skype"
		-- Get current mute status
		set muteStatusOriginal to («event sendskyp» given «class cmnd»:"GET MUTE", «class scrp»:"Skype Mute")
	end tell
	
	if the muteStatusOriginal is "MUTE OFF" then
		tell application "Skype"
			«event sendskyp» given «class cmnd»:"SET MUTE ON", «class scrp»:"Skype Mute"
			set muteStatusNew to («event sendskyp» given «class cmnd»:"GET MUTE", «class scrp»:"Skype Mute")
		end tell
		-- Notify Growl of the new status
		if the muteStatusNew is not equal to the muteStatusOriginal then
			display notification muteStatusNew with title "Skype Mute"
		else
			display notification "Mute/Unmuted failed" with title "Skype Mute"
		end if
	end if
	
	if the muteStatusOriginal is "MUTE ON" then
		tell application "Skype"
			«event sendskyp» given «class cmnd»:"SET MUTE OFF", «class scrp»:"Skype Mute"
			set muteStatusNew to («event sendskyp» given «class cmnd»:"GET MUTE", «class scrp»:"Skype Mute")
		end tell
		
		if the muteStatusNew is not equal to the muteStatusOriginal then
			display notification muteStatusNew with title "Skype Mute"
		else
			display notification "Mute/Unmuted failed" with title "Skype Mute"
		end if
	end if
end run