export type TimeOfDay = 'Morning' | 'Afternoon' | 'Evening' | 'Night';

export type RelationshipType = 'Self' | 'Spouse' | 'Child' | 'Parent' | 'Dependent' | 'Other';

export interface EmergencyContact {
  name: string;
  relation: string;
  phone: string;
}

export interface InsuranceInfo {
  provider: string;
  policyNumber: string;
  groupNumber?: string;
  rxBin?: string;
}

export interface PhysicianInfo {
  name: string;
  specialty: string;
  clinic: string;
  phone: string;
}

export interface FamilyMember {
  id: string;
  name: string;
  relationship: RelationshipType;
  age: number;
  gender: 'Male' | 'Female' | 'Non-Binary' | 'Other';
  avatarBg: string;
  bloodType: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
  allergies: string[];
  chronicConditions: string[];
  emergencyContact: EmergencyContact;
  insurance: InsuranceInfo;
  physician: PhysicianInfo;
  notes?: string;
}

export interface BloodPressure {
  systolic: number;
  diastolic: number;
  pulse?: number;
}

export interface BloodGlucose {
  value: number; // mg/dL
  context: 'fasting' | 'before_meal' | 'after_meal' | 'bedtime' | 'random';
}

export interface SleepData {
  totalHours: number;
  deepHours?: number;
  remHours?: number;
  qualityScore: number; // 0-100
  sleepState: 'Optimal' | 'Restorative' | 'Restless' | 'Fragmented';
}

export interface VitalLog {
  id: string;
  memberId: string;
  timestamp: string; // ISO date string
  bloodPressure?: BloodPressure;
  heartRate?: number; // bpm
  glucose?: BloodGlucose;
  sleep?: SleepData;
  hydrationMl?: number; // ml logged
  oxygenSaturation?: number; // %
  bodyTempF?: number;
  notes?: string;
}

export interface MedicationDoseLog {
  id: string;
  date: string; // YYYY-MM-DD
  timeSlot: TimeOfDay;
  status: 'taken' | 'skipped' | 'pending';
  timestamp?: string; // actual time taken
}

export interface Medication {
  id: string;
  memberId: string;
  name: string;
  genericName?: string;
  dosage: string;
  unit: string; // mg, mcg, ml, puffs, units
  form: 'tablet' | 'capsule' | 'liquid' | 'inhaler' | 'injection' | 'topical';
  scheduleTimes: TimeOfDay[];
  frequencyDescription: string;
  instructions: string; // e.g. "Take with a full glass of water and meal"
  currentStock: number;
  totalPackSize: number;
  refillThresholdDays: number;
  pillsPerDose: number;
  rxNumber?: string;
  prescribedBy?: string;
  pharmacyName?: string;
  pharmacyPhone?: string;
  colorTheme: string; // hex or tailwind class
  doseLogs: MedicationDoseLog[];
  lastRefillDate?: string;
  refillPending?: boolean;
}

export type SymptomCategory = 
  | 'Head & Neurological'
  | 'Cardiovascular & Chest'
  | 'Respiratory'
  | 'Gastrointestinal & Abdominal'
  | 'Musculoskeletal & Joints'
  | 'Dermatological'
  | 'Psychological & Mood'
  | 'General & Systemic';

export interface SymptomLog {
  id: string;
  memberId: string;
  timestamp: string;
  symptomName: string;
  category: SymptomCategory;
  severity: number; // 1 to 10
  bodyLocation: string;
  triggers: string[];
  notes: string;
  durationHours?: number;
  impactScore?: 'Mild' | 'Moderate' | 'Severe' | 'Debilitating';
  resolved?: boolean;
}

export interface EmergencyFacility {
  id: string;
  name: string;
  type: 'Trauma Center (Level 1)' | 'Emergency Room' | 'Urgent Care Center' | '24/7 Pharmacy' | 'Pediatric Emergency';
  address: string;
  distanceMiles: number;
  driveTimeMinutes: number;
  estimatedWaitMinutes: number;
  open247: boolean;
  phone: string;
  erPhone?: string;
  rating: number;
  capabilities: string[];
  coordinates: {
    lat: number;
    lng: number;
  };
}

export interface EmergencyHotline {
  id: string;
  name: string;
  number: string;
  displayNumber: string;
  description: string;
  badge: string;
  isImmediateEmergency?: boolean;
}

export interface AiCorrelationInsight {
  id: string;
  title: string;
  type: 'correlation' | 'risk_warning' | 'optimization' | 'streak';
  severityLevel: 'low' | 'moderate' | 'high' | 'info';
  description: string;
  evidence: string;
  recommendation: string;
  confidenceScore: number; // e.g. 92%
  relatedFactors: string[];
  timestamp: string;
}
