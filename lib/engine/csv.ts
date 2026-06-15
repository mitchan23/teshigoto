import type { Step } from '@/types/workflow'

function parseCSV(text: string): string[][] {
  return text.trim().split('\n').map(line =>
    line.split(',').map(cell => cell.trim().replace(/^"|"$/g, ''))
  )
}

function toCSV(rows: string[][]): string {
  return rows.map(row => row.map(c => c.includes(',') ? `"${c}"` : c).join(',')).join('\n')
}

export function applyCSVStep(input: string, step: Step): string {
  const rows = parseCSV(input)
  if (rows.length < 2) return input
  const headers = rows[0]
  let data = rows.slice(1)

  switch (step.type) {
    case 'csv_extract_columns': {
      const cols = String(step.config.columns ?? '').split(',').map(c => c.trim()).filter(Boolean)
      const idxs = cols.map(c => headers.indexOf(c)).filter(i => i >= 0)
      const newHeaders = idxs.map(i => headers[i])
      const newData = data.map(row => idxs.map(i => row[i] ?? ''))
      return toCSV([newHeaders, ...newData])
    }
    case 'csv_filter_rows': {
      const col = String(step.config.column ?? '')
      const op  = String(step.config.operator ?? '含む')
      const val = String(step.config.value ?? '')
      const idx = headers.indexOf(col)
      if (idx < 0) return input
      data = data.filter(row => {
        const cell = row[idx] ?? ''
        if (op === '含む')       return cell.includes(val)
        if (op === '含まない')   return !cell.includes(val)
        if (op === '等しい')     return cell === val
        if (op === '等しくない') return cell !== val
        return true
      })
      return toCSV([headers, ...data])
    }
    case 'csv_remove_duplicates': {
      const col = String(step.config.column ?? '').trim()
      const idx = col ? headers.indexOf(col) : -1
      const seen = new Set<string>()
      data = data.filter(row => {
        const key = idx >= 0 ? (row[idx] ?? '') : row.join(',')
        if (seen.has(key)) return false
        seen.add(key)
        return true
      })
      return toCSV([headers, ...data])
    }
    case 'csv_sort': {
      const col   = String(step.config.column ?? '').trim()
      const order = String(step.config.order ?? '昇順（小→大・あ→ん）')
      const idx   = headers.indexOf(col)
      if (idx < 0) return input
      const desc  = order.startsWith('降順')
      data = [...data].sort((a, b) => {
        const av = a[idx] ?? '', bv = b[idx] ?? ''
        const an = Number(av), bn = Number(bv)
        const cmp = (!isNaN(an) && !isNaN(bn)) ? an - bn : av.localeCompare(bv, 'ja')
        return desc ? -cmp : cmp
      })
      return toCSV([headers, ...data])
    }
    default:
      return input
  }
}
