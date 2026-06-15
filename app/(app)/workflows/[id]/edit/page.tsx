'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { getLocalWorkflow, updateLocalWorkflow } from '@/lib/local-storage'
import { STEP_META, type Step, type StepType, type Workflow } from '@/types/workflow'

const CATEGORY_LABELS = { text: 'テキスト変換', csv: 'CSV加工', date: '日付計算' }
const CATEGORY_COLORS = {
  text: 'bg-blue-50 text-blue-700 border-blue-200',
  csv:  'bg-green-50 text-green-700 border-green-200',
  date: 'bg-purple-50 text-purple-700 border-purple-200',
}

function newStep(type: StepType): Step {
  return { id: crypto.randomUUID(), type, label: STEP_META[type].label, config: {} }
}

export default function EditWorkflowPage() {
  const router = useRouter()
  const { id } = useParams<{ id: string }>()
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [steps, setSteps] = useState<Step[]>([])
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      let wf: Workflow | null = null
      if (user) {
        const { data } = await supabase.from('workflows').select('*').eq('id', id).single()
        wf = data as Workflow
      } else {
        wf = getLocalWorkflow(id)
      }
      if (wf) {
        setName(wf.name)
        setDescription(wf.description ?? '')
        setSteps(wf.steps)
      }
      setLoading(false)
    }
    load()
  }, [id])

  function addStep(type: StepType) { setSteps(s => [...s, newStep(type)]) }
  function removeStep(sid: string) { setSteps(s => s.filter(x => x.id !== sid)) }
  function updateConfig(sid: string, key: string, value: string) {
    setSteps(s => s.map(x => x.id === sid ? { ...x, config: { ...x.config, [key]: value } } : x))
  }

  async function handleSave() {
    if (!name.trim()) { setError('手仕事の名前を入力してください'); return }
    if (steps.length === 0) { setError('工程を1つ以上追加してください'); return }
    setSaving(true)

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (user) {
      const { error: err } = await supabase.from('workflows').update({
        name: name.trim(), description: description.trim() || null, steps, updated_at: new Date().toISOString(),
      }).eq('id', id)
      if (err) { setError(err.message); setSaving(false); return }
    } else {
      updateLocalWorkflow({ id, name: name.trim(), description: description.trim() || null, steps, created_at: '', updated_at: '' })
    }
    router.push(`/workflows/${id}`)
  }

  if (loading) return <div className="text-sm text-gray-400 py-20 text-center">読み込み中...</div>

  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => router.back()} className="text-sm text-gray-500 hover:text-gray-900">← 戻る</button>
        <h1 className="text-2xl font-bold text-gray-900">手仕事を編集する</h1>
      </div>

      <div className="space-y-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">手仕事の名前 *</label>
            <input value={name} onChange={e => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">説明（任意）</label>
            <input value={description} onChange={e => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
        </div>

        {steps.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-sm font-semibold text-gray-700">登録した工程（上から順に実行）</h2>
            {steps.map((step, i) => {
              const meta = STEP_META[step.type]
              const colorClass = CATEGORY_COLORS[meta.category]
              return (
                <div key={step.id} className="bg-white rounded-xl border border-gray-200 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold text-gray-400 w-5">{i + 1}</span>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded border ${colorClass}`}>
                        {CATEGORY_LABELS[meta.category]}
                      </span>
                      <span className="text-sm font-medium text-gray-900">{meta.label}</span>
                    </div>
                    <button onClick={() => removeStep(step.id)} className="text-xs text-gray-400 hover:text-red-500">削除</button>
                  </div>
                  <p className="text-xs text-gray-400 ml-8 mb-3">{meta.example}</p>
                  {meta.fields.map(f => (
                    <div key={f.key} className="ml-8 mb-2">
                      <label className="block text-xs text-gray-600 mb-1 font-medium">{f.label}</label>
                      {f.type === 'select' ? (
                        <select value={step.config[f.key] as string ?? ''} onChange={e => updateConfig(step.id, f.key, e.target.value)}
                          className="px-2 py-1.5 border border-gray-300 rounded text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white">
                          <option value="">選択してください</option>
                          {f.options?.map(o => <option key={o} value={o}>{o}</option>)}
                        </select>
                      ) : (
                        <input type={f.type} value={step.config[f.key] as string ?? ''}
                          onChange={e => updateConfig(step.id, f.key, e.target.value)}
                          placeholder={f.placeholder}
                          className="px-2 py-1.5 border border-gray-300 rounded text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-indigo-500 w-64" />
                      )}
                    </div>
                  ))}
                </div>
              )
            })}
          </div>
        )}

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-sm font-semibold text-gray-700 mb-1">工程を追加</h2>
          <p className="text-xs text-gray-400 mb-4">やりたい処理を選んでください。複数組み合わせられます。</p>
          {(['text', 'csv', 'date'] as const).map(cat => (
            <div key={cat} className="mb-5">
              <p className="text-xs font-semibold text-gray-500 mb-2">{CATEGORY_LABELS[cat]}</p>
              <div className="flex flex-wrap gap-2">
                {(Object.entries(STEP_META) as [StepType, typeof STEP_META[StepType]][])
                  .filter(([, m]) => m.category === cat)
                  .map(([type, m]) => (
                    <button key={type} onClick={() => addStep(type)}
                      title={m.example}
                      className={`text-xs px-3 py-1.5 rounded-lg border font-medium hover:opacity-80 transition-opacity ${CATEGORY_COLORS[cat]}`}>
                      + {m.label}
                    </button>
                  ))}
              </div>
            </div>
          ))}
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <div className="flex gap-3">
          <button onClick={handleSave} disabled={saving}
            className="px-6 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50">
            {saving ? '保存中...' : '変更を保存する'}
          </button>
          <button onClick={() => router.back()} className="px-6 py-2.5 text-sm text-gray-600 hover:text-gray-900">
            キャンセル
          </button>
        </div>
      </div>
    </div>
  )
}
