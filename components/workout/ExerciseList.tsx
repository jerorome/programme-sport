'use client'
// components/workout/ExerciseList.tsx
import { useState } from 'react'
import { ChevronDown, Plus, Info } from 'lucide-react'
import type { Day, SetEntry, PersonalRecord } from '@/types'
import ExercisePanel from './ExercisePanel'

interface Props {
  day: Day
  sets: Record<number, SetEntry[]>
  notes: Record<number, string>
  prs: Record<string, PersonalRecord>
  onUpdateSet: (ei: number, si: number, field: keyof SetEntry, value: any) => void
  onTickSet: (ei: number, si: number) => void
  onAddSet: (ei: number) => void
  onCheckPR: (ei: number, si: number) => void
  onNoteChange: (ei: number, value: string) => void
}

export default function ExerciseList({ day, sets, notes, prs, onUpdateSet, onTickSet, onAddSet, onCheckPR, onNoteChange }: Props) {
  const [openIdx, setOpenIdx] = useState<Set<number>>(new Set())
  const [panelEx, setPanelEx] = useState<number | null>(null)

  function toggle(ei: number) {
    setOpenIdx(prev => {
      const next = new Set(prev)
      next.has(ei) ? next.delete(ei) : next.add(ei)
      return next
    })
  }

  let lastRecap = false

  return (
    <>
      {day.exercises.map((ex, ei) => {
        const exSets = sets[ei] || []
        const doneCt = exSets.filter(s => s.done).length
        const allDone = exSets.length > 0 && doneCt === exSets.length
        const isOpen = openIdx.has(ei)
        const pr = prs[ex.name]

        // Recap separator
        const showSep = ex.isRecap && !lastRecap
        if (ex.isRecap) lastRecap = true
        else lastRecap = false

        return (
          <div key={ei}>
            {showSep && (
              <div className="flex items-center gap-3 px-3.5 py-2.5 rounded-[15px] mb-2.5 mt-5"
                   style={{ background: 'rgba(255,107,53,.06)', border: '1px solid rgba(255,107,53,.15)' }}>
                <span className="text-base">🔁</span>
                <div className="flex-1">
                  <div className="font-barlow font-bold text-sm tracking-[1.5px] uppercase"
                       style={{ color: 'var(--c2)' }}>Finisher rappel</div>
                  <div className="text-[11px]" style={{ color: 'var(--t2)' }}>
                    ~10 min · optionnel mais recommandé
                  </div>
                </div>
                <span className="text-[9px] font-bold tracking-[1px] px-2 py-1 rounded"
                      style={{ background: 'rgba(255,107,53,.15)', color: 'var(--c2)' }}>
                  RAPPEL
                </span>
              </div>
            )}

            <div className="rounded-[15px] mb-2.5 overflow-hidden transition-colors"
                 style={{
                   background: allDone ? 'rgba(0,232,122,.02)' : (ex.isRecap ? 'rgba(255,107,53,.02)' : 'var(--bg3)'),
                   border: `1.5px solid ${allDone ? 'rgba(0,232,122,.25)' : (ex.isRecap ? 'rgba(255,107,53,.2)' : 'var(--bdr)')}`,
                 }}>

              {/* Header */}
              <div className="flex items-center gap-2.5 px-3.5 py-3 cursor-pointer select-none"
                   onClick={() => toggle(ei)}>
                <div className="w-1 self-stretch rounded-sm flex-shrink-0"
                     style={{ background: ex.isRecap ? 'var(--c2)' : day.clr }}/>
                <div className="w-[42px] h-[42px] rounded-[10px] flex items-center justify-center text-[22px] flex-shrink-0"
                     style={{ background: 'var(--bg4)', border: '1px solid var(--bdr)' }}>
                  {ex.ill}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1">
                    <button
                      className="font-semibold text-sm text-left transition-colors hover:opacity-70"
                      style={{ color: 'var(--txt)' }}
                      onClick={e => { e.stopPropagation(); setPanelEx(ei) }}>
                      {ex.name}
                    </button>
                    <Info size={13} style={{ color: 'var(--t3)', flexShrink: 0 }}
                          onClick={e => { e.stopPropagation(); setPanelEx(ei) }}/>
                    {allDone && (
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded"
                            style={{ background: 'linear-gradient(90deg,var(--c4),#00bf65)',
                                     color: '#000' }}>OK</span>
                    )}
                  </div>
                  <div className="text-[11px] mt-0.5" style={{ color: ex.isRecap ? 'rgba(255,107,53,.7)' : 'var(--t2)' }}>
                    {ex.cat} · {ex.sets}×{ex.reps}
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className={`font-barlow font-bold text-base px-2 py-0.5 rounded ${allDone ? 'text-[var(--c4)]' : 'text-[var(--t2)]'}`}
                        style={{ background: allDone ? 'var(--c4a)' : 'var(--bg4)' }}>
                    {doneCt}/{exSets.length}
                  </span>
                  <ChevronDown size={16} style={{ color: 'var(--t3)', transition: 'transform .22s',
                                                   transform: isOpen ? 'rotate(180deg)' : undefined }}/>
                </div>
              </div>

              {/* Body */}
              {isOpen && (
                <div className="px-3.5 pb-3.5 border-t" style={{ borderColor: 'var(--bdr)' }}>
                  <table className="w-full border-collapse mt-3">
                    <thead>
                      <tr>
                        {['#', 'kg', 'Reps', 'RPE', ''].map(h => (
                          <th key={h} className="text-[9px] font-bold tracking-[1.5px] uppercase text-center pb-2"
                              style={{ color: 'var(--t3)' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {exSets.map((s, si) => {
                        const isPR = pr && Number(s.w) === pr.weight_kg && Number(s.r) === pr.reps
                        const wCls = isPR ? 'pr' : (s.w && !s.prefilled ? 'has' : (s.prefilled && !s._edited ? 'pre' : ''))
                        return (
                          <tr key={si}>
                            <td className="text-center font-barlow font-bold text-xl p-1"
                                style={{ color: 'var(--t3)' }}>{si + 1}</td>
                            <td className="p-1">
                              <input type="number" value={s.w} placeholder="—" min={0} step={0.5}
                                     className="w-full rounded-[9px] text-center font-barlow font-bold text-xl py-2 outline-none transition-all"
                                     style={{
                                       background: isPR ? 'rgba(0,232,122,.09)' : s.prefilled && !s._edited ? 'rgba(139,92,246,.07)' : s.w ? 'rgba(0,212,255,.06)' : 'var(--bg4)',
                                       border: `1.5px solid ${isPR ? 'rgba(0,232,122,.35)' : s.prefilled && !s._edited ? 'rgba(139,92,246,.2)' : s.w ? 'rgba(0,212,255,.2)' : 'var(--bdr)'}`,
                                       color: isPR ? 'var(--c4)' : s.prefilled && !s._edited ? 'var(--t2)' : 'var(--txt)',
                                     }}
                                     onChange={e => { onUpdateSet(ei, si, 'w', parseFloat(e.target.value) || ''); onCheckPR(ei, si) }}/>
                            </td>
                            <td className="p-1">
                              <input type="number" value={s.r} placeholder="—" min={0}
                                     className="w-full rounded-[9px] text-center font-barlow font-bold text-xl py-2 outline-none transition-all"
                                     style={{
                                       background: s.r ? 'rgba(0,212,255,.06)' : 'var(--bg4)',
                                       border: `1.5px solid ${s.r ? 'rgba(0,212,255,.2)' : 'var(--bdr)'}`,
                                       color: 'var(--txt)',
                                     }}
                                     onChange={e => onUpdateSet(ei, si, 'r', parseFloat(e.target.value) || '')}/>
                            </td>
                            <td className="p-1">
                              <select value={s.rpe || ''} onChange={e => onUpdateSet(ei, si, 'rpe', e.target.value)}
                                      className="w-full rounded-[9px] text-center text-xs py-[9px] outline-none cursor-pointer"
                                      style={{ background: 'var(--bg4)', border: '1.5px solid var(--bdr)', color: 'var(--t2)' }}>
                                <option value="">—</option>
                                {[5,5.5,6,6.5,7,7.5,8,8.5,9,9.5,10].map(v => (
                                  <option key={v} value={v}>{v}</option>
                                ))}
                              </select>
                            </td>
                            <td className="p-1">
                              <button onClick={() => onTickSet(ei, si)}
                                      className="w-[38px] h-[38px] rounded-[9px] flex items-center justify-center text-base transition-all"
                                      style={{
                                        background: s.done ? 'var(--c4)' : 'var(--bg4)',
                                        border: `1.5px solid ${s.done ? 'var(--c4)' : 'var(--bdr)'}`,
                                        color: s.done ? '#000' : 'var(--t3)',
                                        fontWeight: s.done ? 800 : 400,
                                      }}>
                                {s.done ? '✓' : '○'}
                              </button>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>

                  <button onClick={() => onAddSet(ei)}
                          className="mt-2 w-full py-2 rounded-[9px] text-xs transition-all"
                          style={{ border: '1.5px dashed var(--bdr)', background: 'transparent', color: 'var(--t3)' }}
                          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--c1)'; (e.currentTarget as HTMLElement).style.color = 'var(--c1)' }}
                          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--bdr)'; (e.currentTarget as HTMLElement).style.color = 'var(--t3)' }}>
                    + Série
                  </button>

                  <textarea value={notes[ei] || ''} onChange={e => onNoteChange(ei, e.target.value)}
                            placeholder="Notes…"
                            className="mt-2.5 w-full rounded-[9px] px-3 py-2.5 text-xs resize-none outline-none min-h-[50px] transition-colors"
                            style={{ background: 'var(--bg4)', border: '1.5px solid var(--bdr)', color: 'var(--t2)' }}/>
                </div>
              )}
            </div>
          </div>
        )
      })}

      {panelEx !== null && (
        <ExercisePanel
          exercise={day.exercises[panelEx]}
          dayClr={day.clr}
          dayGrad={day.grad}
          onClose={() => setPanelEx(null)}/>
      )}
    </>
  )
}
