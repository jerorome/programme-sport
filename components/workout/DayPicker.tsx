'use client'
// components/workout/DayPicker.tsx
import { useRef } from 'react'
import { DAYS } from '@/lib/programme'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface Props {
  current: number
  onChange: (idx: number) => void
}

export default function DayPicker({ current, onChange }: Props) {
  const touchStart = useRef(0)

  return (
    <div
      className="mb-4"
      onTouchStart={e => { touchStart.current = e.touches[0].clientX }}
      onTouchEnd={e => {
        const dx = e.changedTouches[0].clientX - touchStart.current
        if (Math.abs(dx) > 60) onChange((current + (dx < 0 ? 1 : -1) + 4) % 4)
      }}>
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
        {DAYS.map((d, i) => (
          <button
            key={i}
            onClick={() => onChange(i)}
            className="relative overflow-hidden rounded-[15px] p-3.5 text-left transition-all"
            style={{
              background: i === current ? 'var(--bg4)' : 'var(--bg3)',
              border: `1.5px solid ${i === current ? d.clr + '60' : 'var(--bdr)'}`,
              transform: i === current ? 'translateY(-1px)' : undefined,
            }}>
            {i === current && (
              <div className="absolute inset-0 opacity-[0.06]"
                   style={{ background: d.grad }}/>
            )}
            <div className="relative z-10">
              <div className="text-[9px] font-bold tracking-[2px] uppercase mb-1"
                   style={{ color: 'var(--t3)' }}>
                {d.label}
              </div>
              <div className="font-barlow font-black text-2xl leading-none mb-0.5"
                   style={{
                     background: d.grad,
                     WebkitBackgroundClip: 'text',
                     WebkitTextFillColor: 'transparent',
                   }}>
                {d.name.split(' ')[0]}
              </div>
              <div className="text-[10px]" style={{ color: 'var(--t2)' }}>
                {d.focus.split('·')[0].trim()}
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Dots */}
      <div className="flex items-center justify-center gap-2 mt-3">
        <button onClick={() => onChange((current - 1 + 4) % 4)}
                className="w-7 h-7 rounded-full flex items-center justify-center transition-colors"
                style={{ background: 'var(--bg4)', border: '1px solid var(--bdr)', color: 'var(--t2)' }}>
          <ChevronLeft size={14}/>
        </button>
        {DAYS.map((d, i) => (
          <div key={i} className="rounded-full transition-all"
               style={{
                 width: i === current ? 8 : 5,
                 height: i === current ? 8 : 5,
                 background: i === current ? d.clr : 'var(--t3)',
               }}/>
        ))}
        <button onClick={() => onChange((current + 1) % 4)}
                className="w-7 h-7 rounded-full flex items-center justify-center transition-colors"
                style={{ background: 'var(--bg4)', border: '1px solid var(--bdr)', color: 'var(--t2)' }}>
          <ChevronRight size={14}/>
        </button>
      </div>
    </div>
  )
}
