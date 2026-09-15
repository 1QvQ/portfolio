import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { RoundedBox } from '@react-three/drei'
import { MathUtils } from 'three'

const aluminium = '#c8cbca'
const aluminiumLight = '#e0e3e1'
const keyColor = '#333938'

function KeyRow({ z, width }) {
  return (
    <mesh position={[0, 0.178, z]} rotation={[-0.025, 0, 0]}>
      <boxGeometry args={[width, 0.012, 0.043]} />
      <meshStandardMaterial color={keyColor} roughness={0.7} />
    </mesh>
  )
}

export default function Laptop({ reduceMotion = false, ...props }) {
  const content = useRef()
  const smallCircle = useRef()
  const largeCircle = useRef()
  const ballPhysics = useRef({
    small: { x: -0.28, y: 0.08, vx: 0.22, vy: -0.12, radius: 0.13 },
    large: { x: 0.24, y: -0.08, vx: -0.18, vy: 0.1, radius: 0.16 },
  })
  const [hovered, setHovered] = useState(false)

  useFrame((_, delta) => {
    if (!content.current) return
    const next = MathUtils.damp(content.current.scale.x, hovered ? 1.06 : 1, 8, delta)
    content.current.scale.setScalar(next)

    if (reduceMotion || !smallCircle.current || !largeCircle.current) return
    const step = Math.min(delta, 1 / 30)
    const { small, large } = ballPhysics.current

    for (const ball of [small, large]) {
      ball.x += ball.vx * step
      ball.y += ball.vy * step

      const minX = -0.52 + ball.radius
      const maxX = 0.52 - ball.radius
      const minY = -0.32 + ball.radius
      const maxY = 0.3 - ball.radius

      if (ball.x <= minX || ball.x >= maxX) {
        ball.x = MathUtils.clamp(ball.x, minX, maxX)
        ball.vx *= -1
      }
      if (ball.y <= minY || ball.y >= maxY) {
        ball.y = MathUtils.clamp(ball.y, minY, maxY)
        ball.vy *= -1
      }
    }

    const dx = large.x - small.x
    const dy = large.y - small.y
    const distance = Math.hypot(dx, dy)
    const collisionDistance = small.radius + large.radius

    if (distance > 0 && distance < collisionDistance) {
      const normalX = dx / distance
      const normalY = dy / distance
      const overlap = collisionDistance - distance
      small.x -= normalX * overlap * 0.5
      small.y -= normalY * overlap * 0.5
      large.x += normalX * overlap * 0.5
      large.y += normalY * overlap * 0.5

      const relativeSpeed = (large.vx - small.vx) * normalX + (large.vy - small.vy) * normalY
      if (relativeSpeed < 0) {
        const impulse = -relativeSpeed
        small.vx -= impulse * normalX
        small.vy -= impulse * normalY
        large.vx += impulse * normalX
        large.vy += impulse * normalY
      }
    }

    smallCircle.current.position.set(small.x, small.y, 0.071)
    largeCircle.current.position.set(large.x, large.y, 0.072)
  })

  return (
    <group {...props}>
      <group
        ref={content}
        onPointerOver={(event) => {
          event.stopPropagation()
          setHovered(true)
          if (typeof document !== 'undefined') document.body.style.cursor = 'pointer'
        }}
        onPointerOut={() => {
          setHovered(false)
          if (typeof document !== 'undefined') document.body.style.cursor = 'auto'
        }}
      >
        <RoundedBox
          args={[1.32, 0.075, 0.87]}
          radius={0.045}
          smoothness={4}
          position={[0, 0.085, 0.08]}
          castShadow
        >
          <meshStandardMaterial color={aluminium} metalness={0.58} roughness={0.34} />
        </RoundedBox>
        <mesh position={[0, 0.095, 0.515]} rotation={[Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.3, 0.025]} />
          <meshStandardMaterial color="#87908d" metalness={0.55} roughness={0.4} />
        </mesh>

        <group position={[0, 0.535, -0.345]} rotation={[-0.08, 0, 0]}>
          <RoundedBox args={[1.32, 0.88, 0.065]} radius={0.055} smoothness={4} castShadow>
            <meshStandardMaterial color={aluminiumLight} metalness={0.48} roughness={0.3} />
          </RoundedBox>
          <RoundedBox args={[1.18, 0.75, 0.027]} radius={0.032} smoothness={3} position={[0, 0, 0.047]}>
            <meshStandardMaterial color="#182324" metalness={0.12} roughness={0.3} />
          </RoundedBox>
          <RoundedBox args={[1.1, 0.67, 0.01]} radius={0.025} smoothness={3} position={[0, -0.01, 0.064]}>
            <meshStandardMaterial
              color={hovered ? '#6db3c4' : '#477f96'}
              emissive="#315f78"
              emissiveIntensity={hovered ? 0.36 : 0.2}
              roughness={0.38}
            />
          </RoundedBox>
          <mesh ref={smallCircle} position={[-0.26, 0.08, 0.071]} rotation={[0, 0, -0.55]}>
            <circleGeometry args={[0.13, 24]} />
            <meshStandardMaterial color="#90c5be" emissive="#78a99f" emissiveIntensity={0.12} />
          </mesh>
          <mesh ref={largeCircle} position={[0.24, -0.08, 0.072]} rotation={[0, 0, -0.55]}>
            <circleGeometry args={[0.16, 24]} />
            <meshStandardMaterial color="#d7a47c" emissive="#b9795e" emissiveIntensity={0.14} />
          </mesh>
          <mesh position={[0, 0.405, 0.07]}>
            <sphereGeometry args={[0.018, 8, 6]} />
            <meshStandardMaterial color="#1c211f" roughness={0.7} />
          </mesh>
        </group>

        <RoundedBox args={[0.94, 0.024, 0.46]} radius={0.025} smoothness={2} position={[0, 0.155, -0.015]}>
          <meshStandardMaterial color="#252b2a" roughness={0.68} />
        </RoundedBox>
        <KeyRow z={-0.17} width={0.82} />
        <KeyRow z={-0.07} width={0.86} />
        <KeyRow z={0.03} width={0.8} />
        <KeyRow z={0.13} width={0.7} />
        <mesh position={[0, 0.124, 0.31]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.42, 0.2]} />
          <meshStandardMaterial
            color="#9fa5a2"
            metalness={0.35}
            roughness={0.42}
            polygonOffset
            polygonOffsetFactor={-1}
          />
        </mesh>
        <mesh position={[0, 0.22, -0.365]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.025, 0.025, 0.94, 12]} />
          <meshStandardMaterial color="#8f9693" metalness={0.6} roughness={0.32} />
        </mesh>
      </group>
    </group>
  )
}
