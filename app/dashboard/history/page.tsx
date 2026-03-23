'use client'
// app/dashboard/history/page.tsx
import { useEffect, useState } from 'react'
import { getSessions } from '@/lib/db'
import type { Session } from '@/types'
import { DAYS } from '@/lib/programme'

export default function HistoryPage() {
  const [sessions, setSessions] = useState<Session[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getSessions().then(s => { setSessions(s); setLoading(false) })
  }, [])

  if (loading) return (
    <div className="text-center py-20 text-sm" style={{ color: 'var(--t3)' }}>Chargement…</div>
  )

  if (!sessions.length) return (
    <div className="text-center py-20">
      <div className="text-5xl mb-4">📋</div>
      <p className="text-sm" style={{ color: 'var(--t3)' }}>Aucune séance enregistrée.<br/>Lance ton premier entraînement !</p>
    </div>
  )

  return (
    <div className="animate-fade-up space-y-3">
      {sessions.map(h => {
        const day = DAYS[h.day_idx]
        return (
          <div key={h.id} className="rounded-[15px] p-4 overflow-hidden relative"
               style={{ background: 'var(--bg3)', border: '1px solid var(--bdr)' }}>
            <div className="absolute left-0 top-0 bottom-0 w-[3px] rounded-l-[15px]"
                 style={{ background: h.color }}/>

            <div className="flex items-start justify-between pl-3 mb-2">
              <div>
                <div className="font-barlow font-black text-2xl tracking-[1px]"
                     style={{ color: h.color }}>{h.day_name}</div>
                <div className="text-xs mt-0.5" style={{ color: 'var(--t3)' }}>
                  {h.date} · {h.started_at ? new Date(h.started_at).toLocaleTimeString('fr', { hour: '2-digit', minute: '2-digit' }) : '—'} {h.mood || ''}
                </div>
              </div>
              <div className="text-right">
                <div className="font-barlow font-bold text-xl" style={{ color: h.color }}>
                  {h.volume_kg.toLocaleString()}
                </div>
                <div className="text-[10px]" style={{ color: 'var(--t3)' }}>kg volume</div>
              </div>
            </div>

            <div className="flex gap-2 flex-wrap pl-3">
              {[
                `⏱ ${h.duration || '—'}`,
                `💪 ${h.sets_done} séries`,
                ...(h.cardio?.dur ? [`🫀 ${h.cardio.dur}min`] : []),
              ].map(chip => (
                <span key={chip} className="text-xs px-2 py-0.5 rounded"
                      style={{ background: 'var(--bg4)', color: 'var(--t2)' }}>
                  {chip}
                </span>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
