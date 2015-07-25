var serverURL = 'localhost:9000'
var socket = require('socket.io-client')(serverURL)
var GENERAL_VARS = require("../../shared/General_var.js")
var GENERAL_VAR = new GENERAL_VARS
var Game = require('./Game.js')
var Menu = require('./Menu.js')

var renderer = new PIXI.WebGLRenderer(GENERAL_VAR.SCREEN_WIDTH, GENERAL_VAR.SCREEN_HEIGHT);
document.body.appendChild(renderer.view);

var is_cop = 0
var time_game
var servere_players

socket.on('start_info',function(num_usser, time_left) {
    time_game = time_left
    servere_players = num_usser
});

socket.emit('connection')

setTimeout(function () {
    if (servere_players.cops === servere_players.gang) {
        if (prompt("tap c to play as cop")[0] === 'c') is_cop = 1
    }
    else if (servere_players.cops < servere_players.gang) is_cop = 1

    loader = new PIXI.loaders.Loader();
    loader.add('Characters', '../_Images/sprite_sheet.json');
    loader.load(function () {
        var sprite_sheet = new Array()
        for (var i = 0; i < 3; ++i) {
        sprite_sheet[i] = new Array();
        for (var j = 0; j < 4; ++j) 
                sprite_sheet[i][j] = new Array(); 
        }

        sprite_sheet[0][0][0] = new PIXI.Texture.fromFrame("cacoFrontS.png");
        sprite_sheet[0][0][1] = new PIXI.Texture.fromFrame("cacoFrontM1.png");
        sprite_sheet[0][0][2] = new PIXI.Texture.fromFrame("cacoFrontM2.png");
        sprite_sheet[0][0][3] = new PIXI.Texture.fromFrame("cacoDead.png");
        sprite_sheet[0][1][0] = new PIXI.Texture.fromFrame("cacoTrasS.png");
        sprite_sheet[0][1][1] = new PIXI.Texture.fromFrame("cacoTrasM1.png");
        sprite_sheet[0][1][2] = new PIXI.Texture.fromFrame("cacoTrasM2.png");
        sprite_sheet[0][2][0] = new PIXI.Texture.fromFrame("cacoPerfS.png");
        sprite_sheet[0][2][1] = new PIXI.Texture.fromFrame("cacoPerfM1.png");
        sprite_sheet[0][2][2] = new PIXI.Texture.fromFrame("cacoPerfM2.png");
        sprite_sheet[0][3][0] = new PIXI.Texture.fromFrame("cacoPerfSD.png");
        sprite_sheet[0][3][1] = new PIXI.Texture.fromFrame("cacoPerfM1D.png");
        sprite_sheet[0][3][2] = new PIXI.Texture.fromFrame("cacoPerfiM2D.png");
        
        sprite_sheet[1][0][0] = new PIXI.Texture.fromFrame("poliFrontS.png");
        sprite_sheet[1][0][1] = new PIXI.Texture.fromFrame("poliFrontM1.png");
        sprite_sheet[1][0][2] = new PIXI.Texture.fromFrame("poliFrontM2.png");
        sprite_sheet[1][1][0] = new PIXI.Texture.fromFrame("poliTrasS.png");
        sprite_sheet[1][1][1] = new PIXI.Texture.fromFrame("poliTrasM1.png");
        sprite_sheet[1][1][2] = new PIXI.Texture.fromFrame("poliTrasM2.png");
        sprite_sheet[1][2][0] = new PIXI.Texture.fromFrame("poliPerfS.png");
        sprite_sheet[1][2][1] = new PIXI.Texture.fromFrame("poliPerfM1.png");
        sprite_sheet[1][2][2] = new PIXI.Texture.fromFrame("poliPerfM2.png");
        sprite_sheet[1][3][0] = new PIXI.Texture.fromFrame("poliPerfSD.png");
        sprite_sheet[1][3][1] = new PIXI.Texture.fromFrame("poliPerfM1D.png");
        sprite_sheet[1][3][2] = new PIXI.Texture.fromFrame("poliPerfM2D.png");
        
        sprite_sheet[2][0][1] = new PIXI.Texture.fromFrame("passerFrontM1.png");
        sprite_sheet[2][0][2] = new PIXI.Texture.fromFrame("passerFrontM2.png");
        sprite_sheet[2][0][3] = new PIXI.Texture.fromFrame("passerDead.png");
        sprite_sheet[2][1][1] = new PIXI.Texture.fromFrame("passerTras1.png");
        sprite_sheet[2][1][2] = new PIXI.Texture.fromFrame("passerTras2.png");
        sprite_sheet[2][2][1] = new PIXI.Texture.fromFrame("passerPerfM1.png");
        sprite_sheet[2][2][2] = new PIXI.Texture.fromFrame("passerPerfM2.png");
        sprite_sheet[2][3][1] = new PIXI.Texture.fromFrame("passerPerfM1D.png");
        sprite_sheet[2][3][2] = new PIXI.Texture.fromFrame("passerPerfM2D.png");

        new Game(is_cop, socket, renderer, sprite_sheet, time_game)
    });
}, 1000)
