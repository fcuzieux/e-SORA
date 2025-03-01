import { SoraForm, MitigationMeasure, Oso, DeterminationARCInitialInfo } from '../types/sora';

export const initialMitigationMeasures: MitigationMeasure[] = [
  {
    id: 'M1',
    name: "Définition d'une zone tampon",
    description:
      "Établissement d'une zone tampon pour réduire le risque au sol",
    implemented: false,
    robustnessLevel: 'Low',
  },
  {
    id: 'M2',
    name: "Réduction de la zone d'impact au sol",
    description:
      "Mesures techniques pour réduire la zone d'impact en cas de défaillance",
    implemented: false,
    robustnessLevel: 'Low',
  },
];

export const initialOsos: Oso[] = [
  {
    id: 'OSO1',
    number: '01',
    description: 'Procédures opérationnelles définies, validées et suivies',
    requiredLevel: 'Low',
    status: 'Low',
    evidence: '',
  },
  {
    id: 'OSO2',
    number: '02',
    description: 'UAS développé selon des standards reconnus',
    requiredLevel: 'Low',
    status: 'Low',
    evidence: '',
  },
];

export const initialDeterminationARCInitial: DeterminationARCInitialInfo = {
  airspaceClasses: [],
  uspaceProvider: '',
  otherDetails: '',
  OperationalVolumeLevel: 'ARC-a',
  AdjacentVolumeLevel: 'ARC-a',
  detectAndAvoid: '',
  trafficDetection: '',
  additionalDetails: '',
};

export const initialSoraForm: SoraForm = {
  operator: {
    name: '',
    managerName: '',
    operationalContact: '',
    registrationNumber: '',
    address: '',
    phone: '',
    email: '',
  },
  drone: {
    manufacturer: '',
    model: '',
    uasType: 'Multirotor',
    serialNumber: '',
    typeCertificateNumber: '',
    airworthinessCertificateNumber: '',
    acousticCertificateNumber: '',
    technicalDocuments: [],
    mass: 0,
    maxSpeed: 0,
    minSpeed: 0,
    maxCharacteristicDimension: 0,
    classIdentification: null,
    dimensions: {
      length: 0,
      width: 0,
      height: 0,
    },
    materials: '',
    payloads: '',
    propulsionType: '',
    fuelType: '',
    modifications: '',
    groundStation: '',
    locationMeans: '',
    maxClimbRate: 0,
    maxDescentRate: 0,
    turnRate: 0,
    maxEndurance: 0,
    propellerCount: 0,
    kineticEnergy: 0,
    environmentalLimitations: {
      maxWindSpeedTakeoff: 0,
      maxGustSpeed: 0,
      minTemperature: 0,
      maxTemperature: 0,
      visibility: 0,
      ipRating: '',
      otherLimitations: '',
    },
  },
  operation: {
    adjacentAreaExtent: 0,
    operationType: 'VLOS – Vol en vue',
    visualObserversCount: 0,
    dangerousGoods: 'NON',
    maxOperationHeight: 0,
    dayNightOperation: 'Jour',
    operationStartTime: '',
    operationEndTime: '',
    maxDistanceFromPilot: 0,
    confinementLevel: 'Basic',
    pilotCompetency: '',
    otherPersonnelCompetency: '',
    reportableEvents: '',
    geoFiles: [],
  },
  mitigationMeasures: initialMitigationMeasures,
  osos: initialOsos,
  ARCInitial: {
  airspaceClasses: ['Classe A'],
  uspaceProvider: '',
  otherDetails: '',
  OperationalVolumeLevel: '',
  AdjacentVolumeLevel: '',
  detectAndAvoid: '',
  trafficDetection: '',
  additionalDetails: '',
	},
  RiskAssessment: {
    assessmentTypeHauteurVol: 'Calcul selon les table SORA',
    assessmentCriticalArea: '',
    CriticalArea: 0,
    followTerrainHeight: 0,
    PopulationDensityModulation: 'NON',
    assessmentStartTime: '',
    maxDistanceFromPilot: 0,
    confinementLevel: 'Basic',
    pilotCompetency: '',
    otherPersonnelCompetency: '',
    reportableEvents: '',
    intrinsicGroundRisk: 1,
    finalGroundRisk: 1,
    airRisk: 1,
    sailLevel: 'I',
    trajgeoFiles: [],
    mitigationStrategique: 'NON',
    reduceImpactAttenuation: 'NON',
    OperationalVolumeLevel: 'ARC-a',
    AdjacentVolumeLevel: 'ARC-a',
    detectAndAvoid: '',
    trafficDetection: '',
    additionalDetails: '',
    operationalScenario: 'VLOS',
    populationDensity: 'low',
  },
};
