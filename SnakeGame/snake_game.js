const canvas = document.getElementById("snake_game");
const ctx = canvas.getContext("2d");

const box = 32;

const ground = new Image();
ground.src = "img/ground.png";

const foodImg = new Image();
foodImg.src = "img/food.png"; 

//Snake array
let snake = [];
snake [0] = {
    x: 9*box,
    y: 10*box
}

//create the food
let food = {
    x: Math.floor(Math.random()*17+1)*box,
    y: Math.floor(Math.random()*15+3)*box
}


//create the score var
let score = 0;

//control the snake
let d;

document.addEventListener("keydown",direction);

function direction(evt) {
    if (evt.keyCode == 37 && d != "RIGHT") {
        d = "LEFT";
    }else if (evt.keyCode == 38 && d != "DOWN") {
        d = "UP";
    }else if (evt.keyCode == 39 && d != "LEFT") {
        d = "RIGHT";
    }else if (evt.keyCode == 40 && d != "UP") {
        d = "DOWN";
    } 
}

//check the snake if it hit himself
function collision(head,array) {
    for (let i = 0; i < array.length; i++) {
        if (head.x == array[i].x && head.y == array[i].y) {
            return true;
        }
    }
    return false;
}


//draw everything
function draw() {
    ctx.drawImage(ground, 0, 0);

    for (let i = 0; i < snake.length; i++) {
        ctx.fillStyle = (i==0) ? "green" : "white";
        ctx.fillRect(snake[i].x, snake[i].y, box, box);

        ctx.strokeStyle = "red";
        ctx.strokeRect(snake[i].x, snake[i].y, box, box);
    }

    ctx.drawImage(foodImg, food.x, food.y);

    //old head position
    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    //which direction
    if(d == "LEFT") snakeX -= box;
    if(d == "UP") snakeY -= box;
    if(d == "RIGHT") snakeX += box;
    if(d == "DOWN") snakeY += box;

    //if snake eats the food
    if (snakeX == food.x && snakeY == food.y) {
        score++;
        food = {
            x: Math.floor(Math.random()*17+1)*box,
            y: Math.floor(Math.random()*15+3)*box
        }
    }else {
        //remove one from tail
        snake.pop();
    }

    //add new head
    let newHead = {
        x: snakeX,
        y: snakeY
    }
    //game over

    if (snakeX < box || snakeX > 17 * box
     || snakeY < 3 * box || snakeY > 17 * box
     || collision(newHead, snake)) {
           clearInterval(game);
               
    }

    snake.unshift(newHead);

    ctx.fillStyle = "white";
    ctx.font = "45px Change one";
    ctx.fillText(score, 2*box, 1.6*box);
}

let game = setInterval(draw,100);
