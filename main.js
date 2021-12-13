import {GLTFLoader} from "./GLTFLoader.js";
import {Water} from "./Water.js";
import {GUI} from "./lil-gui.module.min.js";
import {OrbitControls} from "./OrbitControls.js";
import {FirstPersonControls} from "./FirstPersonControls.js";

let IMAGEFOLDER = 'Assets/'





var scene = new  THREE.Scene;
var renderer = new THREE.WebGLRenderer();
let light = initLight()
let camera = initCamera()
let water = initWater()
initMovement()

    let fogColor = 0xffffff
    scene.fog = new THREE.Fog(0xffffff, 0.0025, 50);
    scene.background = new THREE.Color(fogColor)




var loader = new GLTFLoader();

let rowBoat,destroyedHouse, tree
loadModels()





renderer.setSize(window.innerWidth,window.innerHeight)
document.body.appendChild(renderer.domElement);



function animate(){
    requestAnimationFrame(animate)
    renderer.render(scene,camera);
    render()

}
animate();

function loadModels(){
    let tempObject
    loader.load("Assets/DestroyedHouse/scene.gltf",function (gltf){
        destroyedHouse = gltf.scene;
        scene.add(gltf.scene)
    })

    loader.load(IMAGEFOLDER + "old_rowboat/scene.gltf",function (gltf){
        rowBoat = gltf.scene
        scene.add(gltf.scene)
        rowBoat.scale.set(0.005,0.005,0.005)
        rowBoat.position.set(10,-0.1,0)
        rowBoat.rotation.y = 0.5

    })
    //tree
    loader.load("Assets/fast_urban_tree/scene.gltf",function (gltf){
        tempObject = gltf.scene;
        scene.add(gltf.scene)
        let scale = 0.007
        light.target = tempObject
        tempObject.position.set(3,0,-5)
        tempObject.rotation.set(0.5,0,0)
        tempObject.scale.set(scale,scale,scale)
    })
    let a
    loader.load("Assets/russian_panel_house_asset/scene.gltf",function (gltf){
        a = gltf.scene;
        scene.add(gltf.scene)
        let scale = 0.001
        a.position.set(30,-0.5,-25)
        // tempObject.rotation.set(0.5,0,0)
        a.scale.set(scale,scale,scale)
        a.rotation.y = 1.5
    })


}

function render() {

    const time = performance.now() * 0.001;

    water.material.uniforms[ 'time' ].value += 0.3 / 60.0;







    renderer.render( scene, camera );

}

function initLight(){
        let directionalLight = new THREE.DirectionalLight(0xffffff,1)
        directionalLight.position.set(0,1,0)
        directionalLight.castShadow = true
        scene.add(directionalLight)

    let pointLight = new THREE.PointLight(0xc4c4c4,1)
    pointLight.position.set(-5,1,-5)
    scene.add(pointLight)
    //
    // let light = new THREE.HemisphereLight(0x000000,0xffffff,5)
    // scene.add(light)

    return directionalLight

    // var ambientLight = new THREE.AmbientLight( 0x404040,10)
    // scene.add(ambientLight)
}

function initWater(){
    const waterGeometry = new THREE.PlaneGeometry( 100, 100 );

    let water = new Water(
        waterGeometry,
        {
            textureWidth: 512,
            textureHeight: 512,
            waterNormals: new THREE.TextureLoader().load( 'textures/waternormals.jpg', function ( texture ) {

                texture.wrapS = texture.wrapT = THREE.RepeatWrapping;

            } ),
            sunDirection: new THREE.Vector3(),
            sunColor: 0xffffff,
            waterColor: 0x001e0f,
            distortionScale: 3.7,
            fog: scene.fog !== undefined
        }
    );

    water.rotation.x = - Math.PI / 2;
    water.position.set(0,0.05,0)

    // const gui = new GUI();


    const waterUniforms = water.material.uniforms;

    // const folderWater = gui.addFolder( 'Water' );
    // folderWater.add( waterUniforms.distortionScale, 'value', 0, 8, 0.1 ).name( 'distortionScale' );
    // folderWater.add( waterUniforms.size, 'value', 0.1, 10, 0.1 ).name( 'size' );
    // folderWater.open();




    scene.add( water );
    return water
}

function initMovement()
{
    let controls = new OrbitControls( camera, renderer.domElement );
    controls.maxPolarAngle = Math.PI * 0.495;
    controls.target.set( 0, 10, 0 );
    controls.minDistance = 20.0;
    controls.maxDistance = 100.0;
    controls.update();
}

function initCamera(){
    var camera = new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight,.01,1000);
    camera.position.set(0,5,13)
    return camera


}
