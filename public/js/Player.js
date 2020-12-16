async function player(game, canvas) {
    // _this est l'accès à la camera à l'interieur de Player
    var _this = this;

    // Le jeu, chargé dans l'objet Player
    this.game = game;

    // La vitesse de course du joueur
    this.speed = 0.5;

    // Axe de mouvement X et Z
    this.axisMovement = [false, false, false, false];


    // Quand les touches sont pressées
    window.addEventListener("keyup", function(evt) {
        switch (evt.keyCode) {
            case 90 :
                _this.camera.axisMovement[0] = false;
                break;
            case 83 :
                _this.camera.axisMovement[1] = false;
                break;
            case 81 :
                _this.camera.axisMovement[2] = false;
                break;
            case 68 :
                _this.camera.axisMovement[3] = false;
                break;
        }
    }, false);

    // Quand les touches sont relachés
    window.addEventListener("keydown", function(evt) {
        switch (evt.keyCode) {
            case 90 :
                _this.camera.axisMovement[0] = true;
                break;
            case 83 :
                _this.camera.axisMovement[1] = true;
                break;
            case 81 :
                _this.camera.axisMovement[2] = true;
                break;
            case 68 :
                _this.camera.axisMovement[3] = true;
                break;
        }
    }, false);


    // Initialisation de la caméra
    await initCameraPlayer(this.game.scene, canvas);
    
}

async function initCameraPlayer(scene, canvas) {

    var playerBox = BABYLON.Mesh.CreateBox("headMainPlayer", 3, scene);
    playerBox.position = new BABYLON.Vector3(0, 20, 0);
    playerBox.ellipsoid = new BABYLON.Vector3(2, 2, 2);

    
    // On crée la caméra
    this.camera = new BABYLON.FreeCamera("camera", new BABYLON.Vector3(0, 30, 30), scene);
    this.camera.playerBox = playerBox;
    this.camera.parent = this.camera.playerBox;

    // Ajout des collisions avec playerBox
    this.camera.playerBox.checkCollisions = true;
    this.camera.playerBox.applyGravity = true;

    // Si le joueur est en vie ou non
    this.isAlive = true;

    // Pour savoir que c'est le joueur principale
    this.camera.isMain = true;

    // Axe de mouvement X et Z
    this.camera.axisMovement = [false, false, false, false];
        
    // On demande à la caméra de regarder au point zéro de la scène
    this.camera.setTarget(BABYLON.Vector3.Zero());

    // Permet de deplacer la caméra 
    //this.camera.attachControl(canvas, true);
}

function checkMovePlayer(ratioFps) {
    let relativeSpeed = this.speed / ratioFps;
    if(this.camera.axisMovement[0]){
        forward = new BABYLON.Vector3(
            parseFloat(Math.sin(parseFloat(this.camera.playerBox.rotation.y))) * relativeSpeed, 
            0, 
            parseFloat(Math.cos(parseFloat(this.camera.playerBox.rotation.y))) * relativeSpeed
        );
        this.camera.playerBox.moveWithCollisions(forward);
    }
    if(this.camera.axisMovement[1]){
        backward = new BABYLON.Vector3(
            parseFloat(-Math.sin(parseFloat(this.camera.playerBox.rotation.y))) * relativeSpeed, 
            0, 
            parseFloat(-Math.cos(parseFloat(this.camera.playerBox.rotation.y))) * relativeSpeed
        );
        this.camera.playerBox.moveWithCollisions(backward);
    }
    if(this.camera.axisMovement[2]){
        left = new BABYLON.Vector3(
            parseFloat(Math.sin(parseFloat(this.camera.playerBox.rotation.y) + degToRad(-90))) * relativeSpeed, 
            0, 
            parseFloat(Math.cos(parseFloat(this.camera.playerBox.rotation.y) + degToRad(-90))) * relativeSpeed
        );
        this.camera.playerBox.moveWithCollisions(left);
    }
    if(this.camera.axisMovement[3]){
        right = new BABYLON.Vector3(
            parseFloat(-Math.sin(parseFloat(this.camera.playerBox.rotation.y) + degToRad(-90))) * relativeSpeed, 
            0, 
            parseFloat(-Math.cos(parseFloat(this.camera.playerBox.rotation.y) + degToRad(-90))) * relativeSpeed
        );
        this.camera.playerBox.moveWithCollisions(right);
    }
    this.camera.playerBox.moveWithCollisions(new BABYLON.Vector3(0,(-1.5) * relativeSpeed ,0));
}