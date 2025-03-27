
		// declare all the neccesary variable
		//gamechar variable
		var gameChar_x;
		var gameChar_y;
		var isLeft;
		var isRight;
		var isFalling;
		var isHitRight;
		var isHitLeft;
		var isDeadright;
		var isDeadleft;
		var isPlummeting;
		var isPlummeting2;
		var killenemy;
		var VgameChar_y;
		var gravity;
		var jumpforce;
		var isContact;
		var isContactB;
		//enemies variable
		var enemies1;
		var enemy2;
		var enemy2Speed;
		var enemy2isDown;
		var enemy2isUp;
		var enemy2isRight;
		var enemy2isLeft;
		var d_enemy2;
		// environment variable
		var stars;
		var canyon;
		var trees;
		var mountains;
		var clouds;
		var cameraPos_x;
		var gamescore;
		var flagpole;
		var lives;
		var gameover;
		var instructionpage;
		var floorPos_y;
		var fwtime;

		//load all the soundeffect
		function preload(){

			soundFormats('mp3');
			//all sound from https://mixkit.co/free-sound-effects/game/
			jumpsound = loadSound('assets/jump',soundFileLoaded);
			enemyhitsound = loadSound('assets/enemyhit',soundFileLoaded)
			hitblockstar = loadSound('assets/hitblockstar',soundFileLoaded)
			collectstar = loadSound('assets/collectstar',soundFileLoaded)
			hitenemy = loadSound('assets/hitenemy',soundFileLoaded)
			falling = loadSound('assets/falling',soundFileLoaded)
			winning = loadSound('assets/winning',soundFileLoaded) 
			fireworksound = loadSound('assets/firework',soundFileLoaded)
			wind = loadSound('assets/wind',soundFileLoaded)
			walk = loadSound('assets/walk',soundFileLoaded)
			walk.setVolume(2);			
			jumpsound.setVolume(0.1);
			falling.setVolume(0.1);
			winning.setVolume(0.5);
			wind.setVolume(0.5);
		}

		//createvariable to load the sound first before gamestart
		var soundFileLoadingCounter = 0;
		var TOTAL_NUMBER_OF_SOUND_FILES = 10;
		function soundFileLoaded(){
			soundFileLoadingCounter++;
		}

		function setup()
		{
			//initialize variable
			createCanvas(1074, 576);
			lives = 3;
			gameover = false;
			instructionpage = true;
			wind.loop ();
			init();
		}

		function init(){
			floorPos_y = height * 3/4;
			gameChar_x = 50;
			gameChar_y = floorPos_y;
			enemy2Speed = 0;
			d_enemy2 = 0;
			cameraPos_x = 0;
			gamescore = 0;
			gravity = 0.5;
			VgameChar_y = 0;

			//trees array (numbers in the array are anchor point(x locations))
			trees=[100,300,900,1500,2300,2500,2800,3300]

			//clouds array (x is the anchor point)
			clouds=[{x:random(10,width),y:random(20,100),size:random(50,60)},{x:random(10,width),y:random(100,200),size:random(50,60)},{x:random(10,width),y:random(200,250),size:random(50,60)}];

			//stars (collectables array)(x is the anchor point)
			stars=[{x:200,y:400,width:15.3,height:23.5,isFound: false},{x:1400,y:380,width:15.3,height:23.5,isFound: false},{x:2700,y:200,width:15.3,height:23.5,isFound: false}]

			//canyon array (x is the anchor point)
			canyon=[{x:400,width:70},{x:1200,width:200},{x:1800,width:200},{x:3000,width:200}]

			//mountain array (x is the anchor point)
			mountains = [{x:-150,height:floorPos_y-290,width:550},{x:550,height:floorPos_y-290,width:600},{x:2300,height:floorPos_y-290,width:500},{x:3500,height:floorPos_y-290,width:700}]

			//enemy array (x is the anchor point)
			enemies1=[{x:-200,alive:true,isHitLeft: false,isHitRight: false,isLeft:false,isRight:true},{x:900,alive:true,isHitLeft: false,isHitRight: false,isLeft: false,isRight:true},{x:2300,alive:true,isHitLeft: false,isHitRight: false,isLeft: false,isRight:true}]

			//enemy2 array (x is the anchor point)
			enemies2=[{x:1200,alive:true,isLeft:false,isRight:true},{x:3000,alive:true,isLeft:false,isRight:true}]

			//flagpole
			flagpole={x:4000,y:floorPos_y-50,wally:floorPos_y-50,isReached:false}

			fireworks=[];
			for(let i=0;i<50;i++){
				fireworks[i]= new firework();
			}

			snows=[];
			for(let i=0;i<100;i++)
			{
				snows[i]=new snow();
			}

			platforms=[];
			for(let i=0;i<1;i++){
				platforms.push(new createPlatforms());
			}

			enemies1array=[];
			for(let i=0;i<enemies1.length;i++)
			{
				enemies1array.push(new enemy1(enemies1[i].x,enemies1[i].alive,enemies1[i].isHitLeft,enemies1[i].isHitRight,enemies1[i].isLeft,enemies1[i].isRight))
			}

			enemies2array=[];
			for(let i=0;i<enemies2.length;i++){
				enemies2array.push(new enemy2(enemies2[i].x,enemies2[i].alive,enemies2[i].isLeft,enemies2[i].isRight))
			}

			//boolean value for interaction
			victorySoundPlayed = false
			isLeft = false;
			isRight = false;
			isFalling = false;
			isPlummeting = false;
			isPlummeting2 = false;
			isHitRight = false;
			isHitLeft = false;
			isDeadleft = false;
			isDeadright = false;
			enemy2isDown = true;
			enemy2isUp = false;
			enemy2isRight = true;
			enemy2isLeft = false;
			killenemy = false;
			isContact = false;
			isContactB = false;
			fwtime = false;
			fall = false;
		}

		function draw()
		{
			//loadsounf
			if(soundFileLoadingCounter!=TOTAL_NUMBER_OF_SOUND_FILES){
				return;
			}
			//instruction page
			if(instructionpage){
				instruction();
			}
			else{
			cameraPos_x=gameChar_x - width/2;
			background(100,155,255);
			//ground
			noStroke();
			fill(139,69,19);
			rect(0, floorPos_y, width, height-floorPos_y); 
			fill(255,250,250);
			rect(0,floorPos_y,width,height-541);

			push();
			translate(-cameraPos_x,0);

			//mountains
			drawMountain();

			//trees
			drawTrees();

			//clouds
			drawClouds();

			//canyon
			drawCanyon(canyon);
			checkCanyon(canyon);

			//stars(collectable)
			drawStars(stars);
			checkStars(stars);

			//drawScore
			drawGameScore();

			//drawsnow
			for(i=0;i<snows.length;i++){
				snows[i].move();
				snows[i].show();
			} 

			//drawplatform
			for(i=0;i<platforms.length;i++){
				platforms[i].show();
			}

			//draw flagpole
			drawflagpole();
			checkflagpole();

			//drawlifetokens
			drawLifeTokens();

			//enemy animation
			//enemy1
			for(i=0;i<enemies1array.length;i++){
				enemies1array[i].animation();
			}

			//enmey2
			for(i=0;i<enemies2array.length;i++){
				enemies2array[i].animation();
			}
			
			//gravity when gamecharacter hit enemy or hit by enemy (slower)
			if(killenemy||isHitLeft||isHitRight){
				if(gameChar_y<=floorPos_y){
					gameChar_y += 1
					isFalling = true
					if(gameChar_y>=floorPos_y){
						killenemy = false;
						if(isHitLeft){
							isHitLeft = false
							isDeadleft = true
						}
						else if(isHitRight){
							isHitRight = false
							isDeadright = true
						}
					}
				}
			}
			//when reach floor stop falling
			else if(gameChar_y>=floorPos_y && isFalling){
				gameChar_y = floorPos_y;
				VgameChar_y = 0;
				isFalling = false
				isContactB = false
			}
			else{
				//platform gravity 
				gameChar_y += VgameChar_y
				if(gameChar_y<floorPos_y){
					for(let i=0;i<platforms.length;i++){
						//when character on the platform	
						if(platforms[i].contact()){
							isContact = true;
							isFalling = false;
							VgameChar_y = 0;
							break;
						}
						//when character touch the left and right of the platform (fall down)
						else if(platforms[i].contactleftright()){
							VgameChar_y = 0;
							VgameChar_y += gravity+10;
							isFalling = true;
							isContactB = true;
						}

						//when character touch the canyon from below
						else if(platforms[i].contactbelow() ){
							VgameChar_y = 0;
							VgameChar_y += gravity;
							isFalling = true;
						}

						//fall normally
						else if(isContact == false || platforms[i].contact() == false){
							VgameChar_y += gravity;
							isFalling = true;
						}

					}
				}
			}

			//when falling in canyon
			if (isPlummeting) {
			  //to play the falling sound exactly one
			  if (!fall) {
				falling.play();
				fall = true;
			  }

			  gameChar_y += 5;
			  checkIsgameChardied()
			}
			//slide down from the slope
			else if(isPlummeting2){
				gameChar_y +=5;
				gameChar_x -=2;
			}

			//moving left
			if(isLeft == true && isPlummeting == false && isPlummeting2 == false && isContactB==false){
				gameChar_x -= 5;
			}

			//moving right
			else if(isRight == true && isPlummeting == false && isPlummeting2 == false && isContactB == false){
				gameChar_x += 5;
			}

			//game character animation
			if(gameover==false){
				//jumping-left
				if(((isLeft || isHitLeft) && isFalling))
				{
					drawGameCharJumpingLeft();
				}

				//jumping-right
				else if(((isRight||isHitRight) && isFalling))
				{
					drawGameCharJumpingRight();
				}

				// walking left
				else if(isLeft && isPlummeting == false && isPlummeting2 == false)
				{
					drawGameCharWalkingLeft();
				}
				//walking right
				else if(isRight && isPlummeting == false && isPlummeting2 == false)
				{
					drawGameCharWalkingRight();
				}

				//jumping facing forwards
				else if(isFalling || isPlummeting)
				{
					drawGameCharjumpingFacingFront();
				}

				//deadright
				else if(isDeadright)
				{
					drawGameCharDiedRight();

					if(frameCount%100 == 0){
						checkIsgameChardied();
					}
				}

				//deadleft
				else if(isDeadleft)
				{
					drawGameCharDiedLeft();

					if(frameCount%200 == 0){
						checkIsgameChardied();
					}
				}

				// standing front facing
				else
				{
					drawGameCharStandingFront();
				}
			}
			//gameover
			if(gameover){
				drawGameOver();
				gameChar_x = width/2 +cameraPos_x
				gameChar_y = floorPos_y
				drawGameCharStandingFront();
			}
			pop();
		}
		}


	//key pressed to move the character
	function keyPressed()
	{
		//instruction page
		if(keyCode == 13 && instructionpage){
			instructionpage = false
		}

		//if gameover stop moving
		else if(gameover){
			return;
		}
		//left
		else if ((keyCode == 37 || key == "A")  && isHitRight == false && isHitLeft == false && isDeadleft ==false && isDeadright ==false && isContactB == false){
			walk.play();
			isLeft = true;
		}
		//right
		else if ((keyCode == 39 || key == "D") && isHitRight == false && isHitLeft == false && isDeadleft ==false && isDeadright ==false && isContactB == false){
			walk.play();
			isRight = true;
		}
		//jump
		else if((keyCode == 38 || key == "W") && (gameChar_y == floorPos_y || platforms[0].contact()) && isPlummeting == false && isPlummeting2 == false && isDeadleft ==false && isDeadright ==false){
			jumpsound.play();
			jumpforce = -11;
			VgameChar_y = jumpforce
		}
	}

	function keyReleased()
	{
		if(gameover){
			return;
		}

		if(keyCode == 37 || key == "A"){
			walk.stop()
			isLeft = false;
		}

		else if (keyCode = 39 || key == "D"){
			walk.stop()
			isRight = false;
		}
	}

	//snow
	class snow{
		constructor(){
			this.x=random(0,width);
			this.y=0;
			this.width=random(5,10);
			this.yspeed=random(1,2);
			this.xspeed=random(-2,2);
		}
		//snow movement	
		move(){
			this.y = this.y + this.yspeed;
			this.x = this.x + this.xspeed;
			if(this.y>height){
				this.y=0;
				this.x=random(0,width)
			}
		}

		//draw snow
		show(){
			noStroke();
			fill(255)
			ellipse(this.x +cameraPos_x,this.y,this.width)
		}
	}

	function createPlatforms(){
		this.y=floorPos_y-120;
		this.wh=25;
		//platform array (total 4 blocks for 1 platform)
		this.blockarray=[[{x:100,y:this.y,s:false},{x:100+this.wh,y:this.y,s:false},{x:100+2*this.wh,y:this.y,s:true},{x:100+3*this.wh,y:this.y,s:false}],[{x:700,y:this.y,s:false},{x:700+this.wh,y:this.y,s:true},{x:700+2*this.wh,y:this.y,s:false},{x:700+3*this.wh,y:this.y,s:false}],[{x:1850,y:this.y+40,s:false},{x:1850+this.wh,y:this.y+40,s:false},{x:1850+2*this.wh,y:this.y+40,s:false},{x:1850+3*this.wh,y:this.y+40,s:false}],[{x:2500,y:this.y,s:false},{x:2500+this.wh,y:this.y,s:false},{x:2500+2*this.wh,y:this.y,s:false},{x:2500+3*this.wh,y:this.y,s:false}]]
		//for special block with star
		this.starsarray=[];
		for(let a=0;a<this.blockarray.length;a++){
			for(let i=0;i<4;i++){
				//save the information of the block with star
				if(this.blockarray[a][i].s){
					this.starsarray.push({x:this.blockarray[a][i].x+13,y:this.blockarray[a][i].y+20,width:10,height:18,isFound: false,touch: false,block: a})
				}
			}
		}

		this.show = function(){
			for(let a=0;a<this.blockarray.length;a++){
				for(let i=0;i<4;i++){
					//draw normal blocks
					if(this.blockarray[a][i].s==false){
						push();
						strokeWeight(3);
						stroke(0);
						fill(116,60,12);
						rect(this.blockarray[a][i].x,this.blockarray[a][i].y,this.wh,this.wh);
						for(let j=0;j<5;j++){
							push();
							strokeWeight(2);
							line(this.blockarray[a][i].x,this.blockarray[a][i].y+5*j,this.blockarray[a][i].x+this.wh,this.blockarray[a][i].y+5*j);
							for(let k=0;k<3;k++){
								line(this.blockarray[a][i].x+3*j+k*7,this.blockarray[a][i].y+5*j,this.blockarray[a][i].x+3*j+k*7,this.blockarray[a][i].y+5+5*j)
							}
							pop();
						}
						pop();
					}
					//draw blocks with stars
					else if(this.blockarray[a][i].s){
						push();
						var c = frameCount%200
						stroke(0);
						strokeWeight(3);
						fill(116,60,12,c);
						rect(this.blockarray[a][i].x,this.blockarray[a][i].y,this.wh,this.wh)
						pop();

						drawStars(this.starsarray);
					}

				for(let b=0;b<this.starsarray.length;b++){
					if(gameChar_x>=this.blockarray[a][i].x && gameChar_x<=this.blockarray[a][i].x+this.wh && gameChar_y-70>=this.blockarray[a][i].y && gameChar_y-70<=this.blockarray[a][i].y+this.wh){
						gameChar_y+=5;
						//is touch the block with star from bottom, play the sound and push the star out of the block
						if(this.blockarray[a][i].s){
							hitblockstar.play();
							this.blockarray[a][i].s = false;
							this.starsarray[a].touch = true;
						}
					} 
					if(this.starsarray[b].touch){
						this.starsarray[b].y -= 5;
						this.starsarray[b].y = min(this.blockarray[b][i].y-15);
						drawStars(this.starsarray);
						checkStars(this.starsarray);
					}
				}
			}
		}
	}
		//detect whether the character on the platform
		this.contact = function(){
			for(let a=0;a<this.blockarray.length;a++){
				for(let i=0;i<4;i++){
					if(gameChar_x>=this.blockarray[a][i].x && gameChar_x<=this.blockarray[a][i].x+this.wh && gameChar_y<=this.blockarray[a][i].y){
						let d=this.blockarray[a][i].y-gameChar_y

						if(d>0&&d<3.5){
							return true;
						}
					}
				}
			}	
			return false;
		}

		//detect whether the character under the platform
		this.contactbelow = function(){
			for(let a=0;a<this.blockarray.length;a++){
				for(let i=0;i<4;i++){
					if(gameChar_x>=this.blockarray[a][0].x && gameChar_x<=this.blockarray[a][3].x+this.wh && gameChar_y-70<=this.blockarray[a][i].y+this.wh && gameChar_y>this.blockarray[a][i].y){
						return true;
					}
				}
			}
			return false;
		}

		////detect whether the character beside of the platform
		this.contactleftright = function(){
			for(let a=0; a<this.blockarray.length; a++){
				for(let i=0;i<4;i++){	
				if(gameChar_y>=this.blockarray[a][i].y && gameChar_y<=this.blockarray[a][i].y+this.wh+20){
				let d = abs(gameChar_x-this.blockarray[a][2].x)
				if(d<65){
				return true;
				}
				}
			}
		}
		return false;
		}
	}

	class firework{
		constructor(){
		this.ballx = flagpole.x;
		this.bally = floorPos_y;
		this.ballxspeed = 0; 
		this.ballsarray=[{x:this.ballx,y:this.bally,speed:this.ballxspeed-5},{x:this.ballx,y:this.bally,speed:this.ballxspeed},{x:this.ballx,y:this.bally,speed:this.ballxspeed+5}]
		this.fw=[]
		this.fwxspeed = random(-5,5);
		this.fwyspeed = random(-5,5);
		this.fwwidth = random(5,10);
		this.color = random(0,255)
		}

		//draw 3 balls when reach flagpole
		ball(){
			for(i=0;i<this.ballsarray.length;i++){
				//if ball reach the designated height, save the information of the ball to firework array and stop drawing ball
				if(this.ballsarray[i].y <= floorPos_y-300 && this.ballsarray[this.ballsarray.length-1].y <= floorPos_y-300){
					this.fw.push({x:this.ballsarray[i].x,y:this.ballsarray[i].y,life:10})
					fwtime = true;
				}
				else if(fwtime==false){
				//draw ball
				noStroke();
				fill(255,0,0)
				ellipse(this.ballsarray[i].x,this.ballsarray[i].y,15)
				this.ballsarray[i].x += this.ballsarray[i].speed
				this.ballsarray[i].y -= 5
			}
		}
		}

		fws(){
			for(let i=0;i<this.fw.length;i++){
			//decrease the life of the firework so it wont expand infinitely
			this.fw[i].life-=1
			//draw firework
			noStroke();
			fill(200,this.color,200)
			ellipse(this.fw[i].x,this.fw[i].y,this.fwwidth);
			//firework movement
			this.fw[i].x+=this.fwxspeed
			this.fw[i].y+=this.fwyspeed
			//remove firework drom the array 
			if(this.fw[i].life<=0){
				this.fw.splice(i,1);
			}
		}
	}
	}

	function drawMountain(){
		for(i=0;i<mountains.length;i++){
			//biggest mountain
			fill(129,147,173);
			beginShape();
			vertex(mountains[i].x,mountains[i].height+290);
			vertex(mountains[i].x+60,mountains[i].height+140);
			vertex(mountains[i].x+200,mountains[i].height);
			vertex(mountains[i].x+400,mountains[i].height+110);
			vertex(mountains[i].x+mountains[i].width,mountains[i].height+290)
			endShape();

			//biggest mountain snow part
			fill(255);
			beginShape();
			vertex(mountains[i].x+200,mountains[i].height);
			vertex(mountains[i].x+90,mountains[i].height+110);
			vertex(mountains[i].x+130,mountains[i].height+130);
			vertex(mountains[i].x+170,mountains[i].height+110);
			vertex(mountains[i].x+210,mountains[i].height+130);
			vertex(mountains[i].x+237,mountains[i].height+110);
			vertex(mountains[i].x+264,mountains[i].height+130);
			vertex(mountains[i].x+304,mountains[i].height+110);
			vertex(mountains[i].x+356,mountains[i].height+130);
			vertex(mountains[i].x+400,mountains[i].height+110);
			endShape();
			//biggest mountain shaded part
			fill(0,100);
			beginShape();
			vertex(mountains[i].x+200,mountains[i].height);
			vertex(mountains[i].x+300,mountains[i].height+290);
			vertex(mountains[i].x+mountains[i].width,mountains[i].height+290);
			vertex(mountains[i].x+400,mountains[i].height+110)
			endShape();

			//left mountain 
			fill(255,250,240)
			beginShape();
			vertex(mountains[i].x+60,mountains[i].height+290);
			vertex(mountains[i].x+330,mountains[i].height+290);
			vertex(mountains[i].x+180,mountains[i].height+240);
			vertex(mountains[i].x+105,mountains[i].height+260);
			endShape(); 

			fill(110,110,110);
			triangle(mountains[i].x+180,mountains[i].height+240,mountains[i].x+200,mountains[i].height+290,mountains[i].x+330,mountains[i].height+290);

			//middle mountain
			fill(130,130,140);
			beginShape();
			vertex(mountains[i].x+mountains[i].width-300,mountains[i].height+290);
			vertex(mountains[i].x+mountains[i].width-270,mountains[i].height+210);
			vertex(mountains[i].x+mountains[i].width-230,mountains[i].height+140);
			vertex(mountains[i].x+mountains[i].width-130,mountains[i].height+210);
			vertex(mountains[i].x+mountains[i].width-70,mountains[i].height+290);
			endShape();

			//middle mountain snow prat
			fill(240,255,255);
			triangle(mountains[i].x+mountains[i].width-230,mountains[i].height+140,mountains[i].x+mountains[i].width-202,mountains[i].height+160,mountains[i].x+mountains[i].width-270,mountains[i].height+210);

			//middle mountain shaded part
			fill(0,100);
			beginShape();
			vertex(mountains[i].x+mountains[i].width-230,mountains[i].height+140);
			vertex(mountains[i].x+mountains[i].width-210,mountains[i].height+290);
			vertex(mountains[i].x+mountains[i].width-70,mountains[i].height+290);
			vertex(mountains[i].x+mountains[i].width-130,mountains[i].height+210);
			endShape();
		}
	}

	function drawTrees(){
		for(var i=0;i<trees.length;i++){
			fill(165,42,42);
			rect(trees[i],floorPos_y-100,25,100);
			//leaves
			fill(40,102,1);
			triangle(trees[i]-25,floorPos_y-80,trees[i]+50,floorPos_y-80,trees[i]+(75)/2-25,floorPos_y-180);
			triangle(trees[i]-35,floorPos_y-30,trees[i]+60,floorPos_y-30,trees[i]+(75)/2-25,floorPos_y-130);
			noStroke();
			//tree snows
			fill(255,250,250);
			beginShape();
			vertex(trees[i]-25,floorPos_y-80);
			vertex(trees[i]-12,floorPos_y-80);
			vertex(trees[i]-35,floorPos_y-30);
			vertex(trees[i]-15,floorPos_y-30);
			vertex(trees[i],floorPos_y-80);
			vertex(trees[i]+25,floorPos_y-110);
			vertex(trees[i]-25+(75)/2,floorPos_y-200);
			vertex(trees[i]-25,floorPos_y-80);
			endShape();
		}
	}

	function drawClouds(){
		for(i=0;i<clouds.length;i++){
			//draw clouds
			fill(255);
			ellipse(clouds[i].x+10,clouds[i].y-20,clouds[i].size);
			ellipse(clouds[i].x-40,clouds[i].y,clouds[i].size);
			ellipse(clouds[i].x+40,clouds[i].y,clouds[i].size);
			ellipse(clouds[i].x-20,clouds[i].y+20,clouds[i].size)
			ellipse(clouds[i].x+10,clouds[i].y+20,clouds[i].size-10)
			ellipse(clouds[i].x-10,clouds[i].y-10,clouds[i].size);

			//animate clouds
			if(clouds[i].x - clouds[i].size >= width + cameraPos_x){
				clouds[i].x = -clouds[i].size + cameraPos_x ;
				clouds[i].y = random(clouds[i].size-20,height/2);
			}
			else {
				clouds[i].x += 2;
			}
		}
	}

	function drawCanyon(t_canyon){
		// draw canyon
		for(i=0;i<t_canyon.length;i++){
			fill(100, 155, 255);
			rect(t_canyon[i].x,floorPos_y,t_canyon[i].width,144);
			triangle(t_canyon[i].x,floorPos_y,t_canyon[i].x-50,floorPos_y+20,t_canyon[i].x,floorPos_y+floorPos_y/5);
			triangle(t_canyon[i].x+t_canyon[i].width,floorPos_y,t_canyon[i].x+t_canyon[i].width+50,floorPos_y,t_canyon[i].x+t_canyon[i].width,floorPos_y+floorPos_y/5);
		}
	}

	function checkCanyon(t_canyon){
		//check wheter inside the canyon
		for(i=0;i<canyon.length;i++){

			var cond1 = gameChar_y >= floorPos_y
			var cond2 = gameChar_x>(t_canyon[i].x)
			var cond3 = gameChar_x<(t_canyon[i].x+t_canyon[i].width+50)
			var cond4 = gameChar_x>(t_canyon[i].x+t_canyon[i].width-20)&&gameChar_x<(t_canyon[i].x+t_canyon[i].width+50)


			if(cond1&&cond2&&cond4){
				isPlummeting2=true;				
			}

			else if(cond1&&cond2&&cond3){
				isPlummeting=true;

			}
		}
	}

	function drawStars(t_collectable){
		//draw star
		for(let i=0;i<t_collectable.length;i++){
			if(t_collectable[i] && t_collectable[i].isFound == false){
				stroke(225,175,3);
				strokeWeight(1);
				fill(254,231,47);
				beginShape();
				vertex(t_collectable[i].x,t_collectable[i].y-t_collectable[i].height)
				vertex(t_collectable[i].x-t_collectable[i].width*1/3,t_collectable[i].y-t_collectable[i].height*3/5);
				vertex(t_collectable[i].x-t_collectable[i].width*9/10,t_collectable[i].y-t_collectable[i].height*2/3);
				vertex(t_collectable[i].x-t_collectable[i].width*1/3,t_collectable[i].y-t_collectable[i].height*1/3);
				vertex(t_collectable[i].x-t_collectable[i].width*2/3,t_collectable[i].y+t_collectable[i].height*1/7);
				vertex(t_collectable[i].x,t_collectable[i].y);
				vertex(t_collectable[i].x+t_collectable[i].width*2/3,t_collectable[i].y+t_collectable[i].height*1/7);
				vertex(t_collectable[i].x+t_collectable[i].width*1/3,t_collectable[i].y-t_collectable[i].height*1/3);
				vertex(t_collectable[i].x+t_collectable[i].width*9/10,t_collectable[i].y-t_collectable[i].height*2/3);
				vertex(t_collectable[i].x+t_collectable[i].width*1/3,t_collectable[i].y-t_collectable[i].height*3/5);
				vertex(t_collectable[i].x,t_collectable[i].y-t_collectable[i].height)
				endShape();
			}
		}
	}

	function checkStars(t_collectable){
		for(i=0;i<t_collectable.length;i++){

			//checkIfGameCharInStarsRange
			var d =dist(t_collectable[i].x,t_collectable[i].y-t_collectable[i].height/3,gameChar_x,gameChar_y - t_collectable[i].height*1.6)

			if(d<30 && isHitLeft == false && isHitRight == false && t_collectable[i].isFound == false){
				collectstar.play();
				t_collectable[i].isFound =true;
				gamescore++
			}
		}
	}

	function drawGameScore(){
		noStroke();
		fill(0);
		textSize(30);
		text('Score:' + gamescore,10+cameraPos_x,30)
	}

	function drawflagpole(){
		//flagpole
		stroke(0);
		fill(169,169,169)
		rect(flagpole.x+48,floorPos_y-400,5,400)
		fill(0,100,0)
		triangle(flagpole.x+55,flagpole.y+50,flagpole.x+55,flagpole.y+20,flagpole.x+100,flagpole.y+20)
		//draw castle wall
		fill(178,34,34);
		stroke(0)
		rect(flagpole.x,flagpole.wally,100,60);

		for(i=0;i<5;i++){
			line(flagpole.x,flagpole.wally + 12*i,flagpole.x+100,flagpole.wally+12*i)
			rect(flagpole.x+22.5*i,flagpole.wally-20,10,20)
			for(j=0;j<5;j++){
				line(flagpole.x+6*i+j*19,flagpole.wally+12*i,flagpole.x+6*i+j*19,flagpole.wally+12+12*i)
			}
		}

		//raise the flag to the top of pole 
		if(flagpole.isReached){
			walk.stop();
			flagpole.y += -3
			flagpole.y = max(flagpole.y,12);
			fill(0,100,0)
			triangle(flagpole.x+55,flagpole.y+50,flagpole.x+55,flagpole.y+20,flagpole.x+100,flagpole.y+20)
		}
	}

	function checkflagpole(){
		if(flagpole.isReached==false){
			let d = dist(gameChar_x,gameChar_y,flagpole.x,floorPos_y)
			if(d<30){
				flagpole.isReached=true
				gameover = true;
			}
		}
	}

	function checkIsgameChardied(){
		if(gameChar_y -80 > height || isDeadleft || isDeadright){
			falling.stop()
			lives --;
			if(lives>0){
				init();
			}
			else{
				gameover = true;
			}
		}
	}

	function drawLifeTokens(){
		for(i=0;i<lives;i++){
			//face
			fill(255,228,196);
			ellipse(40*i+900+cameraPos_x,30,25,25);

			//eye
			fill(0);
			ellipse(40*i+894+cameraPos_x,30,5,5);
			ellipse(40*i+906+cameraPos_x,30,5,5);

			fill(255,0,0);
			curve(40*i+925+cameraPos_x,floorPos_y-352,40*i+885+cameraPos_x,floorPos_y-409,40*i+915+cameraPos_x,floorPos_y-409,40*i+875+cameraPos_x,floorPos_y-352);
			curve(40*i+925+cameraPos_x,floorPos_y-439,40*i+885+cameraPos_x,floorPos_y-409,40*i+915+cameraPos_x,floorPos_y-409,40*i+875+cameraPos_x,floorPos_y-439);
			curve(40*i+925+cameraPos_x,floorPos_y-439,40*i+885+cameraPos_x,floorPos_y-409,40*i+915+cameraPos_x,floorPos_y-409,40*i+875+cameraPos_x,floorPos_y-439);
			curve(40*i+925+cameraPos_x,floorPos_y-412,40*i+885+cameraPos_x,floorPos_y-409,40*i+915+cameraPos_x,floorPos_y-409,40*i+875+cameraPos_x,floorPos_y-412)
		}
	}

	function drawGameOver(){

		fill(0);
		textSize(100);
		if(lives>0){
			if(victorySoundPlayed==false){
				winning.play();
				fireworksound.play();
				victorySoundPlayed = true
			}
			text('You win!',300+cameraPos_x,height/2)
			for(let i=0;i<fireworks.length;i++){
				fireworks[i].ball()
				if(fwtime){
					fireworks[i].fws();
				}
			}
		}
		else{
			text('You lose!',300+cameraPos_x,height/2)
		}
	}

	//function that draw the character----start
	function drawGameCharStandingFront(){
		stroke(0);

		//body
		fill(255,0,0);
		rect(gameChar_x-10,gameChar_y-50,20,30);

		//face
		fill(255,228,196);
		ellipse(gameChar_x,gameChar_y-55,25,25);

		//hat
		fill(255,0,0);
		curve(gameChar_x+25,gameChar_y-5,gameChar_x-15,gameChar_y-62,gameChar_x+15,gameChar_y-62,gameChar_x-25,gameChar_y-5);
		curve(gameChar_x+25,gameChar_y-92,gameChar_x-15,gameChar_y-62,gameChar_x+15,gameChar_y-62,gameChar_x-25,gameChar_y-92);
		curve(gameChar_x+25,gameChar_y-92,gameChar_x-15,gameChar_y-62,gameChar_x+15,gameChar_y-62,gameChar_x-25,gameChar_y-92);
		curve(gameChar_x+25,gameChar_y-65,gameChar_x-15,gameChar_y-62,gameChar_x+15,gameChar_y-62,gameChar_x-25,gameChar_y-65)

		//eyes
		fill(0);
		ellipse(gameChar_x-6,gameChar_y-55,5,5);
		ellipse(gameChar_x+6,gameChar_y-55,5,5);

		//Left hand
		push();
		translate(gameChar_x - 14, gameChar_y - 49);
		rotate(PI / 8);
		rect(0, 0, 5, 15);
		pop();

		//right hand
		push();
		translate(gameChar_x + 10, gameChar_y - 47);
		rotate(-PI / 8);
		rect(0, 0, 5, 15);
		pop();

		//legs
		rect(gameChar_x-8,gameChar_y-20,5,20);
		rect(gameChar_x+3,gameChar_y-20,5,20);
	}

	function drawGameCharJumpingLeft(){
		stroke(0);
		push();
		fill(0);
		translate(gameChar_x,gameChar_y-45);
		rotate(radians(130));
		rect(0,0,5,25);
		pop();

		//right leg

		push();
		fill(0);
		translate(gameChar_x,gameChar_y-23);
		rotate(radians(-50));
		rect(0,0,5,25)
		pop();

		//body
		stroke(0);
		fill(255,0,0);
		rect(gameChar_x-10,gameChar_y-50,20,30);


		//face
		fill(255,228,196);
		ellipse(gameChar_x,gameChar_y-55,25,25);

		//eye
		fill(0);
		ellipse(gameChar_x-6,gameChar_y-55,5,5);

		//hat
		fill(255,0,0);
		arc(gameChar_x,gameChar_y-63,30,15,radians(190),radians(10),CHORD);

		//left hand
		fill(0);
		push();
		translate(gameChar_x,gameChar_y-41);
		rotate(radians(100));
		rect(0,0,5,20);
		pop();

		//left leg
		push();
		translate(gameChar_x-4,gameChar_y-25);
		rotate(radians(50));
		rect(0,0,5,20);
		pop();
	}

	function drawGameCharJumpingRight(){
		//left hand
		stroke(0);
		fill(0);
		push();
		translate(gameChar_x,gameChar_y-40);
		rotate(radians(-130));
		rect(0,0,5,25);
		pop();

		//left leg
		push();
		translate(gameChar_x-4,gameChar_y-22);
		rotate(radians(50));
		rect(0,0,5,20)
		pop();

		//body
		stroke(0);
		fill(255,0,0);
		rect(gameChar_x-10,gameChar_y-50,20,30);

		//face
		fill(255,228,196);
		ellipse(gameChar_x,gameChar_y-55,25,25);

		//eye
		fill(0);
		ellipse(gameChar_x+6,gameChar_y-55,5,5);

		//hat
		fill(255,0,0);
		arc(gameChar_x,gameChar_y-63,30,15,radians(170),radians(350),CHORD);

		//right hand
		fill(0)
		push();
		translate(gameChar_x,gameChar_y-35);
		rotate(radians(-100));
		rect(0,0,5,20);
		pop();

		//right leg
		push();
		translate(gameChar_x+1,gameChar_y-20);
		rotate(radians(-50));
		rect(0,0,5,20)
		pop();
	}

	function drawGameCharWalkingLeft(){
		//right hand
		stroke(0);
		push();
		fill(0);
		translate(gameChar_x,gameChar_y-40);
		rotate(radians(70));
		rect(0,0,5,25);
		pop();

		//right leg
		push();
		fill(0);
		translate(gameChar_x,gameChar_y-23);
		rotate(radians(-20));
		rect(0,0,5,25)
		pop();

		//body
		stroke(0);
		fill(255,0,0);
		rect(gameChar_x-10,gameChar_y-45,20,30);

		//face
		fill(255,228,196);
		ellipse(gameChar_x,gameChar_y-50,25,25);

		//eye
		fill(0);
		ellipse(gameChar_x-6,gameChar_y-50,5,5);

		//hat
		fill(255,0,0);
		arc(gameChar_x,gameChar_y-58,30,15,radians(190),radians(10),CHORD);

		//left hand
		fill(0);
		push();
		translate(gameChar_x,gameChar_y-30);
		rotate(radians(-70));
		rect(0,0,5,20);
		pop();

		//left leg
		push();
		translate(gameChar_x-4,gameChar_y-20);
		rotate(radians(20));
		rect(0,0,5,20)
		pop();
	}

	function drawGameCharWalkingRight(){
		//left hand
		stroke(0);
		fill(0);
		push();
		translate(gameChar_x,gameChar_y-30);
		rotate(radians(-70));
		rect(0,0,5,20);
		pop();

		//left leg
		push();
		translate(gameChar_x-4,gameChar_y-20);
		rotate(radians(20));
		rect(0,0,5,20)
		pop();

		//body
		stroke(0);
		fill(255,0,0);
		rect(gameChar_x-10,gameChar_y-45,20,30);


		//face
		fill(255,228,196);
		ellipse(gameChar_x,gameChar_y-50,25,25);

		//eye
		fill(0);
		ellipse(gameChar_x+6,gameChar_y-50,5,5);

		//hat
		fill(255,0,0);
		arc(gameChar_x,gameChar_y-58,30,15,radians(170),radians(350),CHORD);

		//right hand
		fill(0)
		push();
		translate(gameChar_x,gameChar_y-35);
		rotate(radians(70));
		rect(0,0,5,25);
		pop();

		//right leg
		push();
		translate(gameChar_x+1,gameChar_y-20);
		rotate(radians(-20));
		rect(0,0,5,20)
		pop();
	}

	function drawGameCharjumpingFacingFront(){
		stroke(0);

		//body
		fill(255,0,0);
		rect(gameChar_x-10,gameChar_y-55,20,30);

		//face
		fill(255,228,196);
		ellipse(gameChar_x,gameChar_y-60,25,25);

		//hat
		fill(255,0,0);
		curve(gameChar_x+25,gameChar_y-10,gameChar_x-15,gameChar_y-67,gameChar_x+15,gameChar_y-67,gameChar_x-25,gameChar_y-10);
		curve(gameChar_x+25,gameChar_y-97,gameChar_x-15,gameChar_y-67,gameChar_x+15,gameChar_y-67,gameChar_x-25,gameChar_y-97);
		curve(gameChar_x+25,gameChar_y-97,gameChar_x-15,gameChar_y-67,gameChar_x+15,gameChar_y-67,gameChar_x-25,gameChar_y-97);
		curve(gameChar_x+25,gameChar_y-70,gameChar_x-15,gameChar_y-67,gameChar_x+15,gameChar_y-67,gameChar_x-25,gameChar_y-70)

		//eyes
		fill(0);
		ellipse(gameChar_x-6,gameChar_y-60,5,5);
		ellipse(gameChar_x+6,gameChar_y-60,5,5);

		// Left hand
		push();
		translate(gameChar_x - 14, gameChar_y - 54);
		rotate(PI / 4);
		rect(0, 0, 5, 15);
		pop();

		//right hand
		push();
		translate(gameChar_x + 10, gameChar_y - 50);
		rotate(-PI/4);
		rect(0, 0, 5, 15);
		pop();

		//legs
		rect(gameChar_x-8,gameChar_y-25,5,20);
		rect(gameChar_x+3,gameChar_y-25,5,20); 
	}
	function drawGameCharDiedRight(){
		stroke(0);
		//face
		fill(255,228,196);
		ellipse(gameChar_x,gameChar_y,25,25);

		//eye
		fill(0);
		ellipse(gameChar_x,gameChar_y-5,5,5);

		//hat
		fill(255,0,0);
		arc(gameChar_x,gameChar_y,30,30,radians(100),radians(250),CHORD);

		//body
		fill(255,0,0);
		rect(gameChar_x+10,gameChar_y-10,30,20);

		//right hand
		push();
		translate(gameChar_x+20,gameChar_y);
		fill(0);
		rotate(PI/8);
		rect(0,0,20,5);
		pop();

		//right leg
		fill(0);
		rect(gameChar_x+40,gameChar_y,20,5)
	}

	function drawGameCharDiedLeft(){
		stroke(0);
		//face
		fill(255,228,196);
		ellipse(gameChar_x,gameChar_y,25,25);

		//eye
		fill(0);
		ellipse(gameChar_x,gameChar_y-5,5,5);

		//hat

		fill(255,0,0);

		arc(gameChar_x+5,gameChar_y,30,30,radians(280),radians(80),CHORD);

		//body
		fill(255,0,0);
		rect(gameChar_x-40,gameChar_y-10,30,20);

		//left hand
		push();
		translate(gameChar_x-35,gameChar_y+10);
		fill(0);
		rotate(-PI/8);
		rect(0,0,20,5)
		pop();

		//right leg
		fill(0);
		rect(gameChar_x-55,gameChar_y,20,5)
	}

	//-----end

	//enemy function
	function enemy1(x,alive,IHL,IHR,IL,IR){
		let enemy1Speed = 0;
		this.x = x;
		this.alive = alive;
		this.ihl = IHL;
		this.ihr = IHR;
		this.il = IL;
		this.ir = IR;

		this.animation = function(){

			//use .alive, .isLeft and .isRight to track each enemy individually
			//check if enemy still alive
			if(this.alive){
				
				//draw enemy moving right
				if(this.ir){
					enemy1Speed= 1;
					stroke(0);
					fill(255,0,0);
					triangle(this.x+10, floorPos_y,this.x+15,floorPos_y+5,this.x+30,floorPos_y-10);
					fill(0,100,0);
					arc(this.x,floorPos_y,40,60,radians(180),radians(0));
					fill(245,222,179);
					ellipse(this.x,floorPos_y,50,20);
					line(this.x-10,floorPos_y-25,this.x,floorPos_y-11);
					line(this.x-15,floorPos_y-20,this.x-10,floorPos_y-10);
					line(this.x-2,floorPos_y-29,this.x+13,floorPos_y-9);
					fill(0);
					ellipse(this.x+12,floorPos_y-4,5)
					push();
					strokeWeight(2);
					beginShape();
					vertex(this.x+20,floorPos_y+5);
					vertex(this.x+18,floorPos_y+3);
					vertex(this.x+16,floorPos_y+5);
					vertex(this.x+14,floorPos_y+3);
					vertex(this.x+12,floorPos_y+5);
					endShape();
					pop();
				}

				//draw enemy moving left
				else if(this.il){
					enemy1Speed = -1;
					stroke(0);
					fill(255,0,0);
					triangle(this.x-10, floorPos_y,this.x-15,floorPos_y+5,this.x-30,floorPos_y-10);
					fill(0,100,0);
					arc(this.x,floorPos_y,40,60,radians(180),radians(0));
					fill(245,222,179);
					ellipse(this.x,floorPos_y,50,20);
					line(this.x-10,floorPos_y-25,this.x,floorPos_y-11);
					line(this.x-15,floorPos_y-20,this.x-10,floorPos_y-10);
					line(this.x-2,floorPos_y-29,this.x+13,floorPos_y-9);
					fill(0);
					ellipse(this.x-12,floorPos_y-4,5)
					push();
					strokeWeight(2);
					beginShape();
					vertex(this.x-20,floorPos_y+5);
					vertex(this.x-18,floorPos_y+3);
					vertex(this.x-16,floorPos_y+5);
					vertex(this.x-14,floorPos_y+3);
					vertex(this.x-12,floorPos_y+5);
					endShape();
					pop();
				}

				this.x += enemy1Speed;
				//change to different direction when reach screen or canyon
				for(k=0;k<canyon.length;k++){
				if(this.x+30 == width+cameraPos_x || this.x +30 == canyon[k].x ){
					this.ir = false;
					this.il = true;
				}
				else if(this.x - 30 == canyon[k].x+canyon[k].width+50 || this.x-30==0+cameraPos_x){
					this.il = false;
					this.ir = true;
				}
			}
			}
			//if character hit the enemy on top
			//when enemy face left
			if(gameChar_y>=floorPos_y-20 && gameChar_x > this.x-30 && gameChar_x < this.x +30  && this.il && isHitLeft == false && isHitRight == false && isDeadleft==false && isDeadright==false){
				hitenemy.play();
				this.il = false;
				gameChar_y -= 100;
				this.ihl = true;
				this.alive = false;
				killenemy = true;
			}

			//when enemy face right
			if(gameChar_y>=floorPos_y-20  && gameChar_x > this.x-30 && gameChar_x < this.x +30 && this.ir && isHitLeft == false && isHitRight == false && isDeadleft==false && isDeadright==false){
				hitenemy.play();
				this.ir = false;
				gameChar_y -= 100;
				this.ihr = true;
				this.alive = false;
				killenemy = true;
			}

			//draw died enemy
			if(this.ihl && this.alive == false){
				stroke(0);
				fill(255,0,0);
				triangle(this.x-10, floorPos_y,this.x+5,floorPos_y+5,this.x-30,floorPos_y);
				fill(0,100,0);
				arc(this.x,floorPos_y,40,20,radians(180),radians(0));
				fill(245,222,179);
				ellipse(this.x,floorPos_y,50,10);
				fill(0);
				ellipse(this.x-12,floorPos_y-1,2)
				noFill();
				ellipse(this.x-20,floorPos_y+1,2)
			}

			else if(this.ihr && this.alive == false){
				stroke(0);
				fill(255,0,0);
				triangle(this.x+10, floorPos_y,this.x+5,floorPos_y+5,this.x+30,floorPos_y);
				fill(0,100,0);
				arc(this.x,floorPos_y,40,20,radians(180),radians(0));
				fill(245,222,179);
				ellipse(this.x,floorPos_y,50,10);
				fill(0);
				ellipse(this.x+12,floorPos_y-1,2)
				noFill();
				ellipse(this.x+20,floorPos_y+1,2)

			}

			//let the died enemy disappear 
			if(frameCount%100==0 && (this.ihl||this.ihr) && this.alive == false){
				this.ihl = false;
				this.ihr = false;
			}

			//if enemy hit character from left or right
			// if hit from right
			if(gameChar_x+10 >= this.x-35  && gameChar_x+10 <= this.x+35 && gameChar_y <= floorPos_y && gameChar_y >= floorPos_y -20 && this.alive == true && isHitRight == false && isHitLeft == false&& isDeadleft == false && isDeadright == false){
				gameChar_x -=70;
				gameChar_y -=50;
				isHitRight = true;
				isLeft = false;
				isRight = false;	
				enemyhitsound.play();
			}

			//if hit from left
			else if(gameChar_x-10 <= this.x+35 && gameChar_x-10 >= this.x-35 && gameChar_y <= floorPos_y && gameChar_y >= floorPos_y -20  && this.alive == true && isHitLeft == false && isHitRight == false&& isDeadleft == false && isDeadright == false){
				gameChar_x += 70;
				gameChar_y -= 50; 
				isHitLeft = true;
				isLeft = false;
				isRight = false;
				enemyhitsound.play();
			}
		} 

	}

	function enemy2(x,alive,isLeft,isRight){
		this.x = x;
		this.alive = alive;
		this.il = isLeft
		this.ir = isRight

		this.animation = function(){
			//check if enemy2 still alive
			if(this.alive==true){

				//draw when facing right
				if(this.ir){
					enemy2Speed = 1;
					//wing animation
					if(frameCount%70>=0 && frameCount%70<=20){
						stroke(0);
						fill(0);
						triangle(this.x+25,floorPos_y,this.x+30,floorPos_y,this.x+35,floorPos_y-20);
						fill(152,152,152);
						ellipse(this.x+30,floorPos_y,30,20);
						fill(0);
						triangle(this.x+25,floorPos_y,this.x+30,floorPos_y,this.x+20,floorPos_y-20);
						ellipse(this.x+40,floorPos_y,5,5);
					}
					else {
						stroke(0);
						fill(0);
						triangle(this.x+25,floorPos_y-5,this.x+30,floorPos_y-5,this.x+35,floorPos_y+15);
						fill(152,152,152);
						ellipse(this.x+30,floorPos_y-5,30,20);
						fill(0);
						triangle(this.x+25,floorPos_y-5,this.x+30,floorPos_y-5,this.x+20,floorPos_y+15);
						ellipse(this.x+40,floorPos_y-5,5,5);
					}
				}
				else if(this.il){
					enemy2Speed = -1;   
					if(frameCount%70>=0 && frameCount%70<=20){
						stroke(0);
						fill(0);
						triangle(this.x+30,floorPos_y,this.x+35,floorPos_y,this.x+35,floorPos_y-20);
						fill(152,152,152);
						ellipse(this.x+30,floorPos_y,30,20);
						fill(0);
						triangle(this.x+30,floorPos_y,this.x+35,floorPos_y,this.x+30,floorPos_y-20);
						ellipse(this.x+20,floorPos_y,5,5);
					}   
					else {
						stroke(0);
						fill(0);
						triangle(this.x+30,floorPos_y-5,this.x+35,floorPos_y-5,this.x+35,floorPos_y+15);
						fill(152,152,152);
						ellipse(this.x+30,floorPos_y-5,30,20);
						fill(0);
						triangle(this.x+30,floorPos_y-5,this.x+35,floorPos_y-5,this.x+30,floorPos_y+15);
						ellipse(this.x+20,floorPos_y-5,5,5);

					}
				}
				this.x += enemy2Speed;
				//change direction when reach canyon
				if(this.x+40 > canyon[1+2*i].x+canyon[1+2*i].width+45 && this.ir){
					this.ir = false;
					this.il = true;
				}
				else if(this.x+20 < canyon[1+2*i].x && this.il){
					this.il = false;
					this.ir = true;
				}
			}

			//hit enemy2 on top
			if(gameChar_y>floorPos_y-20 && gameChar_y<floorPos_y+10  && gameChar_x > this.x+8 && gameChar_x < this.x +50 && isHitRight == false && isHitLeft == false && this.alive ){
				hitenemy.play();
				this.alive=false;
				gameChar_y -= 50;
				d_enemy2 += 1;
				killenemy = true
			}
		}
	}

	function instruction(){
		fill(241,20,5)
		rect(10,10,850,400)
		fill(0)
		textSize(20)
		text('press A,D to move left and right',20,50)
		text('press W to jump',20,125)
		text('hold A & W to jump left; hold W & D to jump right; Release these key will stop the jumping',20,200)
		text('hit the enemy from top will perform double jump',20,275)
		text('jump and hit the block with star will push the star out of the block',20,350)
		text('press Enter to continue',20,380)
	}