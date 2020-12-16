// Page entièrement chargé, on lance le jeu
document.addEventListener("DOMContentLoaded", async function() {
    await game('renderCanvas');
}, false);



async function game(canvasId) {
    // Canvas et engine défini ici
    var canvas = document.getElementById(canvasId);
    var engine = new BABYLON.Engine(canvas, true);
    var _this = this;
    
    // On initialise la scene
    this.scene = initSceneGame(engine);


    // On apelle Arena
    var _arena = await arena(_this);
    
    // On apelle Player
    var _player = await player(_this, canvas);

    

    

    
    // Permet au jeu de tourner
    engine.runRenderLoop(function () {
        // Récuperer le ratio par les fps
        _this.fps = Math.round(1000 / engine.getDeltaTime());

        // Checker le mouvement du joueur en lui envoyant le ratio de déplacement
        checkMovePlayer((_this.fps) / 60);

        _this.scene.render();
    });

    // Ajuste la vue 3D si la fenetre est agrandi ou diminué
    window.addEventListener("resize", function () {
        if (engine) {
            engine.resize();
        }
    },false);

}


// Initialise la scene
function initSceneGame(engine) {
    var scene = new BABYLON.Scene(engine);
    scene.clearColor = new BABYLON.Color3(4,0.9,0.9);
    scene.gravity = new BABYLON.Vector3(0, -9.81, 0);
    scene.collisionsEnabled = true;
    return scene;
}



// Conversion degres ----> radians
function degToRad(deg) {
   return (Math.PI * deg) / 180
}

// Conversion radians ----> degres
function radToDeg(rad) {
   // return (Math.PI*deg)/180
   return (rad * 180) / Math.PI
}
