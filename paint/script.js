var canvas;
var ctx;
var circles = [];
// Connection

window.onload = function(){
	canvas = document.getElementById('drowingCanvas');
	ctx = canvas.getContext('2d');

	/*canvas.onmousemove = draw;
	canvas.onmousedown = startDrawing;
	canvas.onmouseup = stopDrawing;
	canvas.onmouseout = stopDrawing;*/

	//canvas.onclick = canvasClick;

	 canvas.onmousedown = canvasClick;   
	 canvas.onmouseup = stopDragging;
	 canvas.onmouseout = stopDragging;
	 canvas.onmousemove = dragCircle;

	 canvas.addEventListener('mousemove',draw);
	 canvas.addEventListener('mousedown',startDrawing);
	 canvas.addEventListener('mouseup',stopDrawing);
	 canvas.addEventListener('mouseout',stopDrawing);
}

var previousColorElement;

function changeColor(color, imgElement){
	ctx.strokeStyle = color;
	imgElement.className = "Selected";

	if(previousColorElement != null) previousColorElement.className = "";
	previousColorElement = imgElement;
}

var previousThicknessElement;

function changeThickness(thickness, thicknessElement){
	ctx.lineWidth = thickness;
	ctx.lineCap = "round";
	thicknessElement.className = "Selected";

	if(previousThicknessElement != null)previousThicknessElement.className = "";
	previousThicknessElement = thicknessElement;
}

function startDrawing(e){
	isDrowing = true;
	ctx.beginPath();
	ctx.moveTo(e.pageX - canvas.offsetLeft, e.pageY - canvas.offsetTop);
}
function draw(e){
	if(isDrowing == true){
		var x = e.pageX - canvas.offsetLeft;
		var y = e.pageY - canvas.offsetTop;
		ctx.lineTo(x, y);
		ctx.stroke();
	}
}
function stopDrawing(){
	isDrowing = false;
}

function clearCanvas(){
	circles = [];
	ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function saveCanvas(){
	var savedImg = document.querySelector('#savedImageCopy');
	savedImg.src = canvas.toDataURL();

	var showdiv = document.querySelector('#savedCopyContainer');
	showdiv.style.display = "block";
}

// Circles


function Circle(x, y, radius, color) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.isSelected = false;
}

function addRandomCircle() {
    // Устанавливаем произвольный размер и позицию круга
    var radius = randomFromTo(10, 60);
    var x = randomFromTo(0, canvas.width);
    var y = randomFromTo(0, canvas.height);

    // Окрашиваем круг произвольным цветом
    var colors = ["green", "blue", "red", "yellow", "magenta", "orange", "brown", "purple", "pink"];
    var color = colors[randomFromTo(0, 8)];

    // Создаем новый круг
    var circle = new Circle(x, y, radius, color);

    // Сохраняем его в массиве
    circles.push(circle);

    // Обновляем отображение круга
    drawCircles();
}

function randomFromTo(from, to) {
  return Math.floor(Math.random() * (to - from + 1) + from);
}

function drawCircles() {
    // Очистить холст
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Перебираем все круги
    for(var i=0; i<circles.length; i++) {
        var circle = circles[i];

        // Рисуем текущий круг
        ctx.globalAlpha = 0.85;
        ctx.beginPath();
        ctx.arc(circle.x, circle.y, circle.radius, 0, Math.PI*2);
        ctx.fillStyle = circle.color;
        ctx.strokeStyle = "black";

        // Выделяем выбранный круг рамкой (потребуется позже)
        if (circle.isSelected) {
            ctx.lineWidth = 5;
        }
        else {
            ctx.lineWidth = 1;
        }
        ctx.fill();
        ctx.stroke(); 
    }
}

var previousSelectedCircle;

function canvasClick(e) {
  // Получаем координаты точки холста, в которой щелкнули
  var clickX = e.pageX - canvas.offsetLeft;
  var clickY = e.pageY - canvas.offsetTop;

  // Проверяем, щелкнули ли no кругу
  for(var i=circles.length-1; i>=0; i--) {
    var circle = circles[i];

    // С помощью теоремы Пифагора вычисляем расстояние от 
	// точки, в которой щелкнули, до центра текущего круга
    var distanceFromCenter = Math.sqrt(Math.pow(circle.x - clickX, 2) + Math.pow(circle.y - clickY, 2))
	
	// Определяем, находится ли точка, в которой щелкнули, в данном круге
    if (distanceFromCenter <= circle.radius) {
	  // Сбрасываем предыдущий выбранный круг	
      if (previousSelectedCircle != null) previousSelectedCircle.isSelected = false;
      previousSelectedCircle = circle;

      // Устанавливаем новый выбранный круг и обновляем холст
      circle.isSelected = true;

      drawCircles();
	  isDragging = true;
	  // Прекращаем проверку
      return;
    }
  }
} 
var isDragging = false;

function stopDragging() {
  isDragging = false;
}

function dragCircle(e) {
  // Проверка возможности перетаскивания
  if (isDragging == true) {
    // Проверка попадания
    if (previousSelectedCircle != null) {
      // Сохраняем позицию мыши
      var x = e.pageX - canvas.offsetLeft;
      var y = e.pageY - canvas.offsetTop;

      // Перемещаем круг в новую позицию
      previousSelectedCircle.x = x;
      previousSelectedCircle.y = y;

      // Обновляем холст
      drawCircles();
    }
  }
}