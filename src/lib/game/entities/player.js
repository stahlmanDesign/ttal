ig.module(
	'game.entities.player'
)
.requires(
	'impact.entity'
)
.defines(function(){

EntityPlayer = ig.Entity.extend({
	
	// The players (collision) size is a bit smaller than the animation
	// frames, so we have to move the collision box a bit (offset)
	size: {x: 8, y:15},
	offset: {x: 8, y: 9},
	
	maxVel: {x: 100, y: 200},
	friction: {x: 600, y: 0},
	
	type: ig.Entity.TYPE.A, // Player friendly group
	checkAgainst: ig.Entity.TYPE.NONE,
	collides: ig.Entity.COLLIDES.PASSIVE,
	
	animSheet: new ig.AnimationSheet( 'media/TTAL-sprites-entities.png', 24, 24 ),	
	
	
	// These are our own properties. They are not defined in the base
	// ig.Entity class. We just use them internally for the Player
	flip: false,
	accelGround: 400,
	accelAir: 150,
	jump: 250,
	health: 200,
	flip: false,
	canClimb: false,
    isClimbing: false,
    momentumDirection: {'x':0,'y':0},
    jumpTimer: new ig.Timer(0.4),
    swordTimer: new ig.Timer(0.06),
    
	init: function( x, y, settings ) {
		this.parent( x, y, settings );
		
		// Add the animations
		this.addAnim( 'idle', 1, [0] );
		this.addAnim( 'run', 0.07, [0,1] );
		this.addAnim( 'jump', 1, [2] );
        this.addAnim( 'sword', 0.6, [2] );
		this.addAnim( 'fall', 0.4, [1] );
	},
	/*
	check: function (other){
    
        if (other instanceof EntityLadder){
            
            //stand on top of ladder
            var foot = Math.floor(this.pos.y+this.size.y);
            var ladderTop = other.pos.y;
            console.log("foot = "+foot)
            console.log("ladderTop = "+ladderTop);
            //if foot is higher than top of ladder
            if (foot < ladderTop){this.isClimbing=true;this.gravityFactor = 0;this.vel.y=0;this.accel.y=0;this.momentumDirection.y=0;}
            
        
        }
   
    },
     */
	update: function() {
		
		// move left or right
		var accel = this.standing ? this.accelGround : this.accelAir;
		if( ig.input.state('left') ) {
			this.accel.x = -accel;
			this.flip = true;
		}
		else if( ig.input.state('right') ) {
			this.accel.x = accel;
			this.flip = false;
		}
		else {
			this.accel.x = 0;
		}
		
		// climb
		if( this.canClimb && (ig.input.pressed('up') ) ) {
			this.vel.x = 0;
            this.momentumDirection.y >-1 ? this.momentumDirection.y -- : this.momentumDirection.y = -1;
            this.isClimbing=true;
        }else if( this.canClimb && (ig.input.pressed('down') ) ) {
			this.vel.x = 0;
            this.momentumDirection.y <1 ? this.momentumDirection.y ++ : this.momentumDirection.y = 1;
            this.isClimbing=true;
        }else if (this.isClimbing && this.momentumDirection.y<=0){
            this.gravityFactor = 0;this.vel.y=0;this.accel.y=0;
            
        }
                
        if (this.isClimbing){
            this.gravityFactor = 0;
            this.accel.y=0;
            this.vel.y = 25*this.momentumDirection.y;            
            
        }else{
            this.gravityFactor = 1;
            this.accel.y = 0;
        }
        if (this.canClimb==true && this.vel.y>0){this.vel.y=0;this.accel.y=0;this.isClimbing=true;}
        if (this.canClimb==false)this.isClimbing=false;
        //if (this.canClimb){this.gravityFactor=0;this.vel.y=0;this.accel.y=0;}
        if (this.canClimb && this.momentumDirection.y==0){this.gravityFactor = 0;this.vel.y=0;this.accel.y=0;}
        
                
		// jump
		if( (this.standing || this.isClimbing) && (ig.input.pressed('jump') ) ) {
			this.vel.y = -this.jump;
            
            //allow to jump off ladders
            this.jumpTimer.set(0.4);
            this.canClimb=false;
            this.isClimbing=false;
        }
        		
		// shoot
		if( ig.input.pressed('shoot') ) {
			ig.game.spawnEntity( EntitySlimeGrenade, this.pos.x, this.pos.y, {flip:this.flip} );
            this.swordTimer.set(0.1);
		}
		
		// set the current animation, based on the player's speed
		if( this.vel.y < 0 ) {
			this.currentAnim = this.anims.jump;
		}
		else if( this.vel.y > 0 ) {
			this.currentAnim = this.anims.fall;
		}
		else if( this.vel.x != 0 ) {
			this.currentAnim = this.anims.run;
		}
		else {
			this.currentAnim = this.anims.idle;
		}
		
        if (this.swordTimer.delta()<0){this.currentAnim = this.anims.sword};


		this.currentAnim.flip.x = this.flip;
		
        // Player death if health reaches 1
                if (this.health <= 1) {
                    ig.game.respawnTimer.set(1);
                    ig.game.playerDead = true;
                    console.log("ig.game.playerDead = "+ig.game.playerDead);
                    this.kill();
                }        
		
		// move!
		this.parent();
	}
    
});


// The grenades a player can throw are NOT in a separate file, because
// we don't need to be able to place them in Weltmeister. They are just used
// here in the code.

// Only entities that should be usable in Weltmeister need to be in their own
// file.
EntitySlimeGrenade = ig.Entity.extend({
	size: {x: 4, y: 4},
	offset: {x: 2, y: -5},
	maxVel: {x: 200, y: 200},
	
	
	// The fraction of force with which this entity bounces back in collisions
	bounciness: 0.6, 
	
	type: ig.Entity.TYPE.NONE,
	checkAgainst: ig.Entity.TYPE.B, // Check Against B - our evil enemy group
	collides: ig.Entity.COLLIDES.PASSIVE,
		
	animSheet: new ig.AnimationSheet( 'media/invisibleProjectile.png', 8, 8 ),
	
	bounceCounter: 0,
	lungeTimer: new ig.Timer(0.01),
	
	init: function( x, y, settings ) {
		this.parent( x, y, settings );
		this.lungeTimer.set(0.06);
		this.vel.x = (settings.flip ? -this.maxVel.x : this.maxVel.x);
		this.vel.y = 0;
		this.addAnim( 'idle', 0.1, [0] );
	},
		/*
	handleMovementTrace: function( res ) {
		this.parent( res );
		if( res.collision.x || res.collision.y ) {
			
			// only bounce 3 times
			this.bounceCounter++;
			if( this.bounceCounter > 3 ) {
				this.kill();
			}
		}
	},
    */
    
    update: function(){
        this.parent();
        if (this.lungeTimer.delta() >0){
            this.kill(); // lunge actually throws a projectile for a very short time and then kills it
        }
    },
	
	// This function is called when this entity overlaps anonther entity of the
	// checkAgainst group. I.e. for this entity, all entities in the B group.
	check: function( other ) {
		//if (other instanceof EntityLadder){
            // don't kill ladder
            
        //}else{
            other.receiveDamage( 3, this );
            this.kill();
        //}
        
        
	}	
});

});