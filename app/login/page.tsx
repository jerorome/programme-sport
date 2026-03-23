'use client'
// app/login/page.tsx
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const supabase = createClient()

  async function loginWithGoogle() {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    })
  }

  async function loginWithMagicLink(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const email = (e.currentTarget.elements.namedItem('email') as HTMLInputElement).value
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${location.origin}/auth/callback` },
    })
    if (!error) alert('Vérifie tes emails — lien envoyé !')
  }

  return (
    <div className="min-h-dvh flex flex-col items-center justify-center p-6"
         style={{ background: 'var(--bg)' }}>

      {/* Ambient orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute w-96 h-96 rounded-full -top-32 -left-24 opacity-5 blur-[90px]"
             style={{ background: 'var(--c1)', animation: 'float 20s ease-in-out infinite alternate' }}/>
        <div className="absolute w-72 h-72 rounded-full bottom-16 -right-16 opacity-5 blur-[90px]"
             style={{ background: 'var(--c2)', animation: 'float 26s ease-in-out infinite alternate' }}/>
      </div>

      <div className="relative z-10 w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="font-barlow font-black text-5xl tracking-[6px] mb-2"
               style={{ background: 'linear-gradient(110deg,var(--c1),var(--c3))',
                        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            APEX
          </div>
          <div className="text-xs font-semibold tracking-[3px] uppercase"
               style={{ color: 'var(--t3)' }}>
            V-Taper Program
          </div>
          <p className="text-sm mt-4" style={{ color: 'var(--t2)' }}>
            Connecte-toi pour accéder à ton programme
          </p>
        </div>

        {/* Google */}
        <button
          onClick={loginWithGoogle}
          className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl font-semibold text-sm transition-all mb-4"
          style={{ background: 'var(--bg3)', border: '1.5px solid var(--bdr)' }}
          onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--c1)')}
          onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--bdr)')}>
          <svg width="18" height="18" viewBox="0 0 48 48">
            <path fill="#FFC107" d="M43.6 20H24v8h11.3C33.7 33.5 29.4 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 7.9 3l5.7-5.7C33.8 6.1 29.1 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20c11 0 19.7-8 19.7-20 0-1.3-.1-2.7-.1-4z"/>
            <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 16 19 13 24 13c3 0 5.8 1.1 7.9 3l5.7-5.7C33.8 6.1 29.1 4 24 4c-7.7 0-14.3 4.4-17.7 10.7z"/>
            <path fill="#4CAF50" d="M24 44c5 0 9.6-1.8 13.1-4.8l-6.1-5.1C29 35.4 26.6 36 24 36c-5.3 0-9.7-3.5-11.3-8.2l-6.5 5C9.7 39.5 16.3 44 24 44z"/>
            <path fill="#1976D2" d="M43.6 20H24v8h11.3c-.7 2.1-2.1 3.9-3.9 5.1l6.1 5.1C41.5 34.8 44 29.8 44 24c0-1.3-.1-2.7-.4-4z"/>
          </svg>
          Continuer avec Google
        </button>

        {/* Divider */}
        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1 h-px" style={{ background: 'var(--bdr)' }}/>
          <span className="text-xs" style={{ color: 'var(--t3)' }}>ou par email</span>
          <div className="flex-1 h-px" style={{ background: 'var(--bdr)' }}/>
        </div>

        {/* Magic link */}
        <form onSubmit={loginWithMagicLink} className="space-y-3">
          <input
            name="email"
            type="email"
            placeholder="ton@email.com"
            required
            className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
            style={{ background: 'var(--bg4)', border: '1.5px solid var(--bdr)', color: 'var(--txt)' }}
            onFocus={e => (e.currentTarget.style.borderColor = 'var(--c1)')}
            onBlur={e => (e.currentTarget.style.borderColor = 'var(--bdr)')}
          />
          <button
            type="submit"
            className="w-full py-3 rounded-xl text-sm font-bold transition-all"
            style={{ background: 'linear-gradient(135deg,var(--c1),var(--c3))', color: '#fff' }}>
            Envoyer un lien magique
          </button>
        </form>

        <p className="text-center text-xs mt-6" style={{ color: 'var(--t3)' }}>
          Tes données sont privées et sécurisées.<br/>
          Aucune carte bancaire requise.
        </p>
      </div>
    </div>
  )
}
