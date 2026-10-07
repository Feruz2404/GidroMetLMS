'use client'

import { useEffect, useState } from 'react'
import QRCode from 'qrcode'
import { routes } from '@/lib/routes'
import { cn } from '@/lib/utils'

/** Absolute public verification URL for a certificate code (client only). */
export function verificationUrl(hash: string): string {
  return `${window.location.origin}${routes.verify(hash)}`
}

/** QR code rendered locally (no third-party service) pointing at the public verification page. */
export function CertificateQr({ hash, color, alt, className }: { hash: string; color: string; alt: string; className?: string }) {
  const [src, setSrc] = useState<string | null>(null)

  useEffect(() => {
    let active = true
    QRCode.toString(verificationUrl(hash), { type: 'svg', margin: 0, errorCorrectionLevel: 'M', color: { dark: color, light: '#ffffff' } })
      .then((svg) => active && setSrc(`data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`))
      .catch(() => active && setSrc(null))
    return () => {
      active = false
    }
  }, [hash, color])

  return (
    <div className={cn('aspect-square bg-white', className)}>
      {/* eslint-disable-next-line @next/next/no-img-element -- a local data: URI; the image optimizer does not apply */}
      {src && <img src={src} alt={alt} className="size-full" />}
    </div>
  )
}
