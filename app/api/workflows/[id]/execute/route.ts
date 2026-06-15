import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { applyTextStep } from '@/lib/engine/text'
import { applyCSVStep } from '@/lib/engine/csv'
import { applyDateStep } from '@/lib/engine/date'
import type { Step } from '@/types/workflow'

function executeStep(input: string, step: Step): string {
  const cat = step.type.split('_')[0]
  if (cat === 'text') return applyTextStep(input, step)
  if (cat === 'csv' || cat === 'date') {
    if (step.type.startsWith('date_')) return applyDateStep(input, step)
    return applyCSVStep(input, step)
  }
  return input
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { input } = await req.json() as { input: string }

  const { data: wf } = await supabase
    .from('workflows').select('*').eq('id', id).eq('user_id', user.id).single()
  if (!wf) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  let current = input
  for (const step of (wf.steps as Step[])) {
    current = executeStep(current, step)
  }

  await supabase.from('executions').insert({
    workflow_id: id,
    user_id: user.id,
    input_data: { text: input },
    output_data: { text: current },
    status: 'completed',
  })

  return NextResponse.json({ output: current })
}
