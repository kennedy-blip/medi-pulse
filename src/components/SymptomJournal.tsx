import React, { useState } from 'react';
import {
  BookHeart, AlertTriangle, CheckCircle2, Brain, Sparkles, ChevronDown, ChevronUp,
  Plus, X, Save, TrendingUp, Clock, Tag, Lightbulb, Activity, Zap
} from 'lucide-react';
import { SymptomLog, SymptomCategory, AiCorrelationInsight } from '../types/health';

interface SymptomJournalProps {
  symptoms: SymptomLog[];
  insights: AiCorrelationInsight[];
  onAddSymptom: (data: Omit<SymptomLog, 'id' | 'memberId' | 'timestamp'>) => void;
  onResolveSymptom: (id: string) => void;
}

const CATEGORIES: SymptomCategory[] = [
  'Head & Neurological', 'Cardiovascular & Chest', 'Respiratory',
  'Gastrointestinal & Abdominal', 'Musculoskeletal & Joints',
  'Dermatological', 'Psychological & Mood', 'General & Systemic'
];

const BODY_LOCATIONS = [
  'Head / Forehead', 'Left Temple', 'Right Temple', 'Occipital / Neck',
  'Left Eye Orbit', 'Right Eye Orbit', 'Throat / Larynx', 'Chest (Central)',
  'Left Chest', 'Right Chest', 'Upper Abdomen', 'Lower Abdomen',
  'Left Shoulder', 'Right Shoulder', 'Lower Back / Lumbar', 'Both Knees',
  'Left Knee', 'Right Knee', 'Both Hands & Wrists', 'Full Body / Systemic'
];

const COMMON_TRIGGERS = [
  'High Stress', 'Poor Sleep', 'Dehydration', 'Missed Meal', 'Caffeine Excess',
  'Alcohol', 'Exercise', 'Cold Air / Weather', 'Bright Light', 'Strong Odors',
  'Allergens / Pollen', 'Rainy / Humid Weather', 'Prolonged Screen Time',
  'Medication Side Effect', 'Poor Posture', 'Hormonal Cycle'
];

const SEVERITY_LABELS: Record<number, { label: string; color: string }> = {
  1: { label: 'Very Mild', color: 'text-emerald-400' },
  2: { label: 'Mild', color: 'text-emerald-400' },
  3: { label: 'Mild-Moderate', color: 'text-emerald-400' },
  4: { label: 'Moderate', color: 'text-amber-400' },
  5: { label: 'Moderate', color: 'text-amber-400' },
  6: { label: 'Moderate-Severe', color: 'text-amber-400' },
  7: { label: 'Severe', color: 'text-orange-400' },
  8: { label: 'Very Severe', color: 'text-rose-400' },
  9: { label: 'Extreme', color: 'text-rose-400' },
  10: { label: 'Unbearable', color: 'text-rose-400' }
};

function SeverityGauge({ value }: { value: number }) {
  const { label, color } = SEVERITY_LABELS[value] || { label: 'Unknown', color: 'text-slate-400' };
  const segments = Array.from({ length: 10 }, (_, i) => i + 1);
  return (
    <div className="flex items-center gap-3">
      <div className="flex gap-0.5">
        {segments.map(s => (
          <div
            key={s}
            className={`h-5 w-3 rounded-sm ${s <= value
              ? s <= 3 ? 'bg-emerald-500' : s <= 6 ? 'bg-amber-500' : 'bg-rose-500'
              : 'bg-slate-800'
            }`}
          ></div>
        ))}
      </div>
      <span className={`font-mono text-sm font-bold ${color}`}>{value}/10 · {label}</span>
    </div>
  );
}

function InsightCard({ insight }: { insight: AiCorrelationInsight }) {
  const [expanded, setExpanded] = useState(false);

  const configs = {
    correlation: { icon: TrendingUp, label: 'Correlation Found', className: 'severity-moderate' },
    risk_warning: { icon: AlertTriangle, label: 'Risk Warning', className: 'severity-high' },
    optimization: { icon: Lightbulb, label: 'Optimization Tip', className: 'severity-info' },
    streak: { icon: Zap, label: 'Achievement Streak', className: 'severity-low' }
  };

  const cfg = configs[insight.type];
  const Icon = cfg.icon;

  const severityBg = {
    low: 'border-emerald-800/50',
    moderate: 'border-amber-800/50',
    high: 'border-rose-800/50',
    info: 'border-cyan-800/50'
  };

  return (
    <div className={`card-glass overflow-hidden border ${severityBg[insight.severityLevel]}`}>
      <div className="p-4">
        <div className="flex items-start gap-3">
          <div className={`mt-0.5 w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${
            insight.severityLevel === 'high' ? 'bg-rose-900/40 border border-rose-800/50' :
            insight.severityLevel === 'moderate' ? 'bg-amber-900/30 border border-amber-800/50' :
            insight.severityLevel === 'info' ? 'bg-cyan-900/30 border border-cyan-800/50' :
            'bg-emerald-900/30 border border-emerald-800/50'
          }`}>
            <Icon className={`w-4 h-4 ${
              insight.severityLevel === 'high' ? 'text-rose-400' :
              insight.severityLevel === 'moderate' ? 'text-amber-400' :
              insight.severityLevel === 'info' ? 'text-cyan-400' : 'text-emerald-400'
            }`} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-start gap-2 mb-1">
              <span className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full border ${cfg.className}`}>
                {cfg.label}
              </span>
              <span className="text-[10px] font-mono text-slate-600 ml-auto">
                {insight.confidenceScore}% confidence
              </span>
            </div>
            <h4 className="text-sm font-semibold text-slate-200 leading-snug mb-1">{insight.title}</h4>
            <p className="text-xs text-slate-500 leading-relaxed">{insight.description}</p>

            {expanded && (
              <div className="mt-3 space-y-2 animate-fade-up">
                <div>
                  <p className="text-[10px] text-slate-600 uppercase tracking-wider mb-1">Evidence</p>
                  <p className="text-xs text-slate-400 font-mono bg-slate-900/60 rounded-lg p-2 leading-relaxed">{insight.evidence}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-600 uppercase tracking-wider mb-1">Recommendation</p>
                  <p className="text-xs text-slate-300 leading-relaxed">{insight.recommendation}</p>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {insight.relatedFactors.map((f, i) => (
                    <span key={i} className="text-[10px] font-mono text-violet-400 bg-violet-900/20 border border-violet-800/40 px-2 py-0.5 rounded-full">
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={() => setExpanded(!expanded)}
              className="flex items-center gap-1 text-[11px] text-slate-600 hover:text-slate-400 mt-2 transition-colors"
            >
              {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              {expanded ? 'Show less' : 'View evidence & recommendations'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function SymptomCard({ symptom, onResolve }: { symptom: SymptomLog; onResolve: (id: string) => void }) {
  const [expanded, setExpanded] = useState(false);
  const d = new Date(symptom.timestamp);
  const { label, color } = SEVERITY_LABELS[symptom.severity] || { label: 'Unknown', color: 'text-slate-400' };
  const catColors: Record<string, string> = {
    'Head & Neurological': 'text-violet-400 bg-violet-900/20 border-violet-800/40',
    'Cardiovascular & Chest': 'text-rose-400 bg-rose-900/20 border-rose-800/40',
    'Respiratory': 'text-cyan-400 bg-cyan-900/20 border-cyan-800/40',
    'Gastrointestinal & Abdominal': 'text-orange-400 bg-orange-900/20 border-orange-800/40',
    'Musculoskeletal & Joints': 'text-blue-400 bg-blue-900/20 border-blue-800/40',
    'Psychological & Mood': 'text-indigo-400 bg-indigo-900/20 border-indigo-800/40',
    'Dermatological': 'text-pink-400 bg-pink-900/20 border-pink-800/40',
    'General & Systemic': 'text-slate-400 bg-slate-800/40 border-slate-700/50'
  };

  return (
    <div className={`card-glass overflow-hidden transition-all duration-200 hover-glow-violet ${symptom.resolved ? 'opacity-60' : ''}`}>
      <div className="p-4">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${catColors[symptom.category] || 'text-slate-400 bg-slate-800 border-slate-700'}`}>
                {symptom.category}
              </span>
              {symptom.resolved && (
                <span className="flex items-center gap-1 text-[10px] font-mono text-emerald-400 bg-emerald-900/20 border border-emerald-800/40 px-2 py-0.5 rounded-full">
                  <CheckCircle2 className="w-3 h-3" /> Resolved
                </span>
              )}
              {!symptom.resolved && (
                <span className="text-[10px] font-mono text-rose-400 bg-rose-900/20 border border-rose-800/40 px-2 py-0.5 rounded-full animate-pulse">
                  Active
                </span>
              )}
            </div>
            <h4 className="text-sm font-bold text-white leading-tight">{symptom.symptomName}</h4>
            <p className="text-xs text-slate-500 mt-0.5">{symptom.bodyLocation}</p>
          </div>
          <div className="text-right flex-shrink-0">
            <div className={`font-mono text-lg font-bold ${color}`}>{symptom.severity}/10</div>
            <div className="text-[10px] text-slate-600 font-mono">
              {d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </div>
          </div>
        </div>

        <SeverityGauge value={symptom.severity} />

        {symptom.triggers.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {symptom.triggers.map((t, i) => (
              <span key={i} className="text-[10px] font-mono text-amber-400 bg-amber-900/20 border border-amber-800/40 px-2 py-0.5 rounded-full">
                <Tag className="w-2.5 h-2.5 inline mr-1" />{t}
              </span>
            ))}
          </div>
        )}

        {expanded && (
          <div className="mt-3 pt-3 border-t border-slate-800/60 space-y-2 animate-fade-up">
            {symptom.notes && (
              <div>
                <p className="text-[10px] text-slate-600 uppercase tracking-wider mb-1">Notes</p>
                <p className="text-xs text-slate-400 leading-relaxed">{symptom.notes}</p>
              </div>
            )}
            <div className="grid grid-cols-3 gap-2">
              {symptom.durationHours && (
                <div>
                  <p className="text-[10px] text-slate-600 mb-0.5">Duration</p>
                  <p className="font-mono text-xs text-slate-300">{symptom.durationHours}h</p>
                </div>
              )}
              {symptom.impactScore && (
                <div>
                  <p className="text-[10px] text-slate-600 mb-0.5">Impact</p>
                  <p className={`font-mono text-xs font-bold ${
                    symptom.impactScore === 'Severe' || symptom.impactScore === 'Debilitating' ? 'text-rose-400' :
                    symptom.impactScore === 'Moderate' ? 'text-amber-400' : 'text-emerald-400'
                  }`}>{symptom.impactScore}</p>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="flex items-center gap-3 mt-3">
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1 text-[11px] text-slate-600 hover:text-slate-400 transition-colors"
          >
            {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            {expanded ? 'Less' : 'Details'}
          </button>
          {!symptom.resolved && (
            <button
              onClick={() => onResolve(symptom.id)}
              className="flex items-center gap-1 text-[11px] font-semibold text-emerald-400 hover:text-emerald-300 bg-emerald-900/20 border border-emerald-800/40 px-2.5 py-1 rounded-lg transition-all ml-auto"
            >
              <CheckCircle2 className="w-3 h-3" /> Mark Resolved
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function AddSymptomForm({ onClose, onAdd }: {
  onClose: () => void;
  onAdd: (data: Omit<SymptomLog, 'id' | 'memberId' | 'timestamp'>) => void;
}) {
  const [form, setForm] = useState({
    symptomName: '', category: CATEGORIES[0], severity: 5, bodyLocation: '',
    triggers: [] as string[], notes: '', durationHours: '', impactScore: 'Moderate' as SymptomLog['impactScore']
  });

  const toggleTrigger = (t: string) => {
    setForm(p => ({
      ...p,
      triggers: p.triggers.includes(t) ? p.triggers.filter(x => x !== t) : [...p.triggers, t]
    }));
  };

  const handleAdd = () => {
    if (!form.symptomName || !form.bodyLocation) return;
    onAdd({
      symptomName: form.symptomName,
      category: form.category,
      severity: form.severity,
      bodyLocation: form.bodyLocation,
      triggers: form.triggers,
      notes: form.notes,
      durationHours: form.durationHours ? parseFloat(form.durationHours) : undefined,
      impactScore: form.impactScore,
      resolved: false
    });
    onClose();
  };

  return (
    <div className="card-glass-elevated border border-rose-800/40 p-5 shadow-glow-rose animate-fade-up">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-rose-900/30 border border-rose-800/50 flex items-center justify-center">
            <Plus className="w-4 h-4 text-rose-400" />
          </div>
          <h3 className="font-semibold text-sm text-white">Log New Symptom</h3>
        </div>
        <button onClick={onClose} className="text-slate-500 hover:text-slate-300"><X className="w-4 h-4" /></button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="md:col-span-2">
          <label className="label-field">Symptom Description *</label>
          <input value={form.symptomName} onChange={e => setForm(p => ({ ...p, symptomName: e.target.value }))}
            placeholder="e.g. Throbbing left-side migraine with visual aura" className="input-field" />
        </div>
        <div>
          <label className="label-field">Category</label>
          <select value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value as SymptomCategory }))} className="select-field">
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="label-field">Body Location *</label>
          <select value={form.bodyLocation} onChange={e => setForm(p => ({ ...p, bodyLocation: e.target.value }))} className="select-field">
            <option value="">Select location...</option>
            {BODY_LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
          </select>
        </div>
        <div>
          <label className="label-field">Estimated Duration (hours)</label>
          <input type="number" step="0.5" value={form.durationHours} onChange={e => setForm(p => ({ ...p, durationHours: e.target.value }))}
            placeholder="e.g. 3.5" className="input-field" />
        </div>
        <div>
          <label className="label-field">Functional Impact</label>
          <select value={form.impactScore} onChange={e => setForm(p => ({ ...p, impactScore: e.target.value as SymptomLog['impactScore'] }))} className="select-field">
            {['Mild', 'Moderate', 'Severe', 'Debilitating'].map(i => <option key={i} value={i}>{i}</option>)}
          </select>
        </div>
      </div>

      <div className="mb-4">
        <label className="label-field">Severity: {form.severity}/10 — {SEVERITY_LABELS[form.severity]?.label}</label>
        <input type="range" min="1" max="10" value={form.severity}
          onChange={e => setForm(p => ({ ...p, severity: parseInt(e.target.value) }))}
          className="w-full mt-2" />
        <div className="flex justify-between text-[10px] text-slate-700 font-mono mt-1">
          <span>1 · Very Mild</span>
          <span>5 · Moderate</span>
          <span>10 · Unbearable</span>
        </div>
      </div>

      <div className="mb-4">
        <label className="label-field">Contributing Triggers (select all that apply)</label>
        <div className="flex flex-wrap gap-2 mt-2">
          {COMMON_TRIGGERS.map(t => (
            <button
              key={t}
              onClick={() => toggleTrigger(t)}
              className={`text-xs px-3 py-1.5 rounded-xl border transition-all ${
                form.triggers.includes(t)
                  ? 'bg-amber-900/30 text-amber-400 border-amber-800/50'
                  : 'bg-slate-800/60 text-slate-500 border-slate-700/60 hover:text-slate-300'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-5">
        <label className="label-field">Clinical Notes</label>
        <textarea value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))}
          placeholder="Describe onset context, what helped, remedies tried, any medications taken..."
          className="input-field resize-none" rows={3} />
      </div>

      <div className="flex gap-3">
        <button onClick={handleAdd} className="btn-primary flex items-center gap-2">
          <Save className="w-4 h-4" />
          Log Symptom
        </button>
        <button onClick={onClose} className="btn-secondary">Cancel</button>
      </div>
    </div>
  );
}

export default function SymptomJournal({ symptoms, insights, onAddSymptom, onResolveSymptom }: SymptomJournalProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [showResolved, setShowResolved] = useState(false);

  const activeSymptoms = symptoms.filter(s => !s.resolved);
  const resolvedSymptoms = symptoms.filter(s => s.resolved);
  const displayedSymptoms = showResolved ? symptoms : activeSymptoms;

  return (
    <div className="space-y-5">
      {/* Header actions */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-2">
          <div className="card-glass px-4 py-2 text-center min-w-[100px]">
            <div className="font-mono text-xl font-bold text-rose-400">{activeSymptoms.length}</div>
            <div className="text-[10px] text-slate-600">Active Symptoms</div>
          </div>
          <div className="card-glass px-4 py-2 text-center min-w-[100px]">
            <div className="font-mono text-xl font-bold text-emerald-400">{resolvedSymptoms.length}</div>
            <div className="text-[10px] text-slate-600">Resolved</div>
          </div>
          <div className="card-glass px-4 py-2 text-center min-w-[100px]">
            <div className="font-mono text-xl font-bold text-violet-400">{insights.length}</div>
            <div className="text-[10px] text-slate-600">AI Insights</div>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowResolved(!showResolved)}
            className={`text-xs font-medium px-4 py-2 rounded-xl border transition-all ${
              showResolved ? 'bg-slate-700 text-slate-200 border-slate-600' : 'bg-slate-800/60 text-slate-500 border-slate-700/60'
            }`}
          >
            {showResolved ? 'Hide Resolved' : 'Show All'}
          </button>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="btn-primary flex items-center gap-2 text-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            Log Symptom
          </button>
        </div>
      </div>

      {/* Add form */}
      {showAddForm && (
        <AddSymptomForm
          onClose={() => setShowAddForm(false)}
          onAdd={(data) => { onAddSymptom(data); setShowAddForm(false); }}
        />
      )}

      {/* Two-column layout: Symptoms + AI Insights */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-5">
        {/* Symptom Log — wider */}
        <div className="xl:col-span-3 space-y-3">
          <div className="flex items-center gap-2 mb-1">
            <BookHeart className="w-4 h-4 text-rose-400" />
            <span className="text-sm font-semibold text-slate-200">Symptom Journal</span>
            {activeSymptoms.length > 0 && (
              <span className="text-[10px] font-mono text-rose-400 bg-rose-900/20 border border-rose-800/40 px-2 py-0.5 rounded-full">
                {activeSymptoms.length} active
              </span>
            )}
          </div>

          {displayedSymptoms.length === 0 ? (
            <div className="card-glass p-10 text-center">
              <BookHeart className="w-10 h-10 text-slate-700 mx-auto mb-3" />
              <p className="text-slate-500 text-sm">No symptoms logged yet.</p>
              <p className="text-slate-600 text-xs mt-1">Use the "Log Symptom" button to track health events.</p>
            </div>
          ) : (
            displayedSymptoms.map(s => (
              <SymptomCard key={s.id} symptom={s} onResolve={onResolveSymptom} />
            ))
          )}
        </div>

        {/* AI Insights Panel — narrower */}
        <div className="xl:col-span-2 space-y-3">
          <div className="flex items-center gap-2 mb-1">
            <Brain className="w-4 h-4 text-violet-400" />
            <span className="text-sm font-semibold text-slate-200">AI Wellness Insights</span>
            <span className="text-[10px] font-mono text-violet-400 bg-violet-900/20 border border-violet-800/40 px-2 py-0.5 rounded-full ml-auto">
              <Sparkles className="w-2.5 h-2.5 inline mr-1" />BETA
            </span>
          </div>

          <div className="card-glass p-3 border border-violet-800/30">
            <div className="flex items-center gap-2">
              <Activity className="w-3.5 h-3.5 text-violet-400" />
              <p className="text-[11px] text-slate-400">
                AI analyzes your symptom logs, medication adherence, sleep, and vital trends to surface actionable health correlations.
              </p>
            </div>
          </div>

          {insights.map(ins => (
            <InsightCard key={ins.id} insight={ins} />
          ))}
        </div>
      </div>
    </div>
  );
}
