var GENERAL_VARS = require("../shared/General_var.js")
var GENERAL_VAR = new GENERAL_VARS
var Collision = require("../shared/Collision_map.js")
var collision = new Collision
var IA_vict = require("./IA_vict.js")

function server_utils() {
    this.vict_in_server = GENERAL_VAR.VICT_LIVE
}

server_utils.prototype.emit_hit = function(attacker_pos, receiver, map_crim, io) {
    for (var key in receiver) {
        if (collision.circle_coll(receiver[key].position, attacker_pos)) {
            if (!receiver[key].live && map_crim !== null) {//drag
                map_crim[Math.floor(receiver[key].position.x/GENERAL_VAR.SIZE_CRIM)][Math.floor(receiver[key].position.y/GENERAL_VAR.SIZE_CRIM)] = false
                receiver[key].drag(attacker_pos)
                map_crim[Math.floor(receiver[key].position.x/GENERAL_VAR.SIZE_CRIM)][Math.floor(receiver[key].position.y/GENERAL_VAR.SIZE_CRIM)] = true
            }
            
            else if (io !== null) {//kill vict
                if (map_crim !== null) {
                    receiver[key].live = false;
                    map_crim[Math.floor(receiver[key].position.x/GENERAL_VAR.SIZE_CRIM)][Math.floor(receiver[key].position.y/GENERAL_VAR.SIZE_CRIM)] = true
                    receiver[this.vict_in_server] = new IA_vict()
                    io.sockets.emit('new_other', -1, this.vict_in_server) 
                    ++this.vict_in_server
                }
                else if(io !== null) {//kill gang
                    receiver[key].live = false;
                    io.sockets.connected[key].emit('hit')
                    setTimeout(function() {
                        receiver[key].live = true
                    }, GENERAL_VAR.TIME_HIT)
                }
            }
            break;
        }
    }
}


server_utils.prototype.emit_info = function(objects, pos_socket, socket) {
    for(var key in objects) {
        if (collision.in_screen(objects[key].position, pos_socket)) {
            if (!collision.hidded(objects[key]))
                socket.emit('update', objects[key].position, objects[key].live, key)
            else socket.emit('update', {x: -300, y: - 300}, objects[key].live, key)
        }
    }
}

server_utils.prototype.info = function (pos) {
    this.position = pos
    this.live = true
}

server_utils.prototype.restart_server = function(vict, map_crim) {
    for (var i = 0; i  < GENERAL_VAR.VICT_LIVE; ++i) vict[i] = new IA_vict()
    for (i = 0 ; i < Math.floor(GENERAL_VAR.MAP_WIDTH/GENERAL_VAR.SIZE_CRIM) + 1; ++i) {
        map_crim[i] = new Array();
        for (j = 0; j < Math.floor(GENERAL_VAR.MAP_HEIGHT/GENERAL_VAR.SIZE_CRIM) + 1; ++j) {
            map_crim[i][j] = false;
        }
    }
}

module.exports = server_utils