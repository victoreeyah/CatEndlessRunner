void setup() {
  // put your setup code here, to run once:
pinMode (2, INPUT_PULLUP);
Serial.begin (9600);
}

void loop() {
  // put your main code here, to run repeatedly:
int button = digitalRead (2);
Serial.println (button);
}
