import type { Step } from '@/types/workflow'

export function applyTextStep(input: string, step: Step): string {
  const { config } = step
  switch (step.type) {
    case 'text_trim':
      return input.trim()
    case 'text_replace':
      return input.replaceAll(String(config.from ?? ''), String(config.to ?? ''))
    case 'text_uppercase':
      return input.toUpperCase()
    case 'text_lowercase':
      return input.toLowerCase()
    case 'text_zenkaku_to_hankaku':
      return input
        .replace(/[Ａ-Ｚａ-ｚ０-９]/g, s => String.fromCharCode(s.charCodeAt(0) - 0xFEE0))
        .replace(/　/g, ' ')
    case 'text_number_comma':
      return input.replace(/\d+(\.\d+)?/g, s => Number(s).toLocaleString('ja-JP'))
    default:
      return input
  }
}
