'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { getLocalWorkflows, getLocalExecCount } from '@/lib/local-storage'
import { FREE_WORKFLOW_LIMIT, type Workflow } from '@/types/workflow'

export default function DashboardPage() {
  const [workflows, setWorkflows] = useState<Workflow[]>([])
  const [plan, setPlan] = useState<'free' | 'pro'>('free')
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setIsLoggedIn(true)
        const [{ data: wfs }, { data: sub }] = await Promise.all([
          supabase.from('workflows').select('*').order('updated_at', { ascending: false }),
          supabase.from('subscriptions').select('plan').eq('user_id', user.id).single(),
        ])
        setWorkflows((wfs as Workflow[]) ?? [])
        setPlan((sub?.plan ?? 'free') as 'free' | 'pro')
      } else {
        setWorkflows(getLocalWorkflows())
      }
      setLoading(false)
    }
    load()
  }, [])

  if (loading) return <div className="text-sm text-gray-400 py-20 text-center">読み込み中...</div>

  const count = workflows.length
  const atLimit = plan === 'free' && count >= FREE_WORKFLOW_LIMIT

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">わたしの手仕事</h1>
          <p className="text-sm text-gray-500 mt-1">
            {isLoggedIn && plan === 'pro'
              ? `${count} 件`
              : `${count} / ${FREE_WORKFLOW_LIMIT} 件（無料プラン）`}
          </p>
        </div>
        {atLimit ? (
          <Link href="/settings"
            className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700">
            Proにアップグレードして追加
          </Link>
        ) : (
          <Link href="/workflows/new"
            className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700">
            + 手仕事を追加
          </Link>
        )}
      </div>

      {count === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="bg-indigo-50 px-8 py-6 text-center border-b border-indigo-100">
            <div className="text-4xl mb-3">✂️</div>
            <h2 className="text-lg font-semibold text-gray-900 mb-1">まず最初の手仕事を登録しましょう</h2>
            <p className="text-sm text-gray-500">3ステップで始められます。難しい設定は一切ありません。</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-gray-100">
            {[
              { n: '1', icon: '⚙️', title: '「手仕事を追加」をクリック', desc: '右上のボタンから、やりたいことを選びます。' },
              { n: '2', icon: '📋', title: 'データを貼り付ける',          desc: 'Excelやメモ帳からコピーしたテキストを貼るだけ。' },
              { n: '3', icon: '▶️', title: '「実行する」を押す',           desc: '一瞬で完了。結果をコピーかダウンロードできます。' },
            ].map(s => (
              <div key={s.n} className="flex flex-col items-center text-center px-6 py-8">
                <div className="w-10 h-10 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold text-sm mb-3">
                  {s.n}
                </div>
                <div className="text-2xl mb-2">{s.icon}</div>
                <h3 className="font-semibold text-gray-900 text-sm mb-1">{s.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
          <div className="px-8 py-5 text-center bg-gray-50 border-t border-gray-100">
            <Link href="/workflows/new"
              className="inline-block px-8 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 text-sm transition-colors">
              + 最初の手仕事を作る
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid gap-3">
          {workflows.map(wf => {
            const execCount = getLocalExecCount(wf.id)
            return (
              <Link key={wf.id} href={`/workflows/${wf.id}`}
                className="bg-white rounded-xl border border-gray-200 p-5 hover:border-indigo-300 hover:shadow-sm transition-all group">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <h3 className="font-semibold text-gray-900 group-hover:text-indigo-700">{wf.name}</h3>
                    {wf.description && <p className="text-sm text-gray-500 mt-1 truncate">{wf.description}</p>}
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    {execCount > 0 && (
                      <span className="text-xs text-gray-400">{execCount}回実行</span>
                    )}
                    <span className="text-xs text-gray-400">{wf.steps.length} 工程</span>
                    <span className="text-xs bg-indigo-50 text-indigo-700 px-2 py-1 rounded font-medium">実行 →</span>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      )}

      {atLimit && (
        <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-800">
          無料プランの上限（{FREE_WORKFLOW_LIMIT}件）に達しました。
          <Link href="/settings" className="underline ml-1">Proプラン（¥500/月）</Link>で無制限に追加できます。
        </div>
      )}

      {!isLoggedIn && count > 0 && (
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-xl text-sm text-blue-800">
          手仕事はこのブラウザにのみ保存されています。
          <Link href="/register" className="underline ml-1 font-medium">アカウント登録</Link>
          するとどこからでも使えます。
        </div>
      )}
    </div>
  )
}
