int rawValue;
int fakeWaterTemp;
int fakeOilPressure;
int fakeFuelPressure;
int fakeBoost;
int fakeRPM;
int fakeAFR;
int fakeGForceX;
int fakeGForceY;
int counter;
String accelX;
String accelY;
String waterTemp;
String boostPressure;
String fuelPressure;
String airFuelRatio;
String oilPressure;
String rpm;
bool up = true;

void setup() {
  Serial.begin(9600);
  counter = 0;
  fakeWaterTemp = 905;
  fakeOilPressure = 80;
  fakeFuelPressure = 35;
  fakeBoost = 101;
  fakeGForceX = 10;
  fakeGForceY = 30;
  fakeAFR = 235;
  fakeRPM = 1200;
}

void loop() {
  if (up){
    fakeWaterTemp = fakeWaterTemp + 3;
    fakeOilPressure++;
    fakeFuelPressure = fakeFuelPressure + 1;
    fakeBoost = fakeBoost + 3;
    fakeAFR = fakeAFR + 5;
    fakeRPM = fakeRPM + 120;
    fakeGForceX = fakeGForceX - 8;
    fakeGForceY = fakeGForceY - 8;
    if (counter >= 20){
      up = false;
      counter--;
    }
    else{
    counter++;
    }
  } else {
    fakeWaterTemp = fakeWaterTemp - 3;
    fakeOilPressure--;
    fakeFuelPressure = fakeFuelPressure - 1;
    fakeBoost = fakeBoost - 3;
    fakeAFR = fakeAFR -5;
    fakeRPM = fakeRPM - 120;
    fakeGForceX = fakeGForceX + 8;
    fakeGForceY = fakeGForceY + 8;
    if (counter <= 0){
      up = true;
      counter++;
    }
    else{
    counter--;
    }
  }
  
  waterTemp = (String)"WT" + fakeWaterTemp;
  oilPressure = (String)"OP" + fakeOilPressure;
  fuelPressure = (String)"FP" + fakeFuelPressure;
  airFuelRatio = (String)"WB" + fakeAFR;
  boostPressure = (String)"BP" + fakeBoost;
  rpm = (String)"ER" + fakeRPM;
  accelX = (String)"XA" + fakeGForceX;
  accelY = (String)"YA" + fakeGForceY;
  
  Serial.println(waterTemp + "," + oilPressure + "," + airFuelRatio + "," + fuelPressure + "," + boostPressure + "," + rpm + "," + accelX + "," + accelY);
  delay(100);
}
