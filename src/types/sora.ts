export type DroneClass = 'C1' | 'C2' | 'C3' | 'C4' | 'C5' | 'C6';

export type SailLevel =
  | 'SAIL 1'
  | 'SAIL 2'
  | 'SAIL 3'
  | 'SAIL 4'
  | 'SAIL 5'
  | 'SAIL 6';

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
export type DayNightOperation = 'Jour' | 'Nuit' | 'Jour & Nuit';
export type ConfinementLevel = 'Basic' | 'Enhanced';

export type assessmentTypeHauteurVol =
  | 'Hauteur de vol suivant trajectoire(s)'
  | 'Hauteur de vol en suivi de terrain';

export type assessmentCriticalArea =
  | 'Calcul selon les table SORA'
  | 'Spécifiée par le déposant';

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
  mass: number;
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
  followTerrainHeight: number;
  PopulationDensityModulation: PopulationDensityModulation;
  assessmentStartTime: string;
  CriticalArea: number;
  maxDistanceFromPilot: number;
  confinementLevel: ConfinementLevel;
  pilotCompetency: string;
  otherPersonnelCompetency: string;
  reportableEvents: string;
  trajgeoFiles: File[];
}
