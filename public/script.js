var socket;
socket = io.connect();//socket = io.connect('http://localhost:3000/');
socket.on('start', startDrawing);
socket.on('paint', paintDrawing);

function startDrawing(data){
  if(data.draw == 'start'){
    ctx.beginPath();
    ctx.moveTo(data.x, data.y);
  }
}

function paintDrawing(data){
  if(data.draw == 'paint'){
    ctx.lineTo(data.x, data.y);
    ctx.stroke();
  }
}



var cursor = document.getElementById("cursor");
var canvas = document.getElementById('myCanvas');
var ctx = canvas.getContext('2d');
var operation = "destination-out"
canvas.width = parseInt(500);
canvas.height = parseInt(500);
ctx.fillStyle = 'rgb(139,69,19)';
ctx.fillRect(0, 0, canvas.width, canvas.height);
var mouse = {x: 0, y: 0};

canvas.addEventListener('mousemove', function(e) {
  var x = e.pageX;
  var y = e.pageY;
  mouse.x = x - this.offsetLeft-25;
  mouse.y = y- this.offsetTop-25;
  cursor.style.top = y -25+ "px";
  cursor.style.left = x - 25 + "px";
}, false);


ctx.globalCompositeOperation = operation;  
ctx.lineWidth = 50;
ctx.lineJoin = 'round';
ctx.lineCap = 'round';
ctx.strokeStyle = 'rgb(139,69,19)';
 
canvas.addEventListener("mouseleave", function(e){
  cursor.style.visibility="hidden";
});
canvas.addEventListener("mouseenter", function(e){
  cursor.style.visibility="visible";
});

canvas.addEventListener('mousedown', function(e) {
    ctx.beginPath();
    ctx.moveTo(mouse.x, mouse.y);
    canvas.addEventListener('mousemove', onPaint, false);
    var data = {
      x: mouse.x,
      y: mouse.y,
      draw: 'start'
    };
    socket.emit('start', data);
}, false);
 
window.addEventListener('mouseup', function(event){
    var data = {
      x: mouse.x,
      y: mouse.y,
      draw: 'stop'
    };
    socket.emit('paint', data);
    socket.emit('start', data);
  canvas.removeEventListener('mousemove', onPaint, false);
  }, false);
 
var onPaint = function() {
    var data = {
      x: mouse.x,
      y: mouse.y,
      draw: 'paint'
    };
    socket.emit('paint', data);
    ctx.lineTo(mouse.x, mouse.y);
    ctx.stroke();
};



function changeBackground() {

    var input = document.getElementById("userInput").value;
    //we could get the desired size here from a width and height form
    canvas.width=500;
    canvas.style.backgroundSize = "500px 500px";
    ctx.fillStyle = 'rgb(139,69,19)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.globalCompositeOperation = operation;  
    ctx.lineWidth = 50;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.strokeStyle = 'rgb(139,69,19)';
    document.getElementById("myCanvas").style.backgroundImage = "url("+input+")";
    
    ctx.fillRect(0, 0, canvas.width, canvas.height);

}

function selectTool(){
  operation = document.querySelector('input[name="drawTool"]:checked').value;
  ctx.globalCompositeOperation = operation;
  if(operation=='source-over'){
    cursor.style.backgroundColor = "purple";
  }else{
    cursor.style.backgroundColor = "skyblue";
  }
}