function Rock({ position, scale = 1, color = '#82907f' }) {
  return (
    <mesh position={position} scale={scale} castShadow receiveShadow>
      <dodecahedronGeometry args={[0.2, 0]} />
      <meshStandardMaterial color={color} roughness={0.95} flatShading />
    </mesh>
  )
}

function Plant({ position, color = '#e46b51' }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.12, 0]} castShadow>
        <cylinderGeometry args={[0.018, 0.024, 0.24, 6]} />
        <meshStandardMaterial color="#426b4b" roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.27, 0]} castShadow>
        <dodecahedronGeometry args={[0.09, 0]} />
        <meshStandardMaterial color={color} roughness={0.8} flatShading />
      </mesh>
    </group>
  )
}

export default function Planet(props) {
  return (
    <group {...props}>
      <mesh position={[0, -0.04, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[2.55, 2.42, 0.5, 10]} />
        <meshStandardMaterial color="#8fc77a" roughness={0.95} flatShading />
      </mesh>

      <mesh position={[0, -0.48, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[2.38, 2.08, 0.48, 10]} />
        <meshStandardMaterial color="#b97855" roughness={1} flatShading />
      </mesh>

      <mesh position={[0, -1.05, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[2.08, 1.42, 0.72, 10]} />
        <meshStandardMaterial color="#8b6959" roughness={1} flatShading />
      </mesh>

      <mesh position={[0, -1.68, 0]} castShadow receiveShadow>
        <coneGeometry args={[1.43, 0.72, 10]} />
        <meshStandardMaterial color="#6f5b54" roughness={1} flatShading />
      </mesh>

      <mesh position={[-1.72, 0.28, 0.65]} rotation={[0, 0.3, -0.08]} castShadow>
        <cylinderGeometry args={[0.07, 0.1, 0.64, 7]} />
        <meshStandardMaterial color="#765441" roughness={0.95} />
      </mesh>
      <group position={[-1.72, 0.72, 0.65]}>
        <mesh position={[-0.15, 0, 0]} castShadow>
          <dodecahedronGeometry args={[0.42, 0]} />
          <meshStandardMaterial color="#5e9963" roughness={1} flatShading />
        </mesh>
        <mesh position={[0.19, 0.06, 0.04]} castShadow>
          <dodecahedronGeometry args={[0.38, 0]} />
          <meshStandardMaterial color="#70aa6b" roughness={1} flatShading />
        </mesh>
      </group>

      <Rock position={[1.85, 0.26, 0.95]} scale={1.25} />
      <Rock position={[2.02, 0.19, 0.63]} scale={0.72} color="#9aa28c" />
      <Rock position={[-1.78, 0.19, -1.15]} scale={0.72} color="#788875" />
      <Plant position={[0.92, 0.25, 1.7]} />
      <Plant position={[1.22, 0.25, 1.55]} color="#f0b45d" />
      <Plant position={[-1.45, 0.25, -1.15]} color="#f0b45d" />
    </group>
  )
}
