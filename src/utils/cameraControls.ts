import * as THREE from 'three'

export class OrbitControls {
  private camera: THREE.PerspectiveCamera
  private domElement: HTMLElement
  private target: THREE.Vector3
  private spherical: THREE.Spherical
  private sphericalDelta: THREE.Spherical
  private scale: number
  private panOffset: THREE.Vector3
  private zoomChanged: boolean

  // Settings
  public enableDamping: boolean = true
  public dampingFactor: number = 0.05
  public enableZoom: boolean = true
  public zoomSpeed: number = 1.0
  public minDistance: number = 0
  public maxDistance: number = Infinity
  public enableRotate: boolean = true
  public rotateSpeed: number = 1.0
  public enablePan: boolean = true
  public panSpeed: number = 1.0
  public minPolarAngle: number = 0
  public maxPolarAngle: number = Math.PI
  public minAzimuthAngle: number = -Infinity
  public maxAzimuthAngle: number = Infinity

  // Internal state
  private rotateStart: THREE.Vector2 = new THREE.Vector2()
  private rotateEnd: THREE.Vector2 = new THREE.Vector2()
  private rotateDelta: THREE.Vector2 = new THREE.Vector2()
  private panStart: THREE.Vector2 = new THREE.Vector2()
  private panEnd: THREE.Vector2 = new THREE.Vector2()
  private panDelta: THREE.Vector2 = new THREE.Vector2()
  private dollyStart: THREE.Vector2 = new THREE.Vector2()
  private dollyEnd: THREE.Vector2 = new THREE.Vector2()
  private dollyDelta: THREE.Vector2 = new THREE.Vector2()

  private state: 'NONE' | 'ROTATE' | 'DOLLY' | 'PAN' = 'NONE'
  private EPS: number = 0.000001

  constructor(camera: THREE.PerspectiveCamera, domElement: HTMLElement) {
    this.camera = camera
    this.domElement = domElement
    this.target = new THREE.Vector3()
    this.spherical = new THREE.Spherical()
    this.sphericalDelta = new THREE.Spherical()
    this.scale = 1
    this.panOffset = new THREE.Vector3()
    this.zoomChanged = false

    this.domElement.addEventListener('contextmenu', this.onContextMenu.bind(this))
    this.domElement.addEventListener('mousedown', this.onMouseDown.bind(this))
    this.domElement.addEventListener('wheel', this.onMouseWheel.bind(this))
    this.domElement.addEventListener('touchstart', this.onTouchStart.bind(this))
    this.domElement.addEventListener('touchend', this.onTouchEnd.bind(this))
    this.domElement.addEventListener('touchmove', this.onTouchMove.bind(this))

    // Initialize
    this.update()
  }

  public update(): boolean {
    const offset = new THREE.Vector3()
    const quat = new THREE.Quaternion().setFromUnitVectors(this.camera.up, new THREE.Vector3(0, 1, 0))
    const quatInverse = quat.clone().invert()

    const lastPosition = new THREE.Vector3()
    const lastQuaternion = new THREE.Quaternion()

    lastPosition.copy(this.camera.position)
    lastQuaternion.copy(this.camera.quaternion)

    offset.copy(this.camera.position).sub(this.target)
    offset.applyQuaternion(quat)

    this.spherical.setFromVector3(offset)

    if (this.enableDamping) {
      this.spherical.theta += this.sphericalDelta.theta * this.dampingFactor
      this.spherical.phi += this.sphericalDelta.phi * this.dampingFactor
    } else {
      this.spherical.theta += this.sphericalDelta.theta
      this.spherical.phi += this.sphericalDelta.phi
    }

    // Restrict theta to be between desired limits
    this.spherical.theta = Math.max(this.minAzimuthAngle, Math.min(this.maxAzimuthAngle, this.spherical.theta))

    // Restrict phi to be between desired limits
    this.spherical.phi = Math.max(this.minPolarAngle, Math.min(this.maxPolarAngle, this.spherical.phi))

    this.spherical.makeSafe()

    this.spherical.radius *= this.scale

    // Restrict radius to be between desired limits
    this.spherical.radius = Math.max(this.minDistance, Math.min(this.maxDistance, this.spherical.radius))

    // Move target to panned location
    if (this.enableDamping) {
      this.target.addScaledVector(this.panOffset, this.dampingFactor)
    } else {
      this.target.add(this.panOffset)
    }

    offset.setFromSpherical(this.spherical)
    offset.applyQuaternion(quatInverse)

    this.camera.position.copy(this.target).add(offset)
    this.camera.lookAt(this.target)

    if (this.enableDamping) {
      this.sphericalDelta.theta *= (1 - this.dampingFactor)
      this.sphericalDelta.phi *= (1 - this.dampingFactor)
      this.panOffset.multiplyScalar(1 - this.dampingFactor)
    } else {
      this.sphericalDelta.set(0, 0, 0)
      this.panOffset.set(0, 0, 0)
    }

    this.scale = 1

    // Update condition
    if (this.zoomChanged ||
        lastPosition.distanceToSquared(this.camera.position) > this.EPS ||
        8 * (1 - lastQuaternion.dot(this.camera.quaternion)) > this.EPS) {
      this.zoomChanged = false
      return true
    }

    return false
  }

  public dispose(): void {
    this.domElement.removeEventListener('contextmenu', this.onContextMenu)
    this.domElement.removeEventListener('mousedown', this.onMouseDown)
    this.domElement.removeEventListener('wheel', this.onMouseWheel)
    this.domElement.removeEventListener('touchstart', this.onTouchStart)
    this.domElement.removeEventListener('touchend', this.onTouchEnd)
    this.domElement.removeEventListener('touchmove', this.onTouchMove)
    
    document.removeEventListener('mousemove', this.onMouseMove)
    document.removeEventListener('mouseup', this.onMouseUp)
  }

  private getAutoRotationAngle(): number {
    return 2 * Math.PI / 60 / 60 * 1000
  }

  private getZoomScale(): number {
    return Math.pow(0.95, this.zoomSpeed)
  }

  private rotateLeft(angle: number): void {
    this.sphericalDelta.theta -= angle
  }

  private rotateUp(angle: number): void {
    this.sphericalDelta.phi -= angle
  }

  private panLeft(distance: number, objectMatrix: THREE.Matrix4): void {
    const v = new THREE.Vector3()
    v.setFromMatrixColumn(objectMatrix, 0) // get X column of objectMatrix
    v.multiplyScalar(-distance)
    this.panOffset.add(v)
  }

  private panUp(distance: number, objectMatrix: THREE.Matrix4): void {
    const v = new THREE.Vector3()
    v.setFromMatrixColumn(objectMatrix, 1) // get Y column of objectMatrix
    v.multiplyScalar(distance)
    this.panOffset.add(v)
  }

  private pan(deltaX: number, deltaY: number): void {
    const element = this.domElement
    const offset = new THREE.Vector3()

    offset.copy(this.camera.position).sub(this.target)

    // Half of the fov is center to top of screen
    let targetDistance = offset.length()

    // Convert to world units
    targetDistance *= Math.tan((this.camera.fov / 2) * Math.PI / 180.0)

    // We actually don't use screenWidth, since perspective camera is fixed to screen height
    this.panLeft(2 * deltaX * targetDistance / element.clientHeight, this.camera.matrix)
    this.panUp(2 * deltaY * targetDistance / element.clientHeight, this.camera.matrix)
  }

  private dollyOut(dollyScale: number): void {
    this.scale /= dollyScale
  }

  private dollyIn(dollyScale: number): void {
    this.scale *= dollyScale
  }

  private handleMouseDownRotate(event: MouseEvent): void {
    this.rotateStart.set(event.clientX, event.clientY)
  }

  private handleMouseDownDolly(event: MouseEvent): void {
    this.dollyStart.set(event.clientX, event.clientY)
  }

  private handleMouseDownPan(event: MouseEvent): void {
    this.panStart.set(event.clientX, event.clientY)
  }

  private handleMouseMoveRotate(event: MouseEvent): void {
    this.rotateEnd.set(event.clientX, event.clientY)
    this.rotateDelta.subVectors(this.rotateEnd, this.rotateStart).multiplyScalar(this.rotateSpeed)

    const element = this.domElement

    this.rotateLeft(2 * Math.PI * this.rotateDelta.x / element.clientHeight) // yes, height
    this.rotateUp(2 * Math.PI * this.rotateDelta.y / element.clientHeight)

    this.rotateStart.copy(this.rotateEnd)
  }

  private handleMouseMoveDolly(event: MouseEvent): void {
    this.dollyEnd.set(event.clientX, event.clientY)
    this.dollyDelta.subVectors(this.dollyEnd, this.dollyStart)

    if (this.dollyDelta.y > 0) {
      this.dollyOut(this.getZoomScale())
    } else if (this.dollyDelta.y < 0) {
      this.dollyIn(this.getZoomScale())
    }

    this.dollyStart.copy(this.dollyEnd)
  }

  private handleMouseMovePan(event: MouseEvent): void {
    this.panEnd.set(event.clientX, event.clientY)
    this.panDelta.subVectors(this.panEnd, this.panStart).multiplyScalar(this.panSpeed)

    this.pan(this.panDelta.x, this.panDelta.y)

    this.panStart.copy(this.panEnd)
  }

  private handleMouseWheel(event: WheelEvent): void {
    if (event.deltaY < 0) {
      this.dollyIn(this.getZoomScale())
    } else if (event.deltaY > 0) {
      this.dollyOut(this.getZoomScale())
    }

    this.zoomChanged = true
  }

  private onMouseDown(event: MouseEvent): void {
    if (!this.enabled) return

    event.preventDefault()

    switch (event.button) {
      case 0: // left
        if (event.ctrlKey || event.metaKey || event.shiftKey) {
          if (!this.enablePan) return
          this.handleMouseDownPan(event)
          this.state = 'PAN'
        } else {
          if (!this.enableRotate) return
          this.handleMouseDownRotate(event)
          this.state = 'ROTATE'
        }
        break

      case 1: // middle
        if (!this.enableZoom) return
        this.handleMouseDownDolly(event)
        this.state = 'DOLLY'
        break

      case 2: // right
        if (!this.enablePan) return
        this.handleMouseDownPan(event)
        this.state = 'PAN'
        break
    }

    if (this.state !== 'NONE') {
      document.addEventListener('mousemove', this.onMouseMove.bind(this))
      document.addEventListener('mouseup', this.onMouseUp.bind(this))
    }
  }

  private onMouseMove(event: MouseEvent): void {
    if (!this.enabled) return

    event.preventDefault()

    switch (this.state) {
      case 'ROTATE':
        if (!this.enableRotate) return
        this.handleMouseMoveRotate(event)
        break

      case 'DOLLY':
        if (!this.enableZoom) return
        this.handleMouseMoveDolly(event)
        break

      case 'PAN':
        if (!this.enablePan) return
        this.handleMouseMovePan(event)
        break
    }
  }

  private onMouseUp(): void {
    if (!this.enabled) return

    document.removeEventListener('mousemove', this.onMouseMove)
    document.removeEventListener('mouseup', this.onMouseUp)

    this.state = 'NONE'
  }

  private onMouseWheel(event: WheelEvent): void {
    if (!this.enabled || !this.enableZoom || (this.state !== 'NONE' && this.state !== 'ROTATE')) return

    event.preventDefault()
    event.stopPropagation()

    this.handleMouseWheel(event)
  }

  private onTouchStart(event: TouchEvent): void {
    // Touch controls implementation would go here
    // Simplified for this demo
  }

  private onTouchEnd(event: TouchEvent): void {
    // Touch controls implementation would go here
  }

  private onTouchMove(event: TouchEvent): void {
    // Touch controls implementation would go here
  }

  private onContextMenu(event: Event): void {
    if (!this.enabled) return
    event.preventDefault()
  }

  public get enabled(): boolean {
    return this._enabled
  }

  public set enabled(value: boolean) {
    this._enabled = value
  }

  private _enabled: boolean = true
}