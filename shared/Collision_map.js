var GENERAL_VARS = require("./General_var.js")
var GENERAL_VAR = new GENERAL_VARS

function Collision_map() {}


//Pre: les posicion son respecte el mapa
Collision_map.prototype.in_screen = function(sprite, map_pos) {
    var dis_ussers = {x: Math.abs(sprite.x - map_pos.x), y: Math.abs(sprite.y - map_pos.y)}
    return (dis_ussers.x <= GENERAL_VAR.SCREEN_WIDTH/2 + GENERAL_VAR.SPRITE_SIZE/2 && dis_ussers.y <= GENERAL_VAR.SCREEN_HEIGHT/2 + GENERAL_VAR.SPRITE_SIZE/2)
}

Collision_map.prototype.can_move = function(sprite, move) {
    var new_pos = {x: -sprite.x + move.x + GENERAL_VAR.SCREEN_WIDTH/2 + GENERAL_VAR.SPRITE_SIZE/2, y: -sprite.y + move.y + GENERAL_VAR.SCREEN_HEIGHT/2 + GENERAL_VAR.SPRITE_SIZE/2}
    return new_pos.x >= 0 && new_pos.y >= 0 && 
    GENERAL_VAR.MAP_MATRIX[Math.floor(new_pos.y/GENERAL_VAR.SIZE_BLOCK)][Math.floor(new_pos.x/GENERAL_VAR.SIZE_BLOCK)] !== 1 
}

Collision_map.prototype.can_move_IA = function(sprite, move) {
    var new_pos = {x: sprite.x + move.x + GENERAL_VAR.SPRITE_SIZE/2, y: sprite.y + move.y + GENERAL_VAR.SPRITE_SIZE/2}
    return new_pos.x > 0 && new_pos.y > 0 && GENERAL_VAR.MAP_MATRIX[Math.floor(new_pos.y/GENERAL_VAR.SIZE_BLOCK)][Math.floor(new_pos.x/GENERAL_VAR.SIZE_BLOCK)] === 0 
}

Collision_map.prototype.hidded = function(sprite) {
    var new_pos = {x: sprite.position.x + GENERAL_VAR.SPRITE_SIZE/2, y: sprite.position.y + GENERAL_VAR.SPRITE_SIZE/2}
    return GENERAL_VAR.MAP_MATRIX[Math.floor(new_pos.y/GENERAL_VAR.SIZE_BLOCK)][Math.floor(new_pos.x/GENERAL_VAR.SIZE_BLOCK)] === 2
}

Collision_map.prototype.circle_coll = function(sprite_1, sprite_2) {
    var dis_x = sprite_1.x - sprite_2.x
    var dis_y = sprite_1.y - sprite_2.y
    var rad_s = GENERAL_VAR.SPRITE_SIZE

    return dis_x*dis_x + dis_y*dis_y < rad_s*rad_s
}

module.exports = Collision_map