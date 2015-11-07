// global vars
var boxes = []; // empty array for boxes to be stored
var words = []; // empty array to hold words
var sorted = []; // empty array to sorted 
var hash = []; // empty array to hold hashMap

var index = 0; // For counting the words
var a = .75;

var sizes = [];
var txt = [];

// boolean to tell if txt is loaded 
loaded = false;


function setup() {
  createCanvas(windowWidth, windowHeight);
  background(60, 180, 255);
  
  // create a new text object
  // txtObj = new TextObject();
  
  words = loadStrings('data/test2.txt', processData);
  
}


function draw() {
  
  // background(200, 180, 250, index/150);
  // if all the string data loaded
  if (loaded) {
    
    // found a box?
    var found = false;
    
    // set a limit to looking so it doesn't break
    var countLimit = 0;
    
    
    // keep looking until one is found
    while (!found){
      // make a new box
     
     
      // console.log(index);
      var b = new Box(txt[index], sizes[index], a);
       // Does it fit on the screen?
      if (b.fits(boxes)) {
        // Add it to the list so we can track it later
        boxes.push(b);
        found = true;
      } else {
        // If not kill that DIV
        b.kill();
      }
      countLimit++;
      if (countLimit >= 10){
        break;
        // noLoop();
      }
    }

    if (found) {
      // console.log('Found! On ' + index + ' out of ' + keys.length);
      index++;
      a = a -.01;

    }
    if (index == txt.length){
      index = 0;
      noLoop();
    }
    if(a < .25){
      a = 1;
    }
  }
}

// call back function to process the data
function processData(){
  // show what's in the array now
  console.log(words);
  // loop over the array
  for (var i in words) {
    // first variable stands for strin key
    // second one for the associated value
    console.log(i + ': ' + words[i]);
  }
  // let's compile the hash map
  for (i in words) {
    // first variable stands for strin key
    // second one for the associated value
    // var console.log(i + ': ' + arr[i]);
    var li = words[i].split(" ");
    for (var k in li) {
      var clean = li[k].replace(/[.,-\/#!$%\^&\*;:{}=\-_`~()]/g, "");

      if (hash[clean] >= 1)
        hash[clean] += 1;
      else
        hash[clean] = 1;
    }
  }

  console.log("== HASH MAP ==============");
  // show the hash map
  for (i in hash) {
    // console.log(i + ': ' + hash[i]);
  }

  console.log("== HASH SORTED ==============");

  // add all the members 
  for (var key in hash)
    sorted.push([key, hash[key]]);

  // sort the array
  sorted.sort(function(a, b) {
    a = a[1];
    b = b[1];

    return a < b ? 1 : (a > b ? -1 : 0);
  });

  // Sort JavaScript Array
  for (i = 0; i < sorted.length; i++){
    // console.log(sorted[i][0] + ': ' + sorted[i][1]);
    sizes.push(sorted[i][1]);
    txt.push(sorted[i][0]);
  }
  
  loaded = true;
}

// function to create a div using words and size from external input
function Box(word, size, alpha) {
  
  // set up variables for creating box
  
  // place randomly on the x and y
  this.x = random(windowWidth);
  this.y = random(windowHeight);
  
  if (size < 50){
    size = size + 5;
  }
  // if (size > 50){
  //   size = size + 3;
  // }
  
  // create a div to know how big the text is
  this.div = createDiv(word);
  this.div.style('font-size', size + 'px');
  this.div.style('color: rgba(250, 250, 250,'+ a +')');
  console.log(a);
  this.div.position(this.x, this.y);

  this.rotated = false;
  this.w = this.div.elt.offsetWidth;
  this.h = this.div.elt.offsetHeight;
  if (random(1) < 0.5) {
    this.rotated = true;
    this.w = this.div.elt.offsetHeight;
    this.h = this.div.elt.offsetWidth;
    //css transform
    this.div.style('transform-origin','left top');
    this.div.style('transform','translate(' + this.w + 'px) rotate(90deg)');

    this.div.style('text-align','center');
    this.div.style('line-height',this.size+'px');
  }

  // a function to remove the div
  this.kill = function() {
    this.div.remove();
  }
  
  // tell me if it is off screen
  this.offscreen = function(){
    var border = 2;
    if (this.x + this.w + border > width) return true;
    if (this.y + this.h + border > height) return true;
    // or
    return false;
  }
  
  // tell me if it overlaps
  this.overlaps = function(other){
  if (this.x > other.x + other.w) return false;
  if (this.x + this.w < other.x) return false;
  if (this.y > other.y + other.h) return false;
  if (this.y + this.h < other.y) return false;
  // and if none of these happen
  return true;
  }
  
  // let me know if this fits n the screen and does not overlap with others
  this.fits = function(boxes){
    if (this.offscreen()){
      return false;
    }
    
    for (var i in boxes){
      if (this.overlaps(boxes[i])){
        return false;
      }
    }
    
    // if it doesnt go offscreen and doesnt overlap...
    return true;
  }
  
}