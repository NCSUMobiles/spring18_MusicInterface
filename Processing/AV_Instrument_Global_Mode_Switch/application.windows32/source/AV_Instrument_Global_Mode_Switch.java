import processing.core.*; 
import processing.data.*; 
import processing.event.*; 
import processing.opengl.*; 

import processing.video.*; 
import netP5.*; 
import oscP5.*; 
import java.util.Arrays; 
import websockets.*; 

import java.util.HashMap; 
import java.util.ArrayList; 
import java.io.File; 
import java.io.BufferedReader; 
import java.io.PrintWriter; 
import java.io.InputStream; 
import java.io.OutputStream; 
import java.io.IOException; 

public class AV_Instrument_Global_Mode_Switch extends PApplet {





/** THIS IS NEEDED FOR APP AND NEW **/

WebsocketServer ws;
/** THIS IS NEEDED FOR APP AND NEW **/


int    BLOB_KILL_FRAMES = 10; // removed blob after inactive for # of frames
int    FRAME_RATE = 30;       //number of frames per second
int    HEX_GRID_UPDATE_FRAMES = 25;
int    OSC_IN_PORT = 57120;
String OSC_OUT_IP = "10.152.23.19";
int    OSC_OUT_PORT = 57160;

int    NUM_VIDEOS = 2;
int    INITIAL_VIDEO = 1;

// NEW 
boolean[] usedColors = {false, false, false, false, false, false, false, false};
boolean[] reset = {false, false, false, false, false, false, false, false};


//osc messaging
OscP5        oscP5;
NetAddress   myRemoteLocation;

//movie
Movie        movie;

//float  abletonvolume;
float  abletonvolume[];

ArrayList<Blob> blobs = new ArrayList<Blob>();

HexGrid   g;
int       rad, nwide, nhigh;
boolean   debug = false; //variable used to turn on/off debugging displays

int      globalMode = 1;

int [] backgroundcolor = {0xffc4a893,0xffb4cde3,0xff58595b,0xffe4dde6};
//EARTH BACKGROUND COLOR #c4a893
//WATER BACKGROUND COLOR #b4cde3
//FIRE BACKGROUND COLOR #58595b
//AIR BACKGROUND COLOR #e4dde6

//////// variables end

public void setup(){
  
  
  
  
  /** 
      Port: 8050 
      If your computer is utilizing this port, select a different
      port number and change the port number in the React Native code
      as well.
  */
  ws = new WebsocketServer(this,8050,"/update");

  
  oscP5 = new OscP5(this,OSC_IN_PORT);
  myRemoteLocation = new NetAddress(OSC_OUT_IP,OSC_OUT_PORT);
  
  frameRate(FRAME_RATE); 
  
  rad = 20;
  nhigh = (height/((rad*3)/2)); 
  nwide = PApplet.parseInt(width/(sqrt(3)*rad))+1;
  g = new HexGrid(nwide, nhigh, rad);
  
  abletonvolume =new float[9];
  for (int i = 0; i >= 9; i++) {abletonvolume[i] = 0.0f;}

  movie = new Movie(this, "movie_"+ str(INITIAL_VIDEO) + ".mov");
  movie.loop(); 
}

/** THIS IS NEEDED FOR APP AND NEW **/
public void webSocketServerEvent(String msg) {
  JSONObject jsonMsg = parseJSONObject(msg);
  String type = jsonMsg.getString("type");
  switch(type) {
    case "init":
      JSONObject ret = new JSONObject();
      ret.setString("type", "init");
      JSONArray dataArr = new JSONArray();      // Data array
      for (int i = 0; i < blobs.size(); i++) {
        JSONObject blobInfo = new JSONObject();        // Temp obj for blob index and color
        blobInfo.setInt("index", i);                    
        blobInfo.setInt("colorId", blobs.get(i).colorId);   // blob color 
        dataArr.append(blobInfo);
      }
      ret.setJSONArray("data", dataArr);
      ret.setInt("selected", globalMode);
      ws.sendMessage(ret.toString());
      break;
      
    case "theme":
      String themeData = jsonMsg.getString("data");
      updateTheme(themeData.charAt(0));
      Arrays.fill(usedColors, false);
      break;
      
    case "blob":
      JSONObject blobData = jsonMsg.getJSONObject("data");
      int index = blobData.getInt("index");
      int colorId = blobData.getInt("color");
      println("index: " + index + ", colorId: " + colorId);
      boolean found = false;
      for (Blob blob : blobs) {
        if (blob.colorId == colorId) {
          blob.colorId = blobs.get(index).colorId;
          blobs.get(index).colorId = colorId;
          found = true;
          break;
        }
      }
      if (!found) {
        usedColors[blobs.get(index).colorId] = false;
        blobs.get(index).colorId = colorId;
        usedColors[colorId] = true;
      }
      break;
    default:
      print("no match");
      break;
  };
}
/** THIS IS NEEDED FOR APP AND NEW **/

//////// setupend
 
public void draw(){
  
  background(backgroundcolor[globalMode]);
  
  //remove inactive blobs
  for (int i = blobs.size() - 1; i >= 0; i--) {
    Blob thisBlob = blobs.get(i);
    if ((frameCount-thisBlob.lastUpdate) > BLOB_KILL_FRAMES) {
      println("removing");
      usedColors[blobs.get(i).colorId] = false;    // removing color
      blobs.remove(i);
      println(blobs.toString());
      JSONObject ret = new JSONObject();
      ret.setString("type", "remove");
      ret.setInt("index", i);
      ws.sendMessage(ret.toString());
    }
  }
 
  // update colors for background hex grid every #HEX_GRID_UPDATE_FRAME frames
  if (frameCount%HEX_GRID_UPDATE_FRAMES == 0){
    g.updateColors();
  }
 
  //draw hex grid
  g.draw();
  
  //update blobs
  for (int x = 0; x < blobs.size(); x++) {
    Blob thisBlob = blobs.get(x);
    thisBlob.update();
    if (debug)thisBlob.display(); //show blobs if debugging is on
  } 
  //image(movie, 0, 0);
  movie.read();
  movie.loadPixels();
}


// osc event listener and sender, listens for blob messages, and relays messages to sonification
String[] blobNames = {"zero","one","two","three","four","five","six","seven","unknown"};

public void oscEvent(OscMessage theOscMessage) {
  
   for (int i = 0; i <= 9; i++) {
      if(theOscMessage.checkAddrPattern("/ableton"+str(i))==true){
        abletonvolume[i] = theOscMessage.get(0).floatValue();
      }
    }
    
    if(theOscMessage.checkAddrPattern("/blob")==true) {
   
      int id = (int)theOscMessage.get(0).floatValue();
      boolean foundBlob = false;
      
      for (Blob thisBlob : blobs) {
        if (id == thisBlob.id){
          thisBlob.targetx = theOscMessage.get(1).floatValue();
          thisBlob.targety = theOscMessage.get(2).floatValue();
          thisBlob.lastUpdate = frameCount;
          foundBlob = true;
        }
      }
      
      if (!foundBlob && blobs.size() < 8) { // and less than 9 blobs
        int colorId = 0;
        for (int i = 0; i < 8; i++) {
          if (!usedColors[i]) {
            colorId = i;
            usedColors[i] = true;
            break;
          }
        }
        Blob newBlob = new Blob(id, colorId, theOscMessage.get(1).floatValue(),theOscMessage.get(2).floatValue());
        blobs.add(newBlob);
        JSONObject ret = new JSONObject();
        JSONObject data = new JSONObject();
        ret.setString("type", "add");
        data.setInt("index", blobs.size() - 1);
        data.setInt("colorId", colorId);
        ret.setJSONObject("data", data);
        ws.sendMessage(ret.toString());
      }
      
      //relay message to sonification
      OscMessage myMessage;
      if (id < 8) myMessage = new OscMessage("/"+blobNames[id]);
      else myMessage = new OscMessage("/"+blobNames[8]);
      for (int x = 1; x <13; x++){myMessage.add(theOscMessage.get(x).floatValue());} // append twelve blob variables
      oscP5.send(myMessage, myRemoteLocation); 
      
  }
}

/** THIS IS NEEDED FOR APP AND NEW **/
public void keyPressed() {
  updateTheme(key);
}
/** THIS IS NEEDED FOR APP AND NEW **/


/** THIS IS NEEDED FOR APP AND NEW **/
/** THIS IS THE OLD KEYPRESSED FUNCTION, ALL YOU NEED TO CHANGE IS THE NAME TO 'UPDATETHEME' AND THEN THE CHAR 'KEY' AS A PARAMETER **/
public void updateTheme(char key) {
  // draw actual blob
  if (key == 'd') {debug = ! debug;} 
 
    // draw actual blob
  if (key == '1' || key == '2') {
      movie = new Movie(this, "movie_"+ str(key) + ".mov");
      movie.loop();
  } 
  
  g.keyPressed(key);
  
  
  // Key press for shape change
  if (key == 'a') {
    globalMode = 0;
    OscMessage ExitMessage = new OscMessage("/earth");
    oscP5.send(ExitMessage, myRemoteLocation);
  } 
  if (key == 's') { 
    globalMode = 1;
    OscMessage ExitMessage = new OscMessage("/water");
    oscP5.send(ExitMessage, myRemoteLocation);
  } 
  if (key == 'd') { 
    globalMode = 2;
    OscMessage ExitMessage = new OscMessage("/fire");
    oscP5.send(ExitMessage, myRemoteLocation);
  } 
  if (key == 'f') { 
    globalMode = 3;
    OscMessage ExitMessage = new OscMessage("/air");
    oscP5.send(ExitMessage, myRemoteLocation);
  }
  
}

//this is only called if you hit ESC key to close the sketch
//created to kill all sound on Ableton when the sketch is closed
public void exit() {
  OscMessage ExitMessage = new OscMessage("/end");
  oscP5.send(ExitMessage, myRemoteLocation);
  super.exit();
}

//new movie functions

public void movieEvent(Movie movie) {
  movie.read();  
}

public float returnMovieBrightness(float x,float y){
  
  float xPercent = constrain(x, 0, width)/width;
  float yPercent = constrain(y, 0, height)/height;
  int pixelColor = movie.get(PApplet.parseInt(xPercent*movie.width),PApplet.parseInt(yPercent*movie.height));
  return brightness(pixelColor)/255;
}

public int returnMovieColor(float x,float y){
  
  float xPercent = constrain(x, 0, width)/width;
  float yPercent = constrain(y, 0, height)/height;
  int pixelColor = movie.get(PApplet.parseInt(xPercent*movie.width),PApplet.parseInt(yPercent*movie.height));
  return pixelColor;
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
int[][] blobColorWheel = {
                          {0xffe88f71, 0xffedbb7b, 0xffd6cb82, 0xff9fad66, 0xff96b592, 0xff82918b, 0xff8d818e, 0xffa88a97}, //earth
                          {0xfffed9b5, 0xffc3c0ac, 0xfff4b7a4, 0xffb2cbad, 0xffc9c0cc, 0xffe3d1d3, 0xffcde3eb, 0xffe5eebf}, //water
                          {0xff861619, 0xffff9120, 0xfffec70b, 0xffe88c4f, 0xffffc63f, 0xffe06226, 0xffa61e22, 0xfff05234}, //fire
                          {0xfff5de6a, 0xffb7c045, 0xfffbb278, 0xffafa1ac, 0xff7c9c6e, 0xff93ba63, 0xfff4ae98, 0xffd0df61}  //air
                          }; 
class Blob {
   
  int     id;
  int     colorId;
  float   targetx, targety;         // received OSC position
  float   x, y;                     // X-coordinate, y-coordinate - position
  float   px, py;                   // X-coordinate, y-coordinate previous update  
  int     age = 0;                  // # frames alive
  int     lastUpdate = frameCount;  // last frame blob was updated

  // Constructor
  Blob(int i, int colorId, float posx, float posy) {
    
    id = i;
    this.colorId = colorId;
    x = px = targetx = posx;
    y = py = targety = posy;
  }

  public void update() {
    
    px = x; py = y;
    x = (0.75f * x ) + (0.25f * targetx); y = (0.75f * y ) + (0.25f * targety);
    
    age++;
  }
  
  public void display() {
    
    pushStyle();
    stroke(255); fill(255); strokeWeight(10);
    ellipse(x * width, y * height, 10, 10);
    popStyle();
  }
}
class HexGrid {
  Hexagon[][] grid; //Our 2D storage array of Hexagon Objects
  int cols, rows;
  float radius;
 
  //Class Constructor required the grid size and cell radius
  HexGrid(int nocol, int norow, int rad)
  {
    //Define our grid parameters
    cols = nocol;
    rows = norow;
    radius = PApplet.parseFloat(rad);

    //2D Matrix of Hexagon Objects
    grid=new Hexagon[cols][rows];
 
    //Lets assign the inital x,y coordinates outside the loop
    int x = PApplet.parseInt(sqrt(3)*radius);
    int y = PApplet.parseInt(radius);
 
    //These two nested for loops will cycle all the columns in each row
    //and calculate the coordinates for the hexagon cells, generating the
    //class object and storing it in the 2D array.
    for( int i=0; i < rows ; i++ ){
      for( int j=0; j < cols; j++ )
      {
        //int temp = int(random(hexColorWheel1.length));
        int temp = PApplet.parseInt(random(hexColorWheel[globalMode].length));
        grid[j][i] = new Hexagon( x, y, radius, hexColorWheel[globalMode][temp]); 
        x+=radius*sqrt(3); //Calculate the x offset for the next column
      }
      y+=(radius*3)/2; //Calculate the y offset for the next row
      if((i+1)%2==0)
        x=PApplet.parseInt(sqrt(3)*radius);
      else
        x=PApplet.parseInt(radius*sqrt(3)/2);
    }
  }
 
  //This function will redraw the entire table by calling the draw on each
  //hexagonal cell object
  public void draw(){
    
    for( int i=0; i < rows ; i++ )for( int j=0; j < cols; j++) grid[j][i].draw();
  }
  
  public void updateColors(){
    
    for( int i=0; i < rows ; i++ )for( int j=0; j < cols; j++) grid[j][i].updateColorTargetRandom();
  }
 
  //This function will return the hexagonal cell object given its column and row
  public Hexagon getHex(int col, int row){
  
    return grid[col][row];
  }
  
  public void keyPressed(int key){
    for( int i=0; i < rows ; i++ )for( int j=0; j < cols; j++) grid[j][i].keyPressed(key);
  }
}
int[][] hexColorWheel = {
                          {0xfff9ddc7, 0xffe2cab7, 0xffdbc3af, 0xffd1b9a5, 0xffc4ac99, 0xffc4a893}, //Earth
                          {0xff64b8df, 0xff90a4c2, 0xff9bc3cb, 0xffb4cde3, 0xff009cbb, 0xff00a79d}, //Water
                          {0xff4b3513, 0xff726658, 0xffc2b59b, 0xff58595b, 0xffa97c50, 0xff9b8579}, //Fire
                          {0xffb4bfb3, 0xffc6d3e4, 0xffaab4c0, 0xffe4dde6, 0xffbbcaae, 0xffb7d1cd}, //Air
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
 int     hexColor;
 int     hexColorTarget;
 
 // half-hex variables
 PShape    halfHex;
 int       MAX_HALFHEX_AGE = 22; //15//50 # frames that half-hexs live
 PShape[]  halfHexArray;         // stores pre-created half hexagons
 boolean   bHalfHex = false;    
 int       whichHalfHex;
 int     halfHexColor;
 int       halfHexAge = 0;
 
 PShape    blobHex;
 int     blobHexColor;
 boolean   bBlobHexFill = false;

//Our Constructor takes the center coordinates along with a value for radius
 Hexagon( float x, float y, float r, int c) {
   centx = x;
   centy = y;
   radius = r;
   hexColor = hexColorTarget = blobHexColor = c;
   
  setupShape(TWO_PI / 3);
 }
 
//The draw function will define the fill values and calculate the coordinates
 public void draw() {
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
    int tempColor = color(red(halfHexColor),green(halfHexColor),blue(halfHexColor),255*(1-((float)halfHexAge/MAX_HALFHEX_AGE))); //fade out halfhex
    halfHex.setFill(tempColor); halfHex.setStroke(tempColor);
    shape(halfHex);
    // flips random active half hexs 
    if (random(1)<0.05f){whichHalfHex = (int)random(0,5); halfHex = halfHexArray[whichHalfHex];}
    // ages halfhex and turns off if too old
    halfHexAge++;
    if (halfHexAge >= MAX_HALFHEX_AGE){halfHexAge = 0; bHalfHex = false;}
  }
  
  //draws blob hex (if present)
  if(bBlobHexFill) {blobHex.setFill(blobHexColor); blobHex.setStroke(blobHexColor);shape(blobHex);}
   
  // turns on random half hexs around screen 
  if (random(1)<.05f && !bHalfHex){
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
      
      int tempColor;
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


public void updateColor(int c) {hexColor = c;}
public void updateColorTarget(int c) {hexColorTarget = c;}
public void updateColorTargetRandom() {
      //int temp = int(random(hexColorWheel1.length)); hexColorTarget = hexColorWheel1[temp];
      int temp = PApplet.parseInt(random(hexColorWheel[globalMode].length));
      hexColorTarget = hexColorWheel[globalMode][temp];
}

//The following are all simply utility functions for setting parameters
 public float centx() {return centx;}
 public float centy() {return centy;}
 public int getColor() {return hexColor;}
 public void setNoFill(boolean yesno) {bFill = yesno;}
 
 public void setFillColor(int col) {
   bFill = true;
   hexColor = col;
 }
 
 
  public void keyPressed(int key) {
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
 
 public void setupShape(float newAngle){
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
  public void settings() {  size(1280, 720);  smooth(); }
  static public void main(String[] passedArgs) {
    String[] appletArgs = new String[] { "AV_Instrument_Global_Mode_Switch" };
    if (passedArgs != null) {
      PApplet.main(concat(appletArgs, passedArgs));
    } else {
      PApplet.main(appletArgs);
    }
  }
}
