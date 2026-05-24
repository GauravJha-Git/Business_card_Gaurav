import { useRef } from 'react'
import { openMailWithFallback } from '../utils/openMail'

export default function MailButton() {
  const btnRef     = useRef(null)
  const shimmerRef = useRef(null)

  const onEnter = () => {
    const gsap = window.gsap
    if (!gsap) return
    gsap.to(btnRef.current, {
      backgroundColor: '#7C3AED',
      color: '#fff',
      borderColor: '#7C3AED',
      duration: 0.25,
    })
    gsap.fromTo(shimmerRef.current,
      { x: '-110%', opacity: 1 },
      { x: '210%',  duration: 0.55, ease: 'power2.out' }
    )
  }

  const onLeave = () => {
    const gsap = window.gsap
    if (!gsap) return
    gsap.to(btnRef.current, {
      backgroundColor: 'transparent',
      color: '#8B5CF6',
      borderColor: '#8B5CF6',
      duration: 0.25,
    })
  }

  const onClick = (e) => {
    // Run GSAP scale animation
    const gsap = window.gsap
    if (gsap) {
      gsap.timeline()
        .to(btnRef.current, { scale: 0.96, duration: 0.09 })
        .to(btnRef.current, { scale: 1, duration: 0.25, ease: 'elastic.out(1.5,0.5)' })
    }
    // Try native mail app → fallback Gmail web
    openMailWithFallback(e)
  }

  return (
    <div className="mail-btn-wrap">
      <a
        ref={btnRef}
        href="mailto:gauravjha092006@gmail.com"
        className="mail-btn"
        onMouseEnter={onEnter}
        onMouseLeave={onLeave}
        onClick={onClick}
        aria-label="Drop a Mail"
      >
        <span className="mail-btn-shimmer" ref={shimmerRef} />
        DROP A MAIL
      </a>
    </div>
  )
}
