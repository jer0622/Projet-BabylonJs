async function arena(game) {
    // Appel des variables nécéssaires
    this.game = game;
    var scene = game.scene;

    // Création de notre lumière principale
    var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);



    // On charge la map 
    await loadMap();
    

};



async function loadMap(scene) {
    const result = await BABYLON.SceneLoader.ImportMeshAsync(null, "./assets/", "map.glb", scene);
    let env = result.meshes[0];
    let allMeshes = env.getChildMeshes();

    allMeshes.forEach(m => {
        m.receiveShadows = true;
        m.checkCollisions = true;
    });
}