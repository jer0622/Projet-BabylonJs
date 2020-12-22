async function player(game, canvas) {
    // _this est l'accès à la camera à l'interieur de Player
    var _this = this;

    // Le jeu, chargé dans l'objet Player
    this.game = game;

    // La vitesse de course du joueur
    this.speed = 0.3;

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

    // Le "patron" du personnage
    const patronPlayer = BABYLON.MeshBuilder.CreateBox("patronPlayer", { width: 2, depth: 1, height: 3 }, scene);
    patronPlayer.isVisible = false;
    patronPlayer.isPickable = false;
    patronPlayer.checkCollisions = true;
    patronPlayer.position = new BABYLON.Vector3(0, 20, 0);
    patronPlayer.bakeTransformIntoVertices(BABYLON.Matrix.Translation(0, 1.5, 0))
    
    patronPlayer.ellipsoid = new BABYLON.Vector3(1, 1.5, 1);
    patronPlayer.ellipsoidOffset = new BABYLON.Vector3(0, 1.5, 0);
    patronPlayer.rotationQuaternion = new BABYLON.Quaternion(0, 1, 0, 0);
    
    // Importation du personnage
    const result = await BABYLON.SceneLoader.ImportMeshAsync(null, "./assets/", "medecin.glb", scene);
    var playerBox = result.meshes[0];
    playerBox.parent = patronPlayer;

    
    //scene.stopAllAnimations();              // On stope les animations
    this._runAnim = result.animationGroups[0];
    
    


    
    // On crée la caméra
    this.camera = new BABYLON.FreeCamera("camera", new BABYLON.Vector3(0, 30, 30), scene);
    this.camera.playerBox = patronPlayer;
    this.camera.parent = this.camera.patronPlayer;

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
    this.camera.attachControl(canvas, true);
}

function checkMovePlayer(deltaTime) {
    let fps = 1000 / deltaTime;
    let relativeSpeed = this.speed / (fps / 60);            // Vitesse de déplacement
    let rotationSpeed = deltaTime / 100;                    // Vitesse de rotation

    if (this.camera.axisMovement[1]) {
        forward = new BABYLON.Vector3(
            parseFloat(Math.sin(parseFloat(this.camera.playerBox.rotation.y))) * relativeSpeed, 
            0, 
            parseFloat(Math.cos(parseFloat(this.camera.playerBox.rotation.y))) * relativeSpeed
        );
        this.camera.playerBox.moveWithCollisions(forward);

        let angle = Math.atan2(0, 1) + this.camera.playerBox.rotation.y;
        let targ = new BABYLON.Quaternion.FromEulerAngles(0, angle, 0);
        this.camera.playerBox.rotationQuaternion = new BABYLON.Quaternion.Slerp(this.camera.playerBox.rotationQuaternion, targ, rotationSpeed);
    }
    if (this.camera.axisMovement[0]) {
        backward = new BABYLON.Vector3(
            parseFloat(-Math.sin(parseFloat(this.camera.playerBox.rotation.y))) * relativeSpeed, 
            0, 
            parseFloat(-Math.cos(parseFloat(this.camera.playerBox.rotation.y))) * relativeSpeed
        );
        this.camera.playerBox.moveWithCollisions(backward);

        let angle = Math.atan2(0, -1) + this.camera.playerBox.rotation.y;
        let targ = new BABYLON.Quaternion.FromEulerAngles(0, angle, 0);
        this.camera.playerBox.rotationQuaternion = new BABYLON.Quaternion.Slerp(this.camera.playerBox.rotationQuaternion, targ, rotationSpeed);
    }
    if (this.camera.axisMovement[3]) {
        left = new BABYLON.Vector3(
            parseFloat(Math.sin(parseFloat(this.camera.playerBox.rotation.y) + degToRad(-90))) * relativeSpeed, 
            0, 
            parseFloat(Math.cos(parseFloat(this.camera.playerBox.rotation.y) + degToRad(-90))) * relativeSpeed
        );
        this.camera.playerBox.moveWithCollisions(left);

        let angle = Math.atan2(-1, 0) + this.camera.playerBox.rotation.y;
        let targ = new BABYLON.Quaternion.FromEulerAngles(0, angle, 0);
        this.camera.playerBox.rotationQuaternion = new BABYLON.Quaternion.Slerp(this.camera.playerBox.rotationQuaternion, targ, rotationSpeed);
    }
    if (this.camera.axisMovement[2]) {
        right = new BABYLON.Vector3(
            parseFloat(-Math.sin(parseFloat(this.camera.playerBox.rotation.y) + degToRad(-90))) * relativeSpeed, 
            0, 
            parseFloat(-Math.cos(parseFloat(this.camera.playerBox.rotation.y) + degToRad(-90))) * relativeSpeed
        );
        this.camera.playerBox.moveWithCollisions(right);

        let angle = Math.atan2(1, 0) + this.camera.playerBox.rotation.y;
        let targ = new BABYLON.Quaternion.FromEulerAngles(0, angle, 0);
        this.camera.playerBox.rotationQuaternion = new BABYLON.Quaternion.Slerp(this.camera.playerBox.rotationQuaternion, targ, rotationSpeed);
    }
    this.camera.playerBox.moveWithCollisions(new BABYLON.Vector3(0,(-1.5) * relativeSpeed ,0));
}





function animatePlayer() {
    if (this.camera.axisMovement[0] || this.camera.axisMovement[1] ||
        this.camera.axisMovement[2] || this.camera.axisMovement[3]) {
            this._runAnim.play(this._runAnim.loopAnimation);
        }
    else {
        this._runAnim.stop();
    }
}