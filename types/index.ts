// types/index.ts

export interface Profile {
  id: string
  name: string | null
  uid: string
  morpho: string
  level: string
  created_at: string
}

export interface Session {
  id: string
  user_id: string
  day_idx: 0 | 1 | 2 | 3
  day_name: string
  date: string
  started_at: string | null
  duration: string | null
  mood: string | null
  volume_kg: number
  sets_done: number
  sets_data: Record<number, SetEntry[]>
  notes_data: Record<number, string>
  cardio: CardioData
  color: string
  created_at: string
}

export interface SetEntry {
  w: number | string
  r: number | string
  rpe: number | string
  done: boolean
  prefilled?: boolean
  _edited?: boolean
}

export interface CardioData {
  type?: string
  dur?: string
  int?: string
  cal?: string
  note?: string
}

export interface PersonalRecord {
  id: string
  user_id: string
  exercise: string
  weight_kg: number
  reps: number
  date: string
  created_at: string
}

export interface JournalEntry {
  id: string
  user_id: string
  date: string
  energy: number | null
  motiv: number | null
  stress: number | null
  note: string | null
  created_at: string
}

export interface WeightLog {
  id: string
  user_id: string
  date: string
  weight_kg: number
  created_at: string
}

export interface Objectif {
  id: string
  user_id: string
  start_weight: number | null
  target_weight: number | null
  target_date: string
  age: number | null
  created_at: string
}

// Day definition
export interface Day {
  name: string
  focus: string
  label: string
  clr: string
  grad: string
  muscles: string[]
  exercises: Exercise[]
}

export interface Exercise {
  name: string
  ill: string
  cat: string
  sets: number
  reps: string
  tip: string
  tall: string
  isRecap?: boolean
  recapZone?: string
}
