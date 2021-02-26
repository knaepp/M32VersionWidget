M32VersionWidget
================
This small widget looks up the newest version of M32 console firmware. The widget has been developed to be used on iOS devices using the Scriptable app.  

Installation on you iOS Device
====================
First you have to install Scriptable on your device. Just download [Scriptable](https://apps.apple.com/de/app/scriptable/id1405459188) from the Apple's Appstore.  
  
In scriptable create a new script and import the 'X or M32 Current Firmware.js' file content into your script. Per default the script checks for the curren Firmware of the M32 Console and the current release of the software provided by them. Because of the fact that X32 consoles and M32 consoles are binary compatible the firmware could be used for either consoles.
  
If you want to see the firmware version permanently on your device just create a widget on your homescreen, add scriptable and choose the imported script to be executed.  

The Widget
===========

After adding the widget to your homescreen you will get one line for the firmware release and one for the software M32-Edit.

![Widet in iOS](./images/widget.png?raw=true)  

This screenshot from my iPad shows first the current release of M32's firmware and second the most up to date release of M32 Edit (Mac).  

The reloaded line shows the date and time when the wiget last has been updated. It will update every some minutes.  

My platform is macOS and because of that I decided to search for the most current release for that platform. Under normal circumstances Musictribe will update the software for all other supported operatingsystems pretty close to that.

Running inside Scriptable
===

If you run the widget inside of Scriptable you will get a small html-page offering two links to download the requested firmware or software directly to your phone or tablet. The picture shows an example of that simple webpage.

![Widet in iOS](./images/scriptable.png?raw=true)

Other Software from Musictribe
===

This widget could be adjusted to observe other software, handbooks, firmware, drivers and what ever you like coming from Musictribe. The companies that are currently part of Musictribe are

1. musictribe
1. midas
1. klarkteknik
1. lab.gruppen
1. lake
1. tannoy
1. turbosound
1. tcelectronic
1. tchelicon
1. behringer
1. bugera
1. oberheim
1. auratone
1. coolaudio
1. eurocom

Each of those companies offer some kind of downloadable files which will be useful for some of us. I am personally only interested in midas, behringer, klarkteknik and tcelectronic but some of you might be interested in files from the other musictribe companies as well. Feel free to ask how to adjust the request-strings for those companies.

Have fun!

