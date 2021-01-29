// Page entièrement chargé, on lance le jeu
document.addEventListener("DOMContentLoaded", async function() {
    await game('renderCanvas');
}, false);



// Configuration de la partie (peut être changé si plusieurs niveaux...)
var CONFIG = {
    NB_PATIENT : 4,
    INITIAL_INFECTION : 1,
    DIST_INFECTION : 0.1,
    DIST_DESINFECTION : 1
};


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
    
    

    // Le nombre de Patient
    var nbPatient = 4;

    // Création des Patient
    var tabPatient = [];
    for (let i = 0; i < CONFIG.NB_PATIENT; i++) {
        let _patient = new Patient();
        await _patient.build(_this, canvas, i);
        tabPatient.push(_patient);
    }
    
    // Permet au jeu de tourner
    engine.runRenderLoop(function () {
        // Checker le mouvement du joueur
        checkMovePlayer(engine.getDeltaTime());

        // Animation du joueur principal
        animatePlayer();

        desinfecterPatient(tabPatient);

        // Boucle qui permet d'infecter les patient lorsque celui-ci croise un infecté
        for (let i = 0; i < CONFIG.NB_PATIENT; i++) {
            for (let j = 0; j < CONFIG.NB_PATIENT; j++) {
                tabPatient[i].checkInfection(tabPatient[j]);
            }
        }

        // Deplace les patients
        tabPatient.forEach(patient => patient.movePatient(engine.getDeltaTime()));
        

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
