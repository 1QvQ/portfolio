import { Suspense, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import {
  ContactShadows,
  Float,
  OrbitControls,
  OrthographicCamera,
  Sparkles,
} from '@react-three/drei'
import { useReducedMotion } from 'framer-motion'
import Planet from './Planet'
import Laptop from './objects/Computer'
import Car from './objects/Car'
import Cat from './objects/Cat'
import { DinosaurPond, Pterodactyl } from './objects/Dinosaurs'
import Keyboard from './objects/Keyboard'

const funFacts = {
  island: {
    title: 'Floating island',
    fact: 'My small world?',
  },
  laptop: {
    title: 'MacBook Air',
    fact: 'Yes I have a laptop.',
  },
  car: {
    title: 'Audi TT',
    fact: 'Box with wheels and personality.',
  },
  cat: {
    title: 'Tabby cat',
    fact: 'Luna has lots of attitude.',
  },
  dinosaur: {
    title: 'Brachiosaurus',
    fact: 'My favourite dinosaur.',
  },
  keyboard: {
    title: 'Mechanical keyboard',
    fact: 'I have too many keyboards, all sound different!',
  },
  pterodactyl: {
    title: 'Flying pterodactyl',
    fact: 'Pterodactyl is not a dinosaur!!!',
  },
}

function IslandWorld({ reduceMotion, onSelectFact }) {
  const world = useRef()

  const interactiveProps = (id) => ({
    onClick: (event) => {
      event.stopPropagation()
      onSelectFact(id)
    },
    onPointerEnter: () => {
      if (typeof document !== 'undefined') document.body.style.cursor = 'pointer'
    },
    onPointerLeave: () => {
      if (typeof document !== 'undefined') document.body.style.cursor = 'auto'
    },
  })

  useFrame((state, delta) => {
    if (!world.current || reduceMotion) return
    world.current.position.y = Math.sin(state.clock.elapsedTime * 0.7) * 0.045
    world.current.rotation.y += delta * 0.035
  })

  return (
    <Float speed={reduceMotion ? 0 : 1.15} rotationIntensity={reduceMotion ? 0 : 0.06} floatIntensity={reduceMotion ? 0 : 0.15}>
      <group ref={world} rotation={[0, -0.38, 0]} position={[0, -0.25, 0]}>
        <Planet {...interactiveProps('island')} />
        <Laptop {...interactiveProps('laptop')} position={[-0.95, 0.34, -0.65]} rotation={[0, 0.45, 0]} scale={1.08} reduceMotion={reduceMotion} />
        <Car {...interactiveProps('car')} position={[1.15, 0.33, -0.08]} rotation={[0, 0.6, 0]} scale={0.72} />
        <Cat {...interactiveProps('cat')} position={[-0.05, 0.31, 1.02]} rotation={[0, 0.45, 0]} scale={0.95} />
        <DinosaurPond {...interactiveProps('dinosaur')} position={[-1.13, 0.25, 0.95]} scale={0.82} reduceMotion={reduceMotion} />
        <Keyboard
          position={[1.12, 0.32, -1.22]}
          rotation={[0, 0.55, 0]}
          scale={0.86}
          onFactClick={() => onSelectFact('keyboard')}
        />
        <Pterodactyl {...interactiveProps('pterodactyl')} reduceMotion={reduceMotion} />
      </group>
    </Float>
  )
}

export default function PlanetScene() {
  const reduceMotion = useReducedMotion()
  const [selectedFact, setSelectedFact] = useState(null)
  const activeFact = selectedFact ? funFacts[selectedFact] : null

  return (
    <div
      className="island-scene"
      role="group"
      aria-label="Interactive floating island. Click an object to discover a fun fact."
    >
      <Canvas
        aria-hidden="true"
        onPointerMissed={() => setSelectedFact(null)}
        dpr={[1, 1.75]}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        shadows
      >
        <OrthographicCamera makeDefault position={[7.2, 6.2, 8.4]} zoom={76} near={0.1} far={100} />
        <ambientLight intensity={1.8} />
        <hemisphereLight args={['#dff4ff', '#c3875f', 1.4]} />
        <directionalLight
          castShadow
          position={[6, 10, 7]}
          intensity={2.6}
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
          shadow-camera-far={24}
          shadow-camera-left={-6}
          shadow-camera-right={6}
          shadow-camera-top={6}
          shadow-camera-bottom={-6}
        />
        <Suspense fallback={null}>
          <IslandWorld reduceMotion={reduceMotion} onSelectFact={setSelectedFact} />
          <Sparkles count={reduceMotion ? 0 : 28} scale={[7, 4, 6]} size={2.4} speed={0.22} color="#e79b70" opacity={0.45} />
          <ContactShadows position={[0, -2.18, 0]} opacity={0.22} scale={9} blur={2.7} far={5} color="#3c503e" />
        </Suspense>
        <OrbitControls
          makeDefault
          enablePan={false}
          enableZoom={false}
          autoRotate={!reduceMotion}
          autoRotateSpeed={0.35}
          minPolarAngle={Math.PI / 3.4}
          maxPolarAngle={Math.PI / 2.5}
          minAzimuthAngle={-Math.PI / 4}
          maxAzimuthAngle={Math.PI / 4}
        />
      </Canvas>
      <p className="island-interaction-hint">Click for fun facts...</p>
      {activeFact && (
        <div className="island-fact" role="dialog" aria-label={`${activeFact.title} fun fact`}>
          <button
            className="island-fact__close"
            type="button"
            aria-label="Close fun fact"
            onClick={() => setSelectedFact(null)}
          >
            ×
          </button>
          <p className="island-fact__label">Fun fact</p>
          <h3>{activeFact.title}</h3>
          <p>{activeFact.fact}</p>
        </div>
      )}
    </div>
  )
}
