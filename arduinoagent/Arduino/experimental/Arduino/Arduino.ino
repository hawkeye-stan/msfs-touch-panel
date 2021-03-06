#include <Joystick.h>
#include <NewEncoder.h>
#include <Keypad.h>

// Rotary Encoder Inputs
#define CLK1 19
#define DT1 18
#define SW1 17

#define CLK2 2
#define DT2 3
#define SW2 4

#define VRx A0
#define VRy A1

const byte ROWS = 4; 
const byte COLS = 4; 

char hexaKeys[ROWS][COLS] = {
  {'1', '2', '3', 'A'},
  {'4', '5', '6', 'B'},
  {'7', '8', '9', 'C'},
  {'*', '0', '#', 'D'}
};

byte rowPins[ROWS] = {31, 33, 35, 37}; 
byte colPins[COLS] = {39, 41, 43, 45}; 
Keypad customKeypad = Keypad(makeKeymap(hexaKeys), rowPins, colPins, ROWS, COLS); 

// Rotatry encoder variables
int currentStateCLK1;
int lastStateCLK1;
int currentStateCLK2;
int lastStateCLK2;

String currentEvent = "";
String currentDir1 = "";
String currentDir2 = "";
boolean rotaryEncoderRotating1 = false;
boolean rotaryEncoderRotating2 = false;

unsigned long lastButton1Press = 0;
unsigned long lastButton2Press = 0;

Joystick joystick(VRx, VRy, 8);

NewEncoder encoder1(DT1, CLK1, -32768, 32767, 0, FULL_PULSE);
NewEncoder encoder2(DT2, CLK2, -32768, 32767, 0, FULL_PULSE);
int16_t prevEncoderValue1;
int16_t prevEncoderValue2;

void setup() {
	// Set encoder pins as inputs
	pinMode(SW1, INPUT_PULLUP);
  pinMode(SW2, INPUT_PULLUP);

	// Setup joystick
	joystick.initialize();  
	joystick.calibrate();
	joystick.setSensivity(3);
  
	// Setup Serial Monitor
	Serial.begin(9600);

  NewEncoder::EncoderState encoderState1;
  NewEncoder::EncoderState encoderState2;
  
  encoder1.begin();
  encoder1.getState(encoderState1);
  prevEncoderValue1 = encoderState1.currentValue;

  encoder2.begin();
  encoder2.getState(encoderState2);
  prevEncoderValue2 = encoderState2.currentValue;
}

void loop() {
  int16_t currentEncoderValue1;
  int16_t currentEncoderValue2;
  NewEncoder::EncoderState currentEncoderState1;
  NewEncoder::EncoderState currentEncoderState2;

  // Read rotary encoder 1
  if (encoder1.getState(currentEncoderState1)) {
    currentEncoderValue1 = currentEncoderState1.currentValue;
    if (currentEncoderValue1 != prevEncoderValue1) {
      if(currentEncoderValue1 > prevEncoderValue1){
        Serial.println("Encoder1:CW:" + String(currentEncoderValue1 - prevEncoderValue1));
      }
      else{
        Serial.println("Encoder1:CCW:" + String(prevEncoderValue1 - currentEncoderValue1));
      }
      prevEncoderValue1 = currentEncoderValue1;
    }
  }

  // Read rotary encoder 2
  if (encoder2.getState(currentEncoderState2)) {
    currentEncoderValue2 = currentEncoderState2.currentValue;
    if (currentEncoderValue2 != prevEncoderValue2) {
      if(currentEncoderValue2 > prevEncoderValue2){
        Serial.println("Encoder2:CW:" + String(currentEncoderValue2 - prevEncoderValue2));
      }
      else{
        Serial.println("Encoder2:CCW:" + String(prevEncoderValue2 - currentEncoderValue2));
      }
      prevEncoderValue2 = currentEncoderValue2;
    }
  }

	// Read the rotary encoder button state
	int btnState1 = digitalRead(SW1);
	int btnState2 = digitalRead(SW2);

	//If we detect LOW signal, button is pressed
	if (btnState1 == LOW) {
		//if 500ms have passed since last LOW pulse, it means that the
		//button has been pressed, released and pressed again
		if (millis() - lastButton1Press > 500) {
			Serial.println("Encoder1:SW");
		}

		// Remember last button press event
		lastButton1Press = millis();
	}

	if (btnState2 == LOW) {
		//if 500ms have passed since last LOW pulse, it means that the
		//button has been pressed, released and pressed again
		if (millis() - lastButton2Press > 500) {
			Serial.println("Encoder2:SW");
		}

		// Remember last button press event
		lastButton2Press = millis();
	}

	// Read joystick (updated for joystick mounted at 90 degree)
	if(joystick.isReleased())
	{
		// left
		if(joystick.isLeft())
		{
      //Serial.println("Joystick:LEFT");
			Serial.println("Joystick:UP");
		}

		// right
		if(joystick.isRight())
		{
      //Serial.println("Joystick:RIGHT");
			Serial.println("Joystick:DOWN");
		}

		// up
		if(joystick.isUp())
		{
      //Serial.println("Joystick:UP");
			Serial.println("Joystick:RIGHT");
		}

		// down
		if(joystick.isDown())
		{
      //Serial.println("Joystick:DOWN");
			Serial.println("Joystick:LEFT");
		}
	}

  // Read keypad
  char customKey = customKeypad.getKey();
  
  if (customKey){
    if(customKey == '#')
    {
      Serial.println("Keypad:KeyPound");
    }
    else if(customKey == '*')
    {
      Serial.println("Keypad:KeyAsterisk");
    }
    else
    {
      Serial.println("Keypad:Key" + String(customKey));
    }
  }

	// slow down a bit
	delay(100);
}
