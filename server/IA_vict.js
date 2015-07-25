var GENERAL_VARS = require("../shared/General_var.js")
var GENERAL_VAR = new GENERAL_VARS

function Vict() {
    var scope = this

    //public info for the client
    scope.live = true
    var random = {x:Math.floor(Math.random()*(GENERAL_VAR.MAP_MATRIX[0].length - 1)), y: Math.floor(Math.random()*(GENERAL_VAR.MAP_MATRIX.length - 1))}
    while (GENERAL_VAR.MAP_MATRIX[random.y][random.x] === 1)
         random = {x:Math.floor(Math.random()*(GENERAL_VAR.MAP_MATRIX[0].length - 1)), y: Math.floor(Math.random()*(GENERAL_VAR.MAP_MATRIX.length - 1))}
    
    scope.position = {x: random.x*(GENERAL_VAR.SIZE_BLOCK - 2) + GENERAL_VAR.SIZE_BLOCK, y: random.y*(GENERAL_VAR.SIZE_BLOCK - 2) + GENERAL_VAR.SIZE_BLOCK}
    //private info for the server
    scope.path_done = GENERAL_VAR.SIZE_BLOCK
    scope.dir = Math.floor(Math.random()*4)
    if(Math.floor(Math.random()*2)) scope.path = [0,2,1,3]
    else scope.path = [3,1,2,0]
    scope.reaction = false
    scope.move_path = {x: 0, y: 0}
}

//pre: Vict is alive
Vict.prototype.move = function(can_move, crime_scene) {
    if (crime_scene && !this.reaction || !can_move) {
        this.dir += 2
        if (this.dir > 3) this.dir -= 4
        this.path_done = GENERAL_VAR.SIZE_BLOCK + (GENERAL_VAR.SIZE_BLOCK - this.path_done)
        if(can_move) this.reaction = true
        else this.move_path.x = this.move_path.y = 0
        
    }
    else {
        this.move_path.x = this.move_path.y = 0
        if(this.path[this.dir] === 0)       this.move_path.x =  GENERAL_VAR.VEL_VICT
        else if (this.path[this.dir] === 1) this.move_path.x = -GENERAL_VAR.VEL_VICT 
        else if (this.path[this.dir] === 2) this.move_path.y =  GENERAL_VAR.VEL_VICT 
        else if (this.path[this.dir] === 3) this.move_path.y = -GENERAL_VAR.VEL_VICT 
        if (this.reaction) {
            this.move_path.x *= 2
            this.move_path.y *= 2
        }
        this.position.x += this.move_path.x
        this.position.y += this.move_path.y
        
        this.path_done -= GENERAL_VAR.VEL_VICT
        if (this.path_done <= 0) {
            ++this.dir
            if (this.dir === 4) this.dir = 0
            this.path_done = GENERAL_VAR.SIZE_BLOCK
            this.reaction = false
        }
    }
}

//pre: Vict is death
Vict.prototype.drag = function(dir_draging) {
    this.position.x = dir_draging.x
    this.position.y = dir_draging.y
}

module.exports = Vict