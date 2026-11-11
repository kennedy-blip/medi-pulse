import { FamilyMember, Medication, VitalLog, SymptomLog, EmergencyFacility, EmergencyHotline, AiCorrelationInsight } from '../types/health';

export const INITIAL_FAMILY_MEMBERS: FamilyMember[] = [
  {
    id: 'mem-1',
    name: 'Alex Rivera',
    relationship: 'Self',
    age: 38,
    gender: 'Male',
    avatarBg: 'from-violet-600 to-indigo-600',
    bloodType: 'O+',
    allergies: ['Penicillin', 'Sulfa Drugs'],
    chronicConditions: ['Stage 1 Hypertension', 'Mild Seasonal Asthma'],
    emergencyContact: {
      name: 'Sarah Rivera',
      relation: 'Spouse',
      phone: '+1 (555) 234-8901'
    },
    insurance: {
      provider: 'BlueCross BlueShield Premier Choice',
      policyNumber: 'BCBS-8892019-X',
      groupNumber: 'GRP-90214',
      rxBin: '004336'
    },
    physician: {
      name: 'Dr. Evelyn Vance, MD',
      specialty: 'Internal Medicine',
      clinic: 'Metro Health Specialists',
      phone: '+1 (555) 890-1234'
    },
    notes: 'Responds well to ACE inhibitors. Monitors morning blood pressure daily.'
  },
  {
    id: 'mem-2',
    name: 'Sarah Rivera',
    relationship: 'Spouse',
    age: 36,
    gender: 'Female',
    avatarBg: 'from-emerald-500 to-teal-700',
    bloodType: 'A+',
    allergies: ['Amoxicillin', 'Tree Nuts'],
    chronicConditions: ['Migraine with Aura', 'Vitamin D Deficiency'],
    emergencyContact: {
      name: 'Alex Rivera',
      relation: 'Spouse',
      phone: '+1 (555) 901-4456'
    },
    insurance: {
      provider: 'BlueCross BlueShield Premier Choice',
      policyNumber: 'BCBS-8892019-X-01',
      groupNumber: 'GRP-90214'
    },
    physician: {
      name: 'Dr. Marcus Holloway, MD',
      specialty: 'Neurology & Headache Specialist',
      clinic: 'Synapse Neurology Clinic',
      phone: '+1 (555) 345-6789'
    },
    notes: 'Migraine triggers include dehydration, bright flashing lights, and disrupted sleep.'
  },
  {
    id: 'mem-3',
    name: 'Leo Rivera',
    relationship: 'Child',
    age: 8,
    gender: 'Male',
    avatarBg: 'from-cyan-500 to-blue-600',
    bloodType: 'B+',
    allergies: ['Peanuts (Mild)', 'Bee Venom'],
    chronicConditions: ['Pediatric Allergic Rhinitis'],
    emergencyContact: {
      name: 'Alex Rivera',
      relation: 'Father',
      phone: '+1 (555) 901-4456'
    },
    insurance: {
      provider: 'BlueCross BlueShield Premier Choice',
      policyNumber: 'BCBS-8892019-X-02',
      groupNumber: 'GRP-90214'
    },
    physician: {
      name: 'Dr. Maya Lin, FAAP',
      specialty: 'Pediatrics',
      clinic: 'Bright Horizons Pediatric Center',
      phone: '+1 (555) 678-9012'
    },
    notes: 'Carries EpiPen Junior in school backpack. Allergic rhinitis peaks in spring.'
  },
  {
    id: 'mem-4',
    name: 'Elena Rivera',
    relationship: 'Parent',
    age: 68,
    gender: 'Female',
    avatarBg: 'from-amber-500 to-orange-600',
    bloodType: 'AB+',
    allergies: ['Latex', 'Codeine'],
    chronicConditions: ['Type 2 Diabetes Mellitus', 'Knee Osteoarthritis', 'Mild Osteoporosis'],
    emergencyContact: {
      name: 'Alex Rivera',
      relation: 'Son',
      phone: '+1 (555) 901-4456'
    },
    insurance: {
      provider: 'Medicare Advantage Part C & D (Aetna)',
      policyNumber: 'MED-7749201-A',
      groupNumber: 'GRP-MED77'
    },
    physician: {
      name: 'Dr. Robert Chen, MD',
      specialty: 'Endocrinology & Geriatric Care',
      clinic: 'University Endocrine Health',
      phone: '+1 (555) 789-0123'
    },
    notes: 'Takes morning fasting glucose check. Maintain HbA1c target below 7.0%.'
  }
];

export const INITIAL_MEDICATIONS: Medication[] = [
  {
    id: 'med-1',
    memberId: 'mem-1',
    name: 'Lisinopril',
    genericName: 'Lisinopril USP',
    dosage: '10',
    unit: 'mg',
    form: 'tablet',
    scheduleTimes: ['Morning'],
    frequencyDescription: 'Once daily in the morning',
    instructions: 'Take 1 tablet every morning with or without food. Drink 8 oz water.',
    currentStock: 14,
    totalPackSize: 30,
    refillThresholdDays: 7,
    pillsPerDose: 1,
    rxNumber: 'RX-7729104',
    prescribedBy: 'Dr. Evelyn Vance, MD',
    pharmacyName: 'CVS Pharmacy #4821',
    pharmacyPhone: '+1 (555) 234-9988',
    colorTheme: '#8b5cf6',
    refillPending: false,
    doseLogs: [
      { id: 'dl-1', date: '2026-11-11', timeSlot: 'Morning', status: 'taken', timestamp: '08:15 AM' },
      { id: 'dl-2', date: '2026-11-10', timeSlot: 'Morning', status: 'taken', timestamp: '08:20 AM' },
      { id: 'dl-3', date: '2026-11-09', timeSlot: 'Morning', status: 'taken', timestamp: '08:45 AM' },
      { id: 'dl-4', date: '2026-11-08', timeSlot: 'Morning', status: 'taken', timestamp: '08:10 AM' },
      { id: 'dl-5', date: '2026-11-07', timeSlot: 'Morning', status: 'taken', timestamp: '09:05 AM' },
      { id: 'dl-6', date: '2026-11-06', timeSlot: 'Morning', status: 'taken', timestamp: '08:30 AM' },
    ]
  },
  {
    id: 'med-2',
    memberId: 'mem-1',
    name: 'Omega-3 CoQ10 Complex',
    genericName: 'EPA/DHA 1000mg + Coenzyme Q10',
    dosage: '1200',
    unit: 'mg',
    form: 'capsule',
    scheduleTimes: ['Morning', 'Evening'],
    frequencyDescription: 'Twice daily with meals',
    instructions: 'Take with food for optimal absorption.',
    currentStock: 6,
    totalPackSize: 60,
    refillThresholdDays: 5,
    pillsPerDose: 1,
    rxNumber: 'OTC-998231',
    prescribedBy: 'Dr. Evelyn Vance, MD',
    pharmacyName: 'Walgreens Health #1032',
    pharmacyPhone: '+1 (555) 667-1122',
    colorTheme: '#06b6d4',
    refillPending: true,
    doseLogs: [
      { id: 'dl-7', date: '2026-11-11', timeSlot: 'Morning', status: 'taken', timestamp: '08:25 AM' },
      { id: 'dl-8', date: '2026-11-11', timeSlot: 'Evening', status: 'pending' },
      { id: 'dl-9', date: '2026-11-10', timeSlot: 'Morning', status: 'taken', timestamp: '08:30 AM' },
      { id: 'dl-10', date: '2026-11-10', timeSlot: 'Evening', status: 'taken', timestamp: '07:15 PM' },
      { id: 'dl-11', date: '2026-11-09', timeSlot: 'Morning', status: 'taken', timestamp: '08:50 AM' },
      { id: 'dl-12', date: '2026-11-09', timeSlot: 'Evening', status: 'taken', timestamp: '07:40 PM' },
    ]
  },
  {
    id: 'med-3',
    memberId: 'mem-1',
    name: 'Albuterol Sulfate Inhaler',
    genericName: 'Albuterol HFA 90mcg/actuation',
    dosage: '90',
    unit: 'mcg',
    form: 'inhaler',
    scheduleTimes: ['Afternoon'],
    frequencyDescription: 'As needed for acute wheezing / pre-exercise',
    instructions: '1-2 puffs 15 minutes before strenuous cardio or as needed for chest tightness.',
    currentStock: 48, // doses remaining
    totalPackSize: 200,
    refillThresholdDays: 10,
    pillsPerDose: 2,
    rxNumber: 'RX-4481023',
    prescribedBy: 'Dr. Evelyn Vance, MD',
    pharmacyName: 'CVS Pharmacy #4821',
    pharmacyPhone: '+1 (555) 234-9988',
    colorTheme: '#10b981',
    refillPending: false,
    doseLogs: [
      { id: 'dl-13', date: '2026-11-10', timeSlot: 'Afternoon', status: 'taken', timestamp: '03:15 PM' },
      { id: 'dl-14', date: '2026-11-08', timeSlot: 'Afternoon', status: 'taken', timestamp: '04:00 PM' },
    ]
  },
  {
    id: 'med-4',
    memberId: 'mem-2',
    name: 'Sumatriptan Succinate',
    genericName: 'Sumatriptan 50mg',
    dosage: '50',
    unit: 'mg',
    form: 'tablet',
    scheduleTimes: ['Afternoon'],
    frequencyDescription: 'At earliest migraine onset',
    instructions: 'Take 1 tablet immediately upon visual aura or headache onset. May repeat once after 2 hours if not resolved.',
    currentStock: 4,
    totalPackSize: 9,
    refillThresholdDays: 3,
    pillsPerDose: 1,
    rxNumber: 'RX-9923812',
    prescribedBy: 'Dr. Marcus Holloway, MD',
    pharmacyName: 'CVS Pharmacy #4821',
    pharmacyPhone: '+1 (555) 234-9988',
    colorTheme: '#f43f5e',
    refillPending: true,
    doseLogs: [
      { id: 'dl-15', date: '2026-11-09', timeSlot: 'Afternoon', status: 'taken', timestamp: '02:30 PM' }
    ]
  },
  {
    id: 'med-5',
    memberId: 'mem-2',
    name: 'Vitamin D3 + K2',
    genericName: 'Cholecalciferol 5000 IU',
    dosage: '5000',
    unit: 'IU',
    form: 'capsule',
    scheduleTimes: ['Morning'],
    frequencyDescription: 'Once daily with breakfast',
    instructions: 'Take with fatty meal or yogurt for enhanced bioavailability.',
    currentStock: 45,
    totalPackSize: 60,
    refillThresholdDays: 10,
    pillsPerDose: 1,
    rxNumber: 'OTC-55291',
    prescribedBy: 'Dr. Marcus Holloway, MD',
    pharmacyName: 'Walgreens Health #1032',
    pharmacyPhone: '+1 (555) 667-1122',
    colorTheme: '#f59e0b',
    refillPending: false,
    doseLogs: [
      { id: 'dl-16', date: '2026-11-11', timeSlot: 'Morning', status: 'taken', timestamp: '08:40 AM' },
      { id: 'dl-17', date: '2026-11-10', timeSlot: 'Morning', status: 'taken', timestamp: '08:50 AM' }
    ]
  },
  {
    id: 'med-6',
    memberId: 'mem-4',
    name: 'Metformin HCl ER',
    genericName: 'Metformin Extended Release 500mg',
    dosage: '500',
    unit: 'mg',
    form: 'tablet',
    scheduleTimes: ['Morning', 'Night'],
    frequencyDescription: 'Twice daily with morning and evening meals',
    instructions: 'Swallow whole with food. Do not crush or chew.',
    currentStock: 38,
    totalPackSize: 60,
    refillThresholdDays: 14,
    pillsPerDose: 1,
    rxNumber: 'RX-1102934',
    prescribedBy: 'Dr. Robert Chen, MD',
    pharmacyName: 'Kaiser Permanente Pharmacy',
    pharmacyPhone: '+1 (555) 445-8899',
    colorTheme: '#8b5cf6',
    refillPending: false,
    doseLogs: [
      { id: 'dl-18', date: '2026-11-11', timeSlot: 'Morning', status: 'taken', timestamp: '08:00 AM' },
      { id: 'dl-19', date: '2026-11-11', timeSlot: 'Night', status: 'pending' },
      { id: 'dl-20', date: '2026-11-10', timeSlot: 'Morning', status: 'taken', timestamp: '08:05 AM' },
      { id: 'dl-21', date: '2026-11-10', timeSlot: 'Night', status: 'taken', timestamp: '08:45 PM' }
    ]
  }
];

export const INITIAL_VITALS: VitalLog[] = [
  {
    id: 'vit-1',
    memberId: 'mem-1',
    timestamp: '2026-11-11T07:45:00Z',
    bloodPressure: { systolic: 120, diastolic: 78, pulse: 68 },
    heartRate: 68,
    glucose: { value: 92, context: 'fasting' },
    sleep: { totalHours: 7.4, deepHours: 2.1, remHours: 1.8, qualityScore: 88, sleepState: 'Restorative' },
    hydrationMl: 1750,
    oxygenSaturation: 98,
    bodyTempF: 98.4,
    notes: 'Morning reading feeling well-rested. Good baseline post-workout.'
  },
  {
    id: 'vit-2',
    memberId: 'mem-1',
    timestamp: '2026-11-10T08:00:00Z',
    bloodPressure: { systolic: 124, diastolic: 82, pulse: 72 },
    heartRate: 72,
    glucose: { value: 96, context: 'fasting' },
    sleep: { totalHours: 6.8, deepHours: 1.6, remHours: 1.4, qualityScore: 79, sleepState: 'Restless' },
    hydrationMl: 2200,
    oxygenSaturation: 98,
    bodyTempF: 98.6,
    notes: 'Slightly busy workday; hydration stayed steady.'
  },
  {
    id: 'vit-3',
    memberId: 'mem-1',
    timestamp: '2026-11-09T08:15:00Z',
    bloodPressure: { systolic: 132, diastolic: 86, pulse: 76 },
    heartRate: 76,
    glucose: { value: 104, context: 'fasting' },
    sleep: { totalHours: 5.4, deepHours: 0.9, remHours: 1.1, qualityScore: 61, sleepState: 'Fragmented' },
    hydrationMl: 1400,
    oxygenSaturation: 97,
    bodyTempF: 98.7,
    notes: 'Late night deadline, slept late. BP slightly elevated.'
  },
  {
    id: 'vit-4',
    memberId: 'mem-1',
    timestamp: '2026-11-08T07:30:00Z',
    bloodPressure: { systolic: 118, diastolic: 76, pulse: 65 },
    heartRate: 65,
    glucose: { value: 91, context: 'fasting' },
    sleep: { totalHours: 8.1, deepHours: 2.4, remHours: 2.0, qualityScore: 92, sleepState: 'Optimal' },
    hydrationMl: 2500,
    oxygenSaturation: 99,
    bodyTempF: 98.4,
    notes: 'Weekend recovery sleep; vitals optimal.'
  },
  {
    id: 'vit-5',
    memberId: 'mem-1',
    timestamp: '2026-11-07T08:30:00Z',
    bloodPressure: { systolic: 122, diastolic: 80, pulse: 70 },
    heartRate: 70,
    glucose: { value: 94, context: 'fasting' },
    sleep: { totalHours: 7.2, deepHours: 1.8, remHours: 1.6, qualityScore: 84, sleepState: 'Restorative' },
    hydrationMl: 2100,
    oxygenSaturation: 98,
    bodyTempF: 98.5,
    notes: 'Steady condition.'
  },
  {
    id: 'vit-6',
    memberId: 'mem-4',
    timestamp: '2026-11-11T07:15:00Z',
    bloodPressure: { systolic: 128, diastolic: 82, pulse: 71 },
    heartRate: 71,
    glucose: { value: 108, context: 'fasting' },
    sleep: { totalHours: 6.5, deepHours: 1.2, remHours: 1.3, qualityScore: 74, sleepState: 'Restorative' },
    hydrationMl: 1600,
    oxygenSaturation: 97,
    bodyTempF: 98.3,
    notes: 'Fasting glucose well within doctor target range (90-120).'
  }
];

export const INITIAL_SYMPTOMS: SymptomLog[] = [
  {
    id: 'sym-1',
    memberId: 'mem-1',
    timestamp: '2026-11-09T16:30:00Z',
    symptomName: 'Tension Headache & Neck Stiffness',
    category: 'Head & Neurological',
    severity: 5,
    bodyLocation: 'Occipital & Posterior Neck',
    triggers: ['High Stress', 'Poor Sleep (<6h)', 'Dehydration', 'Prolonged Screen Time'],
    notes: 'Ache developed after back-to-back virtual conference calls. Hydrated with 500ml electrolyte water.',
    durationHours: 3.5,
    impactScore: 'Moderate',
    resolved: true
  },
  {
    id: 'sym-2',
    memberId: 'mem-1',
    timestamp: '2026-11-06T14:10:00Z',
    symptomName: 'Mild Exertional Wheezing',
    category: 'Respiratory',
    severity: 3,
    bodyLocation: 'Mid-Thoracic Airways',
    triggers: ['Cold Dry Air', 'Outdoor Jogging'],
    notes: 'Triggered during chilly afternoon run. Used 2 puffs Albuterol inhaler with immediate relief within 10 min.',
    durationHours: 0.5,
    impactScore: 'Mild',
    resolved: true
  },
  {
    id: 'sym-3',
    memberId: 'mem-2',
    timestamp: '2026-11-09T13:45:00Z',
    symptomName: 'Left-Side Migraine with Visual Scintillating Scotoma',
    category: 'Head & Neurological',
    severity: 8,
    bodyLocation: 'Left Temporal Orbit',
    triggers: ['Weather Pressure Shift', 'Bright Sunlight Glare', 'Missed Meal'],
    notes: 'Took Sumatriptan 50mg immediately upon aura detection. Rested in dark quiet room.',
    durationHours: 5,
    impactScore: 'Severe',
    resolved: true
  },
  {
    id: 'sym-4',
    memberId: 'mem-4',
    timestamp: '2026-11-10T09:30:00Z',
    symptomName: 'Bilateral Morning Knee Stiffness',
    category: 'Musculoskeletal & Joints',
    severity: 4,
    bodyLocation: 'Both Patellofemoral Joints',
    triggers: ['Overcast / Rainy Weather', 'Prolonged Inactivity'],
    notes: 'Did 15 minutes of prescribed physical therapy mobility stretches with warm compress.',
    durationHours: 1.5,
    impactScore: 'Moderate',
    resolved: true
  }
];

export const INITIAL_AI_INSIGHTS: AiCorrelationInsight[] = [
  {
    id: 'ins-1',
    title: 'Sleep Deficit Directly Elevates Morning Blood Pressure',
    type: 'correlation',
    severityLevel: 'moderate',
    description: 'When night sleep drops under 6.0 hours, next-morning systolic BP registers an average increase of +12 mmHg (132 vs 120 baseline).',
    evidence: 'Derived from 14-day cross-telemetry comparing Sleep Tracker metrics with Morning Sphygmomanometer logs.',
    recommendation: 'Target an 11:00 PM wind-down routine. Maintaining 7+ hours of sleep protects endothelial arterial relaxation.',
    confidenceScore: 94,
    relatedFactors: ['Sleep Duration < 6h', 'Systolic Elevation', 'Lisinopril Timing'],
    timestamp: '2026-11-11T06:00:00Z'
  },
  {
    id: 'ins-2',
    title: 'Refill Warning: Omega-3 CoQ10 Approaching Critical Threshold',
    type: 'risk_warning',
    severityLevel: 'high',
    description: 'Current inventory has 6 capsules remaining (only 3 days supply based on twice-daily regimen).',
    evidence: 'Current Stock: 6 / 60 • Consumption Rate: 2 caps/day • Refill Threshold: 5 days.',
    recommendation: 'Trigger one-click pharmacy refill to avoid medication discontinuation or missed schedule.',
    confidenceScore: 99,
    relatedFactors: ['Stock Depletion', 'Adherence Continuity', 'Pharmacy Lead Time'],
    timestamp: '2026-11-11T05:30:00Z'
  },
  {
    id: 'ins-3',
    title: 'Hydration Volume Correlates Strongly with Headache Prevention',
    type: 'optimization',
    severityLevel: 'info',
    description: 'Zero headache or migraine logs recorded on days where logged hydration surpassed 2,100 ml.',
    evidence: 'Logged symptoms index shows 100% of reported tension headaches occurred on days with hydration < 1,500 ml.',
    recommendation: 'Keep an insulated water flask at desk. Aim for 500ml water by 10 AM, 12 PM, 3 PM, and 6 PM.',
    confidenceScore: 89,
    relatedFactors: ['Hydration Intake (ml)', 'Cranial Microcirculation', 'Tension Headache'],
    timestamp: '2026-11-10T18:00:00Z'
  },
  {
    id: 'ins-4',
    title: '7-Day Medication Adherence Streak: 100% on Lisinopril',
    type: 'streak',
    severityLevel: 'info',
    description: 'Alex has logged 7 consecutive days of on-time morning Lisinopril intake within 30 minutes of scheduled window.',
    evidence: 'Daily log timestamps confirm consistency between 08:10 AM - 08:45 AM.',
    recommendation: 'Exceptional regimen adherence! Consistently stable serum drug levels maintain ideal cardiovascular protection.',
    confidenceScore: 100,
    relatedFactors: ['On-time compliance', 'Normotensive blood pressure'],
    timestamp: '2026-11-11T07:00:00Z'
  }
];

export const EMERGENCY_FACILITIES: EmergencyFacility[] = [
  {
    id: 'fac-1',
    name: 'University Medical Center Trauma Center',
    type: 'Trauma Center (Level 1)',
    address: '742 Evergreen Health Parkway, Suite 100',
    distanceMiles: 1.4,
    driveTimeMinutes: 4,
    estimatedWaitMinutes: 12,
    open247: true,
    phone: '+1 (555) 911-4000',
    erPhone: '+1 (555) 911-4099',
    rating: 4.9,
    capabilities: [
      'Level 1 Comprehensive Trauma',
      '24/7 Primary Percutaneous Coronary Intervention (PCI)',
      'Certified Comprehensive Stroke Center',
      'Advanced Pediatric Intensive Care Unit (PICU)',
      'Helipad & Rapid Response Team'
    ],
    coordinates: { lat: 37.7749, lng: -122.4194 }
  },
  {
    id: 'fac-2',
    name: 'Presbyterian Community Hospital Emergency Dept',
    type: 'Emergency Room',
    address: '1204 Beacon Memorial Boulevard',
    distanceMiles: 2.8,
    driveTimeMinutes: 7,
    estimatedWaitMinutes: 22,
    open247: true,
    phone: '+1 (555) 782-5500',
    erPhone: '+1 (555) 782-5522',
    rating: 4.7,
    capabilities: [
      'Full Emergency Medical Services',
      'Onsite MRI / 128-Slice CT Scanner',
      'Chest Pain Assessment Center',
      'Emergency Orthopedic Surgical Care'
    ],
    coordinates: { lat: 37.7833, lng: -122.4167 }
  },
  {
    id: 'fac-3',
    name: 'CareFirst Urgent Care & Walk-In Clinic',
    type: 'Urgent Care Center',
    address: '883 Market Commerce Crossing, Bay 4',
    distanceMiles: 0.9,
    driveTimeMinutes: 3,
    estimatedWaitMinutes: 8,
    open247: false,
    phone: '+1 (555) 321-7700',
    rating: 4.8,
    capabilities: [
      'Digital X-Ray On-Site',
      'Rapid Strep, Flu, COVID, RSV Testing',
      'Minor Laceration Suturing & Burns',
      'Splinting, Sprains & Strains Care',
      'IV Hydration Therapy'
    ],
    coordinates: { lat: 37.7790, lng: -122.4200 }
  },
  {
    id: 'fac-4',
    name: 'Walgreens 24-Hour Pharmacy & Health Clinic',
    type: '24/7 Pharmacy',
    address: '500 Central Avenue at 14th St',
    distanceMiles: 0.7,
    driveTimeMinutes: 2,
    estimatedWaitMinutes: 5,
    open247: true,
    phone: '+1 (555) 441-2000',
    rating: 4.6,
    capabilities: [
      '24-Hour Drive-Thru Prescription Dispensing',
      'Emergency Pharmacist Consultations',
      'Emergency Inhaler & Insulin Stock',
      'Vaccinations & Rapid Flu Treatment'
    ],
    coordinates: { lat: 37.7690, lng: -122.4250 }
  },
  {
    id: 'fac-5',
    name: 'Children\'s Specialized Pediatric Emergency',
    type: 'Pediatric Emergency',
    address: '220 Wellness Way, Pediatric Wing',
    distanceMiles: 3.2,
    driveTimeMinutes: 8,
    estimatedWaitMinutes: 15,
    open247: true,
    phone: '+1 (555) 998-KIDS',
    rating: 4.9,
    capabilities: [
      'Dedicated Pediatric Emergency Physicians',
      'Pediatric Respiratory Distress Management',
      'Anaphylaxis & Severe Allergy Protocol',
      'Child Life Specialists on Staff'
    ],
    coordinates: { lat: 37.7650, lng: -122.4080 }
  }
];

export const EMERGENCY_HOTLINES: EmergencyHotline[] = [
  {
    id: 'hot-1',
    name: 'Immediate Life-Threatening Emergency',
    number: '911',
    displayNumber: '911',
    description: 'Police, Fire, Ambulance & Paramedics Dispatch',
    badge: 'Critical First Response',
    isImmediateEmergency: true
  },
  {
    id: 'hot-2',
    name: 'Poison Control Center Hotline',
    number: '18002221222',
    displayNumber: '1-800-222-1222',
    description: 'Free, confidential medical advice for poisonings, overdoses & toxic chemical exposure',
    badge: '24/7 Toxicologist'
  },
  {
    id: 'hot-3',
    name: '988 Suicide & Mental Crisis Lifeline',
    number: '988',
    displayNumber: '988',
    description: 'Immediate mental health support, emotional crisis intervention & suicide prevention',
    badge: '24/7 Confidential Crisis Support'
  },
  {
    id: 'hot-4',
    name: 'Registered Nurse 24/7 Clinical Triage',
    number: '18005557873',
    displayNumber: '1-800-555-NURSE',
    description: 'On-demand clinical symptom assessment, medication questions & home-care guidance',
    badge: 'On-Demand Triage'
  }
];
