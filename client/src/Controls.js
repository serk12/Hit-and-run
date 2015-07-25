var GENERAL_VARS = require("../../shared/General_var.js")
var GENERAL_VAR = new GENERAL_VARS
var KeyboardJS = require("./KeyboardJS.js")

function Controls() {
    var scope = this
    this.keyboard = new KeyboardJS()
}

Controls.prototype.move = function() {
    var displace = new PIXI.Point(0, 0);
    if(this.keyboard.char('W')) displace.y = -GENERAL_VAR.VEL_COPS;
    if(this.keyboard.char('S')) displace.y =  GENERAL_VAR.VEL_COPS;
    if(this.keyboard.char('D')) displace.x =  GENERAL_VAR.VEL_COPS;
    if(this.keyboard.char('A')) displace.x = -GENERAL_VAR.VEL_COPS;
    return displace;
}

Controls.prototype.action = function() {
    if (this.keyboard.char(" ")) return true
    else return false
}

module.exports = Controls