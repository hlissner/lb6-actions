--on run argv
set tabs_result to {}
--set only_local to item 1 of argv as number
set only_local to 0

tell application "Google Chrome"
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
			if the URL of the_tab is equal to the URL of active_tab then
				set is_active to 1
			else
				set is_active to 0
			end if
			
			-- id	tab_id	win_id	title	url	is_active?
			copy (tab_id & "	" & win_id & "	" & tab_title & "	" & tab_url & "	" & is_active & "
    ") to end of tabs_result
			
			set tab_id to tab_id + 1
		end repeat
		set win_id to win_id + 1
	end repeat
	
end tell
return tabs_result as text
--end run