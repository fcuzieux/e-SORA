export type DroneClass = 'Sans' | 'C1' | 'C2' | 'C3' | 'C4' | 'C5' | 'C6' | 'Prototype';

export type SailLevel =
  | 'SAIL 1'
  | 'SAIL 2'
  | 'SAIL 3'
  | 'SAIL 4'
  | 'SAIL 5'
  | 'SAIL 6'
  | 'Certifié';

export type UasType =
  | 'Avion'
  | 'Hélicoptère'
  | 'Multirotor'
  | 'Hybride/VTOL'
  | "Plus léger que l'air"
  | 'Autre';
export type OperationType =
  | 'VLOS – Vol en vue'
  | 'EVLOS – Vol en vue Etendu'
  | 'BVLOS – Vol hors vue';
export type DangerousGoods = 'OUI' | 'NON';
export type PopulationDensityModulation = 'OUI' | 'NON';
export type ObstaclesModulation = 'OUI' | 'NON';
export type GlidingCapability = 'OUI' | 'NON';
export type HighImpactAngle = 'OUI' | 'NON';
export type DetailedJarusModel = 'OUI' | 'NON';
export type necessaryToReduceRisk = 'OUI' | 'NON';
export type DayNightOperation = 'Jour' | 'Nuit' | 'Jour & Nuit';
export type ConfinementLevel = 'Basic' | 'Enhanced';
export type mitigationStrategique = 'Non' | 'Oui, faible' | 'Oui, moyenne' | 'Oui, élevée';
export type reduceImpactAttenuation = 'Non' | 'Oui, faible' | 'Oui, moyenne' | 'Oui, élevée';
export type OperationalVolumeLevel = 'ARC-a' | 'ARC-b' | 'ARC-c' | 'ARC-d';
export type AdjacentVolumeLevel = 'ARC-a' | 'ARC-b' | 'ARC-c' | 'ARC-d';
export type OperationalScenario = 'VLOS' | 'BVLOS';
export type PopulationDensity = 'low' | 'moderate' | 'high';
export type airspaceClasses = 'Classe A' | 'Classe B' | 'Classe C' | 'Classe D' | 'Classe E' | 'Classe F' | 'Classe G' | 'U-Space' | 'Autre | Préciser';
export type ContingencyParachuteManeuver = 'OUI' | 'NON';
export type GRB_FixedWingPowerOff = 'ACTIVATED' | 'NONACTIVE';
export type StrategicMitigationAvailable = 'OUI' | 'NON';
export type OperationalVolumeLevelMitigated = 'ARC-a' | 'ARC-b' | 'ARC-c' | 'ARC-d';
export type TacticalMitigationAvailable = 'OUI' | 'NON';
export type assessmentTypeHauteurVol =
  | 'Hauteur de vol suivant trajectoire(s)'
  | 'Hauteur de vol en suivi de terrain';
export type iGRC = '1' | '2' | '3' | '4' | '5' | '6' | '7'| '8';
export type GRC_Final = '1' | '2' | '3' | '4' | '5' | '6' | '7'| '8';
export type assessmentCriticalArea =
  | 'Calcul selon les tables SORA'
  | 'Calcul selon les Modèles JARUS'
  | 'Spécifiée par le déposant';
  export type assessmentGRB =
  | 'Approche Simplifiée, Règle 1:1'
  | 'Approche Balistique (Hélicoptère ou Multirotor)'
  | 'Terminaison Aile Fixe'
  | 'Terminaison avec parachute'
  | 'Spécifiée par le déposant';
  export type assessmentContingencyVolume =
  | 'Spécifiée par le déposant'
  | 'Calcul selon le Guide';
export interface DroneDimensions {
  length: number;
  width: number;
  height: number;
}

export interface EnvironmentalLimitations {
  maxWindSpeedTakeoff: number;
  maxGustSpeed: number;
  minTemperature: number;
  maxTemperature: number;
  visibility: number;
  ipRating: string;
  otherLimitations: string;
}

export interface DroneInfo {
  manufacturer: string;
  model: string;
  uasType: UasType;
  serialNumber: string;
  typeCertificateNumber: string;
  airworthinessCertificateNumber: string;
  acousticCertificateNumber: string;
  technicalDocuments: File[];
  MTOW: number;
  maxSpeed: number;
  minSpeed: number;
  maxCharacteristicDimension: number;
  classIdentification: DroneClass | null;
  dimensions: DroneDimensions;
  materials: string;
  payloads: string;
  propulsionType: string;
  fuelType: string;
  modifications: string;
  groundStation: string;
  locationMeans: string;
  maxClimbRate: number;
  maxDescentRate: number;
  turnRate: number;
  maxEndurance: number;
  propellerCount: number;
  kineticEnergy: number;
  environmentalLimitations: EnvironmentalLimitations;
}

export interface OperationInfo {
  adjacentAreaExtent: number;
  operationType: OperationType;
  visualObserversCount: number;
  dangerousGoods: DangerousGoods;
  maxOperationHeight: number;
  dayNightOperation: DayNightOperation;
  operationStartTime: string;
  operationEndTime: string;
  maxDistanceFromPilot: number;
  confinementLevel: ConfinementLevel;
  pilotCompetency: string;
  otherPersonnelCompetency: string;
  reportableEvents: string;
  geoFiles: File[];
}

export interface RiskAssessmentInfo {
  assessmentTypeHauteurVol: assessmentTypeHauteurVol;
  assessmentCriticalArea: assessmentCriticalArea;
  assessmentContingencyVolume: assessmentContingencyVolume;
  followTerrainHeight: number;
  PopulationDensityModulation: PopulationDensityModulation;
  assessmentStartTime: string;
  CriticalArea: number;
  ContingencyVolume: number;
  maxDistanceFromPilot: number;
  confinementLevel: ConfinementLevel;
  pilotCompetency: string;
  otherPersonnelCompetency: string;
  reportableEvents: string;
  intrinsicGroundRisk?: number;
  finalGroundRisk?: number;
  airRisk?: number;
  sailLevel?: string;
  trajgeoFiles: File[];
  mitigationStrategique: mitigationStrategique;
  reduceImpactAttenuation: reduceImpactAttenuation;
  OperationalVolumeLevel: string;
  AdjacentVolumeLevel: string;
  detectAndAvoid: string;
  trafficDetection: string;
  additionalDetails: string;
  operationalScenario?: OperationalScenario;
  populationDensity?: PopulationDensity;
  necessaryToReduceRisk: necessaryToReduceRisk
  planInterventionUrgence: mitigationStrategique;
  confinementRequirements: 'Basiques' | 'Amélioré';
  additionalRemarks?: string;
  airspaceClasses: airspaceClasses;
  uspaceProvider: string;
  otherDetails: string;
  StrategicMitigationAvailable: StrategicMitigationAvailable;
  StrategicMitigationJustification: string;
  OperationalVolumeLevelMitigated: OperationalVolumeLevelMitigated;
  TacticalMitigationAvailable: TacticalMitigationAvailable;
  TacticalMitigationJustification: string;
  iGRC: string;
  GRC_Final: string;
  SAILJustification: string;
  iGRCcomputation: number;
  SAIL: SailLevel;
  maxCharacteristicDimension: number;
  maxSpeed: number;
  ObstaclesModulation: ObstaclesModulation;
  GlidingCapability: GlidingCapability;
  HighImpactAngle:HighImpactAngle;
  dGlide: number;
  dSlideReduced: number;
  DetailedJarusModel:DetailedJarusModel;
  ThetaGlide: number;
  MTOW: number;
  Theta_Glide_Justification: string;
  UserCriticalArea_Justification: string;
  FlightGeographyWidth: number;
  FlightGeographyHeight: number;
  FlightGeography_Justification: string; 
  ContingencyVolumeWidth: number;
  ContingencyVolumeHeight: number;
  ContingencyVolume_Justification: string; 
  ContingencyVolumeSGPS: number;
  ContingencyVolumeSpos: number;
  ContingencyVolumeSK: number;
  ContingencyVolumeSRZ: number;
  ContingencyTimeRZ: number;
  ContingencyVolumeParachute: boolean;
  ContingencyVolumeSCM: number;
  ContingencyParachuteManeuver:ContingencyParachuteManeuver;
  ParachuteTime: number;
  VzParachute: number;
  VwindParachute: number;
  VzandVwindParachute_Justification: string;
  uasType: UasType;
  ThetaStopCopter: number;
  PhiMaxPlane: number;
  turnRate: number;
  ContingencyVolumeHbaro: number;
  ContingencyVolumeHRZ: number;
  ContingencyVolumeHCM: number;
  assessmentGRB:assessmentGRB;
  GRB: number;
  AdjacentVolumeWidth: number;
  AdjacentVolumeHeight: number;
  GRBWidth: number;
  GRB_Justification: string;
  GRB_FixedWingPowerOff:GRB_FixedWingPowerOff;
  environmentalLimitations: EnvironmentalLimitations;
}


export interface SailInfo {
  airspaceClasses: string[];
  uspaceProvider: string;
  otherDetails: string;
  OperationalVolumeLevel: string;
  AdjacentVolumeLevel: string;
  detectAndAvoid: string;
  trafficDetection: string;
  additionalDetails: string;
}

export interface AdjacentAreasInfo {
  airspaceClasses: string[];
  uspaceProvider: string;
  otherDetails: string;
  OperationalVolumeLevel: string;
  AdjacentVolumeLevel: string;
  detectAndAvoid: string;
  trafficDetection: string;
  additionalDetails: string;
}

export interface DeterminationARCInitialInfo {
  airspaceClasses: string[];
  uspaceProvider: string;
  otherDetails: string;
  OperationalVolumeLevel: string;
  AdjacentVolumeLevel: string;
  detectAndAvoid: string;
  trafficDetection: string;
  additionalDetails: string;
}

export interface OperatorInfo {
  name: string;
  managerName: string;
  operationalContact: string;
  registrationNumber: string;
  address: string;
  phone: string;
  email: string;
  startDate?: string;
  endDate?: string;
  locations?: string;
  riskAssessmentVersion?: string;
}

export type OsoRobustnessLevel = 'Non Requis' | 'Faible' | 'Moyen' | 'Élevé';

export interface MitigationMeasure {
  id: string;
  name: string;
  description: string;
  implemented: boolean;
  robustnessLevel: OsoRobustnessLevel;
}

export interface Oso {
  id: string;
  number: string;
  description: string;
  requiredLevel: OsoRobustnessLevel;
  status: OsoRobustnessLevel;
  evidence: string;
  tooltip: string;
}

export interface RiskAssessment {
  intrinsicGroundRisk: number;
  finalGroundRisk: number;
  airRisk: number;
  sailLevel: string;
}

export interface SoraForm {
  operator: OperatorInfo;
  drone: DroneInfo;
  operation: OperationInfo;
  mitigationMeasures: MitigationMeasure[];
  osos: Oso[];
  riskAssessment: RiskAssessmentInfo;
}
