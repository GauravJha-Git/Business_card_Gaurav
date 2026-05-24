import { useRef } from 'react'

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
    // Only run the animation — let the browser follow the <a href> natively.
    // Do NOT call stopPropagation or preventDefault here.
    const gsap = window.gsap
    if (!gsap) return
    gsap.timeline()
      .to(btnRef.current, { scale: 0.96, duration: 0.09 })
      .to(btnRef.current, { scale: 1, duration: 0.25, ease: 'elastic.out(1.5,0.5)' })
  }

  return (
    <div className="mail-btn-wrap">
      {/*
        Render as a real <a href="mailto:..."> so the browser handles
        it natively — no JS needed to open the mail client.
        GSAP animations fire on top of the native link behavior.
      */}
      <a
        ref={btnRef}
        href="https://mail.google.com/mail/?view=cm&fs=1&to=gauravjha092006@gmail.com"
        target="_blank"
        rel="noopener noreferrer"
        className="mail-btn"
        onMouseEnter={onEnter}
        onMouseLeave={onLeave}
        onClick={onClick}
        aria-label="Drop a Mail — opens Gmail compose"
      >
        <span className="mail-btn-shimmer" ref={shimmerRef} />
        DROP A MAIL
      </a>
    </div>
  )
}
