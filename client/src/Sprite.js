var GENERAL_VARS = require("../../shared/General_var.js")
var GENERAL_VAR = new GENERAL_VARS

function Sprite(pos, is_cop, stage, sprite_sheet) {
    var scope = this
    scope.live = true
    scope.attack_type = false
    scope.is_cop = is_cop
    scope.dir = 0
    scope.sequence = 1
    scope.animating = false
    if (is_cop === 2) scope.sprite  = new PIXI.Sprite(sprite_sheet[2][1][1]);
    else scope.sprite  = new PIXI.Sprite(sprite_sheet[is_cop][0][0]);
    scope.sprite.width = scope.sprite.height = GENERAL_VAR.SPRITE_SIZE
    scope.sprite.anchor.set(0.5, 0.5)
    if (stage) stage.addChild(scope.sprite)
    else scope.sprite.tint = 0x660000;
    if (pos) {
        scope.sprite.position.x = pos.x
        scope.sprite.position.y = pos.y

    }
    else {
        scope.sprite.position.x = GENERAL_VAR.SCREEN_WIDTH/2
        scope.sprite.position.y = GENERAL_VAR.SCREEN_HEIGHT/2
    }
    setInterval(function() {
        if (scope.sequence === 2) scope.sequence = 1
        else scope.sequence = 2
    }, 100)
}

Sprite.prototype.animation = function(move, sprite_sheet) {
    if (move.x === 0 && move.y === 0) {
        if (this.is_cop !== 2) 
            this.sprite.texture = sprite_sheet[this.is_cop][this.dir][0]
    }
    else {
        if (move.x > 0) this.dir = 3
        else if (move.x < 0) this.dir = 2
        else if (move.y < 0) this.dir = 1
        else this.dir = 0
        
    this.sprite.texture = sprite_sheet[this.is_cop][this.dir][this.sequence]
    }
}

Sprite.prototype.dead = function(sprite_sheet) {
    this.sprite.texture = sprite_sheet[this.is_cop][0][3]
}

module.exports = Sprite

//0 = caco, 1 = poli, 2 = passer
// 0 = front, 1 = back, 2 = left, 3 = right
// 0 = static, 1 = animation 1, 2 = animation 2, 3 = dead