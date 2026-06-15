'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { getLocalWorkflow, logLocalExec } from '@/lib/local-storage'
import { runWorkflow } from '@/lib/engine/runner'
import { STEP_META, type Workflow } from '@/types/workflow'

const CATEGORY_COLORS = {
  text: 'bg-blue-50 text-blue-700',
  csv:  'bg-green-50 text-green-700',
  date: 'bg-purple-50 text-purple-700',
}

export default function WorkflowRunPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [wf, setWf] = useState<Workflow | null>(null)
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [running, setRunning] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data } = await supabase.from('workflows').select('*').eq('id', id).single()
        if (data) { setWf(data); return }
      }
      const local = getLocalWorkflow(id)
      if (local) setWf(local)
    }
    load()
  }, [id])

  function handleRun() {
    if (!input.trim()) { setError('入力テキストを入力してください'); return }
    if (!wf) return
    setRunning(true); setError(''); setOutput('')
    try {
      const result = runWorkflow(wf.steps, input)
      setOutput(result)
      logLocalExec(wf.id, wf.name, input, result)
    } catch (e) {
      setError(e instanceof Error ? e.message : '実行エラー')
    }
    setRunning(false)
  }

  function handleDownload() {
    const blob = new Blob([output], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = `${wf?.name ?? 'output'}.txt`
    a.click(); URL.revokeObjectURL(url)
  }

  if (!wf) return <div className="text-sm text-gray-400 py-20 text-center">読み込み中...</div>

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <Link href="/dashboard" className="text-sm text-gray-500 hover:text-gray-900">← 一覧</Link>
        <div>
          <h1 className="text-xl font-bold text-gray-900">{wf.name}</h1>
          {wf.description && <p className="text-sm text-gray-500">{wf.description}</p>}
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {wf.steps.map((step, i) => {
          const meta = STEP_META[step.type]
          return (
            <div key={step.id} className="flex items-center gap-1">
              {i > 0 && <span className="text-gray-300 text-sm">→</span>}
              <span className={`text-xs px-2 py-1 rounded-full font-medium ${CATEGORY_COLORS[meta.category]}`}>
                {meta.label}
              </span>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-gray-700">入力テキスト / CSV</label>
            <label className="text-xs text-indigo-600 cursor-pointer hover:underline">
              ファイルを読み込む
              <input type="file" accept=".txt,.csv" className="hidden" onChange={e => {
                const file = e.target.files?.[0]
                if (file) file.text().then(t => setInput(t))
              }} />
            </label>
          </div>
          <textarea value={input} onChange={e => setInput(e.target.value)}
            placeholder="テキストまたはCSVを貼り付けるか、ファイルを読み込んでください"
            className="w-full h-64 px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none bg-white" />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-gray-700">出力結果</label>
            {output && (
              <button onClick={handleDownload} className="text-xs text-indigo-600 hover:underline">
                ダウンロード
              </button>
            )}
          </div>
          <textarea readOnly value={output}
            placeholder="実行ボタンを押すと結果が表示されます"
            className="w-full h-64 px-3 py-2 border border-gray-200 bg-gray-50 rounded-lg text-sm text-gray-700 font-mono resize-none" />
        </div>
      </div>

      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

      <div className="mt-4 flex gap-3">
        <button onClick={handleRun} disabled={running}
          className="px-8 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 disabled:opacity-50 text-sm transition-colors">
          {running ? '実行中...' : '▶ 実行する'}
        </button>
        {output && (
          <button onClick={() => { setInput(output); setOutput('') }}
            className="px-4 py-3 text-sm text-gray-600 hover:text-gray-900 border border-gray-300 rounded-xl bg-white">
            出力を入力に使う
          </button>
        )}
      </div>
    </div>
  )
}
