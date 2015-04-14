ig.module(
    'game.entities.checkpoint'
)
.requires(
    'impact.entity'
)

.defines(function(){
// All entities must be subclassed from ig.Entity
EntityCheckpoint = ig.Entity.extend({
           
        // Set properties here
        size: {x:20, y:20},
	    zIndex: -1, // Draw in the background
                
        type: ig.Entity.TYPE.NONE, // Neutral entity type
        checkAgainst: ig.Entity.TYPE.A,
        collides: ig.Entity.COLLIDES.PASSIVE,
        
        animSheet: new ig.AnimationSheet('media/tree.png', 20, 20),

	  gravityFactor: 1,
		
	  // controls if the checkpoint has been activated by the player
	  active: false,

	  // allows weltmeister to set the checkpoints in a series
	  //		this way the player cannot backtrack and activate an earlier
	  //		checkpoint when a later checkpoint is already active
      //        MUST BE SET AS VARIABLE IN WELTMEISTER
	  sequence: 0,
        		    
	  // This method is called only once on creation
        init: function( x, y, settings ) {
            // Call the parent constructor
            this.parent( x, y, settings );
               
            // this.addAnim( AnimationName, FrameTime, ArrayOfFrames, Repeat)
            // FrameTime is in seconds
            this.addAnim( 'red', 1, [0], false );
		this.addAnim( 'green', 1, [1], false );
	    
        },
   
        // This method is called on every frame
        update: function() {	    
		// If the checkpoint is inactive, turn red
		if (!this.active) {
			this.currentAnim = this.anims.red;
		}
                      
            // Call the parent update() method to move the entity according to its physics
            this.parent(); 
        },

	  // This method is called upon collision with entity type A
	  check: function( other ) {
      
		// If this checkpoint is not active, and this is the farthest checkpoint reached...
		if ((!this.active) && (ig.game.checkpointSequence < this.sequence)) {

			// Animate the checkpoint to look active
			this.currentAnim = this.anims.green;

			// Spawn some particles
			ig.game.spawnEntity( EntityShard, this.pos.x+3, this.pos.y, -38);
			ig.game.spawnEntity( EntityShard, this.pos.x+3, this.pos.y+2, -25);
			ig.game.spawnEntity( EntityShard, this.pos.x+3, this.pos.y+4, -13);
			ig.game.spawnEntity( EntityShard, this.pos.x+5, this.pos.y+4, 13);
			ig.game.spawnEntity( EntityShard, this.pos.x+5, this.pos.y+2, 13);
			ig.game.spawnEntity( EntityShard, this.pos.x+5, this.pos.y, 38);

			// Tell main.js that this is the farthest checkpoint reached so far
			ig.game.checkpointSequence = this.sequence;

			// Then tell main.js the exact coordinates to spawn the player from now on
			ig.game.spawnPointX = other.pos.x;
			ig.game.spawnPointY = other.pos.y;

			// And finally, activate this checkpoint
			this.active = true;
		}
	  }
        });

// Shrapnel particles
// 	Cosmetic particle effects
// The Impact API says:
//	Objects that don't need to be placed in Weltmeister don't need their own file
EntityShard = ig.Entity.extend({
	size: {x: 6, y: 6},
	maxVel: {x: 80, y: 50},
	
	bounciness: 0.1, 
	
	type: ig.Entity.TYPE.NONE,
	collides: ig.Entity.COLLIDES.PASSIVE,
		
	animSheet: new ig.AnimationSheet( 'media/shard1.png', 8, 8),
	
	bounceNum: 0,
	
	// This method is called only once on creation
	init: function( x, y, settings ) {
		this.parent( x, y, settings );
		
		this.vel.x = settings;
		this.vel.y = -150+Math.floor(Math.random()*-49);
		this.addAnim( 'fly', 0.1+Math.floor(Math.random()*3)/10, [0,1,2,3] );
		this.currentAnim.frame = Math.floor(Math.random()*4);
	},
		
	handleMovementTrace: function( res ) {
		this.parent( res );
		if( res.collision.x || res.collision.y ) {
			
			// only bounce 1 times
			this.bounceNum++;
			if( this.bounceNum > 1 ) {
				this.kill();
			}
		}
	}	
});

});