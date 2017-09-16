
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
	this.speed = 10;
	
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

		// this.game.physics.startSystem(Phaser.Physics.ARCADE);

		/*
			Sprites
		*/ 
		/* Snake */
		this.snake_block = this.game.add.sprite(
								this.game.world.centerX,
								this.game.world.centerY,
								'snake_block'
							);
		this.snake_block.anchor.setTo(0.5,0.5);
		this.snake_block.scale.setTo(0.2);
		this.game.physics.enable(this.snake_block,Phaser.Physics.ARCADE)
	   	
		/* Fruit */
		this.drawFruit();

		/* Point Text */
		var style = { font: "32px Arial", fill: "#ffffff", align: "center" };
	    this.text = this.game.add.text(0, 0, this.point_text + this.points , style);

	    /* 
	    	Physics 
	    */ 
		// this.game.physics.startSystem(Phaser.Physics.ARCADE);
		// this.game.physics.arcade.enable([this.snake_block, this.fruit]);

		// this.snake_block.body.collideWorldBounds = true;
		// this.fruit.body.collideWorldBounds = true;
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
	    this.game.physics.arcade.overlap(this.snake_block,this.fruit,this.onCollision,null,this)
	},

	/*
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
		this.drawFruit();

	},

	/*
	Updates points Scored
	*/ 
	updateText : function(){
		this.text.setText(this.point_text + this.points);
	},

	/*
	Moves snake on the basis of direction that was last key_pressed
	*/ 
	moveSnake: function (){
		switch(this.key_pressed){
			case "up":
				this.snake_block.y -= 10;
				break;
			case "down":
				this.snake_block.y += 10;		
				break;
			case "right":
				this.snake_block.x += 10;
				break;
			case "left":
				this.snake_block.x -= 10;
				break;
			default:
				console.log("error in snake direction");
		}

		// limit snake withing the game boundaries
		if(this.snake_block.x<=0){
			this.snake_block.x = this.game.width;
		}else if(this.snake_block.x>=this.game.width){
			this.snake_block.x = 0;
		}else if(this.snake_block.y >= this.game.height){
			this.snake_block.y = 0;
		}else if(this.snake_block.y <= 0){
			this.snake_block.y = this.game.height;
		}
	},


	/*
	Utils
	*/ 
	getRandom: function(lower_bound,upper_bound){
		return Math.floor(Math.random() * upper_bound) + 1;
	}
};