'use client'
// app/dashboard/page.tsx
import { Suspense } from 'react'
import WorkoutSession from '@/components/workout/WorkoutSession'

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="text-center py-20" style={{ color: 'var(--t3)' }}>Chargement…</div>}>
      <WorkoutSession />
    </Suspense>
  )
}
