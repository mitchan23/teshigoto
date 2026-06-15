import type { Step } from '@/types/workflow'

function parseCSVRows(text: string): string[][] {
  return text.trim().split('\n').map(line =>
    line.split(',').map(c => c.trim().replace(/^"|"$/g, ''))
  )
}

function toCSV(rows: string[][]): string {
  return rows.map(row => row.map(c => c.includes(',') ? `"${c}"` : c).join(',')).join('\n')
}

function parseDate(s: string): Date | null {
  const d = new Date(s.replace(/\//g, '-'))
  return isNaN(d.getTime()) ? null : d
}

function formatDate(d: Date, fmt: string): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return fmt
    .replace('YYYY', String(y))
    .replace('MM', m)
    .replace('DD', day)
}

export function applyDateStep(input: string, step: Step): string {
  const rows = parseCSVRows(input)
  if (rows.length < 2) return input
  const headers = rows[0]
  const col = String(step.config.column ?? '')
  const idx = headers.indexOf(col)
  if (idx < 0) return input

  const data = rows.slice(1).map(row => {
    const d = parseDate(row[idx] ?? '')
    if (!d) return row
    const newRow = [...row]

    if (step.type === 'date_add') {
      const days = Number(step.config.days ?? 0)
      d.setDate(d.getDate() + days)
      newRow[idx] = formatDate(d, 'YYYY-MM-DD')
    } else if (step.type === 'date_format') {
      newRow[idx] = formatDate(d, String(step.config.format ?? 'YYYY/MM/DD'))
    }
    return newRow
  })

  return toCSV([headers, ...data])
}
