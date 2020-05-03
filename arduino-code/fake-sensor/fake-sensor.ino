int rawValue;
int fakeWaterTemp;
int fakeOilPressure;
int fakeFuelPressure;
int fakeBoost;
int fakeRPM;
int fakeAFR;
int counter;
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
    if (counter >= 4){
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
  
  Serial.println(waterTemp + "," + oilPressure + "," + airFuelRatio + "," + fuelPressure + "," + boostPressure + "," + rpm);
  delay(200);
}
