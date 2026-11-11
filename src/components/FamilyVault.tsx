import React, { useState } from 'react';
import {
  Users, Heart, Shield, Phone, Stethoscope, AlertTriangle, Droplets,
  ChevronDown, ChevronUp, User, BadgeInfo, FileHeart, Building2
} from 'lucide-react';
import { FamilyMember, Medication, VitalLog } from '../types/health';

interface FamilyVaultProps {
  members: FamilyMember[];
  medications: Medication[];
  vitals: VitalLog[];
  activeMemberId: string;
  onSelectMember: (id: string) => void;
}

const RELATIONSHIP_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  'Self': { bg: 'bg-violet-900/40', text: 'text-violet-300', border: 'border-violet-700/50' },
  'Spouse': { bg: 'bg-emerald-900/30', text: 'text-emerald-400', border: 'border-emerald-800/40' },
  'Child': { bg: 'bg-cyan-900/30', text: 'text-cyan-400', border: 'border-cyan-800/40' },
  'Parent': { bg: 'bg-amber-900/30', text: 'text-amber-400', border: 'border-amber-800/40' },
  'Dependent': { bg: 'bg-blue-900/30', text: 'text-blue-400', border: 'border-blue-800/40' },
  'Other': { bg: 'bg-slate-800', text: 'text-slate-400', border: 'border-slate-700' },
};

const BLOOD_TYPE_COLORS: Record<string, string> = {
  'O+': 'text-rose-400 bg-rose-900/30 border-rose-800/50',
  'O-': 'text-rose-400 bg-rose-900/30 border-rose-800/50',
  'A+': 'text-amber-400 bg-amber-900/30 border-amber-800/50',
  'A-': 'text-amber-400 bg-amber-900/30 border-amber-800/50',
  'B+': 'text-cyan-400 bg-cyan-900/30 border-cyan-800/50',
  'B-': 'text-cyan-400 bg-cyan-900/30 border-cyan-800/50',
  'AB+': 'text-violet-400 bg-violet-900/30 border-violet-800/50',
  'AB-': 'text-violet-400 bg-violet-900/30 border-violet-800/50',
};

function MemberCard({
  member, medications, vitals, isActive, onSelect
}: {
  member: FamilyMember;
  medications: Medication[];
  vitals: VitalLog[];
  isActive: boolean;
  onSelect: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const memberMeds = medications.filter(m => m.memberId === member.id);
  const latestVital = vitals
    .filter(v => v.memberId === member.id)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];

  const lowStockMeds = memberMeds.filter(med => {
    const daysRemaining = Math.floor(med.currentStock / med.pillsPerDose / med.scheduleTimes.length);
    return daysRemaining <= med.refillThresholdDays;
  });

  const relColors = RELATIONSHIP_COLORS[member.relationship] || RELATIONSHIP_COLORS.Other;
  const initials = member.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  return (
    <div
      className={`card-glass overflow-hidden transition-all duration-200 ${
        isActive ? 'border-violet-700/60 shadow-glow-violet' : 'hover-glow-violet'
      }`}
    >
      <div className="p-5">
        {/* Profile Header */}
        <div className="flex items-start gap-4 mb-4">
          <button
            onClick={onSelect}
            className={`relative w-14 h-14 rounded-2xl bg-gradient-to-br ${member.avatarBg} flex items-center justify-center font-bold text-white text-lg flex-shrink-0 transition-transform hover:scale-105 shadow-lg`}
          >
            {initials}
            {isActive && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-violet-500 rounded-full border-2 border-[#070a12] flex items-center justify-center">
                <User className="w-2.5 h-2.5 text-white" />
              </span>
            )}
          </button>

          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h3 className="font-bold text-base text-white">{member.name}</h3>
              <span className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full border ${relColors.bg} ${relColors.text} ${relColors.border}`}>
                {member.relationship}
              </span>
              {isActive && (
                <span className="text-[10px] font-mono text-violet-400 bg-violet-900/20 border border-violet-800/40 px-2 py-0.5 rounded-full">
                  Active Profile
                </span>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
              <span>{member.age} years old · {member.gender}</span>
              <span className={`font-mono font-bold text-xs px-2 py-0.5 rounded-lg border ${BLOOD_TYPE_COLORS[member.bloodType]}`}>
                {member.bloodType}
              </span>
            </div>
          </div>

          {!isActive && (
            <button
              onClick={onSelect}
              className="flex-shrink-0 text-xs text-violet-400 hover:text-violet-300 bg-violet-900/20 hover:bg-violet-900/30 border border-violet-800/50 px-3 py-1.5 rounded-xl transition-all font-medium"
            >
              Switch To
            </button>
          )}
        </div>

        {/* Quick Stats Row */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="bg-slate-900/60 rounded-xl px-3 py-2 text-center">
            <div className="font-mono text-sm font-bold text-cyan-400">{memberMeds.length}</div>
            <div className="text-[10px] text-slate-600">Medications</div>
          </div>
          <div className={`rounded-xl px-3 py-2 text-center ${lowStockMeds.length > 0 ? 'bg-amber-900/20' : 'bg-slate-900/60'}`}>
            <div className={`font-mono text-sm font-bold ${lowStockMeds.length > 0 ? 'text-amber-400' : 'text-slate-500'}`}>
              {lowStockMeds.length}
            </div>
            <div className="text-[10px] text-slate-600">Refills Due</div>
          </div>
          <div className="bg-slate-900/60 rounded-xl px-3 py-2 text-center">
            <div className="font-mono text-sm font-bold text-violet-400">
              {latestVital?.bloodPressure ? `${latestVital.bloodPressure.systolic}/${latestVital.bloodPressure.diastolic}` : '—'}
            </div>
            <div className="text-[10px] text-slate-600">Last BP</div>
          </div>
        </div>

        {/* Allergies & Conditions */}
        <div className="space-y-3 mb-4">
          {member.allergies.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 mb-1.5">
                <AlertTriangle className="w-3 h-3 text-rose-400" />
                <span className="text-[10px] text-slate-600 uppercase tracking-wider font-medium">Allergies</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {member.allergies.map((a, i) => (
                  <span key={i} className="text-[10px] font-mono text-rose-400 bg-rose-900/20 border border-rose-800/40 px-2 py-0.5 rounded-full">
                    ⚠ {a}
                  </span>
                ))}
              </div>
            </div>
          )}

          {member.chronicConditions.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 mb-1.5">
                <Heart className="w-3 h-3 text-violet-400" />
                <span className="text-[10px] text-slate-600 uppercase tracking-wider font-medium">Chronic Conditions</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {member.chronicConditions.map((c, i) => (
                  <span key={i} className="text-[10px] font-mono text-violet-400 bg-violet-900/20 border border-violet-800/40 px-2 py-0.5 rounded-full">
                    {c}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Expand for more details */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-1 text-[11px] text-slate-500 hover:text-slate-300 transition-colors"
        >
          {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          {expanded ? 'Hide medical details' : 'View physician, insurance & emergency contacts'}
        </button>

        {expanded && (
          <div className="mt-4 pt-4 border-t border-slate-800/60 space-y-4 animate-fade-up">
            {/* Physician */}
            <div>
              <div className="flex items-center gap-1.5 mb-2">
                <Stethoscope className="w-3.5 h-3.5 text-cyan-400" />
                <span className="text-[10px] text-slate-500 uppercase tracking-wider font-medium">Primary Physician</span>
              </div>
              <div className="bg-slate-900/60 rounded-xl p-3">
                <p className="text-sm font-semibold text-white">{member.physician.name}</p>
                <p className="text-xs text-slate-500 mt-0.5">{member.physician.specialty}</p>
                <p className="text-xs text-slate-600 mt-0.5">{member.physician.clinic}</p>
                <a href={`tel:${member.physician.phone}`} className="flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300 mt-2">
                  <Phone className="w-3 h-3" /> {member.physician.phone}
                </a>
              </div>
            </div>

            {/* Insurance */}
            <div>
              <div className="flex items-center gap-1.5 mb-2">
                <Shield className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-[10px] text-slate-500 uppercase tracking-wider font-medium">Health Insurance</span>
              </div>
              <div className="bg-slate-900/60 rounded-xl p-3 space-y-1.5">
                <p className="text-sm font-semibold text-white">{member.insurance.provider}</p>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-[10px] text-slate-600">Policy #</p>
                    <p className="font-mono text-xs text-slate-300">{member.insurance.policyNumber}</p>
                  </div>
                  {member.insurance.groupNumber && (
                    <div>
                      <p className="text-[10px] text-slate-600">Group #</p>
                      <p className="font-mono text-xs text-slate-300">{member.insurance.groupNumber}</p>
                    </div>
                  )}
                  {member.insurance.rxBin && (
                    <div>
                      <p className="text-[10px] text-slate-600">Rx BIN</p>
                      <p className="font-mono text-xs text-slate-300">{member.insurance.rxBin}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Emergency Contact */}
            <div>
              <div className="flex items-center gap-1.5 mb-2">
                <Phone className="w-3.5 h-3.5 text-rose-400" />
                <span className="text-[10px] text-slate-500 uppercase tracking-wider font-medium">Emergency Contact</span>
              </div>
              <div className="bg-rose-900/10 border border-rose-900/30 rounded-xl p-3">
                <p className="text-sm font-semibold text-white">{member.emergencyContact.name}</p>
                <p className="text-xs text-slate-500 mt-0.5">{member.emergencyContact.relation}</p>
                <a href={`tel:${member.emergencyContact.phone}`} className="flex items-center gap-1.5 text-xs text-rose-400 hover:text-rose-300 mt-2 font-semibold">
                  <Phone className="w-3 h-3" /> {member.emergencyContact.phone}
                </a>
              </div>
            </div>

            {/* Notes */}
            {member.notes && (
              <div>
                <div className="flex items-center gap-1.5 mb-2">
                  <FileHeart className="w-3.5 h-3.5 text-violet-400" />
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider font-medium">Clinical Notes</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed bg-slate-900/40 rounded-xl p-3 font-mono">
                  {member.notes}
                </p>
              </div>
            )}

            {/* Medication List for this Member */}
            {memberMeds.length > 0 && (
              <div>
                <div className="flex items-center gap-1.5 mb-2">
                  <BadgeInfo className="w-3.5 h-3.5 text-amber-400" />
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider font-medium">
                    Active Medications ({memberMeds.length})
                  </span>
                </div>
                <div className="space-y-1.5">
                  {memberMeds.map(med => {
                    const daysRemaining = Math.floor(med.currentStock / med.pillsPerDose / med.scheduleTimes.length);
                    return (
                      <div key={med.id} className="flex items-center gap-3 bg-slate-900/50 rounded-xl px-3 py-2">
                        <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: med.colorTheme }}></div>
                        <div className="flex-1 min-w-0">
                          <span className="text-xs font-semibold text-slate-200">{med.name}</span>
                          <span className="text-[10px] text-slate-600 ml-2 font-mono">{med.dosage}{med.unit}</span>
                        </div>
                        <span className={`text-[10px] font-mono flex-shrink-0 ${
                          daysRemaining <= 3 ? 'text-rose-400' : daysRemaining <= med.refillThresholdDays ? 'text-amber-400' : 'text-slate-500'
                        }`}>
                          {daysRemaining}d left
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function FamilyVault({ members, medications, vitals, activeMemberId, onSelectMember }: FamilyVaultProps) {
  const totalMeds = medications.length;
  const lowStockTotal = medications.filter(med => {
    const days = Math.floor(med.currentStock / med.pillsPerDose / med.scheduleTimes.length);
    return days <= med.refillThresholdDays;
  }).length;
  const totalAllergies = [...new Set(members.flatMap(m => m.allergies))].length;

  return (
    <div className="space-y-5">
      {/* Family Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="card-glass p-4 text-center">
          <div className="font-mono text-2xl font-bold text-violet-400">{members.length}</div>
          <div className="text-[10px] text-slate-500 mt-1 uppercase tracking-wider">Family Members</div>
        </div>
        <div className="card-glass p-4 text-center">
          <div className="font-mono text-2xl font-bold text-cyan-400">{totalMeds}</div>
          <div className="text-[10px] text-slate-500 mt-1 uppercase tracking-wider">Total Medications</div>
        </div>
        <div className={`card-glass p-4 text-center ${lowStockTotal > 0 ? 'border-amber-900/50' : ''}`}>
          <div className={`font-mono text-2xl font-bold ${lowStockTotal > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>{lowStockTotal}</div>
          <div className="text-[10px] text-slate-500 mt-1 uppercase tracking-wider">Refills Needed</div>
        </div>
        <div className="card-glass p-4 text-center">
          <div className="font-mono text-2xl font-bold text-rose-400">{totalAllergies}</div>
          <div className="text-[10px] text-slate-500 mt-1 uppercase tracking-wider">Known Allergies</div>
        </div>
      </div>

      {/* Alert: Select Profile */}
      <div className="card-glass border border-violet-800/30 p-4 flex items-center gap-3">
        <div className="w-8 h-8 rounded-xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center flex-shrink-0">
          <Users className="w-4 h-4 text-violet-400" />
        </div>
        <div>
          <p className="text-xs text-slate-300 font-medium">
            Switch the active profile to view personalized medications, vitals, and symptoms for each family member.
          </p>
          <p className="text-[11px] text-slate-600 mt-0.5">Currently viewing: <span className="text-violet-400 font-semibold">{members.find(m => m.id === activeMemberId)?.name}</span></p>
        </div>
      </div>

      {/* Member Cards */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        {members.map(member => (
          <MemberCard
            key={member.id}
            member={member}
            medications={medications}
            vitals={vitals}
            isActive={member.id === activeMemberId}
            onSelect={() => onSelectMember(member.id)}
          />
        ))}
      </div>
    </div>
  );
}
