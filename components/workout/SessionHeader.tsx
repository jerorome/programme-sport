'use client'
// components/workout/SessionHeader.tsx
import { Play, Pause } from 'lucide-react'
import type { Day } from '@/types'

const MOODS = ['😴', '😐', '💪', '🔥', '⚡']

interface Props {
  day: Day
  progress: number
  doneSets: number
  totalSets: number
  volume: number
  timerDisplay: string
  timerRunning: boolean
  startTime: string
  mood: string
  prefilled: boolean
  onToggleTimer: () => void
  onStartTimeChange: (v: string) => void
  onMoodChange: (v: string) => void
}

export default function SessionHeader({
  day, progress, doneSets, totalSets, volume,
  timerDisplay, timerRunning, startTime, mood, prefilled,
  onToggleTimer, onStartTimeChange, onMoodChange,
}: Props) {
  const circ = 169.6
  const offset = circ - circ * progress / 100

  return (
    <div className="rounded-[15px] p-[18px] mb-3.5 relative overflow-hidden"
         style={{ background: 'var(--bg3)', border: '1px solid var(--bdr)' }}>
      {/* Top gradient bar */}
      <div className="absolute top-0 left-0 right-0 h-[2.5px]"
           style={{ background: day.grad }}/>

      {/* Top row */}
      <div className="flex items-start justify-between gap-3 mb-3.5">
        <div>
          <div className="text-[9px] font-bold tracking-[2px] uppercase mb-1"
               style={{ color: 'var(--t3)' }}>{day.label}</div>
          <div className="font-barlow font-black text-4xl tracking-[2px] leading-none"
               style={{ background: day.grad, WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent' }}>
            {day.name}
          </div>
          <div className="text-xs mt-1" style={{ color: 'var(--t2)' }}>{day.focus}</div>
        </div>

        {/* Progress ring */}
        <div className="relative w-[66px] h-[66px] flex-shrink-0">
          <svg width="66" height="66" viewBox="0 0 66 66"
               style={{ transform: 'rotate(-90deg)' }}>
            <circle fill="none" stroke="var(--bg5)" strokeWidth="5" cx="33" cy="33" r="27"/>
            <circle fill="none" strokeWidth="5" strokeLinecap="round"
                    cx="33" cy="33" r="27" stroke="url(#rg)"
                    strokeDasharray={circ} strokeDashoffset={offset}
                    style={{ transition: 'stroke-dashoffset .6s cubic-bezier(.4,0,.2,1)' }}/>
            <defs>
              <linearGradient id="rg" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="var(--c1)"/>
                <stop offset="100%" stopColor="var(--c3)"/>
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-barlow font-bold text-[15px] leading-none">{progress}%</span>
            <span className="text-[9px] tracking-[1px]" style={{ color: 'var(--t3)' }}>fait</span>
          </div>
        </div>
      </div>

      {/* Meta strip */}
      <div className="grid grid-cols-3 gap-2 mb-3.5">
        {[
          { label: 'Chrono', value: timerDisplay, color: 'var(--c1)' },
          { label: 'Volume', value: volume ? `${Math.round(volume)} kg` : '0 kg', color: 'var(--txt)' },
          { label: 'Séries ✓', value: `${doneSets}/${totalSets}`, color: 'var(--c4)' },
        ].map(({ label, value, color }) => (
          <div key={label} className="rounded-[9px] p-3 text-center"
               style={{ background: 'var(--bg4)' }}>
            <div className="text-[9px] font-bold tracking-[1.5px] uppercase mb-1"
                 style={{ color: 'var(--t3)' }}>{label}</div>
            <div className="font-barlow font-bold text-[22px] leading-none"
                 style={{ color }}>{value}</div>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="flex items-center gap-2 flex-wrap mb-2.5">
        <span className="text-[11px] font-semibold" style={{ color: 'var(--t2)' }}>⏱</span>
        <input type="time" value={startTime}
               onChange={e => onStartTimeChange(e.target.value)}
               className="px-2.5 py-2 rounded-[9px] text-sm outline-none w-[118px] transition-colors"
               style={{ background: 'var(--bg4)', border: '1.5px solid var(--bdr)',
                        color: 'var(--txt)' }}/>
        <button onClick={onToggleTimer}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-[9px] text-xs font-semibold transition-all"
                style={{
                  border: `1.5px solid ${timerRunning ? 'var(--c1)' : 'var(--bdr)'}`,
                  background: timerRunning ? 'var(--c1a)' : 'var(--bg4)',
                  color: timerRunning ? 'var(--c1)' : 'var(--t2)',
                }}>
          {timerRunning ? <Pause size={14}/> : <Play size={14}/>}
          {timerRunning ? 'Pause' : 'Lancer'}
        </button>
      </div>

      {/* Mood */}
      <div className="flex items-center gap-2">
        <span className="text-[11px] font-semibold" style={{ color: 'var(--t2)' }}>Feeling</span>
        {MOODS.map(e => (
          <button key={e} onClick={() => onMoodChange(mood === e ? '' : e)}
                  className="w-9 h-9 rounded-lg text-lg transition-all"
                  style={{
                    border: `1.5px solid ${mood === e ? 'var(--c2)' : 'var(--bdr)'}`,
                    background: mood === e ? 'var(--c2a)' : 'var(--bg4)',
                    transform: mood === e ? 'scale(1.1)' : undefined,
                  }}>
            {e}
          </button>
        ))}
      </div>

      {/* Prefill hint */}
      {prefilled && (
        <div className="flex items-center gap-2 mt-3 px-2.5 py-2 rounded-lg text-xs"
             style={{ background: 'rgba(139,92,246,.07)', color: 'var(--t2)' }}>
          🔮 <span style={{ color: 'var(--c3)', fontWeight: 600 }}>Charges pré-remplies</span> depuis ta dernière séance
        </div>
      )}
    </div>
  )
}
