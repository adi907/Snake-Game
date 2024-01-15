// Game Constants & Variables

const gameSound=new Audio('static/music.mp3');
const foodSound=new Audio('static/food.mp3')
const gameOverSound=new Audio('static/gameover.mp3');
const moveSound=new Audio('static/move.mp3');
// the url is done respective to where the html file is located(as it is where the sounds gets loaded)

let lastprintTime=0;
let fps=10;

let inputDir={x:0 ,y:0};

let snakeArr=[//stores segments of snake
    {x:13,y:15}
];
let a=2;let b=16;
let food={x:Math.round(a+(b-a)*Math.random()),y:Math.round(a+(b-a)*Math.random())}

let score=0;

const beg = document.getElementById("beg");
const med = document.getElementById("med");
const pro = document.getElementById("pro");

//difficulty Selection
beg.addEventListener("click",function(){
    fps=8;
    
    document.getElementById('gameFinishText').innerText="";

    invertColor(beg,med,pro);
});

med.addEventListener("click",function(){
    fps=16;
    
    document.getElementById('gameFinishText').innerText="";

    invertColor(med,beg,pro);
});



pro.addEventListener("click",function(){
    fps=24;

    document.getElementById('gameFinishText').innerText="";

    invertColor(pro,beg,med);
    
});

function invertColor(itema,itemr,itemr2){
    itema.classList.add('yellow');
    itemr.classList.remove('yellow');
    itemr2.classList.remove('yellow');

    // Make these unclickable after game starts & then again clickable after game ends
    // beg.style.display="none";
    // med.style.display="none";
    // pro.style.display="none";
}


// Game Functions

function main(ctime){
    window.requestAnimationFrame(main);
    // console.log(ctime);//ctime=current time
    if((ctime-lastprintTime)/1000<1/fps){
        return;
    }
    // else
    lastprintTime=ctime;
    gameengine();
}

function isCollide(snakeArr){

    for (let i = 1; i < snakeArr.length; i++) {
        // Bump into yourself(head collides into any body part)
        if(snakeArr[i].x===snakeArr[0].x && snakeArr[i].y===snakeArr[0].y){
            return true;
        }
    }

    // Bump into walls
    if(snakeArr[0].x>=18 || snakeArr[0].y>=18 || snakeArr[0].x<=0 || snakeArr[0].y<=0){
        return true;
    }
return false;
}

function gameengine(){
    gameSound.play();

    // Update Snake array(location of snake body part)
    if(isCollide(snakeArr)){
        gameOverSound.play();
        gameSound.load();
        inputDir={x:0,y:0};
        document.getElementById('gameFinishText').innerText="Game Over! Press any key to start again";
        snakeArr=[{x:13,y:15}];


        score=0;

        // gameSound.play();

        let ele=document.getElementById("score");
        ele.innerHTML="SCORE: "+score;

        beg.style.display="inline";
        med.style.display="inline"
        pro.style.display="inline";

    }

    // If you have eaten the food, increment the score and regenerate the food
    if(snakeArr[0].y===food.y && snakeArr[0].x===food.x){
        foodSound.play();
        score+=1;

        if(score>highScore){
            highScore=score;
            localStorage.setItem("highScore",JSON.stringify(highScore));
            let highScoreBox=document.getElementById('highScoreBox');
            highScoreBox.innerHTML="HIGH SCORE: "+highScore;
        }
        
        let score_id=document.getElementById('score');
        score_id.innerHTML="SCORE: "+score;
        
        snakeArr.unshift({x:snakeArr[0].x+inputDir.x,y:snakeArr[0].y+inputDir.y});//unshift adds element to start of array
        food={x:Math.round(a+(b-a)*Math.random()),y:Math.round(a+(b-a)*Math.random())}        
    }
    
    // Moving the Snake
    for (let i = snakeArr.length-2; i>=0 ; i--) {
        snakeArr[i+1]={...snakeArr[i]};//Destructuring to object type
        
    }
    snakeArr[0].x+=inputDir.x;
    snakeArr[0].y+=inputDir.y;
    
    // Render Display Snake
    board.innerHTML="";//resets snake to 0
    snakeArr.forEach((e,index)=>{
        snakeElement=document.createElement('div');
        snakeElement.style.gridRowStart=e.y;
        snakeElement.style.gridColumnStart=e.x;
        if(index==0){
            snakeElement.classList.add('head');
        }else{
            snakeElement.classList.add('snake');
        }
        board.appendChild(snakeElement);
    });
    
    // Render Display Food
    foodElement=document.createElement('div');
    foodElement.style.gridRowStart=food.y;
    foodElement.style.gridColumnStart=food.x;
    foodElement.classList.add('food');
    board.appendChild(foodElement);
    
}

// Main logic

gameSound.play();
let highScore=localStorage.getItem("highScore");
if(highScore===null){
    let highScoreVal=0;
    localStorage.setItem("highScore",JSON.stringify(highScoreVal));
}else{
    let highScoreVal=JSON.parse(highScore);
    let highScoreBox=document.getElementById('highScoreBox');
    highScoreBox.innerHTML="High Score: "+highScoreVal;
}

window.requestAnimationFrame(main);

window.addEventListener('keydown',e=>{
    gameSound.play();
    moveSound.play();
    inputDir={x:0,y:1};//Default key(arrowdown)
    document.getElementById('gameFinishText').innerText="";
    
    switch(e.key){
        case "ArrowUp":
            case "W":
                case "w":
                    // console.log("ArrowUp");
                    inputDir.x=0;
                    inputDir.y=-1;
                    break;
            
        case "ArrowDown":
            case "S":
                case "s":
                    // console.log("ArrowDown");
                    inputDir.x=0;
                    inputDir.y=1;
                    break;

        case "ArrowLeft":
            case "A":
                case "a":
                    // console.log("ArrowLeft");
                    inputDir.x=-1;
                    inputDir.y=0;
                    break;

        case "ArrowRight":
            case "D":
                case "d":
                    // console.log("ArrowRight");
                    inputDir.x=1;
                    inputDir.y=0;
                    break;
    }
});
