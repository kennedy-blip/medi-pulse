import { useState, useEffect } from 'react';
import { FamilyMember, Medication, VitalLog, SymptomLog, AiCorrelationInsight } from '../types/health';
import {
  INITIAL_FAMILY_MEMBERS,
  INITIAL_MEDICATIONS,
  INITIAL_VITALS,
  INITIAL_SYMPTOMS,
  INITIAL_AI_INSIGHTS
} from '../services/mockData';

const STORAGE_KEY_MEMBERS = 'medipulse_members';
const STORAGE_KEY_MEDS = 'medipulse_medications';
const STORAGE_KEY_VITALS = 'medipulse_vitals';
const STORAGE_KEY_SYMPTOMS = 'medipulse_symptoms';
const STORAGE_KEY_INSIGHTS = 'medipulse_insights';

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const stored = localStorage.getItem(key);
    if (stored) return JSON.parse(stored) as T;
  } catch {}
  return fallback;
}

function saveToStorage<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch {}
}

export function useHealthStore() {
  const [members, setMembers] = useState<FamilyMember[]>(() =>
    loadFromStorage(STORAGE_KEY_MEMBERS, INITIAL_FAMILY_MEMBERS)
  );
  const [medications, setMedications] = useState<Medication[]>(() =>
    loadFromStorage(STORAGE_KEY_MEDS, INITIAL_MEDICATIONS)
  );
  const [vitals, setVitals] = useState<VitalLog[]>(() =>
    loadFromStorage(STORAGE_KEY_VITALS, INITIAL_VITALS)
  );
  const [symptoms, setSymptoms] = useState<SymptomLog[]>(() =>
    loadFromStorage(STORAGE_KEY_SYMPTOMS, INITIAL_SYMPTOMS)
  );
  const [insights, setInsights] = useState<AiCorrelationInsight[]>(() =>
    loadFromStorage(STORAGE_KEY_INSIGHTS, INITIAL_AI_INSIGHTS)
  );
  const [activeMemberId, setActiveMemberId] = useState<string>('mem-1');

  useEffect(() => { saveToStorage(STORAGE_KEY_MEMBERS, members); }, [members]);
  useEffect(() => { saveToStorage(STORAGE_KEY_MEDS, medications); }, [medications]);
  useEffect(() => { saveToStorage(STORAGE_KEY_VITALS, vitals); }, [vitals]);
  useEffect(() => { saveToStorage(STORAGE_KEY_SYMPTOMS, symptoms); }, [symptoms]);
  useEffect(() => { saveToStorage(STORAGE_KEY_INSIGHTS, insights); }, [insights]);

  const activeMember = members.find(m => m.id === activeMemberId) || members[0];

  const memberMedications = medications.filter(m => m.memberId === activeMemberId);
  const memberVitals = vitals
    .filter(v => v.memberId === activeMemberId)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  const memberSymptoms = symptoms
    .filter(s => s.memberId === activeMemberId)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  // Computed stats for dashboard
  const latestVital = memberVitals[0];

  const todayMeds = memberMedications.flatMap(med =>
    med.doseLogs.filter(dl => dl.date === new Date().toISOString().slice(0, 10))
  );
  const takenToday = todayMeds.filter(dl => dl.status === 'taken').length;
  const totalDosesToday = todayMeds.filter(dl => dl.status !== 'skipped').length;
  const adherenceRate = totalDosesToday > 0 ? Math.round((takenToday / totalDosesToday) * 100) : 100;

  const lowStockMeds = memberMedications.filter(med => {
    const daysRemaining = Math.floor(med.currentStock / med.pillsPerDose / med.scheduleTimes.length);
    return daysRemaining <= med.refillThresholdDays;
  });

  const activeSymptomsCount = symptoms.filter(s => !s.resolved).length;

  // Actions
  const markDoseTaken = (medicationId: string, doseLogId: string) => {
    setMedications(prev => prev.map(med => {
      if (med.id !== medicationId) return med;
      return {
        ...med,
        currentStock: Math.max(0, med.currentStock - med.pillsPerDose),
        doseLogs: med.doseLogs.map(dl =>
          dl.id === doseLogId
            ? { ...dl, status: 'taken' as const, timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) }
            : dl
        )
      };
    }));
  };

  const markDoseSkipped = (medicationId: string, doseLogId: string) => {
    setMedications(prev => prev.map(med => {
      if (med.id !== medicationId) return med;
      return {
        ...med,
        doseLogs: med.doseLogs.map(dl =>
          dl.id === doseLogId ? { ...dl, status: 'skipped' as const } : dl
        )
      };
    }));
  };

  const addVitalLog = (vitalData: Omit<VitalLog, 'id' | 'memberId' | 'timestamp'>) => {
    const newVital: VitalLog = {
      ...vitalData,
      id: `vit-${Date.now()}`,
      memberId: activeMemberId,
      timestamp: new Date().toISOString()
    };
    setVitals(prev => [newVital, ...prev]);
  };

  const addSymptomLog = (symptomData: Omit<SymptomLog, 'id' | 'memberId' | 'timestamp'>) => {
    const newSymptom: SymptomLog = {
      ...symptomData,
      id: `sym-${Date.now()}`,
      memberId: activeMemberId,
      timestamp: new Date().toISOString()
    };
    setSymptoms(prev => [newSymptom, ...prev]);
  };

  const resolveSymptom = (symptomId: string) => {
    setSymptoms(prev => prev.map(s => s.id === symptomId ? { ...s, resolved: true } : s));
  };

  const addMedication = (medData: Omit<Medication, 'id' | 'memberId' | 'doseLogs'>) => {
    const newMed: Medication = {
      ...medData,
      id: `med-${Date.now()}`,
      memberId: activeMemberId,
      doseLogs: []
    };
    setMedications(prev => [...prev, newMed]);
  };

  return {
    members,
    medications,
    vitals,
    symptoms,
    insights,
    activeMember,
    activeMemberId,
    setActiveMemberId,
    memberMedications,
    memberVitals,
    memberSymptoms,
    latestVital,
    adherenceRate,
    lowStockMeds,
    activeSymptomsCount,
    takenToday,
    totalDosesToday,
    markDoseTaken,
    markDoseSkipped,
    addVitalLog,
    addSymptomLog,
    resolveSymptom,
    addMedication,
  };
}
