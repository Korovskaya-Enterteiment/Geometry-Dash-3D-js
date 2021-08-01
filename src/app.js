//Imports
import * as THREE from '../node_modules/three/build/three.module.js'

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)

const renderer = new THREE.WebGLRenderer()
renderer.shadowMap.enabled = true;
renderer.setSize(window.innerWidth, window.innerHeight)

let game = document.querySelector('.game')
game.appendChild(renderer.domElement)

//Settings
let levelLength = 100

//Plane
const geometryPlane = new THREE.BoxGeometry(1000, 1, 3)
const materialPlane = new THREE.MeshPhongMaterial({
  color: 0xFFFFFF
})
let plane = new THREE.Mesh(geometryPlane, materialPlane)
plane.position.y = -0.5
scene.add(plane)

//Character
const geometryBox = new THREE.BoxGeometry(1, 1, 1)
const materialBox = new THREE.MeshPhongMaterial({
  color: 0xFFFFFF
})
let character = new THREE.Mesh(geometryBox, materialBox)
character.position.y = 0.5
character.x_v = 0
character.y_v = 0
character.landed = true
character.gravity = 0.001

scene.add(character)

//Light
const pointLight = new THREE.PointLight(0x0000FF, 1, 50)
pointLight.position.set(3, 3, 3)
scene.add(pointLight)

//Light
const pointLight1 = new THREE.PointLight(0xFF0000, 1, 50)
pointLight1.position.set(-3, 3, -3)
scene.add(pointLight1)

//Camera
camera.rotation.y = 105
camera.rotation.y = 135

scene.add( camera )

//Progress bar
let progress = 0
let progressBar = document.getElementById('progressBar')

//Init
render()
gameController()
window.focus()

//Music
let music = new Audio('../assets/music/i_like_cute_girls.mp3')
music.play()

//Fix wrong size of a game when resized
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()

  renderer.setSize(window.innerWidth, window.innerHeight)
}

window.addEventListener('resize', onWindowResize, false)

//Key Controller
function keyDown(data) {
  if (data.code == 'Space' && character.landed == true) {
    character.landed = false
    character.y_v += 0.05
  }
}
  
window.addEventListener('keydown', keyDown)

function gameController() {
  //Camera
  camera.lookAt(character.position)

  camera.position.x = character.position.x - 2
  camera.position.y = character.position.y + 2
  camera.position.z = character.position.z + 3  

  character.position.x += 0.01

  //Progress bar
  progress = character.position.x / levelLength * progressBar.max
  progressBar.value = progress

  //characterMoveController
  if (character.landed == false) {
    character.rotation.z -= 0.016

    character.y_v -= character.gravity
  } else {
    character.rotation.z = 0
  }

  if (character.position.y + character.y_v <= 0.5) {
    character.position.y = 0.5
  } else {
    character.position.y += character.y_v
  }

  character.position.y += character.y_v

  if (character.position.y <= 0.5) {
    character.y_v = 0
    character.landed = true
  }

  scene.children.forEach(object => {
    if (object == character) return
    if (
      object.position.x + object.scale.x <= character.position.x + character.scale.x &&
      object.position.y + object.scale.y <= character.position.y + character.scale.y
      ) return
  })

  requestAnimationFrame(gameController)
}

//Render world
function render() {
  renderer.render(scene, camera)

  requestAnimationFrame(render)
}