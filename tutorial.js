import './test.css'

import * as THREE from 'three'

// allows the user to interact with mouse
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

/* You will need the following 3
 * 1) Scene
 * 2) Camera
 * 3) Object
 */

// STARTING SCENE
// scene => CONTAINER 
const scene = new THREE.Scene();

/*
 * 1st arg => Field of View: the fan of view that the audience can see
 * 2nd arg => Aspect Ratio: relation to the view's window
 * 3rd arg => View Frustum: view relative to the camera
 * 4th arg => same as above
 */

// STARTING CAMERA & RENDERER
const camera = new THREE.PerspectiveCamera(
    75, window.innerWidth / window.innerHeight, 0.1, 1000,
)

const renderer = new THREE.WebGL1Renderer({
    canvas: document.querySelector('#bg'),
})

renderer.setPixelRatio(window.devicePixelRatio)
renderer.setSize(window.innerWidth, window.innerHeight)
camera.position.setZ(30)

renderer.render(scene, camera)

// STARTING GEOMETRY
const geometry = new THREE.TorusGeometry(10, 3, 16, 100)
// meshBasic does not require light source
// const material = new THREE.MeshBasicMaterial({ color: 0xff6347, wireframe: true })

// meshStandard requires light source
const material = new THREE.MeshStandardMaterial({ color: 0xff6347 })
const torus = new THREE.Mesh(geometry, material)

scene.add(torus)

// STARTING LIGHT SOURCE
const pointLight = new THREE.PointLight(0xffffff)
pointLight.position.set()

const ambientLight = new THREE.AmbientLight(0xffffff)
scene.add(pointLight, ambientLight)

// helpers to allow us to visualize
const lightHelper = new THREE.PointLightHelper(pointLight)
const gridHelper = new THREE.GridHelper(200, 50)
scene.add(lightHelper, gridHelper)

// const controls = new OrbitControls(camera, renderer.domElement)

function addStar() {
    const geometry = new THREE.SphereGeometry(0.25, 24, 24)
    const material = new THREE.MeshStandardMaterial({ color: 0xffffff })
    const star = new THREE.Mesh(geometry, material)

    const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(100))

    star.position.set(x, y, z)
    scene.add(star)
}

Array(200).fill().forEach(addStar)

// adding background texture to the scene
const spaceTexture = new THREE.TextureLoader().load('space.jpg')
scene.background = spaceTexture

// adding texture to the box
const jeffTexture = new THREE.TextureLoader().load('jeff.png')

const jeff = new THREE.Mesh(
    new THREE.BoxGeometry(3, 3, 3),
    new THREE.MeshBasicMaterial({ map: jeffTexture }),
)

scene.add(jeff)

// adding texture to the moon
const moonTexture = new THREE.TextureLoader.load('moon.jpg')

const moon = new THREE.Mesh(
    new THREE.SphereGeometry(3, 32, 32),
    new THREE.MeshBasicMaterial({
        map: moonTexture,
    })
)

moon.position.z = 30
moon.position.setX(-10)

function moveCamera() {
    // getting the top of the document
    const t = document.body.getBoundingClientRect().top
    moon.rotation.x += 0.05
    moon.rotation.y += 0.075
    moon.rotation.z += 0.05

    jeff.rotation.y += 0.01
    jeff.rotation.z += 0.01

    // camera position respect to the top of the document 't'
    camera.position.z = t * -0.01
    camera.position.x = t * -0.0002
    camera.position.y = t * -0.0002
}

document.body.onscroll = moveCamera

// GAME LOGIC
function animate() {
    requestAnimationFrame(animate)

    torus.rotation.x += 0.01
    torus.rotation.y += 0.005
    torus.rotation.z += 0.01

    // controls.update()

    renderer.render(scene, camera)
}

animate()
