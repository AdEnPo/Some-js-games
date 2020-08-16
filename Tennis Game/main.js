var canvas;
var canvasContext;
var ballX = 300, ballY = 200;
var ballSpeedX = 10, ballSpeedY = 4;

var player1Score = 0, player2Score = 0;
const WINNING_SCORE = 3;

var showingWinScreen = false;

var paddle1Y = 250;
var paddle2Y = 250;
const PADDLE_HEIGHT = 100;
const PADDLE_THICKNESS = 10;

window.onload = function () {
	canvas= document.getElementById('gameCanvas');
	canvasContext = canvas.getContext('2d');
	//Create animation of frames
	var framesPerSecond = 30;
	setInterval(() => {
		moveEverything();
		drawEverything();
	}, 1000/framesPerSecond);

	canvas.addEventListener('mousedown',handleMouseClick);

	canvas.addEventListener('mousemove', (evt)=>{
		var mousePos = calculateMousePosition(evt);
		
		paddle1Y = mousePos.y-(PADDLE_HEIGHT/2);
		/*if (ballX <= canvas.width/2) {
			
		}else{
			paddle2Y = mousePos.y-(PADDLE_HEIGHT/2);
		}*/
		
	});

}

function handleMouseClick(evt) {
	if (showingWinScreen) {
		player1Score = 0; 
		player2Score = 0;
		showingWinScreen = false;
	} else {
		
	}
}

//Tracking the mouse movements
function calculateMousePosition(evt) {
	var rect = canvas.getBoundingClientRect();
	var root = document.documentElement;
	var mouseX = evt.clientX - rect.left - root.scrollLeft;
	var mouseY = evt.clientY - rect.top - root.scrollTop;
	//return as an object
	return{
		x: mouseX,
		y: mouseY
	};
}

function ballReset() {
	if (player1Score >= WINNING_SCORE || player2Score >= WINNING_SCORE) {
		showingWinScreen = true;
	}

	ballSpeedX = -ballSpeedX;
	ballX = canvas.width/2;
	ballY = canvas.height/2;
	
}

function computerMovement() {
	var paddle2YCenter = paddle2Y+(PADDLE_HEIGHT/2);

	if (paddle2YCenter< ballY - 35) {
		paddle2Y += 6;		
	} else if(paddle2YCenter > ballY + 35){
		paddle2Y -= 6;
		
	}
}

function moveEverything() {
	if (showingWinScreen) {
		return;
	}

	computerMovement();

	ballX += ballSpeedX;
	ballY += ballSpeedY;

	if (ballX < 0) {
		if (ballY > paddle1Y && ballY < paddle1Y+PADDLE_HEIGHT) {
			ballSpeedX = -ballSpeedX;
				
			//ball's actions where to hit the paddle2
			var deltaY = ballY-(paddle1Y+PADDLE_HEIGHT/2);
			ballSpeedY = deltaY * 0.35;
		}else{
			player2Score++; //must be before reset because first we need to check the score
			ballReset();
		}
		
	}
	
	if (ballX > canvas.width) {
		if (ballY > paddle2Y && ballY < paddle2Y+PADDLE_HEIGHT) {
			ballSpeedX = -ballSpeedX;
			
			//ball's actions where to hit the paddle1
			var deltaY = ballY-(paddle2Y+PADDLE_HEIGHT/2);
			ballSpeedY = deltaY * 0.35;
		} else {
			player1Score++; //must be before reset because first we need to check the score
			ballReset();
		}
	}
	if (ballY > canvas.height) {
		ballSpeedY = -ballSpeedY;
	}
	if (ballY < 0) {
		ballSpeedY = -ballSpeedY;
	}
}

function drawEverything() {	
	//Creating the gamplay area
	colorRect(0,0,canvas.width,canvas.height,'black');
	
	if (showingWinScreen) {
		canvasContext.fillStyle = "white";
		if (player1Score >= WINNING_SCORE){
			canvasContext.fillText("Left Player Won..", 350, 200);
		} 
		else if( player2Score >= WINNING_SCORE) {
			canvasContext.fillText("Right Player Won..", 350, 200);
		}

		canvasContext.fillText("..Click To Continue..", 350, 500);

		return;
	}

	//Net
	drawNet();

	//Ball
	colorCircle(ballX, ballY, 10, 'white');
	
	//Left Padel
	colorRect(0, paddle1Y, PADDLE_THICKNESS, PADDLE_HEIGHT, 'white');
	
	//Right Padel
	colorRect(canvas.width-PADDLE_THICKNESS, paddle2Y, PADDLE_THICKNESS, PADDLE_HEIGHT, 'white');

	//ScoreBoard
	canvasContext.fillText(player1Score, 100, 100);
	canvasContext.fillText(player2Score, canvas.width-100, 100);

}
//draw the rects in one line
function colorRect(leftX,topY,width,height, drawColor) {
	canvasContext.fillStyle = drawColor;
	canvasContext.fillRect(leftX,topY,width,height);
}

//draw the circles
function colorCircle(centerX,centerY, radius, drawColor) {
	canvasContext.fillStyle = drawColor;
	canvasContext.beginPath();
	canvasContext.arc(centerX, centerY, radius, 0, Math.PI*2, true);
	canvasContext.fill();
}

//draw net
function drawNet() {
	for (var i = 0; i < canvas.height; i+=40) {
		colorRect(canvas.width/2-1, i, 2, 20, 'white');
	}
}