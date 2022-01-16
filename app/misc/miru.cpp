#include <Servo.h>

// Entradi
#define kippSchalterUpPin 1
#define kippSchalterDownPin 2
#define endSchalterUpPin 3
#define endSchalterDownPin 4
#define remoteControlPin 5

// Üscida dal servo
#define servoPin 0

// Veocità dal servo, 1 => lent, 90 => svelt (negatif al gira ala altra)
#define servoSpeed 90
static_assert(servoSpeed >= -90 && servoSpeed <= 90, "Velocità invalida");

Servo servo;

void setup()
{
  // Pizza al servo => al fa forza
  myservo.attach(servoPin);

  // Cun la modalità INPUT_PULLUP la entrada le ativa a 0
  pinMode(kippSchalterUpPin,   INPUT_PULLUP);
  pinMode(kippSchalterDownPin, INPUT_PULLUP);
  pinMode(endSchalterUpPin,    INPUT_PULLUP);
  pinMode(endSchalterDownPin,  INPUT_PULLUP);
  pinMode(remoteControlPin,    INPUT_PULLUP);
}

// Sa les da sa ativa al endschalter ma al la surpasa
int isDown = 0;
int isUp = 0;

void loop() {
  // Controla i endschalter
  if (!digitalRead(endSchalterDownPin)) {
    isDown = 1;
    isUp = 0;
  }

  if (!digitalRead(endSchalterUpPin)) {
    isUp = 1;
    isDown = 0;
  }

  // Modalità manuale
  if (!digitalRead(kippSchalterUpPin) && !isUp) {
    servo.write(90 + servoSpeed);
    return;
  }

  if (!digitalRead(kippSchalterDownPin) && !isDown) {
    servo.write(90 - servoSpeed);
    return;
  }

  servo.write(90);  // Bloca al servo in pusizion
}
