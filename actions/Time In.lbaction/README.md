# Time in...

A quick wibbly wobbly, timey whimey way to look up what time it is anywhere in the
world. Feed it an address, a country, a city--whatever.

![](https://raw.githubusercontent.com/hlissner/lb6-actions/master/images/cb-ti-1.png)
![](https://raw.githubusercontent.com/hlissner/lb6-actions/master/images/cb-ti-2.png)

Run it without text and it will list the times of preset locations you've set in your
preferences (see below).

![](https://raw.githubusercontent.com/hlissner/lb6-actions/master/images/cb-ti-3.png)

## Requirements

* A Google Account
* A Google API key (you'll be prompted for this on first run)
* The following Google API services enabled:
    * Geocoding API
    * TimeZone API


## How to set it up

1. Go to [the Google Developer Console](https://console.developers.google.com) and sign in with your Google account.
2. Click "Create new project" and name it whatever you like. I named mine "LaunchBar Actions".
3. Go to **Credentials** on the left menu.
    
    ![](https://raw.githubusercontent.com/hlissner/lb6-actions/master/images/cb-ti-6.png)

4. Beneath **Public API Access**, click on a button labeled **Create new key**.
5. Select "Browser Key" when it prompts you what type of key you want, then click "create" to finish the process.
6. The API key has been created and should be displayed. Note this down. There's one more step before you're done.
    ![](https://raw.githubusercontent.com/hlissner/lb6-actions/master/images/cb-ti-5.png)

7. Go to "APIs" on the left menu, then find and enable these two services:
    * Geocoding API
    * TimeZone API

And you're done! Run Time In once and it will request your API key. Enter it and you're good
to go!


## Notes

To force the API key prompt to appear, hold alt while running the action. Alternatively,
you can modify your api key in the Preferences.plist file for this action:

`~/Library/Application Support/LaunchBar/Action Support/io.henrik.launchbar.TimeIn/Preferences.plist`

Example:

![](https://raw.githubusercontent.com/hlissner/lb6-actions/master/images/cb-ti-4.png)
