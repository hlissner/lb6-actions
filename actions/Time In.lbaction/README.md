# Time in...

A quick wibbly wobbly, timey whimey way to look up what time it is anywhere in the
world. Feed it an address, a country, a city--whatever.

Keeps a history of locations you've looked up and suggests them as you type.

![](img/01.png)
![](img/02.png)

Run it without text and it will list the times of preset locations you've set in your
preferences (see below).

![](img/03.png)

Note:
* Hold down shift to ignore & clear the cache
* Hold down ctrl to select this action's Preferences.plist

## Available Preferences

* show_seconds (yes|no): display the seconds in the result or not. Off by default.
* format_24hour (yes|no): display the time in 24 hour format or not. Off by default.

## Requirements

«Time In» works out of the box **without** an API key, but if you're getting API
query limit errors you might be better off with one:

* A Google Account
* A Google API key (you'll be prompted for this on first run)
* The following Google API services enabled:
    * Geocoding API
    * TimeZone API


## How to set up Google API

1. Go to [the Google Developer Console](https://console.developers.google.com) and sign in with your Google account.
2. Click "Create new project" and name it whatever you like. I named mine "LaunchBar Actions".
3. Go to **Credentials** on the left menu.
    
    ![](img/06.png)

4. Beneath **Public API Access**, click on a button labeled **Create new key**.
5. Select "Browser Key" when it prompts you what type of key you want, then click "create" to finish the process.
6. The API key has been created and should be displayed. Note this down. There's one more step before you're done.
    ![](img/05.png)

7. Go to "APIs" on the left menu, then find and enable these two services:
    * Geocoding API
    * TimeZone API

And you're done! Run Time In while holding down alt and it will give you the
Preferences.plist. Enter your API key in the api_key field and you're good to go!

![](img/04.png)
