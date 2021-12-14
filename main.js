import {GLTFLoader} from "./GLTFLoader.js";
import {Water} from "./Water.js";
import {GUI} from "./lil-gui.module.min.js";
import {OrbitControls} from "./OrbitControls.js";
import {FirstPersonControls} from "./FirstPersonControls.js";
import {PointerLockControls} from "./PointerLockControls.js";

let IMAGEFOLDER = 'Assets/'





let movementX = 0, movementY = 0

let controls

var clock = new THREE.Clock();
var scene = new  THREE.Scene;
var renderer = new THREE.WebGLRenderer();
let light = initLight()
let camera = initCamera()
let water = initWater()
var camControls = initMovement()


const raycaster = new THREE.Raycaster();
const clickMouse = new THREE.Vector2()
const moveMouse = new THREE.Vector2
window.addEventListener('click',event =>{
    clickMouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    clickMouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(clickMouse,camera)
    const intersects = raycaster.intersectObjects(scene.children)
    // console.log(scene.children[5])
    parent = intersects[0].object
    let idx = 0
    let object = intersects[0].object

    while(true)
    {
        idx++
        if(idx === 100)
        {
            return
        }
        
        if(object.parent !== scene)
            object = object.parent
        else{
            break
        }
    }
    // console.log(object)
    scene.remove(object)

})


let fogColor = 0xffffff
scene.fog = new THREE.Fog(0xffffff, 0.0025, 25);
scene.background = new THREE.Color(fogColor)




var loader = new GLTFLoader();

let rowBoat,destroyedHouse, tree, ghost
loadModels()





renderer.setSize(window.innerWidth,window.innerHeight)
document.body.appendChild(renderer.domElement);

function animate(){
    requestAnimationFrame(animate)
    renderer.render(scene,camera);
    render()
    moveGhost()
    if(ghost != null) {
        if ( ghost.position.distanceTo(camera.position) < 2 )
        {
            console.log("you died")
            camControls.movementSpeed = 0
        }
    }

}
animate();
function moveGhost(){
    let ghostSpeed = 0.02
    if(ghost != null) {

        ghost.lookAt(camera.position.x,ghost.position.y, camera.position.z)
        let targetPosition = camera.position
        let targetNormalizedVector = new THREE.Vector3(camera.position)
        targetNormalizedVector.x = targetPosition.x - ghost.position.x
        targetNormalizedVector.y = 0
        targetNormalizedVector.z = targetPosition.z - ghost.position.z
        targetNormalizedVector.normalize();
        ghost.currentTranslate = null
        ghost.translateOnAxis(targetNormalizedVector,ghostSpeed)
        ghost.position.y = -0.1
    }
}



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
    let temp
    loader.load("Assets/russian_panel_house_asset/scene.gltf",function (gltf){
        temp = gltf.scene;
        scene.add(gltf.scene)
        console.log("loaded", temp)
        let scale = 0.001
        temp.position.set(30,-0.5,-25)
        // tempObject.rotation.set(0.5,0,0)
        temp.scale.set(scale,scale,scale)
        temp.rotation.y = 1.5
    })
    loader.load("Assets/scary_ghost/scene.gltf",function (gltf){
        temp = gltf.scene;
        scene.add(gltf.scene)
        let scale = 0.005
        temp.position.set(5,0,-5)
        // tempObject.rotation.set(0.5,0,0)
        temp.scale.set(scale,scale,scale)
        temp.rotation.y = 1.5
        ghost = temp
    })

    loader.load("Assets/chainlink_fence_-_low_poly/scene.gltf",function (gltf){
        temp = gltf.scene;
        scene.add(gltf.scene)
        let scale = 0.1
        temp.position.set(5,0,-5)
        // tempObject.rotation.set(0.5,0,0)
        temp.scale.set(scale,scale,scale)
        temp.rotation.y = 1.5

        let clone
        let startPos = -45
        for(var i = 0 ; i  < 40; i ++)
        {
            clone = temp.clone()
            clone.position.set(startPos + i * 2.5,-0.3, 10)
            clone.rotation.y= 0.0
            scene.add(clone)
        }

    })

    initLamposts()

    loader.load("Assets/simple_russia_village_house/scene.gltf",function (gltf){
        temp = gltf.scene;
        scene.add(gltf.scene)
        let scale = 0.8
        temp.position.set(-20,0,0)
        // tempObject.rotation.set(0.5,0,0)
        temp.scale.set(scale,scale,scale)
        temp.rotation.y = 1.5
    })

    loader.load("Assets/car/scene.gltf",function (gltf){
        temp = gltf.scene;
        scene.add(gltf.scene)
        let scale = 0.1
        temp.position.set(-12,-.5,-18.5)
        // tempObject.rotation.set(0.5,0,0)
        temp.scale.set(scale,scale,scale)
    })

    loader.load("Assets/abandoned_sofa/scene.gltf",function (gltf){
        temp = gltf.scene;
        scene.add(gltf.scene)
        let scale = 0.001
        temp.position.set(-12,.7,-19.65)
        temp.rotation.x = 0.5
        temp.rotation.y = 0.5
        // tempObject.rotation.set(0.5,0,0)
        temp.scale.set(scale,scale,scale)
    })






}

function initLamposts()
{
    let temp
    loader.load("Assets/lamppost/scene.gltf",function (gltf){
        temp = gltf.scene;
        scene.add(gltf.scene)
        console.log("loaded", temp)
        let scale = 0.001
        temp.position.set(-10,-0.5,-10)
        // tempObject.rotation.set(0.5,0,0)
        // temp.scale.set(scale,scale,scale)
        temp.rotation.y = 1.5
        let pointLight = new THREE.PointLight(0xffffff,2)
        pointLight.position.set(temp.position.x,3,temp.position.z)
        scene.add(pointLight)

        let startPos = -50
        let lampClone
        for(var i = 0 ; i  < 10; i++)
        {
            lampClone = temp.clone()
            lampClone.position.set(startPos + 10*i,-0.5,-10)
            scene.add(lampClone)
        }

        scene.remove(temp)





    })


}

function render() {

    const time = performance.now() * 0.001;

    water.material.uniforms[ 'time' ].value += 0.3 / 60.0;


    var delta = clock.getDelta();




    camControls.update(delta);
    camera.position.y = 1
    if(camControls.lookSpeed >= 0)
        camControls.lookSpeed -= 0.01
    else
    {
        camControls.lookSpeed = 0
    }




    renderer.render( scene, camera );

}

function initLight(){
        let directionalLight = new THREE.AmbientLight(0xffffff,1)
        // directionalLight.position.set(0,1,0)
        directionalLight.castShadow = false
        scene.add(directionalLight)

    let pointLight = new THREE.PointLight(0xc4c4c4,0)
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
    var camControls = new FirstPersonControls(camera);
    camControls.lookSpeed = 0.4;
    camControls.movementSpeed = 5;
    camControls.noFly = true;
    camControls.lookVertical = true;
    camControls.constrainVertical = true;
    camControls.verticalMin = 1
    camControls.verticalMax = 2;
    camControls.lon = -150;
    camControls.lat = 120;
    camControls.verticalMax = 2
    camControls.heightMax = 2

    return camControls

}

function initCamera(){

    var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.x = 0;
    camera.position.y = 10;
    camera.position.z = 0;
    camera.lookAt(new THREE.Vector3(0, 0, 0));
    controls = new PointerLockControls(camera,renderer.domElement)
    scene.add(controls.getObject())
    document.addEventListener('mousemove', (e) => {
        camControls.lookSpeed = 0.4

    })


    document.body.addEventListener("click",listener,false)
    return camera




}

function listener(){
    // camera.lock()
}

