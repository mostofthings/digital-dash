#include <Wire.h>
#include <Adafruit_MMA8451.h>
#include <Adafruit_Sensor.h>

Adafruit_MMA8451 mma = Adafruit_MMA8451();

int rawValue;
unsigned long duration;
unsigned long timeNow;
String waterTemp;
String boostPressure;
String fuelPressure;
String airFuelRatio;
String oilPressure;
String rpm;

String xAccel;
String yAccel;
String zAccel;

void setup(void) {
  Serial.begin(9600);
  pinMode(7, INPUT);
  if (! mma.begin()) {
    Serial.println("Accelerometer not found");
//    while (1);
  }
  mma.setRange(MMA8451_RANGE_4_G);  
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
  

  duration = pulseIn(7, HIGH, 100000); // set for min of 500 RPM
  rpm = (String) "ER" + duration;

  rawValue = event.acceleration.x * 100;
  xAccel = (String) "XA" + rawValue;
  rawValue = event.acceleration.y * 100;
  yAccel = (String) "YA" + rawValue;
  rawValue = event.acceleration.z * 100;
  zAccel = (String) "ZA" + rawValue;

  while(millis() < timeNow + 100){
    //total delay of 100ms
  }

  /* Display the results (acceleration is measured in m/s^2) */
  Serial.println(waterTemp + "," + boostPressure + "," + oilPressure + "," +
  airFuelRatio + "," + rpm + "," + xAccel + "," + yAccel + "," + zAccel);  
}
