ig.module(
	'game.entities.enemyknight'
)
.requires(
	'impact.entity'
)
.defines(function(){
	
EntityEnemyknight = ig.Entity.extend({
	size: {x: 8, y: 15},
    offset: {x: 8, y: 9},
	maxVel: {x: 50, y: 200},
	friction: {x: 150, y: 0},
	
	type: ig.Entity.TYPE.B, // Evil enemy group
	checkAgainst: ig.Entity.TYPE.A, // Check against friendly
	collides: ig.Entity.COLLIDES.PASSIVE,
	
	health: 10,
	
	
	speed: 14,
	flip: false,
	
	animSheet: new ig.AnimationSheet( 'media/TTAL-sprites-entities.png', 24, 24 ),
	
	
	init: function( x, y, settings ) {
		this.parent( x, y, settings );
		
		this.addAnim( 'crawl', 0.2, [3,4] );
        this.addAnim( 'sword', 0.1, [5] );
	},
	
	
	update: function() {
		// near an edge? return!
		if( !ig.game.collisionMap.getTile(
				this.pos.x + (this.flip ? +4 : this.size.x -4),
				this.pos.y + this.size.y+1
			)
		) {
			this.flip = !this.flip;
		}
		
        this.currentAnim.flip.x = this.flip;
        
		var xdir = this.flip ? -1 : 1;
		this.vel.x = this.speed * xdir;
		
        
        
		this.parent();
        this.currentAnim = this.anims.crawl;
	},
	
	
	handleMovementTrace: function( res ) {
		this.parent( res );
		
		// collision with a wall? return!
		if( res.collision.x ) {
			this.flip = !this.flip;
		}
	},	
	
	check: function( other ) {
		other.receiveDamage( 1, this );
        this.currentAnim = this.anims.sword;
	},kill: function () {
		this.parent();
        for (var i=0;i<13;i++){
        
            ig.game.spawnEntity(EntityShard, this.pos.x+3, this.pos.y, -4);
        }
	}
});

});