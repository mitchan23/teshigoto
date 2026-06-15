import type { Workflow } from '@/types/workflow'

const KEY      = 'teshigoto_wfs'
const EXEC_KEY = 'teshigoto_exec_history'

type LocalStore = Record<string, Workflow>

export interface ExecRecord {
  id:             string
  workflow_id:    string
  workflow_name:  string
  input_snippet:  string
  output_snippet: string
  executed_at:    string
}

function load(): LocalStore {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? (JSON.parse(raw) as LocalStore) : {}
  } catch {
    return {}
  }
}

function save(store: LocalStore) {
  localStorage.setItem(KEY, JSON.stringify(store))
}

export function getLocalWorkflows(): Workflow[] {
  if (typeof window === 'undefined') return []
  return Object.values(load()).sort((a, b) => b.updated_at.localeCompare(a.updated_at))
}

export function getLocalWorkflow(id: string): Workflow | null {
  if (typeof window === 'undefined') return null
  return load()[id] ?? null
}

export function saveLocalWorkflow(wf: Omit<Workflow, 'user_id'>): void {
  if (typeof window === 'undefined') return
  const store = load()
  store[wf.id] = { ...wf, user_id: 'local' }
  save(store)
}

export function updateLocalWorkflow(wf: Omit<Workflow, 'user_id'>): void {
  if (typeof window === 'undefined') return
  const store = load()
  if (!store[wf.id]) return
  store[wf.id] = { ...store[wf.id], ...wf, updated_at: new Date().toISOString() }
  save(store)
}

export function deleteLocalWorkflow(id: string): void {
  if (typeof window === 'undefined') return
  const store = load()
  delete store[id]
  save(store)
}

export function countLocalWorkflows(): number {
  if (typeof window === 'undefined') return 0
  return Object.keys(load()).length
}

export function getLocalExecHistory(): ExecRecord[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(EXEC_KEY)
    return raw ? (JSON.parse(raw) as ExecRecord[]) : []
  } catch {
    return []
  }
}

export function logLocalExec(wfId: string, wfName: string, input: string, output: string): void {
  if (typeof window === 'undefined') return
  const history = getLocalExecHistory()
  const record: ExecRecord = {
    id:             Math.random().toString(36).slice(2),
    workflow_id:    wfId,
    workflow_name:  wfName,
    input_snippet:  input.slice(0, 120),
    output_snippet: output.slice(0, 120),
    executed_at:    new Date().toISOString(),
  }
  localStorage.setItem(EXEC_KEY, JSON.stringify([record, ...history].slice(0, 200)))
}

export function getLocalExecCount(wfId: string): number {
  return getLocalExecHistory().filter(r => r.workflow_id === wfId).length
}
