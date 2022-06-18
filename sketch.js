var PLAY = 1;
var END = 0;
var gameState = PLAY;

var sub, subImage;
var ground,invisibleGround, groundImage;

var jfGroup, jf1, jf2, jf3;

var score;
var gameOverImg,restartImg
var moveSound , checkPointSound, dieSound

function preload(){
  sub_moving = loadImage("submarine.png");
  
  groundImage = loadImage("ground.png");
  
  jf1 = loadImage("jf1.png");
  jf2 = loadImage("jf2.png");
  jf3 = loadImage("jf3.png");

  shark = loadImage("shark.png");
  
  restartImg = loadImage("restart.png")
  gameOverImg = loadImage("gameover.png")
  
  jumpSound = loadSound("jump.mp3")
  dieSound = loadSound("die.mp3")
  checkPointSound = loadSound("checkPoint.mp3")
}

function setup() {
  createCanvas(600, 200);

  var message = "This is a message";
 console.log(message)
  
  sub = createSprite(50,160,20,50);
  
  sub.scale = 0.5;
  
  ground = createSprite(200,180,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  
  gameOver = createSprite(300,100);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(300,140);
  restart.addImage(restartImg);
  
 
  gameOver.scale = 0.5;
  restart.scale = 0.5;
  
  invisibleGround = createSprite(200,190,400,10);
  invisibleGround.visible = false;
  
  //create jf Groups
  jfGroup = createGroup();
 

  
  sub.setCollider("rectangle",0,0,sub.width,sub.height);
  sub.debug = true
  
  score = 0;
  
}

function draw() {
  
  background(180);
  //displaying score
  text("Score: "+ score, 500,50);
  
  
  if(gameState === PLAY){

    gameOver.visible = false;
    restart.visible = false;
    
    ground.velocityX = -(4 + 3* score/100)
    //scoring
    score = score + Math.round(getFrameRate()/60);
    
    if(score>0 && score%100 === 0){
       checkPointSound.play() 
    }
    
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
    
    //jump when the space key is pressed
    if(keyDown("space")&& sub.y >= 100) {
        sub.velocityY = -12;
        jumpSound.play();
    }
    
    //add gravity
    sub.velocityY = sub.velocityY + 0.5
  
    //spawn obstacles on the ground
    spawnjf();
    
    if(jfGroup.isTouching(sub)){
        //trex.velocityY = -12;
        jumpSound.play();
        gameState = END;
        dieSound.play()
      
    }
  }
   else if (gameState === END) {
      gameOver.visible = true;
      restart.visible = true;
     
      ground.velocityX = 0;
      sub.velocityY = 0
      
     
      //set lifetime of the game objects so that they are never destroyed
    jfGroup.setLifetimeEach(-1);
    jfGroup.setVelocityXEach(0);  
   }
  
 
  //stop trex from falling down
  sub.collide(invisibleGround);
  
  if(mousePressedOver(restart)) {
      reset();
    }


  drawSprites();
}

function reset(){
  gameState = PLAY
  jfGroup.destroyEach();
  score = 0;
}


function spawnjf(){
 if (frameCount % 60 === 0){
   var jf = createSprite(600,165,10,40);
   jf.velocityX = -(6 + score/100);
   
    //generate random obstacles
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: jf.addImage(jf1);
              break;
      case 2: jf.addImage(jf2);
              break;
      case 3: jf.addImage(jf3);
              break;
    }
   
    //assign scale and lifetime to the obstacle           
    jf.scale = 0.5;
    jf.lifetime = 300;
   
   //add each obstacle to the group
    jfGroup.add(jf);
 }
}


  
  