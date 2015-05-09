on run
	tell application "Finder"
		set fldr to (get selection) as alias
	end tell
	open (fldr)
end run

-- Based off achabotl's Enter Path script: 
-- https://github.com/achabotl/Applescripts/blob/master/Launchbar/Enter%20Path.applescript
on open theFile
	set filePath to POSIX path of theFile
	try
		tell application "System Events"
			set theApplication to application processes whose frontmost is true
			set target to item 1 of theApplication
			set target to a reference to front window of target
			set target to a reference to front sheet of target
			delay 1
			tell target to keystroke "g" using {command down, shift down} -- Activate goto field
			if ((count target's sheets) > 0) then set target to front sheet of target -- Open panels use a sheet
			tell target
				try
					set value of text field 1 to filePath
					try
						click button "Go"
					on error
						click button "Aller"
					end try
				on error theError -- Carbon apps don't support setting the field directly, so type out the path.
					set clipboardcontent to clipboard
					set clipboard to filePath
					keystroke "v" using command down
					delay 0.1
					keystroke return
					set clipboard to clipboardcontent
				end try
			end tell
			
		end tell
	on error
		return
	end try
end open
