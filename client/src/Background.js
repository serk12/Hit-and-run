var GENERAL_VARS = require("../../shared/General_var.js")
var GENERAL_VAR = new GENERAL_VARS
function Background(stage, is_cop) {
    var scope = this
    scope.sprite  = new PIXI.Sprite.fromImage("../_Images/background.jpg");
    scope.sprite.width = GENERAL_VAR.MAP_WIDTH
    scope.sprite.height = GENERAL_VAR.MAP_HEIGHT
    scope.sprite.anchor.x = (GENERAL_VAR.SCREEN_WIDTH/20)/GENERAL_VAR.MAP_WIDTH
    scope.sprite.anchor.y = (GENERAL_VAR.SCREEN_HEIGHT/20)/GENERAL_VAR.MAP_HEIGHT
    scope.sprite.position.set(0, 0)
    
    var random = {x: Math.random()*GENERAL_VAR.SIZE_SPAWN, y: Math.random()*GENERAL_VAR.SIZE_SPAWN}
    if (is_cop === 1) {
        stage.position.x = -random.x 
        stage.position.y = -random.y 
    }
    else {
        stage.position.x = -GENERAL_VAR.MAP_WIDTH  + GENERAL_VAR.SCREEN_WIDTH  + random.x
        stage.position.y = -GENERAL_VAR.MAP_HEIGHT + GENERAL_VAR.SCREEN_HEIGHT + random.y
    }
    stage.addChild(scope.sprite);
}

Background.prototype.spawn = function (stage, is_cop) {
    var random = {x: Math.random()*GENERAL_VAR.SIZE_SPAWN, y: Math.random()*GENERAL_VAR.SIZE_SPAWN}
    if (is_cop === 1) {
        stage.position.x = -random.x
        stage.position.y = -random.y 
    }
    else {
        stage.position.x = -GENERAL_VAR.MAP_WIDTH  + GENERAL_VAR.SCREEN_WIDTH  + random.x
        stage.position.y = -GENERAL_VAR.MAP_HEIGHT + GENERAL_VAR.SCREEN_HEIGHT + random.y
    }
}

module.exports = Background