const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(
	75,
	window.innerWidth / window.innerHeight,
	0.1,
	1000
)

const renderer = new THREE.WebGLRenderer()
renderer.shadowMap.enabled = true
renderer.setSize(window.innerWidth, window.innerHeight)

var game = document.querySelector('.game')
game.appendChild(renderer.domElement)

// Settings
var levelLength = 100

// Plane
const geometryPlane = new THREE.BoxGeometry(1, 1, 1)
const materialPlane = new THREE.MeshPhongMaterial({
	color: 0xffffff,
})
var plane = new THREE.Mesh(geometryPlane, materialPlane)
plane.scale.x = 1000
plane.scale.z = 3
plane.position.y = -0.5
scene.add(plane)

// Character
const characterBox = new THREE.BoxGeometry(1, 1, 1)
const characterMaterial = new THREE.MeshPhongMaterial({
	color: 0xffffff,
})
var character = new THREE.Mesh(characterBox, characterMaterial)
character.position.y = 0.5
character.x_v = 0
character.y_v = 0
character.landed = true
character.gravity = 0.01

scene.add(character)

// Block
const enemyGeometry = new THREE.BoxGeometry(1, 1, 1)
const enemyMaterial = new THREE.MeshPhongMaterial({
	color: 0xffffff,
})
var enemy = new THREE.Mesh(enemyGeometry, enemyMaterial)

enemy.scale.y = 2
enemy.position.x = 3
enemy.position.y = 1

scene.add(enemy)

// Light
const pointLight = new THREE.PointLight(0x0000ff, 1, 50)
pointLight.position.set(3, 3, 3)
scene.add(pointLight)

// Light
const pointLight1 = new THREE.PointLight(0xff0000, 1, 50)
pointLight1.position.set(-3, 3, -3)
scene.add(pointLight1)

// Camera
camera.rotation.y = 105
camera.rotation.y = 135

scene.add(camera)

// Progress bar
var progress = 0
var progressBar = document.getElementById('progressBar')

// Init
render()
setInterval(gameController, 16)

// Music
window.focus()
window.addEventListener(
	'focus',
	new Audio('assets/music/i_like_cute_girls.mp3').play()
)

// Fix wrong size of a game when resized
function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight
	camera.updateProjectionMatrix()

	renderer.setSize(window.innerWidth, window.innerHeight)
}

window.addEventListener('resize', onWindowResize, false)

// Key Controller
function keyDown(data) {
	if (
		(data.code == 'Space' || data.code == 'Click') &&
		character.landed == true
	) {
		character.landed = false
		character.y_v += 0.21
	}
}

window.addEventListener('keydown', keyDown)

function gameController() {
	// Camera
	camera.lookAt(character.position)

	camera.position.x = character.position.x - 2
	camera.position.y = character.position.y + 2
	camera.position.z = character.position.z + 3

	// Progress bar
	progress = (character.position.x / levelLength) * progressBar.max
	progressBar.value = progress

	// characterMoveController
	character.position.x += 0.01

	character.landed = false

	scene.children.forEach((object) => {
		if (object == character || object == camera || object.type == 'PointLight')
			return

		if (
			object.position.x + object.scale.x / 2 <=
				character.position.x - character.scale.x / 2 ||
			object.position.x - object.scale.x / 2 >=
				character.position.x + character.scale.x / 2 ||
			object.position.y + object.scale.y / 2 <=
				character.position.y - character.scale.y / 2 ||
			object.position.y - object.scale.y / 2 >=
				character.position.y + character.scale.y / 2
		)
			return

		if (character.y_v <= 0) character.y_v = 0

		character.landed = true
	})

	character.rotation.z = character.rotation.z - 0.04

	if (!character.landed) character.y_v -= character.gravity
	if (character.landed) character.rotation.z = 0

	character.position.y += character.y_v
}

// Render world
function render() {
	renderer.render(scene, camera)

	requestAnimationFrame(render)
}
