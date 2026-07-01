import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Activity, BarChart3, CalendarDays, Dumbbell, HeartHandshake, Home, Landmark, LineChart, NotebookPen, ShieldCheck, Sparkles, Target, Trophy, WalletCards, BriefcaseBusiness, Brain, Flame, Moon, Utensils, CircleDollarSign, Users, House } from 'lucide-react';
import './styles.css';

const STORAGE_KEY = 'life-journey-v5';

const todayISO = () => {

  const now = new Date();

  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;

};
const clamp = (n, min = 0, max = 100) => Math.min(max, Math.max(min, n));

const initialState = {
  profile: {
    chapter: 'Rebuild Year — 2026',
    mission: 'Rebuild Myself → Finish CPA → Return to Work → Pay Debt → Create a Family Home',
    debtTotal: 170000,
    debtPaid: 0,
    personalDebt: 116600,
    creditCardDebt: 41100,
    studentLoanDebt: 11600,
    cashOnHand: 0,
    cashAuntieAda: 550,
    cashAdrian: 8680,
    monthlyBurn: {
      rent: 900,
      food: 200,
      gas: 100,
      phone: 35,
      insurance: 50,
      gym: 25,
      minimumPayments: 200,
      miscellaneous: 100,
    },
    targetCPA: '2026-12-31',
    targetCareer: '2026-12-31',
  },
  base: {
    cpa: 0,
    career: 18,
    debt: 0,
    familyHome: 2,
    mentalStrength: 30,
    stressResilience: 28,
    selfWorth: 24,
    baselineStability: 30,
    sleepStability: 22,
    fitness: 12,
    gamblingRegulation: 38,
    environment: 45,
    familySupport: 20,
    financeStability: 25,
  },
  milestones: {
    cpaISC: true,
    cpaAUD: false,
    cpaREG: false,
    cpaFAR: false,
    resumeUpdated: false,
    profileUpdated: false,
    tenApplications: false,
    firstInterview: false,
    firstOffer: false,
    stableIncome: false,
    emergencyFundStarted: false,
    creditRebuildStarted: false,
  },
  logs: [],
};

const actionDefs = [
  { key: 'cpa30', label: 'CPA study 30+ min', icon: NotebookPen, affects: { cpa: 0.12, baselineStability: 0.03 } },
  { key: 'cpa2h', label: 'CPA study 2+ hours', icon: Trophy, affects: { cpa: 0.35, baselineStability: 0.06, selfWorth: 0.04 } },
  { key: 'careerTask', label: 'Career task / application / resume', icon: BriefcaseBusiness, affects: { career: 0.55, financeStability: 0.08, selfWorth: 0.06 } },
  { key: 'workout', label: 'Workout / gym', icon: Dumbbell, affects: { fitness: 0.55, stressResilience: 0.12, baselineStability: 0.06, mentalStrength: 0.05 } },
  { key: 'walk', label: 'Walk / mobility / stretch', icon: Activity, affects: { fitness: 0.22, stressResilience: 0.08, sleepStability: 0.04 } },
  { key: 'cooked', label: 'Cooked / ate real meal', icon: Utensils, affects: { baselineStability: 0.12, financeStability: 0.08, fitness: 0.06 } },
  { key: 'sleptOkay', label: 'Slept okay', icon: Moon, affects: { sleepStability: 0.22, baselineStability: 0.11, stressResilience: 0.08 } },
  { key: 'mentalWork', label: 'Therapy / journaling / emotional work', icon: Brain, affects: { mentalStrength: 0.2, selfWorth: 0.16, stressResilience: 0.12 } },
  { key: 'moneyManaged', label: 'Managed money / runway check', icon: WalletCards, affects: { financeStability: 0.18, debt: 0.05, stressResilience: 0.05 } },
  { key: 'familyConnect', label: 'Connected with family', icon: HeartHandshake, affects: { familySupport: 0.22, selfWorth: 0.05, mentalStrength: 0.05 } },
  { key: 'cleanRoom', label: 'Cleaned / improved room', icon: Home, affects: { environment: 0.2, baselineStability: 0.08 } },
  { key: 'avoidedGambling', label: 'Avoided gambling / no chasing', icon: ShieldCheck, affects: { gamblingRegulation: 0.32, stressResilience: 0.1, financeStability: 0.08 } },
  { key: 'takeout', label: 'Ordered takeout', icon: CircleDollarSign, affects: { financeStability: -0.08, baselineStability: -0.02 } },
  { key: 'gambled', label: 'Gambled / poker / slots', icon: Flame, affects: { gamblingRegulation: -0.55, stressResilience: -0.18, financeStability: -0.2, baselineStability: -0.08 } },
  { key: 'overwhelmed', label: 'Felt overwhelmed', icon: Brain, affects: { stressResilience: -0.16, baselineStability: -0.08, mentalStrength: -0.06 } },
];

const milestoneDefs = {
  cpaISC: { label: 'ISC passed', group: 'CPA', affects: { cpa: 25 } },
  cpaAUD: { label: 'AUD passed', group: 'CPA', affects: { cpa: 25 } },
  cpaREG: { label: 'REG passed', group: 'CPA', affects: { cpa: 25 } },
  cpaFAR: { label: 'FAR passed', group: 'CPA', affects: { cpa: 25 } },
  resumeUpdated: { label: 'Resume updated', group: 'Career', affects: { career: 10 } },
  profileUpdated: { label: 'LinkedIn / profile updated', group: 'Career', affects: { career: 7 } },
  tenApplications: { label: 'First 10 applications', group: 'Career', affects: { career: 15 } },
  firstInterview: { label: 'First interview', group: 'Career', affects: { career: 15 } },
  firstOffer: { label: 'First offer', group: 'Career', affects: { career: 20 } },
  stableIncome: { label: 'Stable income', group: 'Career', affects: { career: 25, financeStability: 25 } },
  emergencyFundStarted: { label: 'Emergency fund started', group: 'Future Security', affects: { financeStability: 10, familyHome: 5 } },
  creditRebuildStarted: { label: 'Credit rebuild started', group: 'Future Security', affects: { familyHome: 5, financeStability: 5 } },
};

const statLabels = {
  cpa: ['CPA Completion', 'Finish all CPA exams by Dec 2026', NotebookPen],
  career: ['Career Reintegration', 'Return to work within 6 months', BriefcaseBusiness],
  debt: ['Debt Freedom', 'Personal + credit card + student loan debt', Landmark],
  familyHome: ['Family Home', 'Create a stable home for family', House],
  mentalStrength: ['Mental Strength', 'Grounded identity and emotional regulation', Brain],
  stressResilience: ['Stress Resilience', 'Avoid collapse under pressure', Flame],
  selfWorth: ['Self-Worth', 'Value beyond achievement and productivity', Sparkles],
  baselineStability: ['Baseline Stability', 'Sleep, food, routine, functioning', Activity],
  sleepStability: ['Sleep Stability', 'Recovery and regular rhythm', Moon],
  fitness: ['Fitness Evolution', 'From barely moving to strong physique', Dumbbell],
  gamblingRegulation: ['Gambling Regulation', 'No chasing, no volatility rescue', ShieldCheck],
  environment: ['Environment Stability', 'Room supports study and rest', Home],
  familySupport: ['Family Support', 'Stay connected and build capacity to help', Users],
  financeStability: ['Financial Stability', 'Runway, spending control, stable cashflow', WalletCards],
};

function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? { ...initialState, ...JSON.parse(saved) } : initialState;
  } catch { return initialState; }
}
function saveState(state) { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }

function calculateStats(state) {
  const stats = { ...state.base };
  Object.entries(state.milestones).forEach(([key, done]) => {
    if (!done) return;
    const def = milestoneDefs[key];
    Object.entries(def.affects).forEach(([stat, val]) => { stats[stat] = (stats[stat] || 0) + val; });
  });
  state.logs.filter(log => log.completed).forEach(log => {
    Object.entries(log.actions || {}).forEach(([key, checked]) => {
      if (!checked) return;
      const def = actionDefs.find(a => a.key === key);
      if (!def) return;
      Object.entries(def.affects).forEach(([stat, val]) => { stats[stat] = (stats[stat] || 0) + val; });
    });
    if (log.stress >= 8) stats.stressResilience -= 0.12;
    if (log.urge >= 8) stats.gamblingRegulation -= 0.12;
    if (log.energy === 'High') stats.baselineStability += 0.04;
    if (log.mood === 'Good') stats.mentalStrength += 0.04;
  });
  const debtProgress = state.profile.debtTotal ? (state.profile.debtPaid / state.profile.debtTotal) * 100 : 0;
  stats.debt = Math.max(stats.debt, debtProgress);
  Object.keys(stats).forEach(k => { stats[k] = clamp(Number(stats[k].toFixed(1))); });
  return stats;
}

function Progress({ value, label, sub, icon: Icon = Target, danger=false }) {
  return <div className="progress-card">
    <div className="progress-top"><div className="progress-title"><Icon size={18}/><span>{label}</span></div><strong>{Math.round(value)}%</strong></div>
    <div className="bar"><div className={danger ? 'fill danger' : 'fill'} style={{ width: `${clamp(value)}%` }} /></div>
    {sub && <p>{sub}</p>}
  </div>
}

function App() {
  const [state, setState] = useState(loadState);
  const [tab, setTab] = useState('home');
  const [dailySummary, setDailySummary] = useState(null);
  const stats = useMemo(() => calculateStats(state), [state]);
  const recent = state.logs.filter(log => log.completed).slice(-7);

  const update = (next) => { setState(next); saveState(next); };
  const upsertLog = (patch) => {
    const date = todayISO();
    const logs = [...state.logs];
    const idx = logs.findIndex(l => l.date === date);
    const base = idx >= 0 ? logs[idx] : { date, actions: {}, energy: 'Medium', mood: 'Okay', stress: 5, urge: 3, note: '' };
    const editingAfterComplete = base.completed && !patch.completed;
    const nextLog = { ...base, ...patch, completed: editingAfterComplete ? false : (patch.completed ?? base.completed), actions: { ...base.actions, ...(patch.actions || {}) } };
    if (idx >= 0) logs[idx] = nextLog; else logs.push(nextLog);
    update({ ...state, logs });
  };
  const completeDay = () => {
    const date = todayISO();
    const current = state.logs.find(l => l.date === date) || { date, actions: {}, energy: 'Medium', mood: 'Okay', stress: 5, urge: 3, note: '' };
    const checked = actionDefs.filter(a => current.actions?.[a.key]);
    const positive = {};
    const negative = {};
    checked.forEach(a => {
      Object.entries(a.affects).forEach(([stat, val]) => {
        if (val >= 0) positive[stat] = (positive[stat] || 0) + val;
        else negative[stat] = (negative[stat] || 0) + val;
      });
    });
    const topPositive = Object.entries(positive).sort((a,b)=>b[1]-a[1]).slice(0,3).map(([k,v]) => `${statLabels[k]?.[0] || k} +${v.toFixed(1)}%`);
    const topNegative = Object.entries(negative).sort((a,b)=>a[1]-b[1]).slice(0,2).map(([k,v]) => `${statLabels[k]?.[0] || k} ${v.toFixed(1)}%`);
    const takeaway = current.stress >= 8
      ? 'High-stress day. The win is reducing damage and protecting sleep.'
      : checked.some(a => a.key === 'cpa2h')
        ? 'Good CPA foundation day. Keep the rhythm steady.'
        : checked.length >= 4
          ? 'Solid rebuild day. Multiple systems moved forward.'
          : 'Light day logged. Visibility still counts.';
    upsertLog({ completed: true, completedAt: new Date().toISOString() });
    setDailySummary({ date, topPositive, topNegative, takeaway, count: checked.length });
  };
  const today = state.logs.find(l => l.date === todayISO()) || { actions: {}, energy: 'Medium', mood: 'Okay', stress: 5, urge: 3, note: '' };

  return <div className="app">
    <aside className="sidebar">
      <div className="brand"><div className="orb">LJ</div><div><h1>Life Journey</h1><span>Rebuild • CPA • Family Home</span></div></div>
      <nav>{[
        ['home','Home',Home],['today','Today',CalendarDays],['goals','Goals',Target],['self','Self-Rebuild',Sparkles],['insights','Insights',LineChart]
      ].map(([id,label,Icon]) => <button key={id} onClick={() => setTab(id)} className={tab===id?'active':''}><Icon size={18}/>{label}</button>)}</nav>
      <div className="side-note"><strong>Current focus</strong><span>CPA + work re-entry while protecting well-being.</span></div>
    </aside>
    <main className="main">
      {tab === 'home' && <HomeScreen state={state} stats={stats} />}
      {tab === 'today' && <TodayScreen today={today} upsertLog={upsertLog} completeDay={completeDay} dailySummary={dailySummary} setDailySummary={setDailySummary} />}
      {tab === 'goals' && <GoalsScreen state={state} update={update} stats={stats} />}
      {tab === 'self' && <SelfScreen stats={stats} />}
      {tab === 'insights' && <InsightsScreen state={state} stats={stats} recent={recent} />}
    </main>
  </div>
}

function totalCash(profile) { return (profile.cashOnHand || 0) + (profile.cashAuntieAda || 0) + (profile.cashAdrian || 0); }
function totalBurn(profile) { return Object.values(profile.monthlyBurn || {}).reduce((sum, v) => sum + Number(v || 0), 0); }
function runwayMonths(profile) { const burn = totalBurn(profile); return burn ? totalCash(profile) / burn : 0; }
function runwayEndDate(profile) {
  const months = runwayMonths(profile);
  if (!Number.isFinite(months) || months <= 0) return '—';
  const d = new Date();
  d.setDate(d.getDate() + Math.round(months * 30.44));
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}
function money(n) { return `$${Number(n || 0).toLocaleString()}`; }

function HomeScreen({ state, stats }) {
  const cash = totalCash(state.profile);
  const burn = totalBurn(state.profile);
  const runway = runwayMonths(state.profile);
  return <section>
    <div className="hero">
      <div><p className="eyebrow">{state.profile.chapter}</p><h2>Build Stability → Protect Family → Create Home</h2><p>{state.profile.mission}</p></div>
      <div className="hero-card"><span>Main Mission</span><strong>Finish CPA in 2026</strong><small>First milestone: 1/4 complete</small></div>
    </div>
    <div className="grid three">
      <div className="panel runway-card"><h3>Runway Command</h3><div className="runway-number">{runway.toFixed(1)}<span>months</span></div><p>{money(cash)} accessible cash ÷ {money(burn)} monthly burn</p><p className="runway-date">Estimated through: <strong>{runwayEndDate(state.profile)}</strong></p><div className="cash-mini"><span>Hand {money(state.profile.cashOnHand)}</span><span>Ada {money(state.profile.cashAuntieAda)}</span><span>Adrian {money(state.profile.cashAdrian)}</span></div></div>
      <div className="panel"><h3>Professional Recovery</h3><Progress value={stats.cpa} label="CPA Completion" sub="Target: Dec 2026" icon={NotebookPen}/><Progress value={stats.career} label="Career Reintegration" sub="Target: within 6 months" icon={BriefcaseBusiness}/></div>
      <div className="panel"><h3>Self Rebuild</h3><Progress value={stats.fitness} label="Fitness Evolution" sub="From low movement to strong physique" icon={Dumbbell}/><Progress value={stats.stressResilience} label="Stress Resilience" sub="Avoid future collapse" icon={Flame}/></div>
      <div className="panel"><h3>Future Security</h3><Progress value={stats.debt} label="Debt Freedom" sub="Priority: stabilize CC debt first" icon={Landmark}/><Progress value={stats.familyHome} label="Family Home" sub="Ultimate mission" icon={House}/></div>
    </div>
    <div className="timeline panel"><h3>Life Horizon</h3><div className="road"><span>2026<br/>CPA + Work</span><span>2027<br/>Stable Income</span><span>2028–2031<br/>Debt War</span><span>2031+<br/>Family Home</span></div></div>
  </section>
}

function TodayScreen({ today, upsertLog, completeDay, dailySummary, setDailySummary }) {
  const selectedCount = Object.values(today.actions || {}).filter(Boolean).length;
  return <section><Header title="Today Log" text="Auto-saves as a draft. Press Complete Day when you are ready to finalize progress." />
    <div className="draft-status"><span>{today.completed ? 'Completed Today' : 'Draft Saved'}</span><strong>{selectedCount} actions selected</strong></div>
    <div className="action-grid">{actionDefs.map(({key,label,icon:Icon}) => <button key={key} className={today.actions[key] ? 'action checked' : 'action'} onClick={() => upsertLog({ actions: { [key]: !today.actions[key] } })}><Icon size={18}/><span>{label}</span></button>)}</div>
    <div className="panel checkin"><h3>Quick State</h3><div className="row"><label>Energy</label><select value={today.energy} onChange={e=>upsertLog({energy:e.target.value})}><option>Low</option><option>Medium</option><option>High</option></select></div><div className="row"><label>Mood</label><select value={today.mood} onChange={e=>upsertLog({mood:e.target.value})}><option>Bad</option><option>Okay</option><option>Good</option></select></div><Slider label="Stress" value={today.stress} onChange={v=>upsertLog({stress:v})}/><Slider label="Gambling Urge" value={today.urge} onChange={v=>upsertLog({urge:v})}/><textarea placeholder="Short note..." value={today.note || ''} onChange={e=>upsertLog({note:e.target.value})}/>
      <button className="complete-btn" onClick={completeDay}>{today.completed ? 'Update Completed Day' : 'Complete Day'}</button>
      <p className="hint">Draft changes do not affect progress until the day is completed.</p>
    </div>
    {dailySummary && <div className="summary-modal"><div className="summary-card"><button className="summary-close" onClick={()=>setDailySummary(null)}>×</button><p className="eyebrow">Day Complete</p><h3>{dailySummary.count} Actions Logged</h3><p>{dailySummary.takeaway}</p>{dailySummary.topPositive.length > 0 && <><h4>Progress Added</h4><ul>{dailySummary.topPositive.map((x,i)=><li key={i}>{x}</li>)}</ul></>}{dailySummary.topNegative.length > 0 && <><h4>Watch Items</h4><ul>{dailySummary.topNegative.map((x,i)=><li key={i}>{x}</li>)}</ul></>}</div></div>}
  </section>
}
function Slider({label,value,onChange}) { return <div className="row"><label>{label}: {value}/10</label><input type="range" min="1" max="10" value={value} onChange={e=>onChange(Number(e.target.value))}/></div> }

function GoalsScreen({ state, update, stats }) {
  const setMilestone = (key, checked) => update({ ...state, milestones: { ...state.milestones, [key]: checked } });
  const groups = ['CPA','Career','Future Security'];
  return <section><Header title="Goals & Milestones" text="Daily actions move slowly. Major milestones move the bars meaningfully." />
    <div className="grid two"><Progress value={stats.cpa} label="CPA Completion" sub="1/4 sections completed; target: Dec 2026" icon={NotebookPen}/><Progress value={stats.career} label="Career Reintegration" sub="Target: within 6 months due to runway" icon={BriefcaseBusiness}/><Progress value={stats.debt} label="Debt Freedom" sub="Enter total and payments; projected long-term payoff" icon={Landmark}/><Progress value={stats.familyHome} label="Family Home" sub="Long-term purpose: house and protect family" icon={House}/></div>
    <div className="panel"><h3>Milestone Toggles</h3>{groups.map(group=><div key={group} className="milestone-group"><h4>{group}</h4>{Object.entries(milestoneDefs).filter(([,d])=>d.group===group).map(([key,d])=><label className="milestone" key={key}><input type="checkbox" checked={!!state.milestones[key]} onChange={e=>setMilestone(key,e.target.checked)}/><span>{d.label}</span></label>)}</div>)}</div>
    <div className="panel"><h3>Debt Command Center</h3><DebtBreakdown profile={state.profile} /><div className="debt-inputs"><label>Total debt<input type="number" value={state.profile.debtTotal} onChange={e=>update({...state, profile:{...state.profile, debtTotal:Number(e.target.value)}})} /></label><label>Debt paid<input type="number" value={state.profile.debtPaid} onChange={e=>update({...state, profile:{...state.profile, debtPaid:Number(e.target.value)}})} /></label><label>Personal debt<input type="number" value={state.profile.personalDebt} onChange={e=>update({...state, profile:{...state.profile, personalDebt:Number(e.target.value)}})} /></label><label>Credit card debt<input type="number" value={state.profile.creditCardDebt} onChange={e=>update({...state, profile:{...state.profile, creditCardDebt:Number(e.target.value)}})} /></label><label>Student loan<input type="number" value={state.profile.studentLoanDebt} onChange={e=>update({...state, profile:{...state.profile, studentLoanDebt:Number(e.target.value)}})} /></label></div><p className="hint">Debt reality: personal debt is the biggest emotional weight, credit card debt is likely the highest-pressure target, and student loans can usually be handled more slowly.</p></div>
    <RunwayPanel state={state} update={update} />
  </section>
}


function RunwayPanel({ state, update }) {
  const p = state.profile;
  const burn = totalBurn(p);
  const cash = totalCash(p);
  const runway = runwayMonths(p);
  const setProfile = (patch) => update({ ...state, profile: { ...p, ...patch } });
  const setBurn = (key, value) => setProfile({ monthlyBurn: { ...p.monthlyBurn, [key]: Number(value) } });
  return <div className="panel"><h3>Runway Command Center</h3>
    <div className="runway-summary"><div><span>Total accessible cash</span><strong>{money(cash)}</strong></div><div><span>Monthly burn</span><strong>{money(burn)}</strong></div><div><span>Estimated Runway</span><strong>{runway.toFixed(1)} months</strong></div><div><span>Estimated Through</span><strong>{runwayEndDate(p)}</strong></div></div>
    <h4>Liquid Funds</h4>
    <div className="debt-inputs"><label>Cash on hand<input type="number" value={p.cashOnHand} onChange={e=>setProfile({cashOnHand:Number(e.target.value)})} /></label><label>Cash with Auntie Ada<input type="number" value={p.cashAuntieAda} onChange={e=>setProfile({cashAuntieAda:Number(e.target.value)})} /></label><label>Cash with Adrian<input type="number" value={p.cashAdrian} onChange={e=>setProfile({cashAdrian:Number(e.target.value)})} /></label></div>
    <h4>Monthly Burn</h4>
    <div className="debt-inputs">{Object.entries(p.monthlyBurn || {}).map(([key, value]) => <label key={key}>{key.replace(/([A-Z])/g, ' $1')}<input type="number" value={value} onChange={e=>setBurn(key, e.target.value)} /></label>)}</div>
    <p className="hint">Runway is your short-term survival meter. Debt is the long war; accessible cash is the battlefield.</p>
  </div>
}


function DebtBreakdown({ profile }) {
  const total = profile.debtTotal || 1;
  const items = [
    ['Personal Debt', profile.personalDebt || 0],
    ['Credit Card Debt', profile.creditCardDebt || 0],
    ['Student Loan', profile.studentLoanDebt || 0],
  ];
  return <div className="debt-breakdown">
    <div className="debt-total"><span>Total debt</span><strong>${(profile.debtTotal || 0).toLocaleString()}</strong></div>
    {items.map(([label, amount]) => <div className="debt-line" key={label}>
      <div><span>{label}</span><strong>${amount.toLocaleString()}</strong></div>
      <div className="mini-bar"><i style={{width: `${clamp((amount / total) * 100)}%`}} /></div>
      <small>{((amount / total) * 100).toFixed(1)}%</small>
    </div>)}
  </div>
}

function SelfScreen({ stats }) {
  const keys = ['mentalStrength','stressResilience','selfWorth','baselineStability','sleepStability','fitness','gamblingRegulation','environment','familySupport','financeStability'];
  return <section><Header title="Self-Rebuild" text="This is the foundation. The goal is not only productivity — it is resilience, physique, baseline, and future-proofing." />
    <div className="grid two">{keys.map(k => { const [label, sub, Icon] = statLabels[k]; return <Progress key={k} value={stats[k]} label={label} sub={sub} icon={Icon} danger={k==='gamblingRegulation' && stats[k] < 30}/> })}</div>
    <div className="panel"><h3>Fitness Roadmap</h3><div className="stages"><span>0–3 mo: Activation</span><span>3–12 mo: Foundation</span><span>1–2 yr: Transformation</span><span>2+ yr: Identity</span></div></div>
  </section>
}

function InsightsScreen({ state, stats, recent }) {
  const counts = Object.fromEntries(actionDefs.map(a=>[a.key, recent.filter(l=>l.actions?.[a.key]).length]));
  const avgStress = recent.length ? (recent.reduce((s,l)=>s+(l.stress||0),0)/recent.length).toFixed(1) : '—';
  const recs = [];
  if (counts.cpa2h < 3) recs.push('Protect the CPA floor: aim for more 2-hour days this week.');
  if (counts.careerTask < 1) recs.push('Add one career reintegration task; runway makes this parallel to CPA.');
  if (avgStress !== '—' && Number(avgStress) >= 7) recs.push('Stress is high: lower intensity, avoid gambling decisions, prioritize sleep.');
  if (counts.workout + counts.walk < 3) recs.push('Fitness needs activation: aim for 3 movement days, even if light.');
  if (counts.gambled > 0) recs.push('Gambling exposure appeared this week; focus on no-chasing and recovery speed.');
  if (!recs.length) recs.push('Good balance. Keep CPA and self-rebuild consistent without overreaching.');
  return <section><Header title="Weekly Insights" text="The app watches patterns, not perfection." />
    <div className="grid three"><StatBox label="CPA 2h days" value={`${counts.cpa2h}/7`}/><StatBox label="Movement days" value={`${counts.workout + counts.walk}/7`}/><StatBox label="Avg stress" value={avgStress}/></div>
    <div className="panel"><h3>Recommended Focus</h3><ol className="recs">{recs.map((r,i)=><li key={i}>{r}</li>)}</ol></div>
    <div className="panel"><h3>Formula Model</h3><p>Daily actions make small weighted changes. Major milestones make large jumps. Negative actions reduce condition meters, but one bad day never erases the whole journey.</p></div>
  </section>
}
function StatBox({label,value}) { return <div className="statbox"><span>{label}</span><strong>{value}</strong></div> }
function Header({title,text}) { return <div className="header"><h2>{title}</h2><p>{text}</p></div> }

createRoot(document.getElementById('root')).render(<App />);

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {});
  });
}

