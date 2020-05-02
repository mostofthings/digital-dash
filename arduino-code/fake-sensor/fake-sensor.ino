int rawValue;
int fakeWaterTemp;
int fakeOilPressure;
int fakeFuelPressure;
int fakeBoost;
int fakeRPM;
int counter;
String waterTemp;
String boostPressure;
String fuelPressure;
String oilPressure;
String rpm;
bool up = true;

void setup() {
  Serial.begin(9600);
  counter = 0;
  fakeWaterTemp = 905;
  fakeOilPressure = 80;
  fakeFuelPressure = 35;
  fakeBoost = -20;
  fakeRPM = 1200;
}

void loop() {
  if (up){
    fakeWaterTemp = fakeWaterTemp + 3;
    fakeOilPressure++;
    fakeFuelPressure = fakeFuelPressure + .5;
    fakeBoost++;
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
    fakeFuelPressure = fakeFuelPressure -.5;
    fakeBoost--;
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
  boostPressure = (String)"BP" + fakeBoost;
  rpm = (String)"ER" + fakeRPM;
  
  Serial.println(waterTemp + "," + oilPressure + "," + fuelPressure + "," + boostPressure + "," + rpm);
  delay(200);
}
