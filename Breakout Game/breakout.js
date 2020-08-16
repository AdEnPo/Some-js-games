var canvas = document.getElementById('breakOut');
var ctx    = canvas.getContext('2d');


var ballRadius = 10;
var ballColor  = '#0095DD';

var ballX  = canvas.width/2;
var ballY  = canvas.height - 40;
var speedX = 4;
var speedY = -4;

var paddleHeight = 10;
var paddleWidth  = 75;
var paddleX      = (canvas.width - paddleWidth) / 2;
var rightPressed = false;
var leftPressed  = false;
var paddleColor  = "#0095DD";
var paddleBottomMargin = 20;

var brickRowCount    = 8;
var brickColumnCount = 6;
var brickWidth       = 70;
var brickHeight      = 10;
var brickPadding     = 3;
var brickOffsetTop   = 30;
var brickOffsetLeft  = 30;
var brickColor       = getRandomColor();

var starterBricks = 0;
var score = 0;
var lives = 3;
var CountDown = 3;

var pressedPlay = false;

var bricks = [];
for (var c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for (var r = 0; r < brickRowCount; r++) {
        bricks[c][r] = {x: -brickWidth, y: -brickHeight, status: 1};
    }
}

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

function keyDownHandler(evt) {
    if (evt.key == "Right" || evt.key == "ArrowRight") {
        rightPressed = true;
    }
    else if (evt.key == "Left" || evt.key == "ArrowLeft") {
        leftPressed = true;
    }
}
function keyUpHandler(evt) {
    if (evt.key == "Right" || evt.key == "ArrowRight") {
        rightPressed = false;
    }
    else if (evt.key == "Left" || evt.key == "ArrowLeft") {
        leftPressed = false;
    }
}

function collisionDetection(){
    for (var c = 0; c < brickColumnCount; c++) {
        for (var r = 0; r < brickRowCount; r++) {
            var b = bricks[c][r];
            if (b.status == 1) {
                if (ballX + ballRadius > b.x && ballX - ballRadius < b.x + brickWidth &&//right and left sides 
                    ballY + ballRadius > b.y && ballY - ballRadius < b.y + brickHeight/*top and bottom*/ ) {
                    
                    speedY = -speedY;
                    b.status = 0;  
                    score++;
                    starterBricks--;
                    if (starterBricks == 0) {
                        //console.log(starterBricks);
                        starterBricks = 0;
                        //alert("You Win..");
                        //document.location.reload();
                    }
                }
            }
            
        }
        
    }
}

function drawBall() {
    ctx.beginPath();
    ctx.arc(ballX, ballY, ballRadius, 0, Math.PI*2);
    ctx.fillStyle = ballColor;
    ctx.fill();
    ctx.closePath();
}

function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height-paddleHeight-paddleBottomMargin, paddleWidth, paddleHeight);
    ctx.fillStyle = paddleColor;
    ctx.fill();
    ctx.closePath();
}


function startBricks(params) {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            bricks[c][r].status =  Math.random() >= 0.3;
            if ( bricks[c][r].status == true) { starterBricks++;}
            //console.log(bricks[c][r].status);
        }
    }
    //console.log(starterBricks);
} 
startBricks();

function drawBricks() {
    for (var c = 0; c < brickColumnCount; c++) {
        for (var r = 0; r < brickRowCount; r++) {
            if (bricks[c][r].status ==1 ) {                           
                var brickX  = (c * (brickWidth + brickPadding)) + brickOffsetLeft;
                var brickY  = (r * (brickHeight + brickPadding)) + brickOffsetTop;
            
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = brickColor;
                ctx.fill();
                ctx.closePath();
            }
        }    
    }
}

function drawScore() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Score: " + score, 8, 20);
}

function drawLives() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Lives: " + lives,canvas.width - 65, 20);
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    drawBricks();
    drawBall();
    drawPaddle();
    drawScore();
    drawLives();
    collisionDetection();

    //Make the ball bounce
    if (ballX + speedX + ballRadius > canvas.width || ballX + speedX - ballRadius < 0) {
        speedX = - speedX;
    }
    if (ballY + speedY - ballRadius < 0) {
        speedY = - speedY;
    }
    if (ballY + speedY > canvas.height + 15) {
        lives--;
        if (!lives) {
            alert("Game Over");
            document.location.reload();
            //clearInterval(interval); // Needed for Chrome to end the game   
        }else{
            ballX = canvas.width/2;
            ballY = canvas.height - paddleBottomMargin - paddleHeight;
            speedX = 4;
            speedY = -4;
            paddleX = (canvas.width - paddleWidth)/2;
        }

    }
    if (ballY + speedY > canvas.height - paddleBottomMargin - paddleHeight  && 
        ballX +speedX + ballRadius > paddleX && ballX - ballRadius< paddleX + paddleWidth) {// Bounce the ball if it hits the paddle
            if (ballY + speedY < canvas.height - paddleBottomMargin ){
                speedY = -speedY;
                if(starterBricks ==0){
                    startBricks();
                    //drawBricks();
                }
            }

            //ball's actions where to hit the paddle
            var deltaX = ballX - (paddleX + paddleWidth/2);
            speedX = deltaX * 0.1;
    }

    ballX += speedX;
    ballY += speedY;

    //Move the paddles
    if (rightPressed) {
        paddleX += 10;
        if (paddleX + paddleWidth > canvas.width ) {//border check
            paddleX = canvas.width - paddleWidth;
        }
    }
    if (leftPressed) {
        paddleX -= 10;
        if (paddleX < 0 ) {//border check
            paddleX = 0;
        }
    }
    
    requestAnimationFrame(draw);
     
}

//var interval = setInterval(draw, 10);
function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color ='#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random()*16)];
    }
    return color;
}
function Start() {
    if (window.confirm("start the game")) {
        draw();
    } else {
    }
}


Start();
