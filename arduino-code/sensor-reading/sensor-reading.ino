int rawValue;
String waterTemp;
String oilTemp;

void setup() {
  Serial.begin(9600);
}

void loop() {
  rawValue = analogRead(A0);
  waterTemp = (String)"WT" + rawValue;
  oilTemp = (String)"OT" + rawValue;
  Serial.println(waterTemp + "," + oilTemp);
  delay(200);
}
