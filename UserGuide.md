# MSFS Touch Panel User Guide

# Main Screen
The Main screen contains most of the flight control functions and are touch enabled. Each panel can be collapsed to display only what is needed at that moment. Panels can also be hidden via the [Configuration Settings](#configuration-settings) menu.

<div float="left">
  <img src="screenshots/app/screenshot1.png" width="480" hspace="10" />
  <img src="screenshots/app/screenshot10.png" width="480" hspace="10" valign="top"/> 
</div>

<br/>

## Menu Bar

The menu bar displays the current connection status of the application as well as buttons to show configuration settings. It also displays the current active plane profile.

<img src="screenshots/app/screenshot11.png" width="980" hspace="10" />

Explanation of menu bar icons/info from the left to right:

* Connection status to MSFS - This will become active when MSFS/SimConnect is connected.
* Connection status for Arduino - This will become active if Arduino is connected.
* Plane Title
* [Web Panel Feature](ExperiementalFeatuere2.md)
* [Switch to map screen](#map-screen)
* Plane profile settings

	The corresponding plane profile will automatically activate when you select the desired plane for simulation. You can also manually select another plane profile but some plane functions may not work correctly. More plane profiles will be added in future releases.
				
	<img src="screenshots/app/screenshot9.png"  hspace="10"/>

* Configuration Settings

	The configuration settings allow you to adjust various features of the application.
			
	<img src="screenshots/app/screenshot8.png" hspace="10"/>
		
	* **Data Refresh Interval** - data will refresh every X milliseconds. The valid refresh rate is between 50ms to 5000ms. If the application seems slow or unresponsive, you can increase the refresh interval. The refresh interval will affect how fast the telemetry and UI is being updated. For any recently built computer, the lowest refresh interval will work just fine.		
	* **Map Refresh Interval** - map will refresh every X milliseconds. The valid refresh rate is between 50ms to 5000ms. When using plane following, the map will move smoother when using lower refresh interval.
	* [Use Arduino](#arduino-input-method) - enable input using Arduino hardware.
	* **Panels** - show or hide the selected panel on the main screen. The show/hide panel configuration is saved per plane configuration. 

<br/>

## Panels
The flight control panels consist of some of the frequently use functions during simulation. The use of the panel is pretty self-explanatory. For any of the button, when active (such as Autopilot Master), it will light up in green. Any button or input that can be selected or changed, it will light up orange when hover or press. For numeric entry, a corresponding popup panel will be available for input when press.


<br/>

## Input Method

There are three ways to input data into flight control. For choosing direct input or non-direct input, your configuration will be saved for the individual inputs. For example, if you want to use direct input for NAV/COM and knob input for Autopilot heading, you can do that!

* Dial Knob Input Method

	<img src="screenshots/app/screenshot4.png" hspace="10"/>

	* 	For a more immersive and fun way to enter data. The dual knobs behaves exactly like the dual knob control in flight instrument panel within the simulation. 
	 
	*	Depending on the input field, there maybe only a single knob for the input instead of dual knobs.

	* 	To exit or cancel your input, either press the "X" button or press anywhere outside the knob pad popup.
	
	* 	To switch between direct input or knob input, you can press the "Direct Input" switch at the top. The popup will change to direct input number pad for data entry.

* Direct Input

	<img src="screenshots/app/screenshot5.png" hspace="10"/>
	
	* 	You can enter numeric data directly using the popup number pad. The accept ('Check') button will not light up if the number you enter is invalid. For example, if you try to enter 199.000 for COM radio, the "Check" button will not light up. Also, invalid keypad number will be disabled for the input field where applicable. 
	
	* When you hover or long press the information "i" icon on the left of the number display, the valid data value for the input field will be displayed.
	
	* To exit or cancel your input, either press the "X" button or press anywhere outside the number pad popup.
	
	* To switch between direct input or knob/stepper input, you can press the "Direct Input" switch at the top. The popup will change to either knob or stepper input that is configured in the [Configuration Settings](#configuration-settings) menu.
 

<br/>

## Arduino Input Method

For the most immersive experience, using couple of Arduino rotary encoders and a joystick control is a super fun way to manage the in-flight controls. Currently, the application utilizes two rotary encoders and a joystick for input.

Please see technical design [here](TechnicalDetail.md#arduino) in how to build the Arduino hardware controls. 

Once the Arduino hardware controls are connected to the application, you can easily change any numeric input fields such as COM standby or NAV standby by just pressing on the field in the application. The Arduino encoder(s) will become active immediately to control that particular input field. This is pretty similar to Sim Innovations' knobster control. I called it the poor man's Knobster! Thanks for Sim Innovations' designers for their idea of Knobster.

Here is an example of how the Arduino control will work:

By activating the COM1 standby field in the application, rotary encoder one will change the MHz value of the radio and rotary encoder two will change the KHz value of the radio. The rotary encoder switch will perform the swap to use from standby once the desire radio frequency is entered.

The joystick control currently has minimal functionality. It is designed to pan the map in the G1000 NXi interface (map panning doesn't work yet in G1000 NXi 0.6 addon as of this writing). The joystick can also be used to switch between fields in the FMS. 

<br/>

# Map Screen

The map screen gives you a prettier VFR map compare to the MSFS built-in VFR Map. 

<div float="left">
  <img src="screenshots/app/screenshot2.png" width="480" hspace="10" />
  <img src="screenshots/app/screenshot3.png" width="480" hspace="10" valign="top"/> 
</div>


It includes the following features:

* Enable/disable flight following (by dragging to different location on the map, flight following is automatically disable).
* Center plane - set current plane location to the center of the map.
* Show/hide flight plan - current flight plan will be automatically loaded if available.

For the map overlay, you can select it by pressing on the overlay icon at the upper right hand corner of the map. The map display uses OpenTop map as default. The following map types are also available for selection:

* OpenStreet map
* Dark version of map
* Google Street
* Google Terrain
* Google Satellite
* Google Hybrid
* Aviation Overlay

The current flight path is being drawn with a smooth curve based on Quadratic Bézier Curve calculation instead of straight line from waypoint to waypoint. In future release, I will experiment with various path drawing techniques to continue improve the visual quality of the flight path.
