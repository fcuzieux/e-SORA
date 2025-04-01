import { SoraForm, MitigationMeasure, Oso, DeterminationARCInitialInfo, airspaceClasses } from '../types/sora';

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
    robustnessLevel: 'Faible',
  },
];

export const initialOsos: Oso[] = [
  {
    id: 'OSO1',
    number: '01',
    description: 'Opérateur UAS compétent et/ou approuvé',
    requiredLevel: 'Faible',
    status: 'Faible',
    evidence: '',
  },
  {
    id: 'OSO2',
    number: '02',
    description: 'Constructeur UAS compétent et/ou approuvé',
    requiredLevel: 'Faible',
    status: 'Faible',
    evidence: '',
  },
  {
    id: 'OSO3',
    number: '03',
    description: 'Maintenance UAS assurée par une entité compétente et/ou approuvée',
    requiredLevel: 'Faible',
    status: 'Faible',
    evidence: '',
  },
  {
    id: 'OSO4',
    number: '04',
    description: 'UAS développé selon des standards reconnus par l’autorité',
    requiredLevel: 'Faible',
    status: 'Faible',
    evidence: '',
  },
  {
    id: 'OSO5',
    number: '05',
    description: 'UAS conçu selon des standards de fiabilité et de sécurité',
    requiredLevel: 'Faible',
    status: 'Faible',
    evidence: '',
  },
  {
    id: 'OSO6',
    number: '06',
    description: 'Performances du Lien C3 appropriées pour la mission',
    requiredLevel: 'Faible',
    status: 'Faible',
    evidence: '',
  },
  {
    id: 'OSO7',
    number: '07',
    description: 'Inspections de l’UAS pour assurer la validité du ConOps',
    requiredLevel: 'Faible',
    status: 'Faible',
    evidence: '',
  },
  {
    id: 'OSO8',
    number: '08',
    description: 'Procédures opérationnelles définies, validées et appliquées',
    requiredLevel: 'Faible',
    status: 'Faible',
    evidence: '',
  },
  {
    id: 'OSO9',
    number: '09',
    description: 'Equipage formé, entrainé régulièrement et capable de faire face aux situations anormales',
    requiredLevel: 'Faible',
    status: 'Faible',
    evidence: '',
  },
  {
    id: 'OSO10',
    number: '10',
    description: 'Retour à la normale en toute sécurité après un problème technique',
    requiredLevel: 'Faible',
    status: 'Faible',
    evidence: '',
  },
  {
    id: 'OSO11',
    number: '11',
    description: 'Des procédures sont en place pour supporter la détérioration des systèmes externes de soutien à l’opération',
    requiredLevel: 'Faible',
    status: 'Faible',
    evidence: '',
  },
  {
    id: 'OSO12',
    number: '12',
    description: 'L’UAS est conçu pour supporter la détérioration des systèmes externes de soutien',
    requiredLevel: 'Faible',
    status: 'Faible',
    evidence: '',
  },
  {
    id: 'OSO13',
    number: '13',
    description: 'Les systèmes externes de soutien sont adéquats pour l’opération',
    requiredLevel: 'Faible',
    status: 'Faible',
    evidence: '',
  },
  {
    id: 'OSO14',
    number: '14',
    description: 'Procédures opérationnelles définies, validées et appliquées',
    requiredLevel: 'Faible',
    status: 'Faible',
    evidence: '',
  },
  {
    id: 'OSO15',
    number: '15',
    description: 'Equipage formé, entrainé régulièrement et capable de faire face aux situations anormales',
    requiredLevel: 'Faible',
    status: 'Faible',
    evidence: '',
  },
  {
    id: 'OSO16',
    number: '16',
    description: 'Coordination intra-équipage',
    requiredLevel: 'Faible',
    status: 'Faible',
    evidence: '',
  },
  {
    id: 'OSO17',
    number: '17',
    description: 'Equipage en capacité d’exploiter',
    requiredLevel: 'Faible',
    status: 'Faible',
    evidence: '',
  },
  {
    id: 'OSO18',
    number: '18',
    description: 'Protection automatique de l’enveloppe de vol, résistance à l’erreur humaine',
    requiredLevel: 'Faible',
    status: 'Faible',
    evidence: '',
  },
  {
    id: 'OSO19',
    number: '19',
    description: 'Retour à la normale en toute sécurité après une erreur humaine',
    requiredLevel: 'Faible',
    status: 'Faible',
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
    uasType: 'Avion',
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
    followTerrainHeight: 0,
    PopulationDensityModulation: 'NON',
    assessmentStartTime: '',
    CriticalArea: 0,
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
    necessaryToReduceRisk: 'NON',
    planInterventionUrgence: 'NON',
    confinementRequirements: 'Basiques',
    additionalRemarks: '',
    airspaceClasses: ['Classe A'],
    uspaceProvider: '',
    otherDetails: '',
    StrategicMitigationAvailable: '',
    StrategicMitigationJustification: '',
    OperationalVolumeLevelMitigated: '',
    TacticalMitigationAvailable: '',
    TacticalMitigationJustification: '',
    iGRC: '',
    GRC_Final: '',
    SAILJustification: '',
    AdjacentVolumeLevelMitigated: '',
    TacticalVolumeLevelMitigated: '',
    TacticalVolumeLevel: '',
    TacticalVolumeLevelJustification: '',
    TacticalVolumeLevelMitigatedJustification: '',
    StrategicVolumeLevel: '',
    StrategicVolumeLevelJustification: '',
    StrategicVolumeLevelMitigated: '',
    StrategicVolumeLevelMitigatedJustification: '',
  },
};
