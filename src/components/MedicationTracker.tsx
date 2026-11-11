import React, { useState } from 'react';
import {
  Pill, Clock, AlertTriangle, CheckCircle2, XCircle, Package,
  Phone, ChevronDown, ChevronUp, Plus, RefreshCw, Info, X, Save
} from 'lucide-react';
import { Medication, TimeOfDay } from '../types/health';

interface MedicationTrackerProps {
  medications: Medication[];
  showAddMedForm: boolean;
  onCloseAddMed: () => void;
  onAddMedication: (data: Omit<Medication, 'id' | 'memberId' | 'doseLogs'>) => void;
  onMarkTaken: (medId: string, doseLogId: string) => void;
  onMarkSkipped: (medId: string, doseLogId: string) => void;
}

const TIME_BADGES: Record<TimeOfDay, { label: string; className: string; hour: string }> = {
  Morning: { label: 'Morning', className: 'time-badge-morning', hour: '08:00 AM' },
  Afternoon: { label: 'Afternoon', className: 'time-badge-afternoon', hour: '01:00 PM' },
  Evening: { label: 'Evening', className: 'time-badge-evening', hour: '06:00 PM' },
  Night: { label: 'Night', className: 'time-badge-night', hour: '09:00 PM' },
};

function StockBar({ current, total, threshold }: { current: number; total: number; threshold: number }) {
  const pct = Math.min(100, (current / total) * 100);
  const isLow = current <= threshold * 2;
  const isCritical = current <= threshold;
  const color = isCritical ? 'bg-rose-500' : isLow ? 'bg-amber-500' : 'bg-emerald-500';
  return (
    <div className="space-y-1">
      <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${color}`}
          style={{ width: `${pct}%` }}
        ></div>
      </div>
      <div className="flex justify-between text-[10px] font-mono">
        <span className={isCritical ? 'text-rose-400 font-bold' : isLow ? 'text-amber-400' : 'text-slate-500'}>
          {current} remaining
        </span>
        <span className="text-slate-700">/ {total}</span>
      </div>
    </div>
  );
}

function DoseStatusBadge({ status }: { status: 'taken' | 'skipped' | 'pending' }) {
  if (status === 'taken') return (
    <span className="flex items-center gap-1 text-[10px] font-mono text-emerald-400 bg-emerald-900/30 border border-emerald-800/50 px-2 py-0.5 rounded-full">
      <CheckCircle2 className="w-3 h-3" /> Taken
    </span>
  );
  if (status === 'skipped') return (
    <span className="flex items-center gap-1 text-[10px] font-mono text-slate-500 bg-slate-800/60 border border-slate-700/50 px-2 py-0.5 rounded-full">
      <XCircle className="w-3 h-3" /> Skipped
    </span>
  );
  return (
    <span className="flex items-center gap-1 text-[10px] font-mono text-amber-400 bg-amber-900/30 border border-amber-800/50 px-2 py-0.5 rounded-full animate-pulse">
      <Clock className="w-3 h-3" /> Pending
    </span>
  );
}

function MedicationCard({ med, onMarkTaken, onMarkSkipped }: {
  med: Medication;
  onMarkTaken: (medId: string, doseLogId: string) => void;
  onMarkSkipped: (medId: string, doseLogId: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const daysRemaining = Math.floor(med.currentStock / med.pillsPerDose / med.scheduleTimes.length);
  const isLowStock = daysRemaining <= med.refillThresholdDays;
  const isCritical = daysRemaining <= 3;

  const todayLogs = med.doseLogs.filter(dl => dl.date === new Date().toISOString().slice(0, 10));
  const recentLogs = med.doseLogs.slice(0, 7);

  const formColors: Record<string, string> = {
    tablet: 'text-violet-400',
    capsule: 'text-cyan-400',
    liquid: 'text-blue-400',
    inhaler: 'text-teal-400',
    injection: 'text-rose-400',
    topical: 'text-orange-400'
  };

  return (
    <div className={`card-glass overflow-hidden transition-all duration-200 hover-glow-violet ${
      isCritical ? 'border-rose-900/60' : isLowStock ? 'border-amber-900/60' : ''
    }`}>
      {/* Critical/Low Banner */}
      {isLowStock && (
        <div className={`flex items-center gap-2 px-4 py-2 text-xs font-medium ${
          isCritical
            ? 'bg-rose-900/30 text-rose-300 border-b border-rose-900/50'
            : 'bg-amber-900/20 text-amber-400 border-b border-amber-900/40'
        }`}>
          <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
          {isCritical
            ? `CRITICAL: Only ${daysRemaining} day${daysRemaining !== 1 ? 's' : ''} of supply remaining — refill immediately`
            : `Refill warning: ${daysRemaining} days remaining — ${med.refillPending ? 'Refill request sent' : 'Request refill soon'}`}
          {med.refillPending && <span className="ml-auto font-mono text-[10px] text-cyan-400 bg-cyan-900/30 border border-cyan-800/50 px-2 py-0.5 rounded-full">REFILL PENDING</span>}
        </div>
      )}

      <div className="p-5">
        {/* Header */}
        <div className="flex items-start gap-4 mb-4">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 border"
            style={{ backgroundColor: `${med.colorTheme}20`, borderColor: `${med.colorTheme}40` }}
          >
            <Pill className="w-6 h-6" style={{ color: med.colorTheme }} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-start gap-2 mb-1">
              <h3 className="font-bold text-base text-white leading-tight">{med.name}</h3>
              <span className={`text-[10px] font-mono capitalize ${formColors[med.form]}`}>
                {med.form}
              </span>
            </div>
            {med.genericName && (
              <p className="text-[11px] text-slate-500 mb-1">{med.genericName}</p>
            )}
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-xs font-bold text-slate-200 bg-slate-800/80 border border-slate-700/60 px-2 py-0.5 rounded-lg">
                {med.dosage} {med.unit} × {med.pillsPerDose}
              </span>
              {med.scheduleTimes.map(t => (
                <span key={t} className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${TIME_BADGES[t].className}`}>
                  {TIME_BADGES[t].label}
                </span>
              ))}
            </div>
            <p className="text-[11px] text-slate-500 mt-1.5">{med.instructions}</p>
          </div>
        </div>

        {/* Stock bar */}
        <div className="mb-4">
          <StockBar current={med.currentStock} total={med.totalPackSize} threshold={med.refillThresholdDays * med.pillsPerDose * med.scheduleTimes.length} />
        </div>

        {/* Today's Schedule */}
        {todayLogs.length > 0 && (
          <div className="mb-4">
            <p className="text-[10px] text-slate-600 uppercase tracking-wider mb-2 font-medium">Today's Schedule</p>
            <div className="flex flex-wrap gap-2">
              {todayLogs.map(dl => (
                <div key={dl.id} className="flex items-center gap-2 bg-slate-900/60 border border-slate-800/60 rounded-xl px-3 py-2">
                  <span className={`text-[10px] font-mono ${TIME_BADGES[dl.timeSlot].className} px-2 py-0.5 rounded-full`}>
                    {dl.timeSlot}
                  </span>
                  <DoseStatusBadge status={dl.status} />
                  {dl.timestamp && (
                    <span className="text-[10px] font-mono text-slate-600">{dl.timestamp}</span>
                  )}
                  {dl.status === 'pending' && (
                    <div className="flex gap-1.5 ml-1">
                      <button
                        onClick={() => onMarkTaken(med.id, dl.id)}
                        className="text-[10px] font-semibold text-emerald-400 hover:text-emerald-300 bg-emerald-900/30 hover:bg-emerald-800/40 border border-emerald-800/50 px-2 py-0.5 rounded-lg transition-all"
                      >
                        Mark Taken
                      </button>
                      <button
                        onClick={() => onMarkSkipped(med.id, dl.id)}
                        className="text-[10px] text-slate-500 hover:text-slate-400 bg-slate-800/60 border border-slate-700/50 px-2 py-0.5 rounded-lg transition-all"
                      >
                        Skip
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 7-day adherence dots */}
        <div className="mb-4">
          <p className="text-[10px] text-slate-600 uppercase tracking-wider mb-2 font-medium">7-day history</p>
          <div className="flex gap-1.5">
            {recentLogs.slice(0, 7).map((dl, i) => (
              <div
                key={i}
                title={`${dl.date} · ${dl.timeSlot} · ${dl.status}`}
                className={`w-6 h-6 rounded-lg flex items-center justify-center ${
                  dl.status === 'taken' ? 'bg-emerald-900/50 border border-emerald-700/50' :
                  dl.status === 'skipped' ? 'bg-rose-900/40 border border-rose-900/50' :
                  'bg-slate-800/80 border border-slate-700/50'
                }`}
              >
                {dl.status === 'taken' && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
                {dl.status === 'skipped' && <XCircle className="w-3 h-3 text-rose-500" />}
                {dl.status === 'pending' && <Clock className="w-3 h-3 text-amber-400" />}
              </div>
            ))}
          </div>
        </div>

        {/* Expand for details */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-1 text-[11px] text-slate-500 hover:text-slate-300 transition-colors"
        >
          {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          {expanded ? 'Hide details' : 'Pharmacy & prescription details'}
        </button>

        {expanded && (
          <div className="mt-4 pt-4 border-t border-slate-800/60 grid grid-cols-1 md:grid-cols-2 gap-3 animate-fade-up">
            {med.rxNumber && (
              <div>
                <p className="text-[10px] text-slate-600 uppercase tracking-wider mb-1">Rx Number</p>
                <p className="font-mono text-xs text-slate-300">{med.rxNumber}</p>
              </div>
            )}
            {med.prescribedBy && (
              <div>
                <p className="text-[10px] text-slate-600 uppercase tracking-wider mb-1">Prescribing Physician</p>
                <p className="text-xs text-slate-300">{med.prescribedBy}</p>
              </div>
            )}
            {med.pharmacyName && (
              <div>
                <p className="text-[10px] text-slate-600 uppercase tracking-wider mb-1">Pharmacy</p>
                <p className="text-xs text-slate-300">{med.pharmacyName}</p>
                {med.pharmacyPhone && (
                  <a href={`tel:${med.pharmacyPhone}`} className="flex items-center gap-1 text-[10px] text-cyan-400 hover:text-cyan-300 mt-1">
                    <Phone className="w-3 h-3" /> {med.pharmacyPhone}
                  </a>
                )}
              </div>
            )}
            <div>
              <p className="text-[10px] text-slate-600 uppercase tracking-wider mb-1">Refill Threshold</p>
              <p className="text-xs text-slate-300">{med.refillThresholdDays} days before depletion</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function AddMedicationForm({ onClose, onAdd }: {
  onClose: () => void;
  onAdd: (data: Omit<Medication, 'id' | 'memberId' | 'doseLogs'>) => void;
}) {
  const [form, setForm] = useState({
    name: '', genericName: '', dosage: '', unit: 'mg', form: 'tablet' as Medication['form'],
    scheduleTimes: [] as TimeOfDay[], frequencyDescription: '', instructions: '',
    currentStock: '', totalPackSize: '', refillThresholdDays: '7', pillsPerDose: '1',
    rxNumber: '', prescribedBy: '', pharmacyName: '', pharmacyPhone: '', colorTheme: '#8b5cf6'
  });

  const toggleTime = (t: TimeOfDay) => {
    setForm(p => ({
      ...p,
      scheduleTimes: p.scheduleTimes.includes(t)
        ? p.scheduleTimes.filter(x => x !== t)
        : [...p.scheduleTimes, t]
    }));
  };

  const handleAdd = () => {
    if (!form.name || !form.dosage || form.scheduleTimes.length === 0) return;
    onAdd({
      name: form.name,
      genericName: form.genericName || undefined,
      dosage: form.dosage,
      unit: form.unit,
      form: form.form,
      scheduleTimes: form.scheduleTimes,
      frequencyDescription: form.frequencyDescription,
      instructions: form.instructions,
      currentStock: parseInt(form.currentStock) || 30,
      totalPackSize: parseInt(form.totalPackSize) || 30,
      refillThresholdDays: parseInt(form.refillThresholdDays) || 7,
      pillsPerDose: parseInt(form.pillsPerDose) || 1,
      rxNumber: form.rxNumber || undefined,
      prescribedBy: form.prescribedBy || undefined,
      pharmacyName: form.pharmacyName || undefined,
      pharmacyPhone: form.pharmacyPhone || undefined,
      colorTheme: form.colorTheme,
      refillPending: false
    });
    onClose();
  };

  const timeslots: TimeOfDay[] = ['Morning', 'Afternoon', 'Evening', 'Night'];

  return (
    <div className="card-glass-elevated border border-cyan-800/40 p-5 shadow-glow-cyan animate-fade-up">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-cyan-900/30 border border-cyan-800/50 flex items-center justify-center">
            <Plus className="w-4 h-4 text-cyan-400" />
          </div>
          <h3 className="font-semibold text-sm text-white">Add New Medication</h3>
        </div>
        <button onClick={onClose} className="text-slate-500 hover:text-slate-300">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-5">
        <div className="lg:col-span-2">
          <label className="label-field">Medication Name *</label>
          <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
            placeholder="e.g. Lisinopril" className="input-field" />
        </div>
        <div>
          <label className="label-field">Generic Name</label>
          <input value={form.genericName} onChange={e => setForm(p => ({ ...p, genericName: e.target.value }))}
            placeholder="Optional" className="input-field" />
        </div>
        <div>
          <label className="label-field">Dosage *</label>
          <input value={form.dosage} onChange={e => setForm(p => ({ ...p, dosage: e.target.value }))}
            placeholder="e.g. 10" className="input-field" />
        </div>
        <div>
          <label className="label-field">Unit</label>
          <select value={form.unit} onChange={e => setForm(p => ({ ...p, unit: e.target.value }))} className="select-field">
            {['mg', 'mcg', 'ml', 'g', 'IU', 'puffs', 'units', '%'].map(u => <option key={u} value={u}>{u}</option>)}
          </select>
        </div>
        <div>
          <label className="label-field">Form</label>
          <select value={form.form} onChange={e => setForm(p => ({ ...p, form: e.target.value as Medication['form'] }))} className="select-field">
            {['tablet', 'capsule', 'liquid', 'inhaler', 'injection', 'topical'].map(f => <option key={f} value={f} className="capitalize">{f}</option>)}
          </select>
        </div>
        <div>
          <label className="label-field">Doses per Intake</label>
          <input type="number" min="1" value={form.pillsPerDose} onChange={e => setForm(p => ({ ...p, pillsPerDose: e.target.value }))}
            className="input-field" />
        </div>
        <div>
          <label className="label-field">Current Stock (units)</label>
          <input type="number" value={form.currentStock} onChange={e => setForm(p => ({ ...p, currentStock: e.target.value }))}
            placeholder="e.g. 30" className="input-field" />
        </div>
        <div>
          <label className="label-field">Pack Size (units)</label>
          <input type="number" value={form.totalPackSize} onChange={e => setForm(p => ({ ...p, totalPackSize: e.target.value }))}
            placeholder="e.g. 30" className="input-field" />
        </div>
        <div>
          <label className="label-field">Refill Alert (days)</label>
          <input type="number" value={form.refillThresholdDays} onChange={e => setForm(p => ({ ...p, refillThresholdDays: e.target.value }))}
            className="input-field" />
        </div>
        <div className="lg:col-span-2">
          <label className="label-field">Instructions</label>
          <input value={form.instructions} onChange={e => setForm(p => ({ ...p, instructions: e.target.value }))}
            placeholder="e.g. Take with food and 8oz water" className="input-field" />
        </div>
        <div>
          <label className="label-field">Frequency Description</label>
          <input value={form.frequencyDescription} onChange={e => setForm(p => ({ ...p, frequencyDescription: e.target.value }))}
            placeholder="e.g. Once daily in the morning" className="input-field" />
        </div>
        <div>
          <label className="label-field">Rx Number</label>
          <input value={form.rxNumber} onChange={e => setForm(p => ({ ...p, rxNumber: e.target.value }))}
            placeholder="Optional" className="input-field" />
        </div>
        <div>
          <label className="label-field">Prescribed By</label>
          <input value={form.prescribedBy} onChange={e => setForm(p => ({ ...p, prescribedBy: e.target.value }))}
            placeholder="Physician name" className="input-field" />
        </div>
        <div>
          <label className="label-field">Pharmacy Name</label>
          <input value={form.pharmacyName} onChange={e => setForm(p => ({ ...p, pharmacyName: e.target.value }))}
            placeholder="Pharmacy" className="input-field" />
        </div>
        <div>
          <label className="label-field">Pharmacy Phone</label>
          <input value={form.pharmacyPhone} onChange={e => setForm(p => ({ ...p, pharmacyPhone: e.target.value }))}
            placeholder="+1 (555) 000-0000" className="input-field" />
        </div>
        <div>
          <label className="label-field">Color Theme</label>
          <div className="flex gap-2">
            {['#8b5cf6', '#10b981', '#06b6d4', '#f59e0b', '#f43f5e', '#0ea5e9'].map(c => (
              <button key={c} onClick={() => setForm(p => ({ ...p, colorTheme: c }))}
                className={`w-7 h-7 rounded-lg border-2 transition-all ${form.colorTheme === c ? 'border-white scale-110' : 'border-transparent'}`}
                style={{ backgroundColor: c }} />
            ))}
          </div>
        </div>
      </div>

      <div className="mb-5">
        <label className="label-field">Schedule Times *</label>
        <div className="flex flex-wrap gap-2">
          {timeslots.map(t => (
            <button
              key={t}
              onClick={() => toggleTime(t)}
              className={`text-sm font-medium px-4 py-2 rounded-xl border transition-all ${
                form.scheduleTimes.includes(t)
                  ? `${TIME_BADGES[t].className} scale-105`
                  : 'bg-slate-800/60 text-slate-500 border-slate-700/60 hover:text-slate-300'
              }`}
            >
              {t} · {TIME_BADGES[t].hour}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-3">
        <button onClick={handleAdd} className="btn-primary flex items-center gap-2">
          <Save className="w-4 h-4" />
          Add Medication
        </button>
        <button onClick={onClose} className="btn-secondary">Cancel</button>
      </div>
    </div>
  );
}

export default function MedicationTracker({
  medications, showAddMedForm, onCloseAddMed, onAddMedication, onMarkTaken, onMarkSkipped
}: MedicationTrackerProps) {
  const [filterTime, setFilterTime] = useState<TimeOfDay | 'All'>('All');

  const filtered = filterTime === 'All'
    ? medications
    : medications.filter(m => m.scheduleTimes.includes(filterTime));

  const timeslots: (TimeOfDay | 'All')[] = ['All', 'Morning', 'Afternoon', 'Evening', 'Night'];

  const lowStockMeds = medications.filter(med => {
    const daysRemaining = Math.floor(med.currentStock / med.pillsPerDose / med.scheduleTimes.length);
    return daysRemaining <= med.refillThresholdDays;
  });

  const todayLogs = medications.flatMap(med =>
    med.doseLogs.filter(dl => dl.date === new Date().toISOString().slice(0, 10))
  );
  const takenToday = todayLogs.filter(dl => dl.status === 'taken').length;
  const pendingToday = todayLogs.filter(dl => dl.status === 'pending').length;

  return (
    <div className="space-y-5">
      {/* Stats Banner */}
      <div className="grid grid-cols-3 gap-3">
        <div className="card-glass p-4 text-center">
          <div className="font-mono text-2xl font-bold text-emerald-400">{takenToday}</div>
          <div className="text-[10px] text-slate-500 mt-1 uppercase tracking-wider">Doses Taken</div>
        </div>
        <div className="card-glass p-4 text-center">
          <div className="font-mono text-2xl font-bold text-amber-400">{pendingToday}</div>
          <div className="text-[10px] text-slate-500 mt-1 uppercase tracking-wider">Doses Pending</div>
        </div>
        <div className="card-glass p-4 text-center">
          <div className={`font-mono text-2xl font-bold ${lowStockMeds.length > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
            {lowStockMeds.length}
          </div>
          <div className="text-[10px] text-slate-500 mt-1 uppercase tracking-wider">Refill Needed</div>
        </div>
      </div>

      {/* Add Medication Form */}
      {showAddMedForm && (
        <AddMedicationForm onClose={onCloseAddMed} onAdd={onAddMedication} />
      )}

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {timeslots.map(t => (
          <button
            key={t}
            onClick={() => setFilterTime(t)}
            className={`text-xs font-medium px-4 py-2 rounded-xl border transition-all duration-200 ${
              filterTime === t
                ? t === 'All'
                  ? 'bg-violet-600/20 text-violet-300 border-violet-500/40'
                  : TIME_BADGES[t as TimeOfDay]?.className
                : 'bg-slate-800/60 text-slate-500 border-slate-700/60 hover:text-slate-300'
            }`}
          >
            {t === 'All' ? `All Medications (${medications.length})` : (
              <>
                {t}
                <span className="ml-1 text-[10px] opacity-70">
                  ({medications.filter(m => m.scheduleTimes.includes(t as TimeOfDay)).length})
                </span>
              </>
            )}
          </button>
        ))}
      </div>

      {/* Medication Cards */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="card-glass p-10 text-center">
            <Pill className="w-10 h-10 text-slate-700 mx-auto mb-3" />
            <p className="text-slate-500 text-sm">No medications scheduled for this time slot.</p>
          </div>
        ) : (
          filtered.map(med => (
            <MedicationCard
              key={med.id}
              med={med}
              onMarkTaken={onMarkTaken}
              onMarkSkipped={onMarkSkipped}
            />
          ))
        )}
      </div>
    </div>
  );
}
