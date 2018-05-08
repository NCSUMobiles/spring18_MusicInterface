color[][] blobColorWheel = {
                          {#e88f71, #edbb7b, #d6cb82, #9fad66, #96b592, #82918b, #8d818e, #a88a97}, //earth
                          {#fed9b5, #c3c0ac, #f4b7a4, #b2cbad, #c9c0cc, #e3d1d3, #cde3eb, #e5eebf}, //water
                          {#861619, #ff9120, #fec70b, #e88c4f, #ffc63f, #e06226, #a61e22, #f05234}, //fire
                          {#f5de6a, #b7c045, #fbb278, #afa1ac, #7c9c6e, #93ba63, #f4ae98, #d0df61}  //air
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

  void update() {
    
    px = x; py = y;
    x = (0.75 * x ) + (0.25 * targetx); y = (0.75 * y ) + (0.25 * targety);
    
    age++;
  }
  
  void display() {
    
    pushStyle();
    stroke(255); fill(255); strokeWeight(10);
    ellipse(x * width, y * height, 10, 10);
    popStyle();
  }
}
