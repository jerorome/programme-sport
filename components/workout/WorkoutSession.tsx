'use client'
// components/workout/WorkoutSession.tsx
import { useState, useEffect, useCallback } from 'react'
import { DAYS } from '@/lib/programme'
import { getLastSessionByDay, createSession, upsertPR, getPRs } from '@/lib/db'
import type { SetEntry, PersonalRecord } from '@/types'
import DayPicker from './DayPicker'
import SessionHeader from './SessionHeader'
import ExerciseList from './ExerciseList'

export default function WorkoutSession() {
  const [dayIdx, setDayIdx] = useState(0)
  const [sets, setSets] = useState<Record<number, SetEntry[]>>({})
  const [notes, setNotes] = useState<Record<number, string>>({})
  const [prs, setPRs] = useState<Record<string, PersonalRecord>>({})
  const [prefilled, setPrefilled] = useState(false)
  const [timerRunning, setTimerRunning] = useState(false)
  const [timerStart, setTimerStart] = useState<number | null>(null)
  const [elapsed, setElapsed] = useState(0)
  const [startTime, setStartTime] = useState('')
  const [mood, setMood] = useState('')
  const [saving, setSaving] = useState(false)

  const day = DAYS[dayIdx]

  // Load last session weights + PRs on day change
  useEffect(() => {
    setSets({})
    setNotes({})
    setPrefilled(false)

    async function load() {
      const [lastW, allPRs] = await Promise.all([
        getLastSessionByDay(dayIdx),
        getPRs(),
      ])

      // Build PRs map
      const prMap: Record<string, PersonalRecord> = {}
      allPRs.forEach(pr => { prMap[pr.exercise] = pr })
      setPRs(prMap)

      // Init sets with prefill
      const initSets: Record<number, SetEntry[]> = {}
      day.exercises.forEach((ex, ei) => {
        const prev = lastW?.[ei]
        initSets[ei] = Array.from({ length: ex.sets }, (_, si) => ({
          w: prev?.[si]?.w ?? '',
          r: prev?.[si]?.r ?? '',
          rpe: '',
          done: false,
          prefilled: !!(prev?.[si]?.w),
        }))
      })
      setSets(initSets)
      if (lastW) setPrefilled(true)
    }

    load()
  }, [dayIdx])

  // Timer
  useEffect(() => {
    if (!timerRunning || !timerStart) return
    const iv = setInterval(() => setElapsed(Math.floor((Date.now() - timerStart) / 1000)), 1000)
    return () => clearInterval(iv)
  }, [timerRunning, timerStart])

  function startTimer() {
    const now = new Date()
    setStartTime(now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0'))
    setTimerStart(Date.now())
    setTimerRunning(true)
  }

  function toggleTimer() {
    if (timerRunning) { setTimerRunning(false) }
    else { startTimer() }
  }

  const timerDisplay = `${Math.floor(elapsed / 60).toString().padStart(2, '0')}:${(elapsed % 60).toString().padStart(2, '0')}`

  // Progress
  const totalSets = Object.values(sets).reduce((a, s) => a + s.length, 0)
  const doneSets  = Object.values(sets).reduce((a, s) => a + s.filter(x => x.done).length, 0)
  const progress  = totalSets ? Math.round(doneSets / totalSets * 100) : 0

  const volume = Object.values(sets).reduce((a, s) =>
    a + s.reduce((b, x) => b + ((Number(x.w) || 0) * (Number(x.r) || 0)), 0), 0)

  // Update set
  const updateSet = useCallback((ei: number, si: number, field: keyof SetEntry, value: any) => {
    setSets(prev => {
      const copy = { ...prev }
      const row = [...(copy[ei] || [])]
      row[si] = { ...row[si], [field]: value, _edited: true }
      copy[ei] = row
      return copy
    })
  }, [])

  const tickSet = useCallback((ei: number, si: number) => {
    setSets(prev => {
      const copy = { ...prev }
      const row = [...(copy[ei] || [])]
      row[si] = { ...row[si], done: !row[si].done }
      copy[ei] = row
      return copy
    })
  }, [])

  const addSet = useCallback((ei: number) => {
    setSets(prev => {
      const copy = { ...prev }
      copy[ei] = [...(copy[ei] || []), { w: '', r: '', rpe: '', done: false }]
      return copy
    })
  }, [])

  // Check PR
  async function checkPR(ei: number, si: number) {
    const s = sets[ei]?.[si]
    if (!s?.w || !s?.r) return
    const ex = day.exercises[ei]
    const pr = prs[ex.name]
    const w = Number(s.w), r = Number(s.r)
    if (!pr || w > pr.weight_kg || (w === pr.weight_kg && r > pr.reps)) {
      const date = new Date().toLocaleDateString('fr')
      const newPR = await upsertPR(ex.name, w, r, date)
      setPRs(prev => ({ ...prev, [ex.name]: newPR }))
    }
  }

  // Finish session
  async function finishSession() {
    setSaving(true)
    try {
      await createSession({
        day_idx: dayIdx as 0 | 1 | 2 | 3,
        day_name: day.name,
        date: new Date().toLocaleDateString('fr'),
        started_at: timerStart ? new Date(timerStart).toISOString() : null,
        duration: timerDisplay,
        mood,
        volume_kg: Math.round(volume),
        sets_done: doneSets,
        sets_data: sets,
        notes_data: notes,
        cardio: {},
        color: day.clr,
      })
      // Reset
      setSets({})
      setNotes({})
      setTimerRunning(false)
      setTimerStart(null)
      setElapsed(0)
      setMood('')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="animate-fade-up">
      <DayPicker current={dayIdx} onChange={setDayIdx} />

      <SessionHeader
        day={day}
        progress={progress}
        doneSets={doneSets}
        totalSets={totalSets}
        volume={volume}
        timerDisplay={timerDisplay}
        timerRunning={timerRunning}
        startTime={startTime}
        mood={mood}
        prefilled={prefilled}
        onToggleTimer={toggleTimer}
        onStartTimeChange={setStartTime}
        onMoodChange={setMood}
      />

      <ExerciseList
        day={day}
        sets={sets}
        notes={notes}
        prs={prs}
        onUpdateSet={updateSet}
        onTickSet={tickSet}
        onAddSet={addSet}
        onCheckPR={checkPR}
        onNoteChange={(ei, v) => setNotes(prev => ({ ...prev, [ei]: v }))}
      />

      <button
        onClick={finishSession}
        disabled={saving}
        className="w-full py-[18px] rounded-[15px] font-barlow font-black text-2xl tracking-[4px] text-white transition-all mt-6 disabled:opacity-50"
        style={{ background: 'linear-gradient(135deg,var(--c1),var(--c3))' }}>
        {saving ? '…' : '✓ TERMINER LA SÉANCE'}
      </button>
    </div>
  )
}
