'use client'
// app/dashboard/import/page.tsx
import { useState } from 'react'
import { importFromJSON } from '@/lib/db'
import { Upload, CheckCircle, AlertCircle } from 'lucide-react'

export default function ImportPage() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [result, setResult] = useState<{ sessions: number; prs: number; journal: number } | null>(null)
  const [error, setError] = useState('')

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setStatus('loading')
    try {
      const text = await file.text()
      const data = JSON.parse(text)
      const res = await importFromJSON(data)
      setResult(res)
      setStatus('success')
    } catch (err: any) {
      setError(err.message || 'Erreur de lecture')
      setStatus('error')
    }
  }

  return (
    <div className="animate-fade-up max-w-sm mx-auto pt-8">
      <h1 className="font-barlow font-black text-3xl tracking-[1px] mb-2">Importer mes données</h1>
      <p className="text-sm mb-8" style={{ color: 'var(--t2)' }}>
        Tu utilises déjà APEX en version HTML ? Exporte ton fichier JSON depuis l'app, et importe-le ici pour retrouver toutes tes séances, PR et journal.
      </p>

      {status === 'idle' && (
        <label className="flex flex-col items-center gap-4 p-8 rounded-[15px] cursor-pointer transition-all"
               style={{ background: 'var(--bg3)', border: '2px dashed var(--bdr)' }}
               onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--c1)')}
               onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--bdr)')}>
          <Upload size={32} style={{ color: 'var(--c1)' }}/>
          <div className="text-center">
            <div className="font-semibold text-sm mb-1">Glisse ton fichier apex-*.json</div>
            <div className="text-xs" style={{ color: 'var(--t3)' }}>ou clique pour sélectionner</div>
          </div>
          <input type="file" accept=".json" className="hidden" onChange={handleFile}/>
        </label>
      )}

      {status === 'loading' && (
        <div className="text-center py-12">
          <div className="text-4xl mb-4 animate-spin">⚙️</div>
          <p style={{ color: 'var(--t2)' }}>Import en cours…</p>
        </div>
      )}

      {status === 'success' && result && (
        <div className="rounded-[15px] p-6" style={{ background: 'var(--bg3)', border: '1px solid rgba(0,232,122,.3)' }}>
          <CheckCircle size={32} className="mb-3" style={{ color: 'var(--c4)' }}/>
          <h2 className="font-barlow font-bold text-xl mb-4" style={{ color: 'var(--c4)' }}>Import réussi !</h2>
          {[
            { label: 'Séances importées', value: result.sessions },
            { label: 'Records importés',  value: result.prs },
            { label: 'Entrées journal',   value: result.journal },
          ].map(({ label, value }) => (
            <div key={label} className="flex justify-between py-2 border-b" style={{ borderColor: 'var(--bdr)' }}>
              <span className="text-sm" style={{ color: 'var(--t2)' }}>{label}</span>
              <span className="font-barlaw font-bold" style={{ fontFamily: 'var(--font-barlow)', color: 'var(--c4)' }}>{value}</span>
            </div>
          ))}
          <a href="/dashboard" className="block mt-6 text-center py-3 rounded-[12px] text-white font-bold"
             style={{ background: 'linear-gradient(135deg,var(--c1),var(--c3))' }}>
            Aller à mes séances →
          </a>
        </div>
      )}

      {status === 'error' && (
        <div className="rounded-[15px] p-6" style={{ background: 'var(--bg3)', border: '1px solid rgba(255,107,53,.3)' }}>
          <AlertCircle size={32} className="mb-3" style={{ color: 'var(--c2)' }}/>
          <h2 className="font-barlow font-bold text-xl mb-2" style={{ color: 'var(--c2)' }}>Erreur</h2>
          <p className="text-sm mb-4" style={{ color: 'var(--t2)' }}>{error}</p>
          <button onClick={() => setStatus('idle')} className="text-sm font-semibold" style={{ color: 'var(--c1)' }}>
            Réessayer
          </button>
        </div>
      )}
    </div>
  )
}
