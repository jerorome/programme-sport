import { useState, useEffect, useCallback } from "react";
import { Lock, Unlock, LayoutDashboard, Cpu, Globe, Zap, Dumbbell, Bot, Server, HardDrive, Calendar, Mail, FileText, ExternalLink, ChevronRight, Shield, Activity, Clock, Sun, Moon, MessageCircle, TrendingUp, CheckCircle, AlertCircle, Settings, Plus, Search, Bell, User, Home, Bookmark, RefreshCw } from "lucide-react";

// ─── Auth Gate ───────────────────────────────────────────────────────────
const AUTH_PIN = "2026"; // À remplacer par un vrai système d'auth

function AuthGate({ onAuth }) {
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (pin === AUTH_PIN) {
      onAuth(true);
    } else {
      setError(true);
      setShake(true);
      setTimeout(() => setShake(false), 600);
      setPin("");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 flex items-center justify-center p-4">
      <div className={`bg-slate-800/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8 w-full max-w-sm shadow-2xl ${shake ? "animate-bounce" : ""}`}>
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mb-4 shadow-lg shadow-indigo-500/20">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-xl font-semibold text-white">Écosystème Jerome</h1>
          <p className="text-slate-400 text-sm mt-1">Accès sécurisé</p>
        </div>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            value={pin}
            onChange={(e) => { setPin(e.target.value); setError(false); }}
            placeholder="Code d'accès"
            className="w-full px-4 py-3 bg-slate-900/60 border border-slate-600/50 rounded-xl text-white placeholder-slate-500 text-center text-lg tracking-widest focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all"
            autoFocus
          />
          {error && <p className="text-red-400 text-xs text-center mt-2">Code incorrect</p>}
          <button type="submit" className="w-full mt-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl font-medium transition-all duration-200 shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30">
            Accéder
          </button>
        </form>
      </div>
    </div>
  );
}

// ─── Status Badge ────────────────────────────────────────────────────────
function StatusBadge({ status }) {
  const config = {
    live: { label: "En ligne", color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20", dot: "bg-emerald-400" },
    dev: { label: "En cours", color: "bg-amber-500/10 text-amber-400 border-amber-500/20", dot: "bg-amber-400" },
    planned: { label: "Planifié", color: "bg-blue-500/10 text-blue-400 border-blue-500/20", dot: "bg-blue-400" },
    idea: { label: "Idée", color: "bg-purple-500/10 text-purple-400 border-purple-500/20", dot: "bg-purple-400" },
  };
  const c = config[status] || config.idea;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${c.color}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot} animate-pulse`} />
      {c.label}
    </span>
  );
}

// ─── Project Card ────────────────────────────────────────────────────────
function ProjectCard({ icon: Icon, name, description, stack, url, status, color }) {
  return (
    <div className="group bg-slate-800/40 backdrop-blur border border-slate-700/40 rounded-xl p-5 hover:bg-slate-800/60 hover:border-slate-600/50 transition-all duration-300 hover:shadow-lg hover:shadow-slate-900/50">
      <div className="flex items-start justify-between mb-3">
        <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center shadow-lg`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        <StatusBadge status={status} />
      </div>
      <h3 className="text-white font-semibold text-base mb-1">{name}</h3>
      <p className="text-slate-400 text-sm leading-relaxed mb-3">{description}</p>
      <div className="flex flex-wrap gap-1.5 mb-3">
        {stack.map((t, i) => (
          <span key={i} className="px-2 py-0.5 bg-slate-700/50 text-slate-300 text-xs rounded-md">{t}</span>
        ))}
      </div>
      {url && (
        <a href={url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-indigo-400 hover:text-indigo-300 text-sm transition-colors">
          Visiter <ExternalLink className="w-3.5 h-3.5" />
        </a>
      )}
    </div>
  );
}

// ─── Stat Card ───────────────────────────────────────────────────────────
function StatCard({ icon: Icon, label, value, sub, color }) {
  return (
    <div className="bg-slate-800/40 backdrop-blur border border-slate-700/40 rounded-xl p-4">
      <div className="flex items-center gap-3">
        <div className={`w-9 h-9 rounded-lg ${color} flex items-center justify-center`}>
          <Icon className="w-4.5 h-4.5 text-white" />
        </div>
        <div>
          <p className="text-2xl font-bold text-white leading-none">{value}</p>
          <p className="text-slate-400 text-xs mt-0.5">{label}</p>
        </div>
      </div>
      {sub && <p className="text-slate-500 text-xs mt-2 pl-12">{sub}</p>}
    </div>
  );
}

// ─── Quick Action ────────────────────────────────────────────────────────
function QuickAction({ icon: Icon, label, onClick, color }) {
  return (
    <button onClick={onClick} className={`flex flex-col items-center gap-2 p-4 rounded-xl border border-slate-700/40 bg-slate-800/30 hover:bg-slate-800/60 hover:border-slate-600/50 transition-all duration-200 group`}>
      <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      <span className="text-slate-300 text-xs font-medium text-center">{label}</span>
    </button>
  );
}

// ─── Infrastructure Section ──────────────────────────────────────────────
function InfraCard({ icon: Icon, name, description, details, status, color }) {
  return (
    <div className="bg-slate-800/40 backdrop-blur border border-slate-700/40 rounded-xl p-5">
      <div className="flex items-start gap-4">
        <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center shadow-lg flex-shrink-0`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-white font-semibold">{name}</h3>
            <StatusBadge status={status} />
          </div>
          <p className="text-slate-400 text-sm mb-2">{description}</p>
          <div className="flex flex-wrap gap-1.5">
            {details.map((d, i) => (
              <span key={i} className="px-2 py-0.5 bg-slate-700/40 text-slate-400 text-xs rounded-md">{d}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── OpenClaw Preview ────────────────────────────────────────────────────
function OpenClawPreview() {
  const [messages] = useState([
    { from: "user", text: "Quels sont mes prochains rendez-vous ?" },
    { from: "bot", text: "Tu as 2 rendez-vous cette semaine : dentiste mardi à 10h et ADIL jeudi à 14h." },
    { from: "user", text: "Rappelle-moi de mettre à jour WattSavoir demain" },
    { from: "bot", text: "Rappel créé pour demain 9h : Mettre à jour WattSavoir ✓" },
  ]);

  return (
    <div className="bg-slate-800/40 backdrop-blur border border-slate-700/40 rounded-xl overflow-hidden">
      <div className="px-5 py-3 bg-gradient-to-r from-violet-600/20 to-purple-600/20 border-b border-slate-700/40 flex items-center gap-3">
        <Bot className="w-5 h-5 text-violet-400" />
        <span className="text-white font-semibold text-sm">OpenClaw</span>
        <span className="text-xs text-slate-400">— Assistant IA Personnel</span>
        <span className="ml-auto px-2 py-0.5 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-full text-xs">Bientôt</span>
      </div>
      <div className="p-4 space-y-3 max-h-64 overflow-y-auto">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-xs px-3 py-2 rounded-xl text-sm ${
              m.from === "user"
                ? "bg-indigo-600/30 text-indigo-100 rounded-br-sm"
                : "bg-slate-700/50 text-slate-200 rounded-bl-sm"
            }`}>
              {m.text}
            </div>
          </div>
        ))}
      </div>
      <div className="px-4 py-3 border-t border-slate-700/40 flex items-center gap-2">
        <input
          type="text"
          placeholder="Bientôt disponible..."
          disabled
          className="flex-1 px-3 py-2 bg-slate-900/40 border border-slate-700/40 rounded-lg text-sm text-slate-500 placeholder-slate-600"
        />
        <button disabled className="p-2 bg-violet-600/20 rounded-lg text-violet-400 opacity-50">
          <MessageCircle className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

// ─── Main Dashboard ──────────────────────────────────────────────────────
const projects = [
  {
    icon: Dumbbell, name: "APEX", status: "live", color: "bg-gradient-to-br from-emerald-500 to-teal-600",
    description: "App de musculation avec programmes personnalisés, suivi de progression et timer intégré.",
    stack: ["Next.js 15", "React 19", "Supabase", "Tailwind", "Vercel"],
    url: "https://programme-sport.vercel.app",
  },
  {
    icon: Bot, name: "OpenClaw", status: "dev", color: "bg-gradient-to-br from-violet-500 to-purple-600",
    description: "Agent IA personnel sur Telegram avec mémoire persistante et outils connectés.",
    stack: ["Python 3.11", "Claude API", "Telegram", "systemd"],
    url: null,
  },
  {
    icon: Globe, name: "jeromesuider.fr", status: "dev", color: "bg-gradient-to-br from-blue-500 to-cyan-600",
    description: "Site personnel & portfolio avec blog, projets et CMS headless.",
    stack: ["Next.js", "Sanity CMS", "Tailwind", "Vercel"],
    url: "https://jeromesuider.fr",
  },
  {
    icon: Zap, name: "WattSavoir", status: "live", color: "bg-gradient-to-br from-amber-500 to-orange-600",
    description: "FAQ énergie avec 9 outils interactifs : diagnostic, simulateurs, comparateur fournisseurs.",
    stack: ["Next.js 14", "Netlify", "Static Export"],
    url: "https://wattsavoir.fr",
  },
  {
    icon: Home, name: "calculer-mes-aides.fr", status: "live", color: "bg-gradient-to-br from-rose-500 to-pink-600",
    description: "Simulateur d'aides à la rénovation énergétique, lead gen pour Estimeco.",
    stack: ["WordPress 5.9", "Hestia", "Lead Gen"],
    url: "https://calculer-mes-aides.fr",
  },
  {
    icon: FileText, name: "Notion Hub", status: "live", color: "bg-gradient-to-br from-slate-500 to-gray-600",
    description: "Centre de commande : 14 pages + 1 base de données Projets & Services.",
    stack: ["Notion", "14 pages", "1 DB"],
    url: null,
  },
];

export default function Dashboard() {
  const [authed, setAuthed] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [time, setTime] = useState(new Date());
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 60000);
    return () => clearInterval(t);
  }, []);

  if (!authed) return <AuthGate onAuth={setAuthed} />;

  const greeting = time.getHours() < 12 ? "Bonjour" : time.getHours() < 18 ? "Bon après-midi" : "Bonsoir";
  const dateStr = time.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

  const tabs = [
    { id: "overview", label: "Vue d'ensemble", icon: LayoutDashboard },
    { id: "projects", label: "Projets", icon: Globe },
    { id: "infra", label: "Infrastructure", icon: Server },
    { id: "openclaw", label: "OpenClaw", icon: Bot },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white">
      {/* ─── Header ─── */}
      <header className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <Cpu className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-lg hidden sm:block">Écosystème</span>
          </div>

          <nav className="flex items-center gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? "bg-indigo-600/20 text-indigo-300"
                    : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-lg transition-colors">
              <Bell className="w-4 h-4" />
            </button>
            <button onClick={() => setAuthed(false)} className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-800/50 rounded-lg transition-colors" title="Déconnexion">
              <Lock className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* ─── Welcome ─── */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">
            {greeting}, Jerome
          </h1>
          <p className="text-slate-400 text-sm capitalize">{dateStr}</p>
        </div>

        {/* ─── Overview Tab ─── */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard icon={Globe} label="Projets actifs" value="6" sub="3 live · 2 en cours · 1 planifié" color="bg-gradient-to-br from-indigo-500 to-blue-600" />
              <StatCard icon={CheckCircle} label="Sites en ligne" value="3" sub="APEX · WattSavoir · calculer-mes-aides" color="bg-gradient-to-br from-emerald-500 to-teal-600" />
              <StatCard icon={Server} label="Serveurs" value="2" sub="La Tour + Raspberry Pi" color="bg-gradient-to-br from-amber-500 to-orange-600" />
              <StatCard icon={Shield} label="Backup 3-2-1" value="✓" sub="KDrive · Proton · Local" color="bg-gradient-to-br from-violet-500 to-purple-600" />
            </div>

            {/* Projects Grid */}
            <div>
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Globe className="w-5 h-5 text-indigo-400" />
                Projets
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {projects.map((p, i) => <ProjectCard key={i} {...p} />)}
              </div>
            </div>

            {/* Quick Actions */}
            <div>
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-amber-400" />
                Actions rapides
              </h2>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                <QuickAction icon={Bot} label="OpenClaw" color="bg-gradient-to-br from-violet-500 to-purple-600" onClick={() => setActiveTab("openclaw")} />
                <QuickAction icon={Calendar} label="Agenda" color="bg-gradient-to-br from-blue-500 to-cyan-600" onClick={() => window.open("https://calendar.google.com")} />
                <QuickAction icon={FileText} label="Notion" color="bg-gradient-to-br from-slate-500 to-gray-600" onClick={() => window.open("https://notion.so")} />
                <QuickAction icon={Mail} label="Email" color="bg-gradient-to-br from-indigo-500 to-blue-600" onClick={() => window.open("https://mail.proton.me")} />
                <QuickAction icon={HardDrive} label="KDrive" color="bg-gradient-to-br from-emerald-500 to-teal-600" onClick={() => window.open("https://kdrive.infomaniak.com")} />
                <QuickAction icon={Activity} label="Vercel" color="bg-gradient-to-br from-slate-600 to-gray-700" onClick={() => window.open("https://vercel.com/dashboard")} />
              </div>
            </div>
          </div>
        )}

        {/* ─── Projects Tab ─── */}
        {activeTab === "projects" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">Tous les projets</h2>
              <span className="text-sm text-slate-400">{projects.length} projets</span>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {projects.map((p, i) => <ProjectCard key={i} {...p} />)}
            </div>

            {/* Roadmap Ideas */}
            <div className="bg-slate-800/30 border border-slate-700/30 rounded-xl p-6">
              <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-indigo-400" />
                Prochaines étapes
              </h3>
              <div className="space-y-3">
                {[
                  { label: "Vidéo Pipeline YouTube/TikTok", status: "idea" },
                  { label: "Raspberry Pi + Yunohost (auto-hébergement)", status: "planned" },
                  { label: "Monétisation WattSavoir (affiliation)", status: "planned" },
                  { label: "Intégration OpenClaw dans ce dashboard", status: "dev" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b border-slate-700/30 last:border-0">
                    <span className="text-slate-300 text-sm">{item.label}</span>
                    <StatusBadge status={item.status} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ─── Infra Tab ─── */}
        {activeTab === "infra" && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-white">Infrastructure & Stockage</h2>
            <div className="space-y-4">
              <InfraCard
                icon={Cpu} name="La Tour" status="live" color="bg-gradient-to-br from-amber-500 to-orange-600"
                description="Desktop tower — serveur principal IA & automation, toujours allumé."
                details={["OpenClaw", "Python 3.11", "systemd", "Claude API"]}
              />
              <InfraCard
                icon={Server} name="Raspberry Pi" status="planned" color="bg-gradient-to-br from-rose-500 to-pink-600"
                description="Yunohost — auto-hébergement : fichiers, services web, NextCloud."
                details={["Yunohost", "Nextcloud", "Services web"]}
              />
              <InfraCard
                icon={HardDrive} name="Stockage 3-2-1" status="live" color="bg-gradient-to-br from-emerald-500 to-teal-600"
                description="Stratégie de backup : 3 copies, 2 supports, 1 offsite."
                details={["KDrive 3 To", "Proton Drive E2E", "Local"]}
              />
            </div>

            {/* Hébergement web */}
            <div className="bg-slate-800/30 border border-slate-700/30 rounded-xl p-6">
              <h3 className="text-white font-semibold mb-4">Hébergement web</h3>
              <div className="space-y-3 text-sm">
                {[
                  { site: "APEX", host: "Vercel", domain: "programme-sport.vercel.app" },
                  { site: "jeromesuider.fr", host: "Vercel + OVH", domain: "jeromesuider.fr" },
                  { site: "WattSavoir", host: "Netlify", domain: "wattsavoir.fr" },
                  { site: "calculer-mes-aides.fr", host: "WordPress", domain: "calculer-mes-aides.fr" },
                ].map((h, i) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b border-slate-700/30 last:border-0">
                    <span className="text-white font-medium">{h.site}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-slate-400">{h.host}</span>
                      <span className="text-indigo-400">{h.domain}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ─── OpenClaw Tab ─── */}
        {activeTab === "openclaw" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <Bot className="w-5 h-5 text-violet-400" />
                OpenClaw — Assistant IA
              </h2>
              <StatusBadge status="dev" />
            </div>

            <OpenClawPreview />

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="bg-slate-800/40 border border-slate-700/40 rounded-xl p-5">
                <h3 className="text-white font-semibold mb-3">Architecture</h3>
                <ul className="space-y-2 text-sm text-slate-400">
                  <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" /> Bot Telegram comme interface</li>
                  <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" /> Mémoire persistante (SOUL.md)</li>
                  <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" /> Service systemd 24/7</li>
                  <li className="flex items-center gap-2"><Clock className="w-4 h-4 text-amber-400 flex-shrink-0" /> Intégrations (Calendar, Notion...)</li>
                </ul>
              </div>
              <div className="bg-slate-800/40 border border-slate-700/40 rounded-xl p-5">
                <h3 className="text-white font-semibold mb-3">Connexions prévues</h3>
                <div className="flex flex-wrap gap-2">
                  {["Nextcloud", "Google Calendar", "Notion", "FreshRSS", "Email IMAP", "Vikunja", "YouTube API", "TikTok API"].map((tool, i) => (
                    <span key={i} className="px-2.5 py-1 bg-violet-600/10 text-violet-300 border border-violet-500/20 rounded-lg text-xs">{tool}</span>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-slate-800/30 border border-slate-700/30 rounded-xl p-5">
              <h3 className="text-white font-semibold mb-2">Coût estimé</h3>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-emerald-400">~5€</p>
                  <p className="text-slate-400 text-xs">Haiku (min)</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-amber-400">~8€</p>
                  <p className="text-slate-400 text-xs">Mix (recommandé)</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-rose-400">~15€</p>
                  <p className="text-slate-400 text-xs">Sonnet (max)</p>
                </div>
              </div>
              <p className="text-slate-500 text-xs mt-3 text-center">par mois · hébergé sur La Tour</p>
            </div>
          </div>
        )}
      </main>

      {/* ─── Footer ─── */}
      <footer className="border-t border-slate-800/50 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-sm">Écosystème Jerome · Souveraineté numérique</p>
          <div className="flex items-center gap-4 text-xs text-slate-600">
            <span>jeromesuider.fr</span>
            <span>·</span>
            <span>wattsavoir.fr</span>
            <span>·</span>
            <span>calculer-mes-aides.fr</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
