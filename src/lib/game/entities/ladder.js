ig.module(
	'game.entities.ladder'
)
.requires(
	'impact.entity'
)
.defines(function(){

EntityLadder = ig.Entity.extend({
	size: {x: 64, y: 64},
	
	_wmScalable: true,
	_wmDrawBox: true,
	_wmBoxColor: 'rgba(150, 150, 255, 0.7)',
	
	
	
	type: ig.Entity.TYPE.B,
        checkAgainst: ig.Entity.TYPE.A,
        collides: ig.Entity.COLLIDES.LITE,

        flip: false,
        
        fadeStart: 2,
        fadeEnd: 5,

        init: function(x, y, settings) {
            this.parent(x, y, settings);
        },

        update: function() {
            var target = ig.game.getEntitiesByType( EntityPlayer )[0];
                if (target)target.canClimb=false;
            },

        check: function(other) {
		    if (other instanceof EntityPlayer){
                if (other.jumpTimer.delta()>0)other.canClimb=true;
            }
        }
    });
});
