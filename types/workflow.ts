export type StepType =
  | 'text_trim'
  | 'text_replace'
  | 'text_uppercase'
  | 'text_lowercase'
  | 'text_zenkaku_to_hankaku'
  | 'text_number_comma'
  | 'csv_extract_columns'
  | 'csv_filter_rows'
  | 'csv_remove_duplicates'
  | 'csv_sort'
  | 'date_add'
  | 'date_format'

export type Step = {
  id: string
  type: StepType
  label: string
  config: Record<string, string | number | boolean>
}

export type Workflow = {
  id: string
  user_id: string
  name: string
  description: string | null
  steps: Step[]
  created_at: string
  updated_at: string
}

export type Execution = {
  id: string
  workflow_id: string
  user_id: string
  input_data: Record<string, unknown>
  output_data: Record<string, unknown>
  status: 'completed' | 'failed'
  created_at: string
}

export type Plan = 'free' | 'pro'

export const FREE_WORKFLOW_LIMIT = 3

export const STEP_META: Record<StepType, { label: string; example: string; category: 'text' | 'csv' | 'date'; fields: StepField[] }> = {
  text_trim:        { label: '前後の空白を除去', example: '例: "  山田  " → "山田"', category: 'text', fields: [] },
  text_replace:     { label: '文字列を置換',     example: '例: "株式会社" → "（株）"', category: 'text', fields: [
    { key: 'from', label: '置換前', type: 'text', placeholder: '例: 株式会社' },
    { key: 'to',   label: '置換後', type: 'text', placeholder: '例: （株）' },
  ]},
  text_uppercase:   { label: '大文字に変換', example: '例: "hello" → "HELLO"', category: 'text', fields: [] },
  text_lowercase:   { label: '小文字に変換', example: '例: "HELLO" → "hello"', category: 'text', fields: [] },
  text_zenkaku_to_hankaku: { label: '全角→半角に統一', example: '例: "Ａ１２３" → "A123"（Excelコピペのズレを修正）', category: 'text', fields: [] },
  text_number_comma: { label: '数字にカンマを付ける', example: '例: "1000000" → "1,000,000"', category: 'text', fields: [] },
  csv_extract_columns: { label: '列を抽出', example: '例: 名前と金額の列だけ残す', category: 'csv', fields: [
    { key: 'columns', label: '残す列名（カンマ区切り）', type: 'text', placeholder: '例: 名前,金額' },
  ]},
  csv_filter_rows:  { label: '行をフィルタ', example: '例: 「東京」を含む行だけ残す', category: 'csv', fields: [
    { key: 'column',   label: '対象の列名', type: 'text', placeholder: '例: 都道府県' },
    { key: 'operator', label: '条件', type: 'select', options: ['含む', '含まない', '等しい', '等しくない'] },
    { key: 'value',    label: '値', type: 'text', placeholder: '例: 東京' },
  ]},
  csv_remove_duplicates: { label: '重複行を削除', example: '例: 同じ名前の行を1行にまとめる', category: 'csv', fields: [
    { key: 'column', label: '基準の列名（空欄=全列比較）', type: 'text', placeholder: '例: メールアドレス' },
  ]},
  csv_sort: { label: '列で並べ替え', example: '例: 金額の列を大きい順に並べ替える', category: 'csv', fields: [
    { key: 'column', label: '並べ替える列名', type: 'text', placeholder: '例: 金額' },
    { key: 'order', label: '順序', type: 'select', options: ['昇順（小→大・あ→ん）', '降順（大→小・ん→あ）'] },
  ]},
  date_add:    { label: '日付を加算/減算', example: '例: 2024/1/1 に +7日 → 2024/1/8', category: 'date', fields: [
    { key: 'column', label: '日付の列名', type: 'text', placeholder: '例: 登録日' },
    { key: 'days',   label: '日数（マイナスで減算）', type: 'number', placeholder: '例: 7' },
  ]},
  date_format: { label: '日付フォーマットを統一', example: '例: 2024/1/5 → 2024-01-05', category: 'date', fields: [
    { key: 'column', label: '日付の列名', type: 'text', placeholder: '例: 日付' },
    { key: 'format', label: '変換後の形式', type: 'select', options: ['YYYY/MM/DD', 'YYYY-MM-DD', 'MM/DD/YYYY', 'DD/MM/YYYY'] },
  ]},
}

export type StepField = {
  key: string
  label: string
  type: 'text' | 'number' | 'select'
  options?: string[]
  placeholder?: string
}
