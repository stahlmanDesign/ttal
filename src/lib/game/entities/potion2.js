
ig.module('game.entities.potion2').requires('impact.entity').defines(function () {
	EntityPotion2 = ig.Entity.extend({
		size: {
			x: 10,
			y: 10
		},
		checkAgainst: ig.Entity.TYPE.A,
		animSheet: new ig.AnimationSheet('media/TTAL-sprite-objects.png', 10, 10),
		//collect: new ig.Sound('media/sounds/collect.ogg'),
		init: function (x, y, settings) {
			this.parent(x, y, settings);
			this.addAnim('idle', 1, [14]);
			this.currentAnim.gotoRandomFrame();
		},
		check: function (other) {
			this.kill();
			//this.collect.play();
			ig.game.potion++;
            if (other instanceof EntityPlayer)other.health+=250;
            ig.log(other.health);
		},
		update: function () {
			this.currentAnim.update();
		}
	});
});