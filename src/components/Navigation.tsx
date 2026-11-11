import React from 'react';
import {
  LayoutDashboard,
  Pill,
  BookHeart,
  Users,
  MapPinned,
  Zap,
  Plus,
  FileText,
  LucideIcon
} from 'lucide-react';

export type TabId = 'dashboard' | 'medications' | 'symptoms' | 'family' | 'emergency';

interface Tab {
  id: TabId;
  label: string;
  icon: LucideIcon;
  badge?: number;
}

interface NavigationProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
  lowStockCount: number;
  activeSymptomsCount: number;
  onQuickVital: () => void;
  onAddMed: () => void;
  onExport: () => void;
}

export default function Navigation({
  activeTab,
  onTabChange,
  lowStockCount,
  activeSymptomsCount,
  onQuickVital,
  onAddMed,
  onExport
}: NavigationProps) {
  const tabs: Tab[] = [
    { id: 'dashboard', label: 'Health Dashboard', icon: LayoutDashboard },
    { id: 'medications', label: 'Medication Schedule', icon: Pill, badge: lowStockCount > 0 ? lowStockCount : undefined },
    { id: 'symptoms', label: 'Symptom Journal', icon: BookHeart, badge: activeSymptomsCount > 0 ? activeSymptomsCount : undefined },
    { id: 'family', label: 'Family Vault', icon: Users },
    { id: 'emergency', label: 'Emergency Care', icon: MapPinned },
  ];

  return (
    <div className="border-b border-slate-800/80 bg-[#070a12]/80 backdrop-blur-sm">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6">
        <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`relative flex items-center gap-2 px-4 py-3.5 text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                  isActive ? 'tab-active' : 'tab-inactive'
                }`}
              >
                <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-violet-400' : ''}`} />
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden">{tab.label.split(' ')[0]}</span>
                {tab.badge && (
                  <span className={`flex items-center justify-center min-w-[18px] h-[18px] text-[10px] font-bold rounded-full px-1 ${
                    tab.id === 'medications' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40' : 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}

          {/* Spacer */}
          <div className="flex-1" />

          {/* Mobile Quick Actions */}
          <div className="flex md:hidden items-center gap-1 py-2">
            <button onClick={onQuickVital} className="p-2 rounded-lg bg-violet-600/20 text-violet-400 border border-violet-500/30">
              <Zap className="w-4 h-4" />
            </button>
            <button onClick={onAddMed} className="p-2 rounded-lg bg-cyan-900/20 text-cyan-400 border border-cyan-800/30">
              <Plus className="w-4 h-4" />
            </button>
            <button onClick={onExport} className="p-2 rounded-lg bg-slate-800 text-slate-400 border border-slate-700/80">
              <FileText className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
