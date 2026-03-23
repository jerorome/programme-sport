'use client'
// components/ui/BottomNav.tsx
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Zap, Clock, Heart, BarChart2, Flame } from 'lucide-react'

const NAV = [
  { href: '/dashboard',          label: 'Séance',    Icon: Zap },
  { href: '/dashboard/history',  label: 'Historique', Icon: Clock },
  { href: '/dashboard/journal',  label: 'Forme',     Icon: Heart },
  { href: '/dashboard/stats',    label: 'Stats',     Icon: BarChart2 },
  { href: '/dashboard/objectif', label: 'Objectif',  Icon: Flame },
]

export default function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex"
         style={{ background: 'rgba(12,14,19,.96)', backdropFilter: 'blur(20px)',
                  borderTop: '1px solid var(--bdr)',
                  paddingBottom: 'max(6px, env(safe-area-inset-bottom))' }}>
      {NAV.map(({ href, label, Icon }) => {
        const active = pathname === href || (href !== '/dashboard' && pathname.startsWith(href))
        return (
          <Link key={href} href={href}
                className="flex-1 flex flex-col items-center gap-1 py-2 px-1 transition-colors"
                style={{ color: active ? 'var(--c1)' : 'var(--t3)' }}>
            <Icon size={22} strokeWidth={1.8} />
            <span className="text-[9px] font-semibold tracking-[.5px] uppercase">{label}</span>
            {active && (
              <div className="w-1 h-1 rounded-full" style={{ background: 'var(--c1)' }}/>
            )}
          </Link>
        )
      })}
    </nav>
  )
}
