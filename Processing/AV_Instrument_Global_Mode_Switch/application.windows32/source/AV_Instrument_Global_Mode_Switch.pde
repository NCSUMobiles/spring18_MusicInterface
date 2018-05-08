import processing.video.*;
import netP5.*;
import oscP5.*;
import java.util.Arrays;
/** THIS IS NEEDED FOR APP AND NEW **/
import websockets.*;
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

color [] backgroundcolor = {#c4a893,#b4cde3,#58595b,#e4dde6};
//EARTH BACKGROUND COLOR #c4a893
//WATER BACKGROUND COLOR #b4cde3
//FIRE BACKGROUND COLOR #58595b
//AIR BACKGROUND COLOR #e4dde6

//////// variables end

void setup(){
  
  size(1280, 720);
  smooth();
  
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
  nwide = int(width/(sqrt(3)*rad))+1;
  g = new HexGrid(nwide, nhigh, rad);
  
  abletonvolume =new float[9];
  for (int i = 0; i >= 9; i++) {abletonvolume[i] = 0.0;}

  movie = new Movie(this, "movie_"+ str(INITIAL_VIDEO) + ".mov");
  movie.loop(); 
}

/** THIS IS NEEDED FOR APP AND NEW **/
void webSocketServerEvent(String msg) {
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
 
void draw(){
  
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

void oscEvent(OscMessage theOscMessage) {
  
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
void keyPressed() {
  updateTheme(key);
}
/** THIS IS NEEDED FOR APP AND NEW **/


/** THIS IS NEEDED FOR APP AND NEW **/
/** THIS IS THE OLD KEYPRESSED FUNCTION, ALL YOU NEED TO CHANGE IS THE NAME TO 'UPDATETHEME' AND THEN THE CHAR 'KEY' AS A PARAMETER **/
void updateTheme(char key) {
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
void exit() {
  OscMessage ExitMessage = new OscMessage("/end");
  oscP5.send(ExitMessage, myRemoteLocation);
  super.exit();
}

//new movie functions

void movieEvent(Movie movie) {
  movie.read();  
}

float returnMovieBrightness(float x,float y){
  
  float xPercent = constrain(x, 0, width)/width;
  float yPercent = constrain(y, 0, height)/height;
  color pixelColor = movie.get(int(xPercent*movie.width),int(yPercent*movie.height));
  return brightness(pixelColor)/255;
}

color returnMovieColor(float x,float y){
  
  float xPercent = constrain(x, 0, width)/width;
  float yPercent = constrain(y, 0, height)/height;
  color pixelColor = movie.get(int(xPercent*movie.width),int(yPercent*movie.height));
  return pixelColor;
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
