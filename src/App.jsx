import { lazy, Suspense, useRef } from 'react'
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion'
import './App.css'

const PlanetScene = lazy(() => import('./components/PlanetScene'))

const journey = [
  {
    time: '2019',
    title: 'I started with people, not pixels.',
    copy: 'Psychology gave me a reason to keep asking why people think, choose, and behave the way they do.',
    note: 'Bachelor of Science in Psychology',
  },
  {
    time: '2023 - 2025',
    title: 'Then I became a teacher.',
    copy: 'Teaching showed me that the way something is explained can completely change how it feels to learn it.',
    note: 'Teaching, Curriculum Development',
  },
  {
    time: '2026',
    title: 'I started building the tools I wanted to use.',
    copy: 'As an IT student, I began turning everyday frustrations into small, practical web projects.',
    note: 'Web development, everyday pain points',
  },
  {
    time: 'Now',
    title: 'Still curious. Now with code.',
    copy: 'I like useful software, playful details, and websites that feel like a real person made them.',
    note: 'Three.js, creative development',
  },
]

const projects = [
  {
    title: 'Hotspot Monitor',
    type: 'Search intelligence web app',
    description: 'I built this to keep an eye on a topic without repeating the same search every day. Add a keyword and it gathers new results into one feed.',
    image: '/hotspot-monitor.png',
    link: 'https://github.com/1QvQ/hotspot-monitor',
    className: 'project-feature project-feature--wide',
  },
  {
    title: 'ECE101',
    type: 'Early childhood education platform',
    description: 'A resource finder for early childhood teachers, inspired by the very real problem of needing a good activity idea five minutes ago.',
    image: '/ECE101.png',
    link: 'https://github.com/1QvQ/ECE101',
    className: 'project-feature project-feature--portrait',
  },
  {
    title: 'Keytone',
    type: 'Mechanical keyboard sound library',
    description: 'A home for keyboard builds and typing sounds, because saying “this one is a little more thocky” is not a useful filing system.',
    image: '/keytone.png',
    link: 'https://github.com/1QvQ/KeyTone',
    className: 'project-feature project-feature--showcase',
  },
]

function Reveal({ children, className = '', delay = 0 }) {
  const reduceMotion = useReducedMotion()

  return (
    <motion.div
      className={className}
      initial={reduceMotion ? false : { opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.24 }}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  )
}

function JourneyTimeline() {
  const timelineRef = useRef(null)
  const reduceMotion = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ['start 72%', 'end 58%'],
  })
  const lineScale = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 24,
    restDelta: 0.001,
  })

  return (
    <div ref={timelineRef} className="journey-timeline">
      <div className="timeline-rail" aria-hidden="true">
        <motion.span
          className="timeline-rail__fill"
          style={{ scaleY: reduceMotion ? 1 : lineScale }}
        />
      </div>

      {journey.map((item, index) => (
        <motion.article
          className={`milestone milestone--${index % 2 === 0 ? 'left' : 'right'}`}
          key={item.time}
          initial={reduceMotion ? false : { opacity: 0, y: 36 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.72, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="milestone__marker" aria-hidden="true">
            <span />
          </div>
          <div className="milestone__content">
            <p className="milestone__time">{item.time}</p>
            <h3>{item.title}</h3>
            <p className="milestone__copy">{item.copy}</p>
            <p className="milestone__note">{item.note}</p>
          </div>
        </motion.article>
      ))}
    </div>
  )
}

function App() {
  const reduceMotion = useReducedMotion()
  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, {
    stiffness: 110,
    damping: 28,
    restDelta: 0.001,
  })
  const islandY = useTransform(scrollYProgress, [0, 0.18], [0, -16])

  return (
    <div className="site-shell">
      <motion.div className="page-progress" style={{ scaleX: progress }} />

      <header className="site-header">
        <a className="wordmark" href="#top" aria-label="Kristen Dai home">
          Kristen Dai<span>.</span>
        </a>
        <nav aria-label="Primary navigation">
          <div className="nav__links">
            <a href="#journey">Journey</a>
            <a href="#work">Work</a>
          </div>
          <div className="nav__actions">
            <a className="nav-cta" href="https://github.com/1QvQ" target="_blank" rel="noreferrer">
              GitHub <span aria-hidden="true">↗</span>
            </a>
            <a
              className="nav-cta"
              href="https://www.linkedin.com/in/kristen-dai-83909a188/"
              target="_blank"
              rel="noreferrer"
            >
              LinkedIn <span aria-hidden="true">↗</span>
            </a>
            <a
              className="nav-cta"
              href="https://drive.google.com/file/d/1tU0_3hKkitbG41zFVxEoz_JnH9sppaMa/view?usp=sharing"
              target="_blank"
              rel="noreferrer"
            >
              CV <span aria-hidden="true">↗</span>
            </a>
          </div>
        </nav>
      </header>

      <main>
        <section className="hero" id="top">
          <motion.div
            className="hero__copy"
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="eyebrow">Hi, I’m Kristen.</p>
            <h1>I make things I wish existed.</h1>
            <p className="hero__intro">I studied psychology, became a teacher, and somehow ended up building websites. Honestly, it makes more sense than it sounds.</p>
            <a className="text-link" href="#work">
              See what I’ve been making <span aria-hidden="true">↓</span>
            </a>
          </motion.div>

          <motion.div className="hero__scene" style={{ y: islandY }}>
            <motion.div
              className="island-callout"
              initial={reduceMotion ? false : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="island-callout__text">Things I like...</span>
              <svg
                className="island-callout__arrow"
                viewBox="0 0 68 54"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  d="M54 4C42 12 28 20 14 38"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                />
                <path
                  d="M11 26L13 40L25 36"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </motion.div>

            <Suspense fallback={<div className="island-loading" aria-label="Loading 3D island" />}>
              <PlanetScene />
            </Suspense>
          </motion.div>

          <div className="hero__aside" aria-label="Portfolio focus">
            <p>Psychology</p>
            <p>Teaching</p>
            <p>Now: code</p>
          </div>
        </section>

        <section className="journey section-wrap" id="journey">
          <Reveal className="section-heading">
            <h2>How I got here.</h2>
            <p>Not a straight line, but definitely an interesting one.</p>
          </Reveal>
          <JourneyTimeline />
        </section>

        <section className="work section-wrap" id="work">
          <Reveal className="work__heading">
            <h2>A few things I’ve made</h2>
            <p>Mostly inspired by problems I ran into, plus one very specific keyboard obsession.</p>
          </Reveal>

          <div className="project-layout">
            {projects.map((project, index) => (
              <Reveal className={project.className} delay={index * 0.08} key={project.title}>
                <a
                  className="project-feature__link"
                  href={project.link}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`View ${project.title} on GitHub (opens in new tab)`}
                >
                  <div className="project-feature__visual">
                    <img src={project.image} alt={`${project.title} interface preview`} loading="lazy" />
                  </div>
                  <div className="project-feature__body">
                    <div className="project-feature__meta">
                      <p>{project.type}</p>
                      <span className="project-feature__badge">
                        GitHub <span aria-hidden="true">↗</span>
                      </span>
                    </div>
                    <h3>
                      {project.title}
                      <span className="project-feature__arrow" aria-hidden="true">
                        ↗
                      </span>
                    </h3>
                    <span>{project.description}</span>
                  </div>
                </a>
              </Reveal>
            ))}
          </div>
        </section>

        <section className="closing section-wrap" id="contact">
          <Reveal className="closing__inner">
            <p className="closing__small">Say hello</p>
            <h2>Got an idea? I’d like to hear it.</h2>
            <div className="closing__actions">
              <a className="primary-button" href="https://github.com/1QvQ" target="_blank" rel="noreferrer">
                GitHub <span aria-hidden="true">↗</span>
              </a>
              <a
                className="primary-button"
                href="https://www.linkedin.com/in/kristen-dai-83909a188/"
                target="_blank"
                rel="noreferrer"
              >
                LinkedIn <span aria-hidden="true">↗</span>
              </a>
              <a
                className="primary-button"
                href="https://drive.google.com/file/d/1tU0_3hKkitbG41zFVxEoz_JnH9sppaMa/view?usp=sharing"
                target="_blank"
                rel="noreferrer"
              >
                View CV <span aria-hidden="true">↗</span>
              </a>
            </div>
          </Reveal>
        </section>
      </main>

      <footer className="site-footer">
        <p>Built by Kristen, with too many keyboards nearby.</p>
        <p>© {new Date().getFullYear()}</p>
      </footer>
    </div>
  )
}

export default App
