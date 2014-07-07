on run
	set tabs_result to []
	
	if is_running("Google Chrome") then
		set browserName to "Google Chrome"
	else if is_running("Chromium") then
		set browserName to "Chromium"
	else
		return
	end if
	
	using terms from application "Google Chrome"
		tell application browserName
			
			set win_list to every window
			
			-- Cycle through every Chrome window
			set win_id to 1
			repeat with the_window in win_list
				set tab_list to every tab in the_window
				--set active_tab to active tab in the_window
				
				-- Cycle through every tab in this window
				set tab_id to 1
				repeat with the_tab in tab_list
					set tab_title to the title of the_tab
					set tab_url to the URL of the_tab
					
					if tab_title is "" then
						set tab_title to tab_url
						set tab_url to ""
					end if
					set |title| to (win_id & ": " & tab_title) as string
					set subtitle to tab_url
					set icon to "tab"
					if tab_url is "chrome://newtab/" then
						set icon to icon & "_new"
					else if ("//localhost" is in tab_url) or ("view-source:" is in tab_title) then
						set icon to icon & "_dev"
					end if
					set icon to icon & "_activeTemplate"
					
					set tabs_result to tabs_result & [{tab_id:tab_id, win_id:win_id, |title|:|title|, subtitle:subtitle, icon:icon, action:"switch_tab", actionRunsInBackground:true, actionReturnsItems:true}]
					
					set tab_id to tab_id + 1
				end repeat
				
				set win_id to win_id + 1
			end repeat
			
		end tell
	end using terms from
	return tabs_result
end run

on switch_tab(argv)
	set win_id to win_id of argv
	set tab_id to tab_id of argv
	
	if is_running("Google Chrome") then
		set browserName to "Google Chrome"
	else if is_running("Chromium") then
		set browserName to "Chromium"
	else
		return
	end if
	
	using terms from application "Google Chrome"
		tell application browserName
			set (active tab index of (window win_id)) to tab_id
			activate
		end tell
	end using terms from
	
	-- If we return something, then we can keep the window open while
	-- we switch tabs.
	return {}
end switch_tab

on is_running(appName)
	tell application "System Events" to (name of processes) contains appName
end is_running