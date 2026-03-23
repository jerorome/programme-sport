// app/dashboard/layout.tsx
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import BottomNav from '@/components/ui/BottomNav'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  return (
    <div className="min-h-dvh" style={{ background: 'var(--bg)' }}>
      {/* Ambient orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute w-[480px] h-[480px] rounded-full -top-36 -left-28 opacity-[0.05] blur-[90px]"
             style={{ background: 'var(--c1)', animation: 'float 20s ease-in-out infinite alternate' }}/>
        <div className="absolute w-[360px] h-[360px] rounded-full bottom-16 -right-24 opacity-[0.05] blur-[90px]"
             style={{ background: 'var(--c2)', animation: 'float 26s ease-in-out infinite alternate' }}/>
        <div className="absolute w-[280px] h-[280px] rounded-full top-[45%] left-[35%] opacity-[0.05] blur-[90px]"
             style={{ background: 'var(--c3)', animation: 'float 18s ease-in-out infinite alternate' }}/>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 flex items-center justify-between px-4 h-14"
              style={{ background: 'rgba(12,14,19,.92)', backdropFilter: 'blur(24px)',
                       borderBottom: '1px solid var(--bdr)' }}>
        <div className="flex items-baseline gap-2">
          <span className="font-barlow font-black text-[28px] tracking-[4px]"
                style={{ background: 'linear-gradient(110deg,var(--c1),var(--c3))',
                         WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            APEX
          </span>
          <span className="text-[9px] font-semibold tracking-[2px] uppercase pb-1"
                style={{ color: 'var(--t3)' }}>V-Taper</span>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold"
             style={{ background: 'rgba(255,107,53,.1)', border: '1px solid rgba(255,107,53,.25)',
                      color: 'var(--c2)' }}>
          🔥 <span id="streakCount">0</span>
        </div>
      </header>

      {/* Main content */}
      <main className="relative z-10 pb-28 max-w-[700px] mx-auto px-3.5 pt-4">
        {children}
      </main>

      {/* Bottom nav */}
      <BottomNav />
    </div>
  )
}
