import React, { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { SceneCombiner, TeamScene } from '../utils/sceneCombiner'

interface CombinedSceneViewerProps {
  teamScenes: TeamScene[]
  onClose: () => void
}

const CombinedSceneViewer: React.FC<CombinedSceneViewerProps> = ({
  teamScenes,
  onClose
}) => {
  const mountRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<THREE.Scene>()
  const rendererRef = useRef<THREE.WebGLRenderer>()
  const cameraRef = useRef<THREE.PerspectiveCamera>()
  const combinerRef = useRef<SceneCombiner>()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!mountRef.current) return

    setIsLoading(true)

    // Scene setup
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x87CEEB)
    sceneRef.current = scene

    // Camera setup - positioned higher and further back for overview
    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      2000
    )
    camera.position.set(0, 100, 200)
    camera.lookAt(0, 0, 0)
    cameraRef.current = camera

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    rendererRef.current = renderer

    mountRef.current.appendChild(renderer.domElement)

    // Enhanced lighting for the combined scene
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6)
    scene.add(ambientLight)

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
    directionalLight.position.set(50, 100, 50)
    directionalLight.castShadow = true
    directionalLight.shadow.mapSize.width = 4096
    directionalLight.shadow.mapSize.height = 4096
    directionalLight.shadow.camera.left = -200
    directionalLight.shadow.camera.right = 200
    directionalLight.shadow.camera.top = 200
    directionalLight.shadow.camera.bottom = -200
    directionalLight.shadow.camera.far = 500
    scene.add(directionalLight)

    // Create massive ground plane for the combined world
    const groundGeometry = new THREE.PlaneGeometry(1000, 1000)
    const groundMaterial = new THREE.MeshLambertMaterial({ 
      color: 0x90EE90,
      transparent: true,
      opacity: 0.8
    })
    const ground = new THREE.Mesh(groundGeometry, groundMaterial)
    ground.rotation.x = -Math.PI / 2
    ground.receiveShadow = true
    scene.add(ground)

    // Initialize scene combiner
    const combiner = new SceneCombiner(scene, {
      gridSize: 40,
      spacing: 80,
      maxTeamsPerRow: 3
    })
    combinerRef.current = combiner

    // Load all team scenes
    combiner.combineAllScenes(teamScenes)

    // Camera controls (basic orbit)
    let mouseDown = false
    let mouseX = 0
    let mouseY = 0
    const cameraDistance = 200

    const handleMouseDown = (event: MouseEvent) => {
      mouseDown = true
      mouseX = event.clientX
      mouseY = event.clientY
    }

    const handleMouseUp = () => {
      mouseDown = false
    }

    const handleMouseMove = (event: MouseEvent) => {
      if (!mouseDown || !cameraRef.current) return

      const deltaX = event.clientX - mouseX
      const deltaY = event.clientY - mouseY

      // Orbit camera around the center
      const spherical = new THREE.Spherical()
      spherical.setFromVector3(cameraRef.current.position)
      
      spherical.theta -= deltaX * 0.01
      spherical.phi += deltaY * 0.01
      spherical.phi = Math.max(0.1, Math.min(Math.PI - 0.1, spherical.phi))

      cameraRef.current.position.setFromSpherical(spherical)
      cameraRef.current.lookAt(0, 0, 0)

      mouseX = event.clientX
      mouseY = event.clientY
    }

    const handleWheel = (event: WheelEvent) => {
      if (!cameraRef.current) return
      
      const scaleFactor = event.deltaY > 0 ? 1.1 : 0.9
      cameraRef.current.position.multiplyScalar(scaleFactor)
      
      // Clamp camera distance
      const distance = cameraRef.current.position.length()
      if (distance < 50) {
        cameraRef.current.position.normalize().multiplyScalar(50)
      } else if (distance > 500) {
        cameraRef.current.position.normalize().multiplyScalar(500)
      }
    }

    renderer.domElement.addEventListener('mousedown', handleMouseDown)
    renderer.domElement.addEventListener('mouseup', handleMouseUp)
    renderer.domElement.addEventListener('mousemove', handleMouseMove)
    renderer.domElement.addEventListener('wheel', handleWheel)

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate)
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

    setIsLoading(false)

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize)
      renderer.domElement.removeEventListener('mousedown', handleMouseDown)
      renderer.domElement.removeEventListener('mouseup', handleMouseUp)
      renderer.domElement.removeEventListener('mousemove', handleMouseMove)
      renderer.domElement.removeEventListener('wheel', handleWheel)
      
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement)
      }
      renderer.dispose()
    }
  }, [teamScenes])

  const handleExportCombined = () => {
    if (combinerRef.current) {
      const combinedData = combinerRef.current.exportCombinedScene()
      const dataBlob = new Blob([combinedData], { type: 'application/json' })
      const url = URL.createObjectURL(dataBlob)
      
      const link = document.createElement('a')
      link.href = url
      link.download = `combined-world-${new Date().toISOString().slice(0, 10)}.json`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    }
  }

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 2000 }}>
      <div ref={mountRef} style={{ width: '100%', height: '100vh' }} />
      
      {/* Loading overlay */}
      {isLoading && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontSize: '24px',
          fontFamily: 'Arial, sans-serif'
        }}>
          Building the Combined World...
        </div>
      )}

      {/* Header */}
      <div style={{
        position: 'absolute',
        top: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        color: 'white',
        padding: '15px 30px',
        borderRadius: '10px',
        fontFamily: 'Arial, sans-serif',
        textAlign: 'center'
      }}>
        <h2 style={{ margin: '0 0 10px 0', fontSize: '24px' }}>
          🌟 The Combined Virtual World! 🌟
        </h2>
        <p style={{ margin: 0, fontSize: '14px' }}>
          {teamScenes.length} teams have contributed to this amazing world!
        </p>
      </div>

      {/* Controls */}
      <div style={{
        position: 'absolute',
        top: '20px',
        right: '20px',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: '15px',
        borderRadius: '10px',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px'
      }}>
        <button
          onClick={handleExportCombined}
          style={{
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            padding: '10px 15px',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: 'bold'
          }}
        >
          💾 Export Combined World
        </button>
        
        <button
          onClick={onClose}
          style={{
            backgroundColor: '#f44336',
            color: 'white',
            border: 'none',
            padding: '10px 15px',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: 'bold'
          }}
        >
          ← Back to Workshop
        </button>
      </div>

      {/* Instructions */}
      <div style={{
        position: 'absolute',
        bottom: '20px',
        left: '20px',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        color: 'white',
        padding: '15px',
        borderRadius: '10px',
        fontFamily: 'Arial, sans-serif',
        fontSize: '12px',
        maxWidth: '300px'
      }}>
        <h4 style={{ margin: '0 0 10px 0', fontSize: '14px' }}>Navigation Controls:</h4>
        <ul style={{ margin: 0, paddingLeft: '20px' }}>
          <li>Click and drag to orbit around the world</li>
          <li>Scroll to zoom in/out</li>
          <li>Each team's scene is labeled and positioned in its own district</li>
        </ul>
      </div>
    </div>
  )
}

export default CombinedSceneViewer