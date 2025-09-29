export function gtmEvent(event, data) {
  if (typeof window !== 'undefined') {
    window.dataLayer = window.dataLayer || []
    window.dataLayer.push({ event, ...data })
  }
}
