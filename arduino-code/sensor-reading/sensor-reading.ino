int rawValue;
String waterTemp;
String oilTemp;

void setup() {
  Serial.begin(9600);
  rawValue = 0;
}

void loop() {
  rawValue = rawValue+1;
  if (rawValue==1024) {
  rawValue = 0;
}
  waterTemp = (String)"WT" + rawValue;
  oilTemp = (String)"OP" + rawValue;
  Serial.println(waterTemp + "," + oilTemp);
  delay(100);
}
