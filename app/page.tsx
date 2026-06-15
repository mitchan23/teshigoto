'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

const EXAMPLES = [
  {
    scene: '住所録の整理',
    pain: '同じ人が何件も登録されていて、手で消している',
    before: '山田 太郎\n佐藤 花子\n山田 太郎\n鈴木 一郎\n佐藤 花子',
    after: '山田 太郎\n佐藤 花子\n鈴木 一郎',
    work: '重複をまとめる',
    icon: '📋',
  },
  {
    scene: '売上データの整形',
    pain: '日付の書き方がバラバラで、システムに入力できない',
    before: '2024/1/5\n2024/12/31\n2024/3/8\n2024/10/1',
    after: '2024-01-05\n2024-12-31\n2024-03-08\n2024-10-01',
    work: '日付の形式を統一する',
    icon: '📊',
  },
  {
    scene: '取引先リストの整理',
    pain: 'コピペするたびに余分なスペースが入ってしまう',
    before: '  山田商事　　\n  佐藤工業  \n  鈴木物産　',
    after: '山田商事\n佐藤工業\n鈴木物産',
    work: '余分なスペースを消す',
    icon: '✂️',
  },
  {
    scene: '月次レポートの準備',
    pain: '必要な項目だけ抜き出す作業を毎月手でやっている',
    before: '名前,部署,電話,住所,メール\n山田,営業部,090-...,東京都,y@ex.com',
    after: '名前,メール\n山田,y@ex.com',
    work: '必要な列だけ残す',
    icon: '📑',
  },
]

const PERSONAS = [
  {
    icon: '👩‍💼',
    name: '経理担当・40代',
    result: '1時間 → 10分',
    quote: '毎月の請求データ整理が10分で終わるようになりました。',
    detail: '重複削除と日付統一がボタン1つで完了。月20時間以上の節約に。',
  },
  {
    icon: '🧑‍💻',
    name: '営業事務・30代',
    result: '登録なしで即使える',
    quote: '「難しそう」と思っていたけど、登録なしですぐ使えて驚きました。',
    detail: '顧客リストの整形に毎週使っています。コピペして押すだけ。',
  },
  {
    icon: '👨‍🏫',
    name: '学校事務・50代',
    result: '週4時間の節約',
    quote: 'パソコンが得意じゃない私でも使えました。',
    detail: '名簿の空白を消す作業がなくなり、本来の業務に集中できています。',
  },
]

const FAQS = [
  {
    q: 'アカウント登録しないといけないですか？',
    a: 'いいえ、登録なしでそのまま使えます。3つまで無料で保存できます。もっと保存したい場合のみProプラン（月500円）に登録してください。',
  },
  {
    q: 'インストールは必要ですか？',
    a: '不要です。ブラウザ（ChromeやEdge）で開くだけで使えます。スマホからも使えます。',
  },
  {
    q: '入力したデータはどこかに保存されますか？',
    a: 'テキストデータはサーバーに送られません。すべてあなたのブラウザの中だけで処理されます。',
  },
  {
    q: 'Excelのファイルはそのまま使えますか？',
    a: 'ExcelファイルはCSV形式で保存してからご利用ください。Excel→「名前をつけて保存」→「CSV（コンマ区切り）」で変換できます。',
  },
]

export default function LandingPage() {
  const [current, setCurrent] = useState(0)
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  useEffect(() => {
    const timer = setInterval(() => setCurrent(c => (c + 1) % EXAMPLES.length), 4000)
    return () => clearInterval(timer)
  }, [])

  const ex = EXAMPLES[current]

  return (
    <div className="min-h-screen bg-white text-gray-900">

      {/* ── ヘッダー ── */}
      <header className="border-b border-gray-100 px-6 py-4 flex items-center justify-between bg-white sticky top-0 z-10">
        <Image src="/logo.svg" alt="テシゴト" width={130} height={32} priority />
        <div className="flex items-center gap-3">
          <Link href="/login" className="text-sm text-gray-500 hover:text-gray-800 font-medium">ログイン</Link>
          <Link href="/dashboard"
            className="text-sm bg-indigo-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition-colors">
            無料で試す
          </Link>
        </div>
      </header>

      {/* ── ヒーロー ── */}
      <section className="px-6 py-20 bg-white text-center">
        <div className="max-w-2xl mx-auto">
          {/* 信頼シグナル */}
          <div className="flex justify-center gap-3 mb-8 flex-wrap">
            {['登録不要', 'インストール不要', '無料で使える'].map(t => (
              <span key={t} className="text-xs font-semibold bg-green-50 text-green-700 border border-green-200 px-3 py-1 rounded-full">
                ✓ {t}
              </span>
            ))}
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-5 leading-snug">
            毎月同じ作業、<br/>していませんか？
          </h1>
          <p className="text-xl text-gray-500 mb-4 leading-relaxed">
            住所録の重複削除、日付の書き直し、不要な列の削除…<br/>
            そんな繰り返し作業を、<span className="font-semibold text-gray-700">ボタン1つで終わらせます。</span>
          </p>
          <p className="text-sm text-gray-400 mb-10">
            難しい設定は不要です。選んで、貼り付けて、押すだけ。
          </p>

          <Link href="/dashboard"
            className="inline-block bg-indigo-600 text-white text-lg font-bold px-12 py-4 rounded-2xl hover:bg-indigo-700 shadow-lg hover:shadow-xl transition-all">
            今すぐ試してみる →
          </Link>
          <p className="text-sm text-gray-400 mt-4">登録なし・無料・3秒で始められます</p>
        </div>
      </section>

      {/* ── 成功事例 ── */}
      <section className="py-14 px-6 bg-indigo-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-center text-2xl font-bold text-gray-900 mb-2">こんな方が使っています</h2>
          <p className="text-center text-sm text-gray-500 mb-8">パソコンが得意でなくても大丈夫です</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {PERSONAS.map(p => (
              <div key={p.name} className="bg-white rounded-2xl p-6 border border-indigo-100 shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-3xl">{p.icon}</span>
                  <div>
                    <p className="text-xs font-semibold text-gray-400">{p.name}</p>
                    <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">{p.result}</span>
                  </div>
                </div>
                <p className="text-sm font-bold text-gray-900 mb-2">「{p.quote}」</p>
                <p className="text-xs text-gray-500 leading-relaxed">{p.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Before/After カルーセル ── */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-center text-2xl font-bold text-gray-900 mb-2">
            こんな作業が自動になります
          </h2>
          <p className="text-center text-gray-500 mb-10 text-sm">
            実際の画面イメージです。難しい操作は一切ありません。
          </p>

          <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
            {/* シーン */}
            <div className="flex items-start gap-4 mb-6">
              <span className="text-3xl">{ex.icon}</span>
              <div>
                <p className="text-xs font-semibold text-indigo-600 mb-1">よくある場面</p>
                <h3 className="text-lg font-bold text-gray-900">{ex.scene}</h3>
                <p className="text-sm text-gray-500 mt-1">「{ex.pain}」</p>
              </div>
              <div className="ml-auto text-right">
                <span className="text-xs bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full font-medium">
                  {ex.work}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded">Before</span>
                  <span className="text-xs text-gray-400">整理前のデータ</span>
                </div>
                <div className="bg-red-50 border border-red-100 rounded-xl p-4 font-mono text-sm text-gray-600 whitespace-pre-line leading-relaxed min-h-24">
                  {ex.before}
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded">After</span>
                  <span className="text-xs text-gray-400">ボタンを押した後</span>
                </div>
                <div className="bg-green-50 border border-green-100 rounded-xl p-4 font-mono text-sm text-gray-600 whitespace-pre-line leading-relaxed min-h-24">
                  {ex.after}
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-center gap-2 mt-5">
            {EXAMPLES.map((_, i) => (
              <button key={i} onClick={() => setCurrent(i)}
                className={`h-2 rounded-full transition-all duration-300 ${i === current ? 'bg-indigo-600 w-6' : 'bg-gray-300 w-2'}`} />
            ))}
          </div>
        </div>
      </section>

      {/* ── 使い方 ── */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-center text-2xl font-bold text-gray-900 mb-2">使い方はとても簡単です</h2>
          <p className="text-center text-sm text-gray-500 mb-12">むずかしい設定は一切ありません</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              { n: '1', title: '作業の手順を登録する', desc: '「重複を消す」「スペースを消す」など、やりたいことを選ぶだけ。設定は最初の1回だけです。', icon: '⚙️' },
              { n: '2', title: 'データを貼り付ける', desc: 'Excelからコピーしたデータを貼り付けるか、ファイルをドラッグするだけ。', icon: '📋' },
              { n: '3', title: 'ボタンを押す', desc: '「実行する」を押すと一瞬で完了。結果をそのままコピーかダウンロードできます。', icon: '▶️' },
            ].map(item => (
              <div key={item.n} className="text-center">
                <div className="w-12 h-12 bg-indigo-600 text-white rounded-2xl flex items-center justify-center text-lg font-bold mx-auto mb-4 shadow-md">
                  {item.n}
                </div>
                <div className="text-2xl mb-2">{item.icon}</div>
                <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-center text-2xl font-bold text-gray-900 mb-10">よくある質問</h2>
          <div className="space-y-3">
            {FAQS.map((faq, i) => (
              <div key={i} className="border border-gray-200 rounded-xl overflow-hidden">
                <button
                  className="w-full text-left px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                  <span className="font-medium text-gray-900 text-sm">{faq.q}</span>
                  <span className="text-gray-400 ml-4 flex-shrink-0">{openFaq === i ? '▲' : '▼'}</span>
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-4">
                    <p className="text-sm text-gray-600 leading-relaxed">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 最終CTA ── */}
      <section className="py-16 px-6 bg-indigo-600">
        <div className="max-w-lg mx-auto text-center">
          <h2 className="text-2xl font-bold text-white mb-2">まず、試してみませんか？</h2>
          <p className="text-indigo-200 mb-2 text-sm">登録なし・インストール不要・無料ですぐに使えます</p>
          <p className="text-indigo-300 mb-8 text-xs">保存したい場合は3つまで無料。それ以上はProプラン（¥500/月）</p>
          <Link href="/dashboard"
            className="inline-block bg-white text-indigo-700 font-bold px-10 py-4 rounded-2xl hover:bg-indigo-50 transition-colors text-base shadow-lg">
            今すぐ試してみる →
          </Link>
        </div>
      </section>

      {/* フッター */}
      <footer className="py-8 px-6 bg-gray-900 text-center">
        <p className="text-gray-400 text-sm">テシゴト — 繰り返しの手作業をボタン1つに</p>
        <div className="flex justify-center gap-6 mt-3 text-xs text-gray-500">
          <Link href="/login" className="hover:text-gray-300">ログイン</Link>
          <Link href="/register" className="hover:text-gray-300">新規登録</Link>
        </div>
      </footer>
    </div>
  )
}
