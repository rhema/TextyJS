/////tbd plan////////
//Pairs and Progeny//
/////////////////////

// Create the canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 800;
canvas.height = 600;
document.body.appendChild(canvas);

var stages = ["stage1"];
var current_stage = 0;
//need more images for things to try to pair...


// Background image ... maybe need a for loop here...
var bgReady = false;
//Need more images, need player and enemy images... too
var stageImages = [];
var entImages = [];
var current_ents = [];

function RandomPoint()
{
	this.x = canvas.width * Math.random();
	this.y = canvas.height * Math.random();
}

function wrap_me()
{
	if(this.x < 0)
		this.x += canvas.width;
	if(this.y < 0)
		this.y += canvas.height;
	if(this.x > canvas.width)
		this.x = 0;
	if(this.y > canvas.height)
		this.y = 0;
	
}

function touching()
{
	var dist_to_touch = 30;//should compute from hulls...
	for(var ent in current_ents)
	{
		ent = current_ents[ent];
		if(this.id == ent.id)
			continue;
		var dist = Math.sqrt((this.x-ent.x)*(this.x-ent.x) +  (this.y-ent.y)*(this.y-ent.y));
		//console.log(dist);
		if(dist < dist_to_touch)
			return ent;
	}
	return false;
}

function combine_or_kill()
{
	var touch = this.touching();
	if(touch)
	{
		if(touch.kind == this.kind)
		{//make last touched happen twice
			// if(touch.id == 1)
			// {
				// //console.log(touch.id+" touching "+this.id);
				// this.touched_last = touch.id;
				// return;
			// } 
					//		console.log(touch.id+" touching "+this.id);

			this.speed_x = 0;
			this.speed_y = 0;
			touch.speed_x = 0;
			touch.speed_y = 0;
			this.update = jiggle_in_place;
			touch.update = jiggle_in_place;
		}
		else
		{
			this.scale *= .99;
		}
	}
}

function jiggle_in_place()
{
	if(this.center_x == undefined)
		this.center_x = this.x;
	if(this.center_y == undefined)
		this.center_y = this.y;
	if(this.phase == undefined)
		this.phase = 0;
	this.phase += .02;
	var radius = 5;
	this.x = this.center_x + radius*Math.cos(this.phase);
	this.y = this.center_y + radius*Math.sin(this.phase);

}

function move_randomly()
{
	if(this.speed_x == undefined)
		this.speed_x = Math.random() * 4 - 2;
	if(this.speed_y == undefined)
		this.speed_y = Math.random() * 4 - 2;
	this.x += this.speed_x;
	this.y += this.speed_y;
	this.temp = wrap_me;
	this.temp();
	this.combine_or_kill();
}

function draw_normal()
{
	//ctx.drawImage(this.image, this.x, this.y)
	ctx.drawImage(this.image, this.x, this.y,this.image.width*this.scale,this.image.height*this.scale);
}

//stage: number of the stage
//kind: a or b
var id = 1;
function entity(stage,kind,x,y)
{
	this.id = id;
	id += 1;
	this.scale = 1;
	this.status = 1;//1 alive, 0 dead, 2 combined
	this.x = x;
	this.y = y;
	this.stage = stage;
	this.kind = kind;
	this.update = move_randomly;
	this.image = entImages[stage][kind];
	this.draw = draw_normal;
	this.touching = touching;
	this.combine_or_kill = combine_or_kill;
	current_ents.push(this);
	
}

for(var i=0; i<stages.length; i+=1)
{
	stageImage = new Image();
	//console.log("loading"+stages[i]);
	stageImage.onload = function() {
		bgReady = true;
	};
	stageImages.push(stageImage);
	stageImage.src = "images/"+stages[i]+".png";
	
	var ent_a = new Image();
	ent_a.src = "images/"+stages[i]+"enta.png";
	var ent_b = new Image();
	ent_b.src = "images/"+stages[i]+"entb.png";
	var ents = {'a':ent_a,'b':ent_b};
	entImages.push(ents);
	
}
// 
// var bgImage = new Image();
// bgImage.onload = function () {
	// bgReady = true;
// };
// bgImage.src = "images/background.png";

// Hero image
var heroReady = false;
var heroImage = new Image();
heroImage.onload = function () {
	heroReady = true;
};
heroImage.src = "images/hero.png";
// 
// // Monster image
// var monsterReady = false;
// var monsterImage = new Image();
// monsterImage.onload = function () {
	// monsterReady = true;
// };
// monsterImage.src = "images/monster.png";

// Game objects
var hero = {
	speed: 256 // movement in pixels per second
};

// var monster = {};
// var monstersCaught = 0;

// Handle keyboard controls
var keysDown = {};

addEventListener("keydown", function (e) {
	keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
	delete keysDown[e.keyCode];
}, false);

// Reset the game when the player catches a monster
var reset = function () {
	hero.x = canvas.width / 2;
	hero.y = canvas.height / 2;

	// // Throw the monster somewhere on the screen randomly
	// monster.x = 32 + (Math.random() * (canvas.width - 64));
	// monster.y = 32 + (Math.random() * (canvas.height - 64));
};

// Update game objects
var update = function (modifier) {
	if (38 in keysDown) { // Player holding up
		hero.y -= hero.speed * modifier;
	}
	if (40 in keysDown) { // Player holding down
		hero.y += hero.speed * modifier;
	}
	if (37 in keysDown) { // Player holding left
		hero.x -= hero.speed * modifier;
	}
	if (39 in keysDown) { // Player holding right
		hero.x += hero.speed * modifier;
	}

	// // Are they touching?
	// if (
		// hero.x <= (monster.x + 32)
		// && monster.x <= (hero.x + 32)
		// && hero.y <= (monster.y + 32)
		// && monster.y <= (hero.y + 32)
	// ) {
		// ++monstersCaught;
		// reset();
	// }
};

// Draw everything
var render = function () {
	if (bgReady) {
		//ctx.drawImage(bgImage, 0, 0);
		ctx.drawImage(stageImages[current_stage] , 0, 0);
	}

	if (heroReady) {
		ctx.drawImage(heroImage, hero.x, hero.y);
	}

	// if (monsterReady) {
		// ctx.drawImage(monsterImage, monster.x, monster.y);
	// }
	
	//draw entities
	for(var ent in current_ents)
	{
		current_ents[ent].update();
		current_ents[ent].draw();
	}

	// Score
	// ctx.fillStyle = "rgb(250, 250, 250)";
	// ctx.font = "24px Helvetica";
	// ctx.textAlign = "left";
	// ctx.textBaseline = "top";
	// ctx.fillText("Goblins caught: " + monstersCaught, 32, 32);
};

function initStage()
{
	if(current_stage == 0)
	{
		//create entities
		for(var i=0;i<10; i+=1)
		{
			var p = new RandomPoint();
			new entity(current_stage,"a",p.x,p.y);
			var p = new RandomPoint();
			new entity(current_stage,"b",p.x,p.y);
		}
	}
}



// The main game loop
var main = function () {
	var now = Date.now();
	var delta = now - then;

	update(delta / 1000);
	render();

	then = now;
};

// Let's play this game!
reset();
var then = Date.now();
setInterval(main, 1); // Execute as fast as possible
setTimeout("initStage()",1000);
