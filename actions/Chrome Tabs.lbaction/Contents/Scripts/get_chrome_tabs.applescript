on run argv
	set tabs_result to {}
	set only_local to item 1 of argv
	
	if is_running("Google Chrome") then
		set browserName to "Google Chrome"
	else if is_running("Chromium") then
		set browserName to "Chromium"
	else
		return
	end if
	
	using terms from application "Google Chrome"
		tell application browserName
			if only_local = 1 then
				set win_list to first window
			else
				set win_list to every window
			end if
			
			-- Cycle through every Chrome window
			set win_id to 1
			repeat with the_window in win_list
				set tab_list to every tab in the_window
				set active_tab to active tab in the_window
				
				-- Cycle through every tab in this window
				set tab_id to 1
				repeat with the_tab in tab_list
					set tab_url to the URL of the_tab
					set tab_title to the title of the_tab
					
					-- Is this an active tab?
					if the id of the_tab is equal to the id of active_tab then
						set is_active to 1
					else
						set is_active to 0
					end if
					
					set end of tabs_result to {tab_id, win_id, is_active, tab_url, tab_title, " !-% "}
					
					set tab_id to tab_id + 1
				end repeat
				
				set win_id to win_id + 1
			end repeat
			
		end tell
	end using terms from
	return tabs_result
end run

on is_running(appName)
	tell application "System Events" to (name of processes) contains appName
end is_running