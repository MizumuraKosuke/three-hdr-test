import { Canvas, MeshProps, useFrame } from '@react-three/fiber'
import { useEffect, useRef, useState } from 'react'
import { Environment, OrbitControls } from '@react-three/drei'
import { DataTexture, EquirectangularReflectionMapping, Mesh, Texture } from 'three'
import { RGBELoader } from 'three-stdlib'

const Box = ({ envMap }: { envMap: Texture | undefined }) => {
  const mesh = useRef<Mesh>(null)
  const [active, setActive] = useState(false)

  useFrame((_, delta) => {
    if (mesh.current === null) {
      return
    }
    mesh.current.rotation.x += delta
  })

  return (
    <mesh
      position={[1, 0, 0]}
      ref={mesh}
      scale={active ? 1.5 : 1}
      onClick={() => setActive(!active)}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial
        envMap={envMap}
        roughness={0.0}
        metalness={1}
      />
    </mesh>
  )
}

const Sphere = ({ envMap }: { envMap: Texture | undefined }) => {
  const mesh = useRef<Mesh>(null)
  const [active, setActive] = useState(false)

  useFrame((_, delta) => {
    if (mesh.current === null) {
      return
    }
    mesh.current.rotation.x += delta
  })

  return (
    <mesh
      position={[-1, 0, 0]}
      ref={mesh}
      scale={active ? 1.5 : 1}
      onClick={() => setActive(!active)}
    >
      <sphereGeometry args={[1, 2, 3]} />
      <meshStandardMaterial
        envMap={envMap}
        roughness={0.0}
        metalness={1}
      />
    </mesh>
  )
}

const Objects = () => {
  const mesh = useRef<Mesh>(null)
  const [hovered, setHover] = useState(false)
  const [active, setActive] = useState(false)
  const [envMap, setEnvMap] = useState<DataTexture>()

  useFrame((state, delta) => {
    if (mesh.current === null) {
      return
    }
    mesh.current.rotation.x += delta
  })

  useEffect(() => {
    new RGBELoader().load('/hdr/sample.hdr', (texture) => {
      texture.mapping = EquirectangularReflectionMapping
      setEnvMap(texture)
    })
  }, [])

  return (
    <>
      <Box envMap={envMap} />
      <Sphere envMap={envMap} />
    </>
  )
}


export default function Home() {
  return (
    <main
      className={`fixed inset-0`}
    >
      <Canvas>
        <OrbitControls />
        <Environment files="/hdr/sample.hdr" background blur={0} />
        <ambientLight />
        <pointLight position={[10, 10, 10]} />
        <Objects />
      </Canvas>
    </main> 
  )
}
