// lib/db.ts
// Toutes les fonctions d'accès aux données Supabase
// Utilisées depuis les composants client via hooks

import { createClient } from './supabase/client'
import type { Session, PersonalRecord, JournalEntry, WeightLog, Objectif } from '@/types'

// ── SESSIONS ──────────────────────────────────────────────────────

export async function getSessions(limit = 50) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('sessions')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit)
  if (error) throw error
  return data as Session[]
}

export async function createSession(session: Omit<Session, 'id' | 'user_id' | 'created_at'>) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { data, error } = await supabase
    .from('sessions')
    .insert({ ...session, user_id: user.id })
    .select()
    .single()
  if (error) throw error
  return data as Session
}

export async function getLastSessionByDay(dayIdx: number) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('sessions')
    .select('sets_data')
    .eq('day_idx', dayIdx)
    .order('created_at', { ascending: false })
    .limit(1)
    .single()
  if (error) return null
  return data?.sets_data || null
}

// ── PERSONAL RECORDS ──────────────────────────────────────────────

export async function getPRs() {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('personal_records')
    .select('*')
    .order('weight_kg', { ascending: false })
  if (error) throw error
  return data as PersonalRecord[]
}

export async function upsertPR(exercise: string, weightKg: number, reps: number, date: string) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { data, error } = await supabase
    .from('personal_records')
    .upsert(
      { user_id: user.id, exercise, weight_kg: weightKg, reps, date },
      { onConflict: 'user_id,exercise' }
    )
    .select()
    .single()
  if (error) throw error
  return data as PersonalRecord
}

// ── JOURNAL ───────────────────────────────────────────────────────

export async function getJournalEntries(limit = 30) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('journal_entries')
    .select('*')
    .order('date', { ascending: false })
    .limit(limit)
  if (error) throw error
  return data as JournalEntry[]
}

export async function upsertJournalEntry(entry: {
  date: string
  energy: number | null
  motiv: number | null
  stress: number | null
  note: string | null
}) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { data, error } = await supabase
    .from('journal_entries')
    .upsert(
      { ...entry, user_id: user.id },
      { onConflict: 'user_id,date' }
    )
    .select()
    .single()
  if (error) throw error
  return data as JournalEntry
}

// ── WEIGHT LOGS ───────────────────────────────────────────────────

export async function getWeightLogs() {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('weight_logs')
    .select('*')
    .order('date', { ascending: true })
  if (error) throw error
  return data as WeightLog[]
}

export async function upsertWeightLog(date: string, weightKg: number) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { data, error } = await supabase
    .from('weight_logs')
    .upsert(
      { user_id: user.id, date, weight_kg: weightKg },
      { onConflict: 'user_id,date' }
    )
    .select()
    .single()
  if (error) throw error
  return data as WeightLog
}

// ── OBJECTIF ──────────────────────────────────────────────────────

export async function getObjectif() {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('objectifs')
    .select('*')
    .single()
  if (error) return null
  return data as Objectif
}

export async function upsertObjectif(objectif: Partial<Objectif>) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { data, error } = await supabase
    .from('objectifs')
    .upsert(
      { ...objectif, user_id: user.id },
      { onConflict: 'user_id' }
    )
    .select()
    .single()
  if (error) throw error
  return data as Objectif
}

// ── IMPORT depuis JSON (migration depuis HTML) ─────────────────────

export async function importFromJSON(jsonData: {
  history?: any[]
  prs?: Record<string, any>
  journal?: any[]
  obj?: any
}) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const results = { sessions: 0, prs: 0, journal: 0 }

  // Import sessions
  if (jsonData.history?.length) {
    const sessions = jsonData.history.map((h: any) => ({
      user_id: user.id,
      day_idx: h.dayIdx,
      day_name: h.dname,
      date: h.date,
      started_at: h.ts ? new Date(h.ts).toISOString() : null,
      duration: h.duration,
      mood: h.mood,
      volume_kg: h.vol || 0,
      sets_done: h.done || 0,
      sets_data: h.sets || {},
      notes_data: h.notes || {},
      cardio: h.cardio || {},
      color: h.clr || '#00d4ff',
    }))
    const { error } = await supabase.from('sessions').upsert(sessions)
    if (!error) results.sessions = sessions.length
  }

  // Import PRs
  if (jsonData.prs && Object.keys(jsonData.prs).length) {
    const prs = Object.entries(jsonData.prs).map(([exercise, pr]: [string, any]) => ({
      user_id: user.id,
      exercise,
      weight_kg: pr.w,
      reps: pr.r,
      date: pr.date,
    }))
    const { error } = await supabase
      .from('personal_records')
      .upsert(prs, { onConflict: 'user_id,exercise' })
    if (!error) results.prs = prs.length
  }

  // Import journal
  if (jsonData.journal?.length) {
    const entries = jsonData.journal.map((j: any) => ({
      user_id: user.id,
      date: j.date,
      energy: j.energy || null,
      motiv: j.motiv || null,
      stress: j.stress || null,
      note: j.note || null,
    }))
    const { error } = await supabase
      .from('journal_entries')
      .upsert(entries, { onConflict: 'user_id,date' })
    if (!error) results.journal = entries.length
  }

  return results
}
