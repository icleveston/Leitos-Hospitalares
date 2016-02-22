#include <AcceleroMMA7361.h>

AcceleroMMA7361 accelero;
int x = 0;
int x_prev = 0;
int y = 0;
int y_prev = 0;
int z = 0;
int z_prev = 0;

void setup()
{
  Serial.begin(9600);
  accelero.begin(33, 37, 31, 35, A5, A6, A7);
  accelero.setARefVoltage(5);                   
  accelero.setSensitivity(HIGH);                  
  accelero.calibrate();
}

void loop()
{
  //Faz um filtro nos três eixos para remover ruido
  x = accelero.getXAccel();
  if((abs(abs(x) - abs(x_prev))) > 5){
    x_prev = x;
  }
  
  y = accelero.getYAccel();
  if(abs((abs(y) - abs(y_prev))) > 5){
    y_prev = y;
  }
  
  z = accelero.getZAccel();
  if(abs((abs(z) - abs(z_prev))) > 5){
    z_prev = z;
  }
 
  //Envia dados pela serial
  Serial.print(x_prev);
  Serial.print("X");
  Serial.print(".");
  Serial.print(y_prev);
  Serial.print("Y");
  Serial.print(".");
  Serial.print(z_prev);
  Serial.print("Z");
  Serial.print(".");
  Serial.print("\n");
  delay(500);                                    
}
