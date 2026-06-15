'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function SettingsPage() {
  const params = useSearchParams()
  const [plan, setPlan] = useState<string>('free')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const success = params.get('success') === '1'

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return
      setEmail(user.email ?? '')
      supabase.from('subscriptions').select('plan').eq('user_id', user.id).single()
        .then(({ data }) => setPlan(data?.plan ?? 'free'))
    })
  }, [])

  async function handleUpgrade() {
    setLoading(true)
    const res = await fetch('/api/stripe/checkout', { method: 'POST' })
    const { url } = await res.json()
    if (url) window.location.href = url
    else setLoading(false)
  }

  async function handleSignOut() {
    await createClient().auth.signOut()
    window.location.href = '/login'
  }

  return (
    <div className="max-w-lg">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">設定</h1>

      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl text-sm text-green-800">
          ✅ Proプランへのアップグレードが完了しました！
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-4">
        <h2 className="text-sm font-semibold text-gray-700 mb-4">アカウント</h2>
        <p className="text-sm text-gray-600">{email}</p>
        <button onClick={handleSignOut} className="mt-4 text-sm text-gray-400 hover:text-red-500">
          ログアウト
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-sm font-semibold text-gray-700 mb-4">プラン</h2>
        {plan === 'pro' ? (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm font-bold text-indigo-700">Pro プラン</span>
              <span className="text-xs bg-indigo-600 text-white px-2 py-0.5 rounded-full">有効</span>
            </div>
            <p className="text-sm text-gray-500">¥500/月 — ワークフロー無制限</p>
          </div>
        ) : (
          <div>
            <div className="mb-4">
              <p className="text-sm font-medium text-gray-900 mb-1">無料プラン</p>
              <p className="text-sm text-gray-500">ワークフロー 3件まで</p>
            </div>
            <div className="bg-indigo-50 rounded-xl p-4 mb-4">
              <p className="text-sm font-bold text-indigo-900 mb-1">Pro プラン — ¥500/月</p>
              <ul className="text-sm text-indigo-800 space-y-1">
                <li>✓ ワークフロー無制限</li>
                <li>✓ 実行履歴の無制限保存</li>
              </ul>
            </div>
            <button onClick={handleUpgrade} disabled={loading}
              className="w-full py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 disabled:opacity-50">
              {loading ? '処理中...' : 'Proにアップグレード（¥500/月）'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
