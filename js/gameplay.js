
window.onload = function () {
	// phaser will try to load in webgl and default 
	//  to HTML5 Canvas if webGL is not supported
	var game = new Phaser.Game(1240,768,Phaser.AUTO,'game');

	game.state.add('Main', App.main);
	game.state.start('Main');
}

var App = {};
App.main = function(){
	this.key_pressed = "up";
	this.speed = 5;
	
	this.point_text = "Points : ";
	this.points = 0;
	this.fruit_offset = 20;	
}

App.main.prototype = {
	/*
	preloads game assets
	*/
	preload : function(){
		this.load.image('snake_block','assets/images/block.png');
		this.load.image('fruit','assets/images/fruit.png');
	},
	
	/* 
	executes once everything is loaded 
	*/
	create : function(){
		this.game.stage.backgroundColor = 0x5d5d5d;

		/*
			Sprites
		*/ 
		/* Snake */
		this.snake_head = this.drawSnake();
		console.log(this.snake_head);
		
		/* Fruit */
		this.drawFruit();

		/* Point Text */
		var style = { font: "32px Arial", fill: "#ffffff", align: "center" };
	    this.text = this.game.add.text(0, 0, this.point_text + this.points , style);
	},

	drawSnake : function(){
		var snake_block = this.game.add.sprite(
								this.game.world.centerX,
								this.game.world.centerY,
								'snake_block'
							);
		snake_block.anchor.setTo(0.5,0.5);
		snake_block.scale.setTo(0.2);
		this.game.physics.enable(snake_block,Phaser.Physics.ARCADE)
		return snake_block;
	},

	drawFruit : function(){
		// position the fruit in some random position in the screen
		// x: points between(fruit_offset,game.width-fruit_offset)
		// y: points between(fruit_offset,game.height-fruit_offset)
		this.fruit = this.game.add.sprite(
						this.getRandom(this.fruit_offset,this.game.width - this.fruit_offset), 
						this.getRandom(this.fruit_offset,this.game.height - this.fruit_offset), 
						'fruit'
					);
		this.fruit.anchor.setTo(0.5);
		this.fruit.scale.setTo(0.05);
		this.game.physics.enable(this.fruit,Phaser.Physics.ARCADE)
	},

	/*
	executes multiple time per second to update game state
	*/
	update : function(){
	    this.handleKeyUpdates();
	    this.moveSnake();
	    this.game.physics.arcade.overlap(this.snake_head,this.fruit,this.onCollision,null,this)
	},

	/*
	handles key updated changes
	*/ 
	handleKeyUpdates : function(){
		if (this.game.input.keyboard.isDown(Phaser.Keyboard.LEFT)){
			if( this.key_pressed != "right"){
	    		this.key_pressed = "left";
	    	}
	    }
	    else if (this.game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)){
	    	if( this.key_pressed != "left"){
	    		this.key_pressed = "right";
	    	}
	    }
		else if (this.game.input.keyboard.isDown(Phaser.Keyboard.UP)){
			if( this.key_pressed != "down"){
	    		this.key_pressed = "up";
	    	}
	    }
	    else if (this.game.input.keyboard.isDown(Phaser.Keyboard.DOWN)){
	    	if( this.key_pressed != "up"){
	    		this.key_pressed = "down";
	    	}
	    }
	},

	/*
	Handles collision
	*/ 
	onCollision : function(snake,fruit){
		fruit.kill();
		this.points +=1;
		this.updateText();
		if(this.points % 5 == 0){
			this.increaseSpeed();
		}
		this.updateSnake()
		this.drawFruit();
	},

	/*
	Add node to the snake
	*/
	updateSnake : function(){
		// this.snake.nextNode = 
	},

	/*
	Updates points Scored
	*/ 
	updateText : function(){
		this.text.setText(this.point_text + this.points);
	},

	increaseSpeed : function(){
		if(this.speed < 10){
			this.speed+=1 
		}
	},

	/*
	Moves snake on the basis of direction that was last key_pressed
	*/ 
	moveSnake: function (){
		switch(this.key_pressed){
			case "up":
				this.snake_head.y -= this.speed;
				break;
			case "down":
				this.snake_head.y += this.speed;		
				break;
			case "right":
				this.snake_head.x += this.speed;
				break;
			case "left":
				this.snake_head.x -= this.speed;
				break;
			default:
				console.log("error in snake direction");
		}

		// limit snake withing the game boundaries
		if(this.snake_head.x<=0){
			this.snake_head.x = this.game.width;
		}else if(this.snake_head.x>=this.game.width){
			this.snake_head.x = 0;
		}else if(this.snake_head.y >= this.game.height){
			this.snake_head.y = 0;
		}else if(this.snake_head.y <= 0){
			this.snake_head.y = this.game.height;
		}
	},


	/*
	Utils
	*/ 
	getRandom: function(lower_bound,upper_bound){
		return Math.floor(Math.random() * upper_bound) + 1;
	}
};