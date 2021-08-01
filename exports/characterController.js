import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.module.min.js'

class character {
  constructor() {
    const geometryBox = new THREE.BoxGeometry(1, 1, 1)
    const materialBox = new THREE.MeshPhongMaterial({
      color: 0xFFFFFF
    })
    this.object = new THREE.Mesh(geometryBox, materialBox)
    this.object.position.y = 10
    this.object.x_v = 0
    this.object.y_v = 0
    this.object.landed = false
    this.object.gravity = 0.5
    this.object.friction = 0.7
  }
}

export { character }