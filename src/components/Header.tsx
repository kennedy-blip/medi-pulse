import React, { useState } from 'react';
import { Activity, Shield, Zap, Plus, FileText, ChevronDown, Bell, Settings, X } from 'lucide-react';

interface HeaderProps {
  onQuickVital: () => void;
  onAddMed: () => void;
  onExport: () => void;
}

export default function Header({ onQuickVital, onAddMed, onExport }: HeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications] = useState([
    { id: 1, type: 'warning', message: 'Omega-3 CoQ10 refill needed — 3 days remaining', time: '10m ago' },
    { id: 2, type: 'warning', message: 'Sumatriptan critically low — refill required ASAP', time: '1h ago' },
    { id: 3, type: 'success', message: 'Lisinopril adherence streak: 7 consecutive days!', time: '2h ago' },
    { id: 4, type: 'info', message: 'Blood pressure check reminder for Elena Rivera', time: '3h ago' },
  ]);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-800/80 bg-[#070a12]/90 backdrop-blur-xl">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-purple-700 flex items-center justify-center animate-glow-violet">
                <Activity className="w-5 h-5 text-white" strokeWidth={2.5} />
              </div>
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-[#070a12]"></span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight text-white leading-none">MediPulse</span>
                <span className="hidden sm:flex items-center gap-1 text-[10px] font-mono font-semibold text-emerald-400 bg-emerald-900/30 border border-emerald-800/50 px-2 py-0.5 rounded-full">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span>
                  HEALTH GUARD: ACTIVE
                </span>
              </div>
              <span className="text-[10px] text-slate-500 leading-none mt-0.5 hidden sm:block">AI-Powered Family Health Operations Hub</span>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2">
            {/* Quick Vital */}
            <button
              onClick={onQuickVital}
              className="hidden md:flex items-center gap-2 btn-primary text-xs py-2 px-3"
            >
              <Zap className="w-3.5 h-3.5" />
              Log Vital
            </button>

            {/* Add Medication */}
            <button
              onClick={onAddMed}
              className="hidden md:flex items-center gap-2 bg-cyan-900/30 hover:bg-cyan-800/40 text-cyan-400 font-semibold text-xs py-2 px-3 rounded-xl border border-cyan-800/50 transition-all duration-200"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Med
            </button>

            {/* Export */}
            <button
              onClick={onExport}
              className="hidden md:flex items-center gap-2 bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 font-medium text-xs py-2 px-3 rounded-xl border border-slate-700/80 transition-all duration-200"
            >
              <FileText className="w-3.5 h-3.5" />
              Export
            </button>

            {/* Notifications Bell */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 rounded-xl bg-slate-800/60 hover:bg-slate-700/60 border border-slate-700/80 text-slate-400 hover:text-slate-200 transition-all duration-200"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full border border-[#070a12]"></span>
              </button>

              {showNotifications && (
                <div className="absolute right-0 top-full mt-2 w-80 card-glass-elevated shadow-2xl z-50 overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800">
                    <span className="text-sm font-semibold text-slate-200">Alerts & Notifications</span>
                    <button onClick={() => setShowNotifications(false)} className="text-slate-500 hover:text-slate-300">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="max-h-80 overflow-y-auto divide-y divide-slate-800/60">
                    {notifications.map(notif => (
                      <div key={notif.id} className="flex gap-3 px-4 py-3 hover:bg-slate-800/40 cursor-pointer">
                        <div className={`mt-0.5 w-2 h-2 rounded-full flex-shrink-0 ${
                          notif.type === 'warning' ? 'bg-amber-400' :
                          notif.type === 'success' ? 'bg-emerald-400' : 'bg-cyan-400'
                        }`}></div>
                        <div>
                          <p className="text-xs text-slate-300 leading-relaxed">{notif.message}</p>
                          <p className="text-[10px] text-slate-600 mt-1">{notif.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Settings */}
            <button className="p-2 rounded-xl bg-slate-800/60 hover:bg-slate-700/60 border border-slate-700/80 text-slate-400 hover:text-slate-200 transition-all duration-200">
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
