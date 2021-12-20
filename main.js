import {GLTFLoader} from "./GLTFLoader.js";
import {Water} from "./Water.js";
import {GUI} from "./lil-gui.module.min.js";
import {OrbitControls} from "./OrbitControls.js";
import {FirstPersonControls} from "./FirstPersonControls.js";
import {PointerLockControls} from "./PointerLockControls.js";

let IMAGEFOLDER = 'Assets/'





let movementX = 0, movementY = 0

let controls

let objectsRemaining = 3
let canDie = true

var clock = new THREE.Clock();
var scene = new  THREE.Scene;
var renderer = new THREE.WebGLRenderer();
let light = initLight()
let camera = initCamera()
let water = initWater()
let lock = true
let message = document.getElementById("info")
let gameOverMessage = document.getElementById("youDied")

let currOpacity = 0
console.log(">>>",currOpacity)
var camControls = initMovement()
let showMessage = false


const raycaster = new THREE.Raycaster();
const clickMouse = new THREE.Vector2()
const moveMouse = new THREE.Vector2
window.addEventListener('click',event =>{
    clickMouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    clickMouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(clickMouse,camera)
    const intersects = raycaster.intersectObjects(scene.children)
    // console.log(scene.children[5])
    if(intersects[0] == null) return;
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
    if(object.clickable == true) {
        if(object.position.distanceTo(camera.position) < 3)

            collectObject(object)

    }

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
        if ( ghost.position.distanceTo(camera.position) < 2 && canDie)
        {
            gameOverMessage.style.opacity = 1
            console.log("you died")
            camControls.movementSpeed = 0
        }
    }
    // console.log(currOpacity)
    if(showMessage == true) {
        message.style.opacity = currOpacity
        currOpacity =  currOpacity +=0.01
        if(currOpacity >= 3) {
            currOpacity = 1
            showMessage = false
        }

    }
    else if(currOpacity > 0){
        message.style.opacity = currOpacity
        currOpacity = (currOpacity <= 0) ? 0 : currOpacity -=0.01

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


function collectObject(object){
    objectsRemaining --
    message.textContent = "Memmory found.   " + (objectsRemaining) + " remaining"
    if(objectsRemaining == 0 ) {
        canDie = false
        scene.remove(ghost)
    }
    showMessage = true
    scene.remove(object)
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
        scene.name = "Ghost"
        let scale = 0.005
        temp.position.set(0,0,-5)
        // tempObject.rotation.set(0.5,0,0)
        temp.scale.set(scale,scale,scale)
        temp.rotation.y = 1.5
        ghost = temp
        // ghost.children[0].children[0].children[0].children[0].children[0].children[0].position.set( ghost.position)

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
        scene.remove(temp)


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
    loader.load("Assets/van/scene.gltf",function (gltf){
        temp = gltf.scene;
        scene.add(gltf.scene)
        let scale = 0.015
        temp.position.set(20,-0.3,0)
        temp.rotation.x = 0.085
        temp.rotation.y = 1.62
        temp.scale.set(scale,scale,scale)
    })
    loader.load("Assets/diary/scene.gltf",function (gltf){
        temp = gltf.scene;
        temp.clickable = true
        scene.add(gltf.scene)
        let scale = 0.5
        temp.rotation.x = 0.085
        temp.position.set(20.5,0.21,0.3)

        //
        // const gui = new GUI();
        // const waterUniforms = water.material.uniforms;
        // const folderWater = gui.addFolder( 'Water' );
        // folderWater.add( temp.rotation, 'x', 0.0,5.0).name( 'x' );
        // folderWater.add( temp.rotation, 'y', 0.0 ,5.0).name( 'y' );
        // folderWater.add( temp.rotation, 'z', 0.0,5.0).name( 'z' );
        // folderWater.open();
        // temp.scale.set(scale,scale,scale)
    })

    loader.load("Assets/trophy/scene.gltf",function (gltf){
        temp = gltf.scene;
        temp.clickable = true
        scene.add(gltf.scene)
        let scale = 0.005
        temp.position.set(-12,1.0,-19.65)
        temp.rotation.x = -0.5
        temp.rotation.y = -0.5
        console.log(temp)
        // tempObject.rotation.set(0.5,0,0)
        temp.scale.set(scale,scale,scale)
    })
    loader.load("Assets/white_photo_frame/scene.gltf",function (gltf){
        temp = gltf.scene;
        temp.clickable = true
        scene.add(gltf.scene)
        let scale = 0.25
        temp.position.set(5.55,0.4,-0.8)
        temp.rotation.x = 0
        temp.rotation.y = 2.42
        temp.rotation.z = 1.25


        // const folderWater = gui.addFolder( 'Water' );
        // folderWater.add( waterUniforms.distortionScale, 'value', 0, 8, 0.1 ).name( 'distortionScale' );
        // folderWater.add( waterUniforms.size, 'value', 0.1, 10, 0.1 ).name( 'size' );
        // folderWater.open();




        console.log(temp)
        // tempObject.rotation.set(0.5,0,0)
        temp.scale.set(scale,scale,scale)
    })



function initText(){
    let text = 'three.js',

        bevelEnabled = true,

        font = undefined,
        fontName = 'optimer', // helvetiker, optimer, gentilis, droid sans, droid serif
        fontWeight = 'bold'; // normal bold
}



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



    if(lock)
        camControls.lookSpeed = 0

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




    scene.add( water );
    return water
}

function initMovement()
{
    var camControls = new FirstPersonControls(camera);
    camControls.lookSpeed = 0.4;
    camControls.movementSpeed = 3;
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
    camera.position.x = -27.95;
    camera.position.y = 0;
    camera.position.z = -11.95;

    // const gui = new GUI();
    // const folderWater = gui.addFolder( 'Water' );
    // folderWater.add( camera.position, 'x', -30.0,20.0).name( 'x' );
    // folderWater.add( camera.position, 'y', 0.0 ,5.0).name( 'y' );
    // folderWater.add( camera.position, 'z', -30.0,20.0).name( 'z' );
    // folderWater.open();


    camera.lookAt(new THREE.Vector3(0, 0, 0));
    controls = new PointerLockControls(camera,renderer.domElement)
    scene.add(controls.getObject())
    document.addEventListener('mousemove', (e) => {
        camControls.lookSpeed = 0.4

    })


    document.addEventListener("keydown",listener,false)
    return camera




}

function listener(event){

    if(event.keyCode == 88)
        lock = !lock
}

