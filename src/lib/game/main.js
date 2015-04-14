ig.module(
	'game.main'
)
.requires(
	'impact.game',
	'impact.font',
	/* 'impact.debug.debug', */
	'game.entities.player',
	'game.entities.enemyknight',
    'game.entities.enemyknight2',
    'game.entities.wingeddevil',
    'game.entities.wingeddevil2',
    'game.entities.ghost',
    'game.entities.ghost2',
    'game.entities.demon',
    'game.entities.potion',
    'game.entities.potion2',
    'game.entities.potion3',
    'game.entities.debriswater',
	'game.levels.test',

    'game.entities.checkpoint'
)
.defines(function(){

MyGame = ig.Game.extend({

	gravity: 300, // All entities are affected by this

	// Load a font
	font: new ig.Font( 'media/04b03.font.png' ),
    respawnTime: null,
	// Checkpoint sequence
	// this stores the highest checkpoint in the sequence
	// stores 0 if no checkpoint has been reached yet
	checkpointSequence: 0,

	// Respawn point
	// this stores the coordinates the player will spawn at
	// it is changed whenever the player reaches a checkpoint
	// it also initializes when the player spawns
	spawnPointX: 0,
	spawnPointY: 0,

	// Player respawn
	// when this turns true, main.js will spawn a new player at the respawn point above and then set it false again
	playerDead: false,

	init: function() {
		// Bind keys
		ig.input.bind( ig.KEY.LEFT_ARROW, 'left' );
		ig.input.bind( ig.KEY.RIGHT_ARROW, 'right' );
        ig.input.bind( ig.KEY.UP_ARROW, 'up' );
		ig.input.bind( ig.KEY.DOWN_ARROW, 'down' );
		ig.input.bind( ig.KEY.X, 'jump' );
		ig.input.bind( ig.KEY.C, 'shoot' );

		// Load the LevelTest as required above ('game.level.test')
		this.loadLevel( LevelTest );

        // Begin the timers
        this.respawnTimer = new ig.Timer();
	},

	update: function() {
		// Update all entities and BackgroundMaps
		this.parent();

		// screen follows the player
		var player = this.getEntitiesByType( EntityPlayer )[0];
		if( player ) {
			this.screen.x = player.pos.x - ig.system.width/2;
			this.screen.y = player.pos.y - ig.system.height/2;
            this.playerHealth=player.health
		}

        // Respawn the player
		if (this.playerDead) {

			if (this.respawnTimer.delta() >= 0) {
				ig.game.spawnEntity( EntityPlayer, this.spawnPointX, this.spawnPointY );
				this.playerDead = false;
			}
		}


	},

	draw: function() {
		// Draw all entities and BackgroundMaps
		this.parent();

		//this.font.draw( 'Arrow Keys, X, C', 2, 2 );
        this.font.draw( 'Player health: '+this.playerHealth, 2, 2 );
	}
});


// Start the Game with 60fps, a resolution of 240x160, scaled
// up by a factor of 2
ig.main( '#canvas', MyGame, 60, 480, 320, 2 );

});
