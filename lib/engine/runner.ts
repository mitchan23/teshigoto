import { applyTextStep } from './text'
import { applyCSVStep } from './csv'
import { applyDateStep } from './date'
import type { Step } from '@/types/workflow'

export function runWorkflow(steps: Step[], input: string): string {
  let current = input
  for (const step of steps) {
    if (step.type.startsWith('text_')) current = applyTextStep(current, step)
    else if (step.type.startsWith('date_')) current = applyDateStep(current, step)
    else current = applyCSVStep(current, step)
  }
  return current
}
