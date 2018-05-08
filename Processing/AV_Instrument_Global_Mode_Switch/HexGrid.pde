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
    radius = float(rad);

    //2D Matrix of Hexagon Objects
    grid=new Hexagon[cols][rows];
 
    //Lets assign the inital x,y coordinates outside the loop
    int x = int(sqrt(3)*radius);
    int y = int(radius);
 
    //These two nested for loops will cycle all the columns in each row
    //and calculate the coordinates for the hexagon cells, generating the
    //class object and storing it in the 2D array.
    for( int i=0; i < rows ; i++ ){
      for( int j=0; j < cols; j++ )
      {
        //int temp = int(random(hexColorWheel1.length));
        int temp = int(random(hexColorWheel[globalMode].length));
        grid[j][i] = new Hexagon( x, y, radius, hexColorWheel[globalMode][temp]); 
        x+=radius*sqrt(3); //Calculate the x offset for the next column
      }
      y+=(radius*3)/2; //Calculate the y offset for the next row
      if((i+1)%2==0)
        x=int(sqrt(3)*radius);
      else
        x=int(radius*sqrt(3)/2);
    }
  }
 
  //This function will redraw the entire table by calling the draw on each
  //hexagonal cell object
  void draw(){
    
    for( int i=0; i < rows ; i++ )for( int j=0; j < cols; j++) grid[j][i].draw();
  }
  
  void updateColors(){
    
    for( int i=0; i < rows ; i++ )for( int j=0; j < cols; j++) grid[j][i].updateColorTargetRandom();
  }
 
  //This function will return the hexagonal cell object given its column and row
  Hexagon getHex(int col, int row){
  
    return grid[col][row];
  }
  
  void keyPressed(int key){
    for( int i=0; i < rows ; i++ )for( int j=0; j < cols; j++) grid[j][i].keyPressed(key);
  }
}