var GENERAL_VARS = require("../../shared/General_var.js")
var GENERAL_VAR = new GENERAL_VARS
var Collision = require("../../shared/Collision_map.js")
var Controls = require("./Controls.js")
var Background = require("./Background.js")
var Sprite = require("./Sprite.js")

function Game(is_cop, socket, renderer, sprite_sheet, time_left) {
    var stage_others = new PIXI.Container();
    var background = new Background(stage_others, is_cop);

    var stage_usser = new PIXI.Container();
    var time = new PIXI.Text(((Math.floor(time_left/60000)) + ':' + Math.floor((time_left%60000)/1000)), {font: "30px Snippet", fill: "black", align: "left"})
    time.position.y = GENERAL_VAR.SCREEN_HEIGHT - 30*2
    stage_usser.addChild(time);
    var usser = new Sprite(null, is_cop, stage_usser, sprite_sheet);

    var stage_all = new PIXI.Container();
    stage_all.addChild(stage_others)
    stage_all.addChild(stage_usser)

    var controls = new Controls();
    var collision = new Collision();
    var others = {}

    var pos_map = {x: -stage_others.x + GENERAL_VAR.SCREEN_WIDTH/2, y: -stage_others.y + GENERAL_VAR.SCREEN_HEIGHT/2}
    socket.emit('new_usser', pos_map, usser.is_cop)
    animate();

    function animate() {

        requestAnimationFrame(animate);
        if (usser.live) {
            var displace = controls.move();
            if(collision.can_move(stage_others.position, displace)) {
                usser.animation(displace, sprite_sheet)
                stage_others.position.x -= displace.x;
                stage_others.position.y -= displace.y;
            }
            if(controls.action()) usser.attack_type = true;
            else usser.attack_type = false
        }
        renderer.render(stage_all);
    }

    /*INFO TO SERVER*/
    setInterval(function() {
        pos_map = {x: -stage_others.x + GENERAL_VAR.SCREEN_WIDTH/2, y: -stage_others.y + GENERAL_VAR.SCREEN_HEIGHT/2}
        socket.emit('update_position', pos_map, usser.attack_type)
        
        for(var id in others) {
            if(!collision.in_screen(others[id].sprite.position, pos_map))
                stage_others.removeChild(others[id].sprite)
        }
    }, 50)
    
    setInterval(function() {
        time_left -= 1000
        time.text = (Math.floor(time_left/60000)) + ':' + Math.floor((time_left%60000)/1000)
    }, 1000)

    /*INFO FROM SERVER*/
    socket.on('new_other', function(team, id) {
        others[id] = new Sprite(null, team, stage_others, sprite_sheet);
        others[id].sprite.position.x = others[id].sprite.position.y = -300
        stage_others.removeChild(others[id].sprite)
    });

    socket.on('update', function(pos_map, live, id) {
        if(others[id]) {
            var move = {x: -(others[id].sprite.position.x - pos_map.x), y: -(others[id].sprite.position.y - pos_map.y)}
            others[id].animation(move, sprite_sheet);
            others[id].sprite.position = pos_map
            stage_others.addChild(others[id].sprite)
            if(!live) others[id].dead(sprite_sheet)
        }
    });

    socket.on('hit', function() {
        usser.live = false
        usser.dead(sprite_sheet)
        setTimeout(function() {
            usser.live = true
            background.spawn(stage_others, usser.is_cop)  
        }, GENERAL_VAR.TIME_HIT)
    });

    socket.on('usser_disconect', function(id) {
        if (others[id]) {
            stage_others.removeChild(others[id].sprite)
            delete others[id]
        }
    });
    
    socket.on('end_game', function(winner_gang) {
        var text = "GAME OVER"
        if (usser.is_cop !== 1 && winner_gang || usser.is_cop === 1 && !winner_gang) text = "YOU WIN"
        else {
            usser.live = false;
            usser.dead(sprite_sheet)
        }
        var banner = new PIXI.Text(text, {font: "100px Snippet", fill: "black", align: "left"})
        stage_usser.addChild(banner)
        time_left = GENERAL_VAR.TIME_RESET - GENERAL_VAR.TIME_GAME
        setTimeout(function() {
            stage_usser.removeChild(banner)
            delete banner
        }, time_left)
    });
    
    socket.on('restart', function() {
        time_left = GENERAL_VAR.TIME_GAME
        usser.live = true
        background.spawn(stage_others, usser.is_cop)  
    });
}

module.exports = Game
