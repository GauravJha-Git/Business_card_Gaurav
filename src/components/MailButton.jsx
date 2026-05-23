import { useRef } from 'react'

export default function MailButton() {
  const btnRef     = useRef(null)
  const shimmerRef = useRef(null)

  const onEnter = () => {
    const gsap = window.gsap
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
    window.gsap.to(btnRef.current, {
      backgroundColor: 'transparent',
      color: '#8B5CF6',
      borderColor: '#8B5CF6',
      duration: 0.25,
    })
  }

  const onClick = (e) => {
    // Stop the click from bubbling up to the card flip handler
    e.stopPropagation()

    const gsap = window.gsap
    gsap.timeline()
      .to(btnRef.current, { scale: 0.96, duration: 0.09 })
      .to(btnRef.current, { scale: 1, duration: 0.25, ease: 'elastic.out(1.5,0.5)' })

    // Use a hidden anchor — most reliable cross-browser mailto trigger
    const a = document.createElement('a')
    a.href = 'mailto:gauravjha092006@gmail.com'
    a.style.display = 'none'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  return (
    // stopPropagation on wrapper too so no event leaks to card
    <div className="mail-btn-wrap" onClick={e => e.stopPropagation()}>
      <button
        ref={btnRef}
        className="mail-btn"
        onMouseEnter={onEnter}
        onMouseLeave={onLeave}
        onClick={onClick}
        aria-label="Drop a Mail — gauravjha092006@gmail.com"
        type="button"
      >
        <span className="mail-btn-shimmer" ref={shimmerRef} />
        DROP A MAIL
      </button>
    </div>
  )
}
