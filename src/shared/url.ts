/**
 * Accepts only URLs that are safe to render as links or embeds: same-origin
 * paths and https (http only for localhost). Rejects javascript:, data:,
 * protocol-relative and malformed values.
 */
export function safeResourceUrl(value: string | null | undefined): string | null {
  if (!value) return null
  const candidate = value.trim()
  if (candidate.startsWith('/') && !candidate.startsWith('//')) return candidate
  try {
    const url = new URL(candidate)
    if (url.protocol === 'https:') return url.toString()
    if (url.protocol === 'http:' && ['localhost', '127.0.0.1', '[::1]'].includes(url.hostname)) return url.toString()
  } catch {
    return null
  }
  return null
}

/** Extracts the video id from a YouTube watch/share/embed URL. */
export function youtubeVideoId(value: string | null | undefined): string | null {
  if (!value) return null
  try {
    const url = new URL(value)
    const host = url.hostname.replace(/^www\./, '')
    if (host === 'youtu.be') return url.pathname.slice(1, 12) || null
    if (host === 'youtube.com' || host === 'm.youtube.com' || host === 'youtube-nocookie.com') {
      if (url.pathname === '/watch') return url.searchParams.get('v')
      const match = url.pathname.match(/^\/(?:embed|shorts)\/([\w-]{11})/)
      return match?.[1] ?? null
    }
  } catch {
    return null
  }
  return null
}
