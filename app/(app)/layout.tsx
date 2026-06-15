import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/server'

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let plan = 'free'
  if (user) {
    const { data: sub } = await supabase
      .from('subscriptions').select('plan').eq('user_id', user.id).single()
    plan = sub?.plan ?? 'free'
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/"><Image src="/logo.svg" alt="テシゴト" width={120} height={30} priority /></Link>
          <nav className="hidden sm:flex items-center gap-4">
            <Link href="/dashboard" className="text-sm text-gray-600 hover:text-gray-900 font-medium">手仕事一覧</Link>
            <Link href="/history"   className="text-sm text-gray-600 hover:text-gray-900 font-medium">実行履歴</Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          {user ? (
            <>
              {plan === 'free' && (
                <Link href="/settings" className="text-xs bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full font-medium hover:bg-indigo-100">
                  Proにアップグレード
                </Link>
              )}
              {plan === 'pro' && (
                <span className="text-xs bg-indigo-600 text-white px-3 py-1 rounded-full font-medium">Pro</span>
              )}
              <Link href="/settings" className="text-sm text-gray-600 hover:text-gray-900">{user.email}</Link>
            </>
          ) : (
            <>
              <Link href="/settings" className="text-xs bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full font-medium hover:bg-indigo-100">
                Proにアップグレード
              </Link>
              <Link href="/login" className="text-sm text-gray-600 hover:text-gray-900">ログイン</Link>
            </>
          )}
        </div>
      </header>
      <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-8">
        {children}
      </main>
    </div>
  )
}
