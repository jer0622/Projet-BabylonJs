class Patient {

    async build(game, canvas) {
        // Le jeu, chargé dans l'objet Player
        this.game = game;

        // La vitesse de course du joueur
        this.speed = 0.2;

        // Axe de mouvement X et Z
        this.axisMovement = [false, false, false, false];

        // Si le patient est infecté
        var estInfecter = false;

        // Initialise le patient
        await this.initCameraPatient(this.game.scene, canvas);

        // Change les déplacement du patient toute les 0.5 sec
        setInterval(() => this.changeAxisMovement(), 500);
    }


    async initCameraPatient(scene, canvas) {
        // Le "patron" du personnage
        const patronPlayer = BABYLON.MeshBuilder.CreateBox("patronPatient", { width: 2, depth: 1, height: 3 }, scene);
        patronPlayer.isVisible = false;
        patronPlayer.isPickable = false;
        patronPlayer.checkCollisions = true;
        patronPlayer.position = new BABYLON.Vector3(getRandomInt(-8, 8), 2, getRandomInt(-8, 8));       // Placement aléatoire
        patronPlayer.bakeTransformIntoVertices(BABYLON.Matrix.Translation(0, 1.5, 0));
        patronPlayer.ellipsoid = new BABYLON.Vector3(1, 1.5, 1);
        patronPlayer.ellipsoidOffset = new BABYLON.Vector3(0, 1.5, 0);
        patronPlayer.rotationQuaternion = new BABYLON.Quaternion(0, 1, 0, 0);


        // Importation du personnage
        const result = await BABYLON.SceneLoader.ImportMeshAsync(null, "./assets/", "Patient.glb", scene);
        var patientBox = result.meshes[0];
        patientBox.parent = patronPlayer;
        
        // On attache le personnage a son "patron"
        this.patientBox = patronPlayer;

        // Ajout des collisions avec patientBox
        this.patientBox.checkCollisions = true;
        this.patientBox.applyGravity = true;
    }


    movePatient(deltaTime) {
        let fps = 1000 / deltaTime;
        let relativeSpeed = this.speed / (fps / 60);            // Vitesse de déplacement
        let rotationSpeed = deltaTime / 100;                    // Vitesse de rotation
        
        if (this.axisMovement[1]) {
            let forward = new BABYLON.Vector3(
                parseFloat(Math.sin(parseFloat(this.patientBox.rotation.y))) * relativeSpeed, 
                0, 
                parseFloat(Math.cos(parseFloat(this.patientBox.rotation.y))) * relativeSpeed
            );
            this.patientBox.moveWithCollisions(forward);
    
            let angle = Math.atan2(0, 1) + this.patientBox.rotation.y;
            let targ = new BABYLON.Quaternion.FromEulerAngles(0, angle, 0);
            this.patientBox.rotationQuaternion = new BABYLON.Quaternion.Slerp(this.patientBox.rotationQuaternion, targ, rotationSpeed);
        }
        
        if (this.axisMovement[0]) {
            let backward = new BABYLON.Vector3(
                parseFloat(-Math.sin(parseFloat(this.patientBox.rotation.y))) * relativeSpeed, 
                0, 
                parseFloat(-Math.cos(parseFloat(this.patientBox.rotation.y))) * relativeSpeed
            );
            this.patientBox.moveWithCollisions(backward);
    
            let angle = Math.atan2(0, -1) + this.patientBox.rotation.y;
            let targ = new BABYLON.Quaternion.FromEulerAngles(0, angle, 0);
            this.patientBox.rotationQuaternion = new BABYLON.Quaternion.Slerp(this.patientBox.rotationQuaternion, targ, rotationSpeed);
        }
        if (this.axisMovement[3]) {
            let left = new BABYLON.Vector3(
                parseFloat(Math.sin(parseFloat(this.patientBox.rotation.y) + degToRad(-90))) * relativeSpeed, 
                0, 
                parseFloat(Math.cos(parseFloat(this.patientBox.rotation.y) + degToRad(-90))) * relativeSpeed
            );
            this.patientBox.moveWithCollisions(left);
    
            let angle = Math.atan2(-1, 0) + this.patientBox.rotation.y;
            let targ = new BABYLON.Quaternion.FromEulerAngles(0, angle, 0);
            this.patientBox.rotationQuaternion = new BABYLON.Quaternion.Slerp(this.patientBox.rotationQuaternion, targ, rotationSpeed);
        }
        if (this.axisMovement[2]) {
            let right = new BABYLON.Vector3(
                parseFloat(-Math.sin(parseFloat(this.patientBox.rotation.y) + degToRad(-90))) * relativeSpeed, 
                0, 
                parseFloat(-Math.cos(parseFloat(this.patientBox.rotation.y) + degToRad(-90))) * relativeSpeed
            );
            this.patientBox.moveWithCollisions(right);
    
            let angle = Math.atan2(1, 0) + this.patientBox.rotation.y;
            let targ = new BABYLON.Quaternion.FromEulerAngles(0, angle, 0);
            this.patientBox.rotationQuaternion = new BABYLON.Quaternion.Slerp(this.patientBox.rotationQuaternion, targ, rotationSpeed);
        }

        this.patientBox.moveWithCollisions(new BABYLON.Vector3(0,(-1.5) * relativeSpeed ,0));
    }


    changeAxisMovement() {
        if (getRandomInt(0, 1) === 1) {
            this.axisMovement[0] = false;
            this.axisMovement[1] = true;
        }
        else {
            this.axisMovement[0] = true;
            this.axisMovement[1] = false;
        }
        if (getRandomInt(0, 1) === 1) {
            this.axisMovement[2] = false;
            this.axisMovement[3] = true;
        }
        else {
            this.axisMovement[2] = true;
            this.axisMovement[3] = false;
        }
    }
}


function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}