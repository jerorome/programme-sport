'use client'
// app/dashboard/journal/page.tsx
import { useState, useEffect } from 'react'
import { getJournalEntries, upsertJournalEntry } from '@/lib/db'
import type { JournalEntry } from '@/types'

const METERS = [
  { key: 'energy' as const, label: '⚡ Énergie générale', emojis: ['💀','😴','😐','💪','⚡'], labels: ['Épuisé','Fatigué','Normal','En forme','En feu'] },
  { key: 'motiv'  as const, label: '🎯 Motivation',       emojis: ['😩','😕','😐','😤','🔥'], labels: ['Aucune','Faible','Ok','Motivé','À fond'] },
  { key: 'stress' as const, label: '🧠 État mental',      emojis: ['🔴','🟠','🟡','🟢','✨'], labels: ['Surchargé','Tendu','Neutre','Calme','Zen'] },
]

export default function JournalPage() {
  const today = new Date().toLocaleDateString('fr')
  const [energy, setEnergy] = useState(0)
  const [motiv,  setMotiv]  = useState(0)
  const [stress, setStress] = useState(0)
  const [note,   setNote]   = useState('')
  const [entries, setEntries] = useState<JournalEntry[]>([])
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    getJournalEntries().then(data => {
      setEntries(data)
      const todayEntry = data.find(e => e.date === today)
      if (todayEntry) {
        setEnergy(todayEntry.energy || 0)
        setMotiv(todayEntry.motiv || 0)
        setStress(todayEntry.stress || 0)
        setNote(todayEntry.note || '')
      }
    })
  }, [])

  async function save() {
    await upsertJournalEntry({ date: today, energy: energy || null, motiv: motiv || null, stress: stress || null, note: note || null })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
    const updated = await getJournalEntries()
    setEntries(updated)
  }

  const values: Record<string, number> = { energy, motiv, stress }
  const setters: Record<string, (v: number) => void> = { energy: setEnergy, motiv: setMotiv, stress: setStress }

  return (
    <div className="animate-fade-up space-y-3">
      {/* Header */}
      <div className="mb-2">
        <div className="text-[10px] font-bold tracking-[2px] uppercase mb-1" style={{ color: 'var(--t3)' }}>
          {new Date().toLocaleDateString('fr', { weekday: 'long', day: 'numeric', month: 'long' })}
        </div>
        <h1 className="font-barlow font-bold text-[26px] tracking-[1px]">Comment tu te sens ?</h1>
        <p className="text-xs mt-1" style={{ color: 'var(--t2)' }}>30 secondes · chaque jour d'entraînement</p>
      </div>

      {/* Meters */}
      {METERS.map(({ key, label, emojis, labels }) => (
        <div key={key} className="rounded-[15px] p-4" style={{ background: 'var(--bg3)', border: '1px solid var(--bdr)' }}>
          <div className="font-semibold text-sm mb-3">{label}</div>
          <div className="flex gap-2">
            {emojis.map((emoji, i) => (
              <button key={i} onClick={() => setters[key](i + 1 === values[key] ? 0 : i + 1)}
                      className="flex-1 flex flex-col items-center gap-1 py-2.5 rounded-[10px] transition-all"
                      style={{
                        border: `1.5px solid ${values[key] === i + 1 ? 'var(--c1)' : 'var(--bdr)'}`,
                        background: values[key] === i + 1 ? 'var(--c1a)' : 'var(--bg4)',
                        transform: values[key] === i + 1 ? 'translateY(-2px)' : undefined,
                      }}>
                <span className="text-2xl leading-none">{emoji}</span>
                <span className="text-[9px] font-semibold"
                      style={{ color: values[key] === i + 1 ? 'var(--c1)' : 'var(--t3)' }}>
                  {labels[i]}
                </span>
              </button>
            ))}
          </div>
        </div>
      ))}

      {/* Note */}
      <div className="rounded-[15px] p-4" style={{ background: 'var(--bg3)', border: '1px solid var(--bdr)' }}>
        <div className="font-semibold text-sm mb-3">📝 Note (optionnel)</div>
        <textarea value={note} onChange={e => setNote(e.target.value)}
                  placeholder="Contexte, ressenti, observations…"
                  className="w-full rounded-[9px] px-3 py-2.5 text-sm resize-none outline-none min-h-[70px]"
                  style={{ background: 'var(--bg4)', border: '1.5px solid var(--bdr)', color: 'var(--t2)' }}/>
      </div>

      <button onClick={save}
              className="w-full py-[17px] rounded-[15px] font-barlow font-black text-xl tracking-[3px] text-white transition-all"
              style={{ background: saved ? 'var(--c4)' : 'linear-gradient(135deg,var(--c3),var(--c1))' }}>
        {saved ? '✓ Enregistré !' : '💾 Enregistrer'}
      </button>

      {/* History */}
      {entries.length > 0 && (
        <>
          <div className="font-barlow font-bold text-base tracking-[2px] uppercase flex items-center gap-2 mt-4"
               style={{ color: 'var(--t2)' }}>
            Historique
            <div className="flex-1 h-px" style={{ background: 'var(--bdr)' }}/>
          </div>
          {entries.slice(0, 10).map(e => {
            const avg = ((e.energy || 0) + (e.motiv || 0) + (e.stress || 0)) / 3
            const color = avg >= 4 ? 'var(--c4)' : avg >= 3 ? 'var(--c1)' : avg >= 2 ? 'var(--c2)' : 'var(--t3)'
            return (
              <div key={e.id} className="rounded-[12px] p-3 flex items-center gap-3"
                   style={{ background: 'var(--bg3)', border: '1px solid var(--bdr)' }}>
                <div className="text-xs font-semibold min-w-[44px]" style={{ color: 'var(--t3)' }}>
                  {e.date.slice(0, 5)}
                </div>
                <div className="flex gap-2 flex-1">
                  {[e.energy, e.motiv, e.stress].map((v, i) => (
                    <div key={i} className="flex flex-col items-center gap-1 flex-1">
                      <div className="text-base">{['⚡','🎯','🧠'][i]}</div>
                      <div className="w-full h-1 rounded-full overflow-hidden" style={{ background: 'var(--bg5)' }}>
                        <div className="h-full rounded-full"
                             style={{ width: `${(v || 0) * 20}%`, background: ['var(--c1)','var(--c3)','var(--c2)'][i] }}/>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="font-barlaw font-bold text-xl min-w-[32px] text-right"
                     style={{ color, fontFamily: 'var(--font-barlow)' }}>
                  {avg.toFixed(1)}
                </div>
              </div>
            )
          })}
        </>
      )}
    </div>
  )
}
