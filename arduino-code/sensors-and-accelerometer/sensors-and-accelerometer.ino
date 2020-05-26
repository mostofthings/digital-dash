#include <math.h>
#include <Wire.h>
#include <Adafruit_MMA8451.h>
#include <Adafruit_Sensor.h>
#include <Adafruit_NeoPixel.h>
#ifdef __AVR__
#include <avr/power.h> // Required for 16 MHz Adafruit Trinket
#endif

#define PIXEL_PIN    6  // Digital IO pin connected to the NeoPixels.
#define PIXEL_COUNT 16  // Number of NeoPixels

Adafruit_NeoPixel strip(PIXEL_COUNT, PIXEL_PIN, NEO_GRB + NEO_KHZ800);

Adafruit_MMA8451 mma = Adafruit_MMA8451();

char receivedChar;
String receivedMessage;

int rawValue;
unsigned long duration;
float periodInSeconds;
float unroundedRPM;
int roundedRPM;
int rpmToSend;
int lastKnownGoodRPM;
int blinkCounter = 0;
unsigned long timeNow;
bool isDemo = false;
unsigned long demoStart;
int demoDelay = 2000;

bool masterWarn = false;
String warning = "warn";

const byte DATA_MAX_SIZE = 32;
char data[DATA_MAX_SIZE];

String waterTemp;
String boostPressure;
String fuelPressure;
String airFuelRatio;
String oilPressure;
String oilTemp;
String rpm;

String xAccel;
String yAccel;
String zAccel;

void setup(void) {
  Serial.begin(9600);
  strip.begin(); // Initialize NeoPixel strip object (REQUIRED)
  strip.setBrightness(255);
  strip.show();  // Initialize all pixels to 'off'
  pinMode(7, INPUT);

  if (! mma.begin()) {
    Serial.println("Accelerometer not found");
  }

  mma.setRange(MMA8451_RANGE_4_G);

  pixelsDemo();
}



void loop() {
  timeNow = millis();

  /* Get a new sensor event */
  sensors_event_t event;
  mma.getEvent(&event);

  rawValue = analogRead(A0);
  waterTemp = (String) "WT" + rawValue;
  rawValue = analogRead(A1);
  boostPressure = (String) "BP" + rawValue;
  rawValue = analogRead(A2);
  oilPressure = (String) "OP" + rawValue;
  rawValue = analogRead(A3);
  airFuelRatio = (String) "WB" + rawValue;
  rawValue = analogRead(A4);
  oilTemp = (String) "OT" + rawValue;


  duration = pulseIn(7, HIGH, 100000); // set for min of 500 RPM
  //  rpm = (String) "ER" + duration;
  if (duration > 0) {
    rpmToSend = calculateRPM(duration);
  } else {
    rpmToSend = 0;
    lastKnownGoodRPM = 6000;
  }
  rpm = (String) "ER" + rpmToSend;

  rawValue = event.acceleration.x * 100;
  xAccel = (String) "XA" + rawValue;
  rawValue = event.acceleration.y * 100;
  yAccel = (String) "YA" + rawValue;
  rawValue = event.acceleration.z * 100;
  zAccel = (String) "ZA" + rawValue;

  if (!isDemo) {
    strip.clear();
    for (int i = 0; i < PIXEL_COUNT; i ++) {
      int rpmCounter = i * 250 + 3250;
      if (rpmToSend >= rpmCounter) {
        if (rpmCounter <= 4000) {
          strip.setPixelColor(i, strip.Color(0, 255, 0));
        } else if ( rpmCounter <= 5000) {
          strip.setPixelColor(i, strip.Color(255, 255, 0));
        } else if ( rpmCounter <= 6000) {
          strip.setPixelColor(i, strip.Color(255, 0, 0));
        } else if ( rpmCounter <= 7000) {
          strip.setPixelColor(i, strip.Color(0, 0, 255));
        }
      }
    }
  }

  if ( rpmToSend >= 7150) {
    blinkLeds(255);
  } else if (!masterWarn) {
    blinkCounter = 0;
  }

  while (Serial.available() > 0) {
    delay(2);
    static char endMarker = '\n';
    receivedChar = Serial.read();
    

    if (receivedChar == endMarker) {

      return;
    } else {
      receivedMessage += receivedChar;
    }
  }

  if (receivedMessage == warning) {
    masterWarn = true;
//    Serial.println("EM" + receivedMessage + ",");
    receivedMessage = '\0';
  }
  
  if (receivedMessage != '\0') {
    strip.setBrightness(receivedMessage.toInt());
    demoDelay = 750;
    pixelsDemo();
//    Serial.println("EM" + receivedMessage + ",");
    receivedMessage = '\0';
  }


    if (masterWarn){
      blinkLeds(16711680);
    }

  strip.show();

  while (millis() < timeNow + 100) {
    //total delay of 100ms
  }

  if (isDemo && millis() > demoStart + demoDelay) {
    isDemo = false;
  }



  /* Display the results (acceleration is measured in m/s^2) */
  Serial.println(waterTemp + "," + boostPressure + "," + oilPressure + "," + oilTemp + "," +
                 airFuelRatio + "," + rpm + "," + xAccel + "," + yAccel + "," + zAccel);
}

int calculateRPM(unsigned long value) {
  periodInSeconds = value * 3.5 / 1000000;
  unroundedRPM = 60 / periodInSeconds;
  roundedRPM = round(unroundedRPM);
  if (roundedRPM <= lastKnownGoodRPM * 3) {
    lastKnownGoodRPM = roundedRPM;
  } else if (roundedRPM > lastKnownGoodRPM * 3) {
    roundedRPM = lastKnownGoodRPM;
  }
  return roundedRPM;
}

void pixelsDemo() {
  for (int n = 0; n < 16; n++) {
    if (n < 4) {
      strip.setPixelColor(n, strip.Color(0, 255, 0));
    } else if (n < 8) {
      strip.setPixelColor(n, strip.Color(255, 255, 0));
    } else if (n < 12) {
      strip.setPixelColor(n, strip.Color(255, 0, 0));
    } else if (n < 16) {
      strip.setPixelColor(n, strip.Color(0, 0, 255));
    }
  }
  isDemo = true;
  demoStart = millis();
}

void blinkLeds(unsigned long color) {
  strip.fill(color, 0);
  blinkCounter++;
  if (blinkCounter > 2) {
    strip.clear();
  }
  if (blinkCounter == 4) {
    blinkCounter = 0;
  }
}
