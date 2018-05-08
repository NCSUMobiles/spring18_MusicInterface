color[][] hexColorWheel = {
                          {#f9ddc7, #e2cab7, #dbc3af, #d1b9a5, #c4ac99, #c4a893}, //Earth
                          {#64b8df, #90a4c2, #9bc3cb, #b4cde3, #009cbb, #00a79d}, //Water
                          {#4b3513, #726658, #c2b59b, #58595b, #a97c50, #9b8579}, //Fire
                          {#b4bfb3, #c6d3e4, #aab4c0, #e4dde6, #bbcaae, #b7d1cd}, //Air
                          }; 


class Hexagon {

 int       COLOR_STEP = 1;       // how quickly color moves toward color target
 float     ANGLE = TWO_PI / 4;   // angle to contruct hexagon/half-hex - CHANGE SHAPE
 int       BLOB_ZONE_MIN = 50;
 int       BLOB_ZONE_MAX = 180;
 

 // main hex variables
 PShape    hex;
 float     centx;
 float     centy;
 float     radius;
 boolean   bFill = true;
 color     hexColor;
 color     hexColorTarget;
 
 // half-hex variables
 PShape    halfHex;
 int       MAX_HALFHEX_AGE = 22; //15//50 # frames that half-hexs live
 PShape[]  halfHexArray;         // stores pre-created half hexagons
 boolean   bHalfHex = false;    
 int       whichHalfHex;
 color     halfHexColor;
 int       halfHexAge = 0;
 
 PShape    blobHex;
 color     blobHexColor;
 boolean   bBlobHexFill = false;

//Our Constructor takes the center coordinates along with a value for radius
 Hexagon( float x, float y, float r, color c) {
   centx = x;
   centy = y;
   radius = r;
   hexColor = hexColorTarget = blobHexColor = c;
   
  setupShape(TWO_PI / 3);
 }
 
//The draw function will define the fill values and calculate the coordinates
 void draw() {
  //move hex color toward color target
  if (red(hexColor) > red(hexColorTarget)) hexColor = color(red(hexColor)-COLOR_STEP,green(hexColor),blue(hexColor), 255 - returnMovieBrightness(centx,centy)*255);
  if (red(hexColor) < red(hexColorTarget)) hexColor = color(red(hexColor)+COLOR_STEP,green(hexColor),blue(hexColor), 255 - returnMovieBrightness(centx,centy)*255);
  if (green(hexColor) > green(hexColorTarget)) hexColor = color(red(hexColor),green(hexColor)-COLOR_STEP,blue(hexColor), 255 - returnMovieBrightness(centx,centy)*255);
  if (green(hexColor) < green(hexColorTarget)) hexColor = color(red(hexColor),green(hexColor)+COLOR_STEP,blue(hexColor), 255 - returnMovieBrightness(centx,centy)*255);
  if (blue(hexColor) > blue(hexColorTarget)) hexColor = color(red(hexColor),green(hexColor),blue(hexColor)-COLOR_STEP, 255 - returnMovieBrightness(centx,centy)*255);
  if (blue(hexColor) < blue(hexColorTarget)) hexColor = color(red(hexColor),green(hexColor),blue(hexColor)+COLOR_STEP, 255 - returnMovieBrightness(centx,centy)*255);

  //hexColor = color(returnMovieBrightness(centx,centy)*255);
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

   
  //draws hex 
  if(bFill) {hex.setFill(hexColor); hex.setStroke(hexColor);}
  else {hex.setFill(color(0,0,0,0));hex.setStroke(color(0,0,0,0));} 
  shape(hex);
  
  //draws half hex (if present)
  if(bHalfHex){
    //sets half hex color, fades out as it gets older
    color tempColor = color(red(halfHexColor),green(halfHexColor),blue(halfHexColor),255*(1-((float)halfHexAge/MAX_HALFHEX_AGE))); //fade out halfhex
    halfHex.setFill(tempColor); halfHex.setStroke(tempColor);
    shape(halfHex);
    // flips random active half hexs 
    if (random(1)<0.05){whichHalfHex = (int)random(0,5); halfHex = halfHexArray[whichHalfHex];}
    // ages halfhex and turns off if too old
    halfHexAge++;
    if (halfHexAge >= MAX_HALFHEX_AGE){halfHexAge = 0; bHalfHex = false;}
  }
  
  //draws blob hex (if present)
  if(bBlobHexFill) {blobHex.setFill(blobHexColor); blobHex.setStroke(blobHexColor);shape(blobHex);}
   
  // turns on random half hexs around screen 
  if (random(1)<.05 && !bHalfHex){
    bHalfHex = true; halfHexAge = 0;
    whichHalfHex = (int)random(0,5);
    halfHex = halfHexArray[whichHalfHex];
    halfHexColor = color(red(hexColor),green(hexColor),blue(hexColor), 255);
  }

  bBlobHexFill = false;
  for (int i = 0; i < blobs.size(); i++) {
    Blob thisBlob = blobs.get(i);
    float thisX = thisBlob.x*width;
    float thisY = thisBlob.y*height;
    int id = 0; if ((thisBlob.colorId >=0)&&(thisBlob.colorId <8)) id = thisBlob.colorId;
    if(dist(centx,centy,thisX,thisY)<map(abletonvolume[id],0,1,BLOB_ZONE_MIN,BLOB_ZONE_MAX)){
      
      color tempColor;
      if (thisBlob.colorId < 8){
        //tempColor = color(red(blobColorWheel[thisBlob.colorId]),green(blobColorWheel[thisBlob.colorId]),blue(blobColorWheel[thisBlob.colorId]),255-(255*(dist(centx,centy,thisX,thisY)/100)));
        tempColor = color(red(blobColorWheel[globalMode][thisBlob.colorId]),green(blobColorWheel[globalMode][thisBlob.colorId]),blue(blobColorWheel[globalMode][thisBlob.colorId]),255-(255*(dist(centx,centy,thisX,thisY)/100)));
      }
      else{
        tempColor = color(255,255,255,255*(1-(dist(centx,centy,thisX,thisY)/100)));
      }
      hex.setFill(tempColor); hex.setStroke(tempColor);
      // turns on halfhex of same color as blob
      bHalfHex = true;
      halfHexAge = 0;
      whichHalfHex = (int)random(0,5);
      halfHex = halfHexArray[whichHalfHex];
      if (thisBlob.colorId < 8){
        halfHexColor = color(red(blobColorWheel[globalMode][thisBlob.colorId]),green(blobColorWheel[globalMode][thisBlob.colorId]),blue(blobColorWheel[globalMode][thisBlob.colorId]), 128);
        if(dist(centx,centy,thisX,thisY)<(map(abletonvolume[id],0,1,BLOB_ZONE_MIN,BLOB_ZONE_MAX)/2)){
          bBlobHexFill = true;
          blobHexColor = color(red(blobColorWheel[globalMode][thisBlob.colorId]),green(blobColorWheel[globalMode][thisBlob.colorId]),blue(blobColorWheel[globalMode][thisBlob.colorId]), 255-(64*(dist(centx,centy,thisX,thisY)/100)));
        }
      }
    }
  }
}


void updateColor(color c) {hexColor = c;}
void updateColorTarget(color c) {hexColorTarget = c;}
void updateColorTargetRandom() {
      //int temp = int(random(hexColorWheel1.length)); hexColorTarget = hexColorWheel1[temp];
      int temp = int(random(hexColorWheel[globalMode].length));
      hexColorTarget = hexColorWheel[globalMode][temp];
}

//The following are all simply utility functions for setting parameters
 float centx() {return centx;}
 float centy() {return centy;}
 color getColor() {return hexColor;}
 void setNoFill(boolean yesno) {bFill = yesno;}
 
 void setFillColor(color col) {
   bFill = true;
   hexColor = col;
 }
 
 
  void keyPressed(int key) {
  // Key press for shape change
  if (key == 'a') {
    setupShape(TWO_PI / 4);
    //OscMessage ExitMessage = new OscMessage("/earth");
    //oscP5.send(ExitMessage, myRemoteLocation);
} 
  if (key == 's') { 
    setupShape(TWO_PI / 3);
    //OscMessage ExitMessage = new OscMessage("/water");
    //oscP5.send(ExitMessage, myRemoteLocation);
} 
  if (key == 'd') { 
    setupShape(TWO_PI / 6);
    //OscMessage ExitMessage = new OscMessage("/fire");
    //oscP5.send(ExitMessage, myRemoteLocation);
} 
  if (key == 'f') { 
    setupShape(TWO_PI / 5);
    //OscMessage ExitMessage = new OscMessage("/air");
    //oscP5.send(ExitMessage, myRemoteLocation);
  }
}
 
 void setupShape(float newAngle){
     //creates hex shape
   hex = createShape();   
   hex.beginShape(); 
     for (float a = PI/6; a < TWO_PI; a += newAngle) {
       float sx = centx + cos(a) * radius;
       float sy = centy + sin(a) * radius;
       hex.vertex(sx, sy);
     }
   hex.endShape(CLOSE);
   blobHex = hex;
   
   //creates six half hex shapes, stores them in array
   halfHexArray=new PShape[6];
   for (int i=0; i<6; i++) {
     halfHexArray[i] = createShape();
     halfHexArray[i].beginShape(); 
       float a = PI/6 + (i*newAngle);
       for (int j = 0; j<4; j+=1){
         float tempAngle = a + j*newAngle;
         float sx = centx + cos(tempAngle) * radius;
         float sy = centy + sin(tempAngle) * radius;
         halfHexArray[i].vertex(sx, sy);
       }
     halfHexArray[i].endShape(CLOSE); 
    } 
 }
 
}
