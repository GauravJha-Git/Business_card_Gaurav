/**
 * Try to open the native mail app via mailto:.
 * If no mail app is registered (browser stays focused after 600ms),
 * fall back to Gmail web compose in a new tab.
 */
export function openMailWithFallback(e) {
  if (e) e.preventDefault()

  const mailto   = 'mailto:gauravjha092006@gmail.com'
  const gmailUrl = 'https://mail.google.com/mail/?view=cm&fs=1&to=gauravjha092006@gmail.com'

  let handled = false
  const markHandled = () => { handled = true }

  // desktop: native app opening causes the browser window to blur
  window.addEventListener('blur', markHandled, { once: true })

  // mobile: native app opening sends the browser tab to background
  const onVisChange = () => {
    if (document.hidden) {
      handled = true
      document.removeEventListener('visibilitychange', onVisChange)
    }
  }
  document.addEventListener('visibilitychange', onVisChange)

  // Fire the mailto — doesn't navigate the page, just asks the OS
  window.location.href = mailto

  // After 600ms: if neither blur nor visibilitychange fired, no app handled it
  setTimeout(() => {
    window.removeEventListener('blur', markHandled)
    document.removeEventListener('visibilitychange', onVisChange)
    if (!handled) {
      window.open(gmailUrl, '_blank', 'noopener,noreferrer')
    }
  }, 600)
}
