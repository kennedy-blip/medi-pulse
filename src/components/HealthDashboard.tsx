import React, { useState } from 'react';
import {
  Heart, Droplets, Moon, Flame, TrendingUp, TrendingDown, Minus,
  Pill, AlertTriangle, CheckCircle2, Clock, Activity, Wind, Thermometer,
  Brain, ChevronRight, Zap, X, Save
} from 'lucide-react';
import { VitalLog, Medication } from '../types/health';

interface HealthDashboardProps {
  memberName: string;
  memberBg: string;
  latestVital?: VitalLog;
  vitals: VitalLog[];
  adherenceRate: number;
  lowStockMeds: Medication[];
  activeSymptomsCount: number;
  takenToday: number;
  totalDosesToday: number;
  showQuickVitalForm: boolean;
  onCloseVitalForm: () => void;
  onSaveVital: (data: Omit<VitalLog, 'id' | 'memberId' | 'timestamp'>) => void;
  onNavigateToMeds: () => void;
  onNavigateToSymptoms: () => void;
}

function MetricCard({ label, value, unit, sub, icon: Icon, color, trend }: {
  label: string; value: string | number; unit?: string; sub?: string;
  icon: React.ElementType; color: string; trend?: 'up' | 'down' | 'stable';
}) {
  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;
  const trendColor = trend === 'up' ? 'text-rose-400' : trend === 'down' ? 'text-emerald-400' : 'text-slate-500';
  return (
    <div className="vital-card hover-glow-violet group cursor-default">
      <div className="flex items-start justify-between">
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${color}`}>
          <Icon className="w-4.5 h-4.5" style={{ width: '18px', height: '18px' }} />
        </div>
        {trend && <TrendIcon className={`w-4 h-4 ${trendColor}`} />}
      </div>
      <div>
        <div className="flex items-baseline gap-1">
          <span className="font-mono text-2xl font-bold text-white tracking-tight">{value}</span>
          {unit && <span className="text-xs text-slate-500 font-mono">{unit}</span>}
        </div>
        <p className="text-xs text-slate-500 mt-0.5">{label}</p>
        {sub && <p className="text-[10px] text-slate-600 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

function BPCard({ latest, vitals }: { latest?: VitalLog; vitals: VitalLog[] }) {
  const bp = latest?.bloodPressure;
  if (!bp) return null;
  const { systolic, diastolic, pulse } = bp;

  const classify = (s: number, d: number) => {
    if (s < 120 && d < 80) return { label: 'Normal', color: 'text-emerald-400', bg: 'bg-emerald-900/30 border-emerald-800/50' };
    if (s < 130 && d < 80) return { label: 'Elevated', color: 'text-amber-400', bg: 'bg-amber-900/30 border-amber-800/50' };
    if (s < 140 || d < 90) return { label: 'Stage 1 HTN', color: 'text-orange-400', bg: 'bg-orange-900/30 border-orange-800/50' };
    return { label: 'Stage 2 HTN', color: 'text-rose-400', bg: 'bg-rose-900/30 border-rose-800/50' };
  };
  const cls = classify(systolic, diastolic);

  return (
    <div className="card-glass p-5 hover-glow-violet">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-rose-900/30 border border-rose-800/50 flex items-center justify-center">
            <Activity className="w-[18px] h-[18px] text-rose-400" />
          </div>
          <span className="text-sm font-semibold text-slate-200">Blood Pressure & HR</span>
        </div>
        <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${cls.bg} ${cls.color}`}>
          {cls.label}
        </span>
      </div>

      <div className="flex items-center justify-between mb-3">
        <div className="text-center">
          <div className="font-mono text-3xl font-bold text-white">{systolic}</div>
          <div className="text-[10px] text-slate-500 mt-0.5">SYSTOLIC</div>
        </div>
        <div className="flex flex-col items-center gap-1">
          <div className="w-px h-8 bg-slate-700"></div>
          <span className="text-slate-600 text-xs">/</span>
          <div className="w-px h-8 bg-slate-700"></div>
        </div>
        <div className="text-center">
          <div className="font-mono text-3xl font-bold text-white">{diastolic}</div>
          <div className="text-[10px] text-slate-500 mt-0.5">DIASTOLIC</div>
        </div>
        <div className="text-center">
          <div className="font-mono text-2xl font-bold text-rose-400">{pulse || latest?.heartRate || '--'}</div>
          <div className="text-[10px] text-slate-500 mt-0.5">HR / BPM</div>
        </div>
      </div>

      {/* Trend Sparkline - last 5 readings */}
      <div className="mt-3 pt-3 border-t border-slate-800/60">
        <p className="text-[10px] text-slate-600 uppercase tracking-wider mb-2">7-day systolic trend</p>
        <div className="flex items-end gap-1 h-8">
          {vitals.slice(0, 7).reverse().map((v, i) => {
            const val = v.bloodPressure?.systolic || 120;
            const pct = ((val - 100) / 60) * 100;
            const h = Math.max(10, Math.min(100, pct));
            const c = val < 120 ? 'bg-emerald-500' : val < 130 ? 'bg-amber-500' : 'bg-rose-500';
            return (
              <div key={i} className="flex-1 flex flex-col items-center justify-end" title={`${val} mmHg`}>
                <div className={`w-full rounded-sm ${c} opacity-70`} style={{ height: `${h}%` }}></div>
              </div>
            );
          })}
        </div>
        <div className="flex justify-between mt-1">
          <span className="text-[10px] text-slate-700">7d ago</span>
          <span className="text-[10px] text-slate-700">Today</span>
        </div>
      </div>
    </div>
  );
}

function SleepCard({ vital }: { vital?: VitalLog }) {
  const sleep = vital?.sleep;
  if (!sleep) return (
    <div className="card-glass p-5">
      <p className="text-slate-500 text-sm">No sleep data recorded today.</p>
    </div>
  );

  const stateColors = {
    'Optimal': 'text-emerald-400 bg-emerald-900/30 border-emerald-800/50',
    'Restorative': 'text-cyan-400 bg-cyan-900/30 border-cyan-800/50',
    'Restless': 'text-amber-400 bg-amber-900/30 border-amber-800/50',
    'Fragmented': 'text-rose-400 bg-rose-900/30 border-rose-800/50'
  };

  const phases = [
    { label: 'Deep Sleep', value: sleep.deepHours || 0, color: 'bg-violet-500', max: 3 },
    { label: 'REM Sleep', value: sleep.remHours || 0, color: 'bg-cyan-500', max: 3 },
    { label: 'Light Sleep', value: sleep.totalHours - (sleep.deepHours || 0) - (sleep.remHours || 0), color: 'bg-blue-700', max: 6 },
  ];

  return (
    <div className="card-glass p-5 hover-glow-violet">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-violet-900/30 border border-violet-800/50 flex items-center justify-center">
            <Moon className="w-[18px] h-[18px] text-violet-400" />
          </div>
          <span className="text-sm font-semibold text-slate-200">Sleep Analysis</span>
        </div>
        <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${stateColors[sleep.sleepState]}`}>
          {sleep.sleepState}
        </span>
      </div>

      <div className="flex items-baseline gap-2 mb-4">
        <span className="font-mono text-4xl font-bold text-white">{sleep.totalHours.toFixed(1)}</span>
        <span className="text-slate-500 text-sm font-mono">hrs total</span>
        <span className={`ml-auto font-mono text-lg font-bold ${
          sleep.qualityScore >= 85 ? 'text-emerald-400' : sleep.qualityScore >= 70 ? 'text-amber-400' : 'text-rose-400'
        }`}>{sleep.qualityScore}%</span>
      </div>

      {/* Phase bars */}
      <div className="space-y-2.5">
        {phases.map(phase => (
          <div key={phase.label}>
            <div className="flex justify-between text-[10px] text-slate-500 mb-1">
              <span>{phase.label}</span>
              <span className="font-mono">{phase.value.toFixed(1)}h</span>
            </div>
            <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${phase.color} transition-all duration-500`}
                style={{ width: `${Math.min(100, (phase.value / phase.max) * 100)}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function HealthDashboard({
  memberName,
  latestVital,
  vitals,
  adherenceRate,
  lowStockMeds,
  activeSymptomsCount,
  takenToday,
  totalDosesToday,
  showQuickVitalForm,
  onCloseVitalForm,
  onSaveVital,
  onNavigateToMeds,
  onNavigateToSymptoms,
}: HealthDashboardProps) {
  const [vitalForm, setVitalForm] = useState({
    systolic: '', diastolic: '', heartRate: '', glucose: '',
    sleep: '', sleepQuality: '80', hydration: '', oxygen: '', temp: '', notes: ''
  });

  const handleSaveVital = () => {
    const data: Omit<VitalLog, 'id' | 'memberId' | 'timestamp'> = {
      bloodPressure: vitalForm.systolic && vitalForm.diastolic ? {
        systolic: parseInt(vitalForm.systolic),
        diastolic: parseInt(vitalForm.diastolic),
        pulse: vitalForm.heartRate ? parseInt(vitalForm.heartRate) : undefined
      } : undefined,
      heartRate: vitalForm.heartRate ? parseInt(vitalForm.heartRate) : undefined,
      glucose: vitalForm.glucose ? { value: parseInt(vitalForm.glucose), context: 'fasting' } : undefined,
      sleep: vitalForm.sleep ? {
        totalHours: parseFloat(vitalForm.sleep),
        qualityScore: parseInt(vitalForm.sleepQuality),
        sleepState: parseInt(vitalForm.sleepQuality) >= 85 ? 'Optimal' : parseInt(vitalForm.sleepQuality) >= 70 ? 'Restorative' : 'Restless'
      } : undefined,
      hydrationMl: vitalForm.hydration ? parseInt(vitalForm.hydration) : undefined,
      oxygenSaturation: vitalForm.oxygen ? parseInt(vitalForm.oxygen) : undefined,
      bodyTempF: vitalForm.temp ? parseFloat(vitalForm.temp) : undefined,
      notes: vitalForm.notes || undefined
    };
    onSaveVital(data);
    setVitalForm({ systolic: '', diastolic: '', heartRate: '', glucose: '', sleep: '', sleepQuality: '80', hydration: '', oxygen: '', temp: '', notes: '' });
  };

  const lv = latestVital;
  const now = new Date();
  const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  const dateStr = now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  return (
    <div className="space-y-6">
      {/* Quick Vital Log Form */}
      {showQuickVitalForm && (
        <div className="card-glass-elevated border border-violet-800/50 p-5 shadow-glow-violet animate-fade-up">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center">
                <Zap className="w-4 h-4 text-violet-400" />
              </div>
              <div>
                <h3 className="font-semibold text-sm text-white">Quick Vital Log</h3>
                <p className="text-[10px] text-slate-500 font-mono">{timeStr} · {dateStr}</p>
              </div>
            </div>
            <button onClick={onCloseVitalForm} className="text-slate-500 hover:text-slate-300">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-4">
            <div>
              <label className="label-field">Systolic (mmHg)</label>
              <input type="number" placeholder="e.g. 120" value={vitalForm.systolic}
                onChange={e => setVitalForm(p => ({ ...p, systolic: e.target.value }))}
                className="input-field" />
            </div>
            <div>
              <label className="label-field">Diastolic (mmHg)</label>
              <input type="number" placeholder="e.g. 80" value={vitalForm.diastolic}
                onChange={e => setVitalForm(p => ({ ...p, diastolic: e.target.value }))}
                className="input-field" />
            </div>
            <div>
              <label className="label-field">Heart Rate (bpm)</label>
              <input type="number" placeholder="e.g. 68" value={vitalForm.heartRate}
                onChange={e => setVitalForm(p => ({ ...p, heartRate: e.target.value }))}
                className="input-field" />
            </div>
            <div>
              <label className="label-field">Glucose (mg/dL)</label>
              <input type="number" placeholder="e.g. 95" value={vitalForm.glucose}
                onChange={e => setVitalForm(p => ({ ...p, glucose: e.target.value }))}
                className="input-field" />
            </div>
            <div>
              <label className="label-field">Sleep (hours)</label>
              <input type="number" step="0.5" placeholder="e.g. 7.5" value={vitalForm.sleep}
                onChange={e => setVitalForm(p => ({ ...p, sleep: e.target.value }))}
                className="input-field" />
            </div>
            <div>
              <label className="label-field">Sleep Quality: {vitalForm.sleepQuality}%</label>
              <input type="range" min="0" max="100" value={vitalForm.sleepQuality}
                onChange={e => setVitalForm(p => ({ ...p, sleepQuality: e.target.value }))}
                className="w-full mt-1" />
            </div>
            <div>
              <label className="label-field">Hydration (ml)</label>
              <input type="number" placeholder="e.g. 2000" value={vitalForm.hydration}
                onChange={e => setVitalForm(p => ({ ...p, hydration: e.target.value }))}
                className="input-field" />
            </div>
            <div>
              <label className="label-field">O₂ Saturation (%)</label>
              <input type="number" placeholder="e.g. 98" value={vitalForm.oxygen}
                onChange={e => setVitalForm(p => ({ ...p, oxygen: e.target.value }))}
                className="input-field" />
            </div>
          </div>

          <div className="mb-4">
            <label className="label-field">Notes</label>
            <input type="text" placeholder="Optional notes (e.g. 'Post-run reading, felt great')" value={vitalForm.notes}
              onChange={e => setVitalForm(p => ({ ...p, notes: e.target.value }))}
              className="input-field" />
          </div>

          <div className="flex gap-3">
            <button onClick={handleSaveVital} className="btn-primary flex items-center gap-2">
              <Save className="w-4 h-4" />
              Save Vitals
            </button>
            <button onClick={onCloseVitalForm} className="btn-secondary">Cancel</button>
          </div>
        </div>
      )}

      {/* Summary Stat Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className={`card-glass p-4 cursor-pointer hover-glow-violet ${adherenceRate === 100 ? 'border-emerald-800/50' : ''}`}>
          <div className="flex items-center gap-2 mb-2">
            <Pill className="w-4 h-4 text-emerald-400" />
            <span className="text-xs text-slate-500">Adherence Rate</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className={`font-mono text-2xl font-bold ${adherenceRate >= 90 ? 'text-emerald-400' : adherenceRate >= 75 ? 'text-amber-400' : 'text-rose-400'}`}>
              {adherenceRate}%
            </span>
          </div>
          <p className="text-[10px] text-slate-600 mt-1 font-mono">{takenToday}/{totalDosesToday} doses today</p>
        </div>

        <div className="card-glass p-4 cursor-pointer hover-glow-violet" onClick={onNavigateToMeds}>
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <span className="text-xs text-slate-500">Refill Warnings</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className={`font-mono text-2xl font-bold ${lowStockMeds.length > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
              {lowStockMeds.length}
            </span>
          </div>
          <p className="text-[10px] text-slate-600 mt-1 font-mono">
            {lowStockMeds.length > 0 ? lowStockMeds[0].name.split(' ')[0] + (lowStockMeds.length > 1 ? ` +${lowStockMeds.length - 1}` : '') : 'All stocked'}
          </p>
        </div>

        <div className="card-glass p-4 cursor-pointer hover-glow-violet" onClick={onNavigateToSymptoms}>
          <div className="flex items-center gap-2 mb-2">
            <Brain className="w-4 h-4 text-rose-400" />
            <span className="text-xs text-slate-500">Active Alerts</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className={`font-mono text-2xl font-bold ${activeSymptomsCount > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
              {activeSymptomsCount}
            </span>
          </div>
          <p className="text-[10px] text-slate-600 mt-1 font-mono">{activeSymptomsCount === 0 ? 'No active symptoms' : 'Open symptom alerts'}</p>
        </div>

        <div className="card-glass p-4">
          <div className="flex items-center gap-2 mb-2">
            <Moon className="w-4 h-4 text-violet-400" />
            <span className="text-xs text-slate-500">Sleep Score</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className={`font-mono text-2xl font-bold ${
              (lv?.sleep?.qualityScore || 0) >= 85 ? 'text-emerald-400' :
              (lv?.sleep?.qualityScore || 0) >= 70 ? 'text-cyan-400' : 'text-amber-400'
            }`}>
              {lv?.sleep?.qualityScore || '--'}
            </span>
            <span className="text-slate-500 text-xs font-mono">/100</span>
          </div>
          <p className="text-[10px] text-slate-600 mt-1 font-mono">{lv?.sleep ? `${lv.sleep.totalHours.toFixed(1)}h · ${lv.sleep.sleepState}` : 'No sleep data'}</p>
        </div>
      </div>

      {/* Vitals Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {lv?.heartRate && (
          <MetricCard label="Resting Heart Rate" value={lv.heartRate} unit="BPM" icon={Heart} color="bg-rose-900/30 border border-rose-800/50 text-rose-400" trend={lv.heartRate > 80 ? 'up' : 'stable'} />
        )}
        {lv?.glucose && (
          <MetricCard label="Blood Glucose" value={lv.glucose.value} unit="mg/dL" sub={lv.glucose.context.replace('_', ' ')} icon={Activity} color="bg-cyan-900/30 border border-cyan-800/50 text-cyan-400" trend={lv.glucose.value > 100 ? 'up' : 'stable'} />
        )}
        {lv?.hydrationMl && (
          <MetricCard label="Hydration Logged" value={lv.hydrationMl} unit="ml" sub={`${Math.round(lv.hydrationMl / 240)} glasses`} icon={Droplets} color="bg-blue-900/30 border border-blue-800/50 text-blue-400" trend="stable" />
        )}
        {lv?.oxygenSaturation && (
          <MetricCard label="Oxygen Saturation" value={lv.oxygenSaturation} unit="% SpO₂" icon={Wind} color="bg-teal-900/30 border border-teal-800/50 text-teal-400" trend={lv.oxygenSaturation < 95 ? 'down' : 'stable'} />
        )}
        {lv?.bodyTempF && (
          <MetricCard label="Body Temperature" value={lv.bodyTempF.toFixed(1)} unit="°F" icon={Thermometer} color="bg-orange-900/30 border border-orange-800/50 text-orange-400" trend={lv.bodyTempF > 100.4 ? 'up' : 'stable'} />
        )}
      </div>

      {/* BP + Sleep Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <BPCard latest={lv} vitals={vitals} />
        <SleepCard vital={lv} />
      </div>

      {/* Vital Log History */}
      <div className="card-glass overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-slate-800/60">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-slate-500" />
            <span className="font-semibold text-sm text-slate-200">Recent Vital Readings</span>
          </div>
          <span className="text-xs text-slate-600 font-mono">{vitals.length} records</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-slate-800/60">
                <th className="text-left text-slate-600 font-medium px-5 py-3 uppercase tracking-wider">Date & Time</th>
                <th className="text-left text-slate-600 font-medium px-4 py-3 uppercase tracking-wider">BP</th>
                <th className="text-left text-slate-600 font-medium px-4 py-3 uppercase tracking-wider">HR</th>
                <th className="text-left text-slate-600 font-medium px-4 py-3 uppercase tracking-wider">Glucose</th>
                <th className="text-left text-slate-600 font-medium px-4 py-3 uppercase tracking-wider">Sleep</th>
                <th className="text-left text-slate-600 font-medium px-4 py-3 uppercase tracking-wider hidden md:table-cell">O₂</th>
                <th className="text-left text-slate-600 font-medium px-4 py-3 uppercase tracking-wider hidden lg:table-cell">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/40">
              {vitals.slice(0, 7).map((v, i) => {
                const d = new Date(v.timestamp);
                const bp = v.bloodPressure;
                return (
                  <tr key={v.id} className={`hover:bg-slate-800/20 transition-colors ${i === 0 ? 'bg-violet-900/10' : ''}`}>
                    <td className="px-5 py-3 font-mono text-slate-400">
                      <div>{d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>
                      <div className="text-slate-600 text-[10px]">{d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</div>
                    </td>
                    <td className="px-4 py-3 font-mono">
                      {bp ? (
                        <span className={`${bp.systolic >= 140 ? 'text-rose-400' : bp.systolic >= 130 ? 'text-amber-400' : 'text-emerald-400'}`}>
                          {bp.systolic}/{bp.diastolic}
                        </span>
                      ) : <span className="text-slate-700">—</span>}
                    </td>
                    <td className="px-4 py-3 font-mono text-rose-400">{v.heartRate || <span className="text-slate-700">—</span>}</td>
                    <td className="px-4 py-3 font-mono text-cyan-400">{v.glucose?.value || <span className="text-slate-700">—</span>}</td>
                    <td className="px-4 py-3 font-mono">
                      {v.sleep ? (
                        <span className={v.sleep.qualityScore >= 80 ? 'text-emerald-400' : 'text-amber-400'}>
                          {v.sleep.totalHours.toFixed(1)}h
                        </span>
                      ) : <span className="text-slate-700">—</span>}
                    </td>
                    <td className="px-4 py-3 font-mono text-teal-400 hidden md:table-cell">{v.oxygenSaturation ? `${v.oxygenSaturation}%` : <span className="text-slate-700">—</span>}</td>
                    <td className="px-4 py-3 text-slate-600 max-w-[200px] truncate hidden lg:table-cell">{v.notes || '—'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
