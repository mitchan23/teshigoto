'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getLocalExecHistory, type ExecRecord } from '@/lib/local-storage'

function formatDate(iso: string) {
  const d = new Date(iso)
  return d.toLocaleDateString('ja-JP', { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}

export default function HistoryPage() {
  const [records, setRecords] = useState<ExecRecord[]>([])
  const [filter, setFilter]   = useState<string>('all')

  useEffect(() => {
    setRecords(getLocalExecHistory())
  }, [])

  const wfNames = Array.from(new Set(records.map(r => r.workflow_name)))

  const filtered = filter === 'all'
    ? records
    : records.filter(r => r.workflow_name === filter)

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">実行履歴</h1>
          <p className="text-sm text-gray-500 mt-1">このブラウザでの実行ログ（最大200件）</p>
        </div>
        <Link href="/dashboard" className="text-sm text-gray-500 hover:text-gray-900">← 一覧に戻る</Link>
      </div>

      {wfNames.length > 1 && (
        <div className="flex gap-2 mb-5 flex-wrap">
          <button
            onClick={() => setFilter('all')}
            className={`text-xs px-3 py-1.5 rounded-full font-medium transition-colors ${
              filter === 'all' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}>
            すべて
          </button>
          {wfNames.map(name => (
            <button
              key={name}
              onClick={() => setFilter(name)}
              className={`text-xs px-3 py-1.5 rounded-full font-medium transition-colors ${
                filter === name ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}>
              {name}
            </button>
          ))}
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-200">
          <div className="text-4xl mb-3">📋</div>
          <p className="text-gray-500 text-sm">まだ実行履歴がありません</p>
          <Link href="/dashboard" className="mt-4 inline-block text-sm text-indigo-600 hover:underline">
            手仕事を実行する →
          </Link>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map(r => (
            <div key={r.id} className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex items-start justify-between gap-3 mb-3">
                <span className="text-sm font-semibold text-indigo-700">{r.workflow_name}</span>
                <span className="text-xs text-gray-400 flex-shrink-0">{formatDate(r.executed_at)}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-gray-400 mb-1">入力</p>
                  <p className="text-xs font-mono text-gray-600 bg-gray-50 rounded px-2 py-1.5 line-clamp-2">
                    {r.input_snippet || '—'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-1">出力</p>
                  <p className="text-xs font-mono text-gray-600 bg-green-50 rounded px-2 py-1.5 line-clamp-2">
                    {r.output_snippet || '—'}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
