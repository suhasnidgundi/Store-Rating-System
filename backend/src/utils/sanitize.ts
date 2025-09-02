export function sanitizeString(input: unknown) {
  if (typeof input !== 'string') return input
  // Minimal neutralization of common XSS vectors
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .trim()
}
