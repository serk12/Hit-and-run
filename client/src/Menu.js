var GENERAL_VARS = require("../../shared/General_var.js")
var GENERAL_VAR = new GENERAL_VARS

function menu(renderer, player_as) {
    var stage = new PIXI.Container();
    var background = new PIXI.Sprite.fromImage("../_Images/background.jpg");
    background.width = GENERAL_VAR.SCREEN_WIDTH
    background.height = GENERAL_VAR.SCREEN_HEIGHT
    stage.addChild(background)
    var banner_cop = new PIXI.Text("Play as Cop", {font: "30px Snippet", fill: "black", align: "left"})
    banner_cop.position.y = 3*GENERAL_VAR.SCREEN_HEIGHT/10
    stage.addChild(banner_cop)
    var banner_gang = new PIXI.Text("Play as Gang", {font: "30px Snippet", fill: "black", align: "left"})
    banner_gang.position.y = 4*GENERAL_VAR.SCREEN_HEIGHT/10
    stage.addChild(banner_gang)
    var how_to_play =new PIXI.Text("How to play" , {font: "30px Snippet", fill: "black", align: "left"})
    how_to_play.position.y = 5*GENERAL_VAR.SCREEN_HEIGHT/10
    stage.addChild(how_to_play)
    var mouse = {x: NaN, y: NaN}
    document.addEventListener("click", function(evt) {
        mouse.x = evt.clientX
        mouse.y = evt.clientY
    })
    var returned = animation();

    function animation() {
        requestAnimationFrame(animation);

        if(mouse.x >= 0 && mouse.x <= 350 && mouse.y <= 6*GENERAL_VAR.SCREEN_HEIGHT/10) {
            if (mouse.y >= 5*GENERAL_VAR.SCREEN_HEIGHT/10) {
                how_to_play.text = "How to play: \n Objective: cill all the citizens if you are a gang \n in the other hand kill all the gang to stop the killing \n controls: WASD to move space to kill or drag the bodies"
            }
            else if (mouse.y >= 4*GENERAL_VAR.SCREEN_HEIGHT/10) {console.log(0); player_as = 0;}
            else if (mouse.y >= 3*GENERAL_VAR.SCREEN_HEIGHT/10) {console.log(1); player_as = 1;}
        }
        renderer.render(stage);
    }
    setTimeout( function() {
        delete background
        delete banner_cop
        delete banner_gang
        delete how_to_play
        delete stage
    },4000)
}



module.exports = menu