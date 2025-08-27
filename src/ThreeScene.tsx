import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { createHouse, createTree, createBox, COLORS } from './utils/primitives'
import type { PrimitiveType } from './types'
import PrimitiveToolbar from './components/PrimitiveToolbar'
import ObjectProperties from './components/ObjectProperties'
import SceneManager from './components/SceneManager'
import { useSceneManager } from './hooks/useSceneManager'
import { OrbitControls } from './utils/cameraControls'

const ThreeScene: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<THREE.Scene>(null)
  const rendererRef = useRef<THREE.WebGLRenderer>(null)
  const cameraRef = useRef<THREE.PerspectiveCamera>(null)
  const controlsRef = useRef<OrbitControls>(null)
  const [selectedPrimitive, setSelectedPrimitive] = useState<PrimitiveType>('box')
  
  const sceneManager = useSceneManager(sceneRef.current || undefined)

  const handleAddPrimitive = () => {
    // Add primitive at a random position for now
    const randomX = (Math.random() - 0.5) * 10
    const randomZ = (Math.random() - 0.5) * 10
    sceneManager.addPrimitive(selectedPrimitive, { x: randomX, y: 1, z: randomZ })
  }

  const handleClearScene = () => {
    sceneManager.clearScene()
  }

  const handleExportScene = () => {
    const sceneData = sceneManager.getSceneData()
    return JSON.stringify(sceneData, null, 2)
  }

  const handleLoadScene = (data: any[]) => {
    sceneManager.loadSceneData(data)
  }

  const handleObjectClick = (event: MouseEvent) => {
    if (!cameraRef.current || !sceneRef.current || !rendererRef.current) return

    // Calculate mouse position in normalized device coordinates
    const rect = rendererRef.current.domElement.getBoundingClientRect()
    const mouse = new THREE.Vector2()
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1

    // Set up raycaster
    const raycaster = new THREE.Raycaster()
    raycaster.setFromCamera(mouse, cameraRef.current)

    // Get all meshes that can be intersected (only user-created objects)
    const intersectableObjects = sceneManager.objects.map(obj => obj.mesh)
    const intersects = raycaster.intersectObjects(intersectableObjects, true)

    if (intersects.length > 0) {
      // Find the closest intersection
      const intersectedMesh = intersects[0].object
      
      // Find the scene object that contains this mesh
      const selectedObj = sceneManager.objects.find(obj => {
        if (obj.mesh === intersectedMesh) return true
        // Check if it's part of a group
        if (obj.mesh instanceof THREE.Group) {
          return obj.mesh.children.includes(intersectedMesh as THREE.Mesh)
        }
        return false
      })

      if (selectedObj) {
        sceneManager.selectObject(selectedObj)
      }
    } else {
      // Clicked on empty space, deselect
      sceneManager.selectObject(null)
    }
  }

  useEffect(() => {
    if (!mountRef.current) return

    // Scene setup
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x87CEEB) // Sky blue background
    sceneRef.current = scene

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    )
    camera.position.set(5, 5, 5)
    camera.lookAt(0, 0, 0)
    cameraRef.current = camera

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    rendererRef.current = renderer

    mountRef.current.appendChild(renderer.domElement)

    // Lighting setup
    const ambientLight = new THREE.AmbientLight(0x404040, 0.4)
    scene.add(ambientLight)

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
    directionalLight.position.set(10, 10, 5)
    directionalLight.castShadow = true
    directionalLight.shadow.mapSize.width = 2048
    directionalLight.shadow.mapSize.height = 2048
    scene.add(directionalLight)

    // Ground plane
    const groundGeometry = new THREE.PlaneGeometry(50, 50)
    const groundMaterial = new THREE.MeshLambertMaterial({ color: 0x90EE90 })
    const ground = new THREE.Mesh(groundGeometry, groundMaterial)
    ground.rotation.x = -Math.PI / 2
    ground.receiveShadow = true
    scene.add(ground)

    // Sample primitive objects using our utilities
    
    // House
    const house = createHouse({
      position: { x: 0, y: 0, z: 0 },
      width: 2,
      height: 2,
      depth: 1.5
    })
    scene.add(house)

    // Tree
    const tree = createTree({
      position: { x: -4, y: 0, z: 0 },
      trunkHeight: 2,
      leavesRadius: 1.2
    })
    scene.add(tree)

    // Another tree
    const tree2 = createTree({
      position: { x: 4, y: 0, z: -2 },
      trunkHeight: 1.5,
      leavesRadius: 1
    })
    scene.add(tree2)

    // Some additional boxes for demonstration
    const box1 = createBox({
      width: 1,
      height: 1.5,
      depth: 1,
      color: COLORS.BLUE,
      position: { x: 2, y: 0.75, z: 2 }
    })
    scene.add(box1)

    // Set up camera controls
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.05
    controls.enableRotate = true
    controls.enableZoom = true
    controls.enablePan = true
    controls.minDistance = 5
    controls.maxDistance = 100
    controlsRef.current = controls

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate)
      
      // Update controls
      if (controlsRef.current) {
        controlsRef.current.update()
      }
      
      // Rotate the box slightly for visual interest
      if (box1) {
        box1.rotation.y += 0.01
      }
      
      renderer.render(scene, camera)
    }
    animate()

    // Handle window resize
    const handleResize = () => {
      if (!cameraRef.current || !rendererRef.current) return
      
      cameraRef.current.aspect = window.innerWidth / window.innerHeight
      cameraRef.current.updateProjectionMatrix()
      rendererRef.current.setSize(window.innerWidth, window.innerHeight)
    }

    window.addEventListener('resize', handleResize)
    renderer.domElement.addEventListener('click', handleObjectClick)

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize)
      renderer.domElement.removeEventListener('click', handleObjectClick)
      if (controlsRef.current) {
        controlsRef.current.dispose()
      }
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement)
      }
      renderer.dispose()
    }
  }, [])

  return (
    <>
      <div ref={mountRef} style={{ width: '100%', height: '100vh' }} />
      <PrimitiveToolbar
        selectedPrimitive={selectedPrimitive}
        onPrimitiveSelect={setSelectedPrimitive}
        onAddPrimitive={handleAddPrimitive}
        onClearScene={handleClearScene}
      />
      <ObjectProperties
        selectedObject={sceneManager.selectedObject}
        onUpdatePosition={(position) => {
          if (sceneManager.selectedObject) {
            sceneManager.updateObjectPosition(sceneManager.selectedObject.id, position)
          }
        }}
        onUpdateRotation={(rotation) => {
          if (sceneManager.selectedObject) {
            sceneManager.updateObjectRotation(sceneManager.selectedObject.id, rotation)
          }
        }}
        onUpdateScale={(scale) => {
          if (sceneManager.selectedObject) {
            sceneManager.updateObjectScale(sceneManager.selectedObject.id, scale)
          }
        }}
        onUpdateColor={(color) => {
          if (sceneManager.selectedObject) {
            sceneManager.updateObjectColor(sceneManager.selectedObject.id, color)
          }
        }}
        onDeleteObject={() => {
          if (sceneManager.selectedObject) {
            sceneManager.removeObject(sceneManager.selectedObject.id)
          }
        }}
      />
      <SceneManager
        onSaveScene={() => {}}
        onLoadScene={handleLoadScene}
        onExportScene={handleExportScene}
      />
    </>
  )
}

export default ThreeScene