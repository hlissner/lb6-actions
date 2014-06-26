property fileTypes : {Â
	{JPEG picture, ".jpg"}, Â
	{TIFF picture, ".tiff"}, Â
	{GIF picture, ".gif"}, Â
	{Çclass PDF È, ".pdf"}}

on run
	set theType to getType()
	if theType is not missing value then
		set myPath to "/tmp/cb" & (second item of theType)
		try
			set myFile to (open for access myPath with write permission)
			set eof myFile to 0
			write (the clipboard as (first item of theType)) to myFile -- as whatever
			close access myFile
			set posixPath to (POSIX path of myPath)
			return [{title:posixPath, subtitle:"Clipboard Image", |path|:myPath, quickLookURL:"file://" & myPath}]
		on error
			try
				close access myFile
			end try
			return [{title:"Could not write to file!"}]
		end try
	else
		return [{title:"Your clipboard doesn't contain an image."}]
	end if
end run


-- Helpers ----------------------------------------------

on getType()
	repeat with aType in fileTypes -- find the first match in the list
		repeat with theInfo in (clipboard info)
			if (first item of theInfo) is equal to (first item of aType) then
				return aType
			end if
		end repeat
	end repeat
	return missing value
end getType