const CODE_PATTERN = /(?<![a-f0-9])[a-f0-9]{40}(?![a-f0-9])/i

/** Accepts a bare 40-character code or any link that contains one (QR links, legacy ?hash= links). */
export function extractVerificationCode(input: string): string | null {
  return input.trim().match(CODE_PATTERN)?.[0].toLowerCase() ?? null
}
