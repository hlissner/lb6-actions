--Copyright (c) 2011, Aristides Francisco Lourenco (@aristidesfl)

--Permission is hereby granted, free of charge, to any person obtaining a copy
--of this software and associated documentation files (the "Software"), to deal
--in the Software without restriction, including without limitation the rights
--to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
--copies of the Software, and to permit persons to whom the Software is
--furnished to do so, subject to the following conditions:

--The above copyright notice and this permission notice shall be included in
--all copies or substantial portions of the Software.

--THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
--IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
--FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
--AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
--LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
--OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
--THE SOFTWARE.

--You need to have haste installed with: gem install haste

-- take string from LaunchBar
on handle_string(theText)
	try

		set curlCMD to "echo " & quoted form of theText & " | haste"
		set theURL to (do shell script curlCMD)
		set the clipboard to theURL
		tell application "LaunchBar"
			set selection as text to theURL
			activate
		end tell
	on error e
		my growlRegister()
		growlNotify("Error", e)
	end try
end handle_string

--take sting from a file
on open (the_file)
	try
		set curlCMD to "haste < " & quoted form of ((POSIX path of the_file) as text)
		set theURL to (do shell script curlCMD)
		set the clipboard to theURL
		tell application "LaunchBar"
			set selection as text to theURL
			activate
		end tell
	on error e
		my growlRegister()
		growlNotify("Error", e)
	end try
end open


-- additional scripting for Growlnotificati
using terms from application "Growl"
	on growlRegister()
		set appIcon to "Launchbar.app"
		tell application "Growl"
			register as application "Hastebin" all notifications {"Alert"} default notifications {"Alert"} icon of application appIcon
		end tell
	end growlRegister
	on growlNotify(grrTitle, grrDescription)
		tell application "Growl"
			notify with name "Alert" title grrTitle description grrDescription application name "Hastebin"
		end tell
	end growlNotify
end using terms from
te