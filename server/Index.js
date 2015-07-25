var port = process.env.PORT || 9000
var io = require('socket.io')(port)
var IA_vict = require("./IA_vict.js")
var GENERAL_VARS = require("../shared/General_var.js")
var GENERAL_VAR = new GENERAL_VARS
var Server_utils = require("./server_utils.js")
var server_utils = new Server_utils()
var Collision = require("../shared/Collision_map.js")
var collision = new Collision

var cops = {}
var gang = {}
var vict = {}
var time_left = GENERAL_VAR.TIME_GAME
var map_crim = new Array();
server_utils.restart_server(vict, map_crim)

setInterval(function() {
    io.sockets.emit('restart')
    for(var key in vict) delete vict[key]
    delete server_utils
    server_utils = new Server_utils()
    time_left = GENERAL_VAR.TIME_GAME
    server_utils.restart_server(vict, map_crim)
}, GENERAL_VAR.TIME_RESET)

setInterval(function() {
    time_left -= 1000
    if(time_left === 0) {
        var winner_gang = ((server_utils.vict_in_server - GENERAL_VAR.VICT_LIVE) > GENERAL_VAR.MAX_VICT/2)
        if (winner_gang) for(var key in cops) cops[key].live = false 
        else for(var key in gang) gang[key].live = false
        io.sockets.emit('end_game', winner_gang)
    }
}, 1000)

io.on('connection', function (socket) {
    
    socket.on('connection', function() {
        console.log(socket.id)
        var num_usser =  {cops: 0, gang: 0}
        for(var key in cops) ++num_usser.cops
        for(var key in gang) ++num_usser.gang
        socket.emit('start_info', num_usser, time_left)
    });
    
    socket.on('new_usser', function(pos_map, team) {
        for(var key in cops) socket.emit('new_other', 1, key)
        for(var key in gang) socket.emit('new_other', 0, key)
        for(var key in vict) socket.emit('new_other', 2, key)  
            
        if (team === 1) cops[socket.id] = new server_utils.info(pos_map)
        else            gang[socket.id] = new server_utils.info(pos_map)
        socket.broadcast.emit('new_other', team, socket.id)
    });
    
    socket.on('update_position', function(pos_map, type_attack) {
        var is_cop = (gang[socket.id] === undefined)
        if (cops[socket.id])      cops[socket.id].position = pos_map
        else if (gang[socket.id]) gang[socket.id].position = pos_map

        if (type_attack) {
            if (is_cop) {
                server_utils.emit_hit(cops[socket.id].position, gang, null, io)
                server_utils.emit_hit(cops[socket.id].position, vict, map_crim, null)
            }
            else server_utils.emit_hit(gang[socket.id].position, vict, map_crim, io)
        }
        
        server_utils.emit_info(gang, pos_map, socket)
        server_utils.emit_info(cops, pos_map, socket)
        server_utils.emit_info(vict, pos_map, socket)
    });
	
    socket.on('disconnect', function() {
        if (cops[socket.id]) delete cops[socket.id]
        else delete gang[socket.id]
        socket.broadcast.emit('usser_disconect', socket.id)
    });    
});


setInterval(function() {
    for(var key in vict) {
        if(vict[key].live) {
            var pos_array = {x: Math.floor(vict[key].position.x/GENERAL_VAR.SIZE_CRIM), y: Math.floor(vict[key].position.y/GENERAL_VAR.SIZE_CRIM)}
            vict[key].move(collision.can_move_IA(vict[key].position, vict[key].move_path), map_crim[pos_array.x][pos_array.y])
        }
    }
}, 50)

console.log('server started on port', port)


