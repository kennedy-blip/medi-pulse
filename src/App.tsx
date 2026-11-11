import React, { useState } from 'react';
import Header from './components/Header';
import Navigation, { TabId } from './components/Navigation';
import HealthDashboard from './components/HealthDashboard';
import MedicationTracker from './components/MedicationTracker';
import SymptomJournal from './components/SymptomJournal';
import FamilyVault from './components/FamilyVault';
import EmergencyRouter from './components/EmergencyRouter';
import { useHealthStore } from './hooks/useHealthStore';

function ExportModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative card-glass-elevated border border-violet-800/50 p-6 max-w-md w-full shadow-2xl animate-fade-up">
        <h3 className="text-base font-bold text-white mb-2">Export Health Summary</h3>
        <p className="text-sm text-slate-400 mb-5 leading-relaxed">
          Generate a comprehensive PDF health report including vitals history, medication records, symptom journal, and family medical vault for your physician or for your personal records.
        </p>
        <div className="space-y-2 mb-5">
          {[
            'Vital Signs History (Last 30 days)',
            'Medication Adherence Report',
            'Symptom Correlation Journal',
            'Family Medical Vault Summary',
            'Prescription & Insurance Details'
          ].map((item, i) => (
            <label key={i} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-800/40 cursor-pointer">
              <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-slate-700 bg-slate-800 text-violet-500 focus:ring-violet-500/50" />
              <span className="text-sm text-slate-300">{item}</span>
            </label>
          ))}
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => {
              alert('Health Summary export generated! In a production deployment this would generate a PDF.');
              onClose();
            }}
            className="btn-primary flex-1"
          >
            Generate PDF Report
          </button>
          <button onClick={onClose} className="btn-secondary">Cancel</button>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [activeTab, setActiveTab] = useState<TabId>('dashboard');
  const [showQuickVitalForm, setShowQuickVitalForm] = useState(false);
  const [showAddMedForm, setShowAddMedForm] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);

  const store = useHealthStore();

  const handleTabChange = (tab: TabId) => {
    setActiveTab(tab);
    setShowQuickVitalForm(false);
    setShowAddMedForm(false);
  };

  const handleQuickVital = () => {
    setActiveTab('dashboard');
    setShowQuickVitalForm(true);
  };

  const handleAddMed = () => {
    setActiveTab('medications');
    setShowAddMedForm(true);
  };

  return (
    <div className="min-h-screen bg-[#070a12] bg-grid-pattern relative overflow-x-hidden">
      {/* Background ambient glows */}
      <div className="fixed inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-600/4 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-cyan-600/4 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10">
        <Header
          onQuickVital={handleQuickVital}
          onAddMed={handleAddMed}
          onExport={() => setShowExportModal(true)}
        />

        <Navigation
          activeTab={activeTab}
          onTabChange={handleTabChange}
          lowStockCount={store.lowStockMeds.length}
          activeSymptomsCount={store.activeSymptomsCount}
          onQuickVital={handleQuickVital}
          onAddMed={handleAddMed}
          onExport={() => setShowExportModal(true)}
        />

        <main className="max-w-[1440px] mx-auto px-4 sm:px-6 py-6">
          {activeTab === 'dashboard' && (
            <HealthDashboard
              memberName={store.activeMember?.name || ''}
              memberBg={store.activeMember?.avatarBg || ''}
              latestVital={store.latestVital}
              vitals={store.memberVitals}
              adherenceRate={store.adherenceRate}
              lowStockMeds={store.lowStockMeds}
              activeSymptomsCount={store.activeSymptomsCount}
              takenToday={store.takenToday}
              totalDosesToday={store.totalDosesToday}
              showQuickVitalForm={showQuickVitalForm}
              onCloseVitalForm={() => setShowQuickVitalForm(false)}
              onSaveVital={(data) => {
                store.addVitalLog(data);
                setShowQuickVitalForm(false);
              }}
              onNavigateToMeds={() => handleTabChange('medications')}
              onNavigateToSymptoms={() => handleTabChange('symptoms')}
            />
          )}

          {activeTab === 'medications' && (
            <MedicationTracker
              medications={store.memberMedications}
              showAddMedForm={showAddMedForm}
              onCloseAddMed={() => setShowAddMedForm(false)}
              onAddMedication={(data) => {
                store.addMedication(data);
                setShowAddMedForm(false);
              }}
              onMarkTaken={store.markDoseTaken}
              onMarkSkipped={store.markDoseSkipped}
            />
          )}

          {activeTab === 'symptoms' && (
            <SymptomJournal
              symptoms={store.memberSymptoms}
              insights={store.insights}
              onAddSymptom={store.addSymptomLog}
              onResolveSymptom={store.resolveSymptom}
            />
          )}

          {activeTab === 'family' && (
            <FamilyVault
              members={store.members}
              medications={store.medications}
              vitals={store.vitals}
              activeMemberId={store.activeMemberId}
              onSelectMember={store.setActiveMemberId}
            />
          )}

          {activeTab === 'emergency' && (
            <EmergencyRouter />
          )}
        </main>

        {/* Footer */}
        <footer className="border-t border-slate-800/60 mt-12 py-6 px-4 sm:px-6">
          <div className="max-w-[1440px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs text-slate-600">
              <span className="font-mono">MediPulse v1.0.0</span>
              <span>·</span>
              <span>AI-Powered Family Health Operations Hub</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-[10px] text-slate-700 font-mono">All data stored locally · No cloud upload · HIPAA-aware design</span>
              <span className="flex items-center gap-1 text-[10px] font-mono text-emerald-500">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                HEALTH GUARD: ACTIVE
              </span>
            </div>
          </div>
        </footer>
      </div>

      {/* Export Modal */}
      {showExportModal && <ExportModal onClose={() => setShowExportModal(false)} />}
    </div>
  );
}
