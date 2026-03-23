'use client'
// components/workout/ExercisePanel.tsx
import { useState, useEffect } from 'react'
import Image from 'next/image'
import { X, ExternalLink } from 'lucide-react'
import type { Exercise } from '@/types'

const UNSPLASH: Record<string, string> = {
  'Tractions (prise large)':           'https://images.unsplash.com/photo-1598971457999-ca4ef48a9a74',
  'Tirage poulie haute (large)':       'https://images.unsplash.com/photo-1534438327276-14e5300c3a48',
  'Rowing poulie basse (neutre)':      'https://images.unsplash.com/photo-1581009137042-c552e485697a',
  'Rowing haltère unilatéral':         'https://images.unsplash.com/photo-1590507621108-433608c97823',
  'Face pull corde (poulie haute)':    'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b',
  'Développé couché haltères':         'https://images.unsplash.com/photo-1517836357463-d25dfeac3438',
  'Développé incliné haltères 30°':   'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5',
  'Développé militaire haltères':      'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5',
  'Élévations latérales haltères':     'https://images.unsplash.com/photo-1585152968992-d2b9444408cc',
  'Squat barre (stance large)':        'https://images.unsplash.com/photo-1574680178050-55c6a6a96e0a',
  'Leg press (pieds hauts écartés)':  'https://images.unsplash.com/photo-1534438327276-14e5300c3a48',
  'Hip thrust machine (guidée)':       'https://images.unsplash.com/photo-1581009137042-c552e485697a',
  'Crunch câble agenouillé':           'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b',
  'Ab wheel (roue abdominale)':        'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b',
}

const YOUTUBE: Record<string, { id: string; label: string }> = {
  'Tractions (prise large)':           { id: 'eGo4IYlbE5g', label: 'Tractions — forme & technique' },
  'Tirage poulie haute (large)':       { id: 'CAwf7n6Luuc', label: 'Lat pulldown — tutoriel' },
  'Rowing poulie basse (neutre)':      { id: 'GZbfZ033f74', label: 'Cable row — technique' },
  'Rowing haltère unilatéral':         { id: 'pYcpY20QaE8', label: 'Dumbbell row' },
  'Face pull corde (poulie haute)':    { id: 'V8dZ3pyiCBo', label: 'Face pull guide' },
  'Développé couché haltères':         { id: 'VmB1G1K7v94', label: 'Dumbbell bench press' },
  'Développé incliné haltères 30°':   { id: '8iPEnn-ltC8', label: 'Incline press' },
  'Développé militaire haltères':      { id: 'HzIiNhHhhtA', label: 'Shoulder press' },
  'Élévations latérales haltères':     { id: '3VcKaXpzqRo', label: 'Lateral raise' },
  'Squat barre (stance large)':        { id: 'ultWZbUMPL8', label: 'Squat guide' },
  'Leg press (pieds hauts écartés)':  { id: 'IZxyjW7MPJQ', label: 'Leg press' },
  'Fentes bulgares haltères':          { id: '2C-uNgKwPLE', label: 'Bulgarian split squat' },
  'Leg curl couché (ischio)':          { id: 'Orxowest56U', label: 'Leg curl' },
  'Hip thrust machine (guidée)':       { id: 'xDmFkJxPzeM', label: 'Hip thrust' },
  'Crunch câble agenouillé':           { id: '_x7vqFy7EKE', label: 'Cable crunch' },
  'Leg raise suspendu (barre)':        { id: 'hdng3ZMr6b0', label: 'Hanging leg raise' },
  'Ab wheel (roue abdominale)':        { id: 'AaC7pHPGZ3s', label: 'Ab wheel rollout' },
}

interface Props {
  exercise: Exercise
  dayClr: string
  dayGrad: string
  onClose: () => void
}

export default function ExercisePanel({ exercise, dayClr, dayGrad, onClose }: Props) {
  const [visible, setVisible] = useState(false)
  const yt = YOUTUBE[exercise.name]
  const photo = UNSPLASH[exercise.name]

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true))
  }, [])

  function close() {
    setVisible(false)
    setTimeout(onClose, 350)
  }

  return (
    <div className="fixed inset-0 z-[400]">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-[6px]"
           style={{ opacity: visible ? 1 : 0, transition: 'opacity .3s' }}
           onClick={close}/>

      {/* Panel */}
      <div className="absolute top-0 right-0 bottom-0 flex flex-col overflow-hidden"
           style={{
             width: 'min(440px, 100vw)',
             background: 'var(--bg2)',
             borderLeft: '1px solid var(--bdr)',
             transform: visible ? 'translateX(0)' : 'translateX(100%)',
             transition: 'transform .35s cubic-bezier(.32,0,.28,1)',
           }}>

        {/* Photo */}
        <div className="relative h-40 flex-shrink-0 overflow-hidden"
             style={{ background: 'var(--bg3)' }}>
          {photo ? (
            <Image src={`${photo}?w=440&h=160&fit=crop&q=75&auto=format`}
                   alt={exercise.name} fill className="object-cover"/>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-[72px] opacity-15">
              {exercise.ill}
            </div>
          )}
          {/* Gradient overlay */}
          <div className="absolute inset-0"
               style={{ background: 'linear-gradient(to bottom, transparent 40%, rgba(17,20,27,.95))' }}/>
        </div>

        {/* Gradient bar */}
        <div className="h-[2px] flex-shrink-0" style={{ background: dayGrad }}/>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5">
          <div className="flex items-start justify-between gap-3 mb-4">
            <div>
              <div className="text-[9px] font-bold tracking-[2px] uppercase mb-1.5"
                   style={{ color: 'var(--t3)' }}>{exercise.cat}</div>
              <h2 className="font-barlow font-black text-2xl tracking-[1px] leading-tight">
                {exercise.name}
              </h2>
            </div>
            <button onClick={close}
                    className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 text-lg transition-all"
                    style={{ background: 'var(--bg4)', border: '1px solid var(--bdr)', color: 'var(--t2)' }}>
              <X size={18}/>
            </button>
          </div>

          {/* Params */}
          <div className="grid grid-cols-3 gap-2 mb-5">
            {[
              { label: 'Séries', value: exercise.sets },
              { label: 'Reps', value: exercise.reps },
              { label: 'Type', value: exercise.isRecap ? 'Rappel' : 'Principal' },
            ].map(({ label, value }) => (
              <div key={label} className="rounded-[9px] p-2.5 text-center"
                   style={{ background: 'var(--bg4)' }}>
                <div className="text-[9px] font-bold tracking-[1.5px] uppercase mb-1"
                     style={{ color: 'var(--t3)' }}>{label}</div>
                <div className="font-barlow font-bold text-xl">{value}</div>
              </div>
            ))}
          </div>

          {/* Tip */}
          <div className="p-3 mb-3 rounded-r-[9px]"
               style={{ background: 'rgba(139,92,246,.07)', borderLeft: '3px solid var(--c3)' }}>
            <p className="text-sm" style={{ color: 'var(--t2)', lineHeight: 1.6 }}>
              💡 {exercise.tip}
            </p>
          </div>

          {/* Tall note */}
          {exercise.tall && (
            <div className="p-3 mb-4 rounded-r-[9px]"
                 style={{ background: 'rgba(0,212,255,.06)', borderLeft: '3px solid var(--c1)' }}>
              <p className="text-sm" style={{ color: 'var(--t2)', lineHeight: 1.6 }}>
                📏 {exercise.tall}
              </p>
            </div>
          )}

          {/* YouTube */}
          {yt && (
            <>
              <div className="text-[10px] font-bold tracking-[2px] uppercase mb-2 flex items-center gap-2"
                   style={{ color: 'var(--t3)' }}>
                Vidéo de référence
                <div className="flex-1 h-px" style={{ background: 'var(--bdr)' }}/>
              </div>
              <a href={`https://www.youtube.com/watch?v=${yt.id}`}
                 target="_blank" rel="noopener"
                 className="flex items-center gap-3 p-3 rounded-[12px] transition-all group"
                 style={{ background: 'var(--bg4)', border: '1.5px solid var(--bdr)' }}
                 onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--c1)')}
                 onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--bdr)')}>
                <img src={`https://img.youtube.com/vi/${yt.id}/mqdefault.jpg`}
                     alt="" className="w-24 h-14 rounded-lg object-cover flex-shrink-0"/>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold leading-tight"
                       style={{ color: 'var(--txt)' }}>{yt.label}</div>
                  <div className="text-xs mt-1" style={{ color: 'var(--t3)' }}>YouTube ↗</div>
                </div>
                <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                     style={{ background: 'rgba(255,0,0,.8)' }}>
                  <div className="border-l-[14px] border-y-[9px] border-y-transparent border-l-white ml-0.5"/>
                </div>
              </a>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
