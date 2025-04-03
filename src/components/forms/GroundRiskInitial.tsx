import React, { useRef, useState } from 'react';

import {
  RiskAssessmentInfo,
  DroneInfo,
  OperationInfo,
  assessmentTypeHauteurVol,
  assessmentCriticalArea,
  assessmentGRB,
  assessmentContingencyVolume,
  PopulationDensityModulation,
  SailLevel,
  OperationalScenario,
  PopulationDensity,
  iGRC,
  ObstaclesModulation,
  GlidingCapability,
  HighImpactAngle,
  DetailedJarusModel,
  UasType,
} from '../../types/sora';

import { Tooltip } from '../common/Tooltip';
import { Upload, Clock, Pi } from 'lucide-react';
import { RiskAssessmentMap } from './RiskAssessmentMap';
import DefinitionOfVolumes from '../../image/DefinitionOfVolumes.png';

interface RiskAssessmentFormProps {
  assessment: RiskAssessmentInfo;
  drone: DroneInfo;
  operation: OperationInfo;
  onChange: (assessment: RiskAssessmentInfo) => void;
  showOnly?: Array<keyof RiskAssessmentInfo>;
}

export function RiskAssessmentForm({
  assessment,
  drone,
  operation,
  onChange,
  showOnly,
}: RiskAssessmentFormProps) {

  const handleOnChangeGlidingCapability = (e) => {
    onChange({
      ...assessment,
      GlidingCapability: e.target
        .value as GlidingCapability,
        assessmentGRB: e.target.value === 'NON' ? "Approche Simplifiée, Règle 1:1" : assessment.assessmentGRB,
    });
  }

  const handleOnChangeFixedWingPowerOff = (e) => {
    const isChecked = e.target.checked;
    onChange({
      ...assessment,
      GRB_FixedWingPowerOff: isChecked ? 'ACTIVATED' : 'NONACTIVE',
      assessmentGRB:"Approche Simplifiée, Règle 1:1",
    });
  };

  const GRB_FixedWingPowerOffActivationbydefault=() => {
    assessment.GRB_FixedWingPowerOff = 'ACTIVATED'
    return true;
  }
  const CalulGRB =() =>{
    let GRB = Number(1);
    let GRAVITY = 9.81;
    let Vwind=assessment.environmentalLimitations.maxGustSpeed;
    

    
    if (assessment.assessmentGRB === 'Approche Simplifiée, Règle 1:1') {
      GRB =assessment.ContingencyVolumeHeight+0.5*assessment.maxCharacteristicDimension;
    } else if (assessment.assessmentGRB === 'Approche Balistique (Hélicoptère ou Multirotor)') {
      GRB =assessment.maxSpeed*Math.sqrt(2*assessment.ContingencyVolumeHeight/GRAVITY) +0.5*assessment.maxCharacteristicDimension;
    } else if (assessment.assessmentGRB === 'Terminaison Aile Fixe') {
      GRB =assessment.ContingencyVolumeHeight/Math.tan(assessment.ThetaGlide*Math.PI/180.0);

    } else if (assessment.assessmentGRB === 'Terminaison avec parachute') {
      GRB =assessment.maxSpeed*assessment.ParachuteTime+Vwind*assessment.ContingencyVolumeHeight/assessment.VzParachute;   //+0.5*assessment.maxCharacteristicDimension;
    } else  {
      GRB =0.0;

    }
    
    return parseFloat(GRB.toFixed(2));
  }
  const CalculContingencyVolumeWidth = (SGPS,Spos,SK,SRZ,SCM) => {
    let SCV = Number(1);
    //assessment.ContingencyVolumeSGPS,assessment.ContingencyVolumeSpos,assessment.ContingencyVolumeSK,assessment.ContingencyVolumeSRZ,assessment.ContingencyVolumeSCM
    SCV=SGPS+Spos+SK+SRZ+SCM;
    assessment.ContingencyVolumeWidth = parseFloat((SCV).toFixed(2));
    return parseFloat((SCV).toFixed(2));
  }
  
  const CalculContingencyVolumeHeight = (Hbaro,HRZ,HCM) => {
    let HCV = Number(1);
    //assessment.ContingencyVolumeSGPS,assessment.ContingencyVolumeSpos,assessment.ContingencyVolumeSK,assessment.ContingencyVolumeSRZ,assessment.ContingencyVolumeSCM
    HCV=Hbaro+HRZ+HCM+assessment.FlightGeographyHeight;
    assessment.ContingencyVolumeHeight = parseFloat((HCV).toFixed(2));
    return parseFloat((HCV).toFixed(2));
  }
//Contigency Maneuvre Volume
  const CalculVolumeSCM = () => {
    let SCM = Number(1);
    let HCM = Number(1);
    let GRAVITY = 9.81;
  // | 'Avion'
  // | 'Hélicoptère'
  // | 'Multirotor'
  // | 'Hybride/VTOL'
  // | "Plus léger que l'air"
  // | 'Autre';
  // ContingencyVolumeSCM: assessment.ParachuteTime*assessment.maxSpeed, 
  // ContingencyVolumeHCM: parseFloat((assessment.ParachuteTime*0.7*assessment.maxSpeed).toFixed(2)) , 
    if (assessment.ContingencyParachuteManeuver === 'OUI') {
      SCM = assessment.ParachuteTime*assessment.maxSpeed;
      HCM = parseFloat((assessment.ParachuteTime*0.7*assessment.maxSpeed).toFixed(2));
    } else {
      if (assessment.uasType === 'Avion' || assessment.uasType === 'Hybride/VTOL' || assessment.uasType === "Plus léger que l'air") {
        SCM = assessment.maxSpeed*assessment.maxSpeed/(GRAVITY*Math.tan(assessment.PhiMaxPlane*Math.PI/180.0));
        HCM = 0.3*assessment.maxSpeed*assessment.maxSpeed/(GRAVITY);
        //Cas 2 based on Maximum Turn Rate :
        //SCM = 0.5*assessment.maxSpeed*(90.0/assessment.turnRate);
      } else if (assessment.uasType === 'Hélicoptère' || assessment.uasType === 'Multirotor') {
        SCM = 0.5*assessment.maxSpeed*assessment.maxSpeed/(GRAVITY*Math.tan(assessment.ThetaStopCopter*Math.PI/180.0));
        HCM = 0.5*assessment.maxSpeed*assessment.maxSpeed/(GRAVITY);
      } else if (assessment.uasType === 'Autre') {
        SCM = 0.5*assessment.maxSpeed*(90.0/assessment.turnRate);
        HCM = 0.3*assessment.maxSpeed*assessment.maxSpeed/(GRAVITY);
      } else {  
        SCM = 0 / 0;
      }
      assessment.ContingencyVolumeSCM = parseFloat(SCM.toFixed(2));
      assessment.ContingencyVolumeHCM = parseFloat(HCM.toFixed(2));
      return [SCM, HCM];
    }
  }

 const ACtable = () => {
    let AcFromTable = Number(8);
    if (assessment.maxCharacteristicDimension<=1.0) {
      AcFromTable = 8;
    } else if (assessment.maxCharacteristicDimension<=3.0) {
      AcFromTable = 80;
    } else if (assessment.maxCharacteristicDimension<=8.0) {
      AcFromTable = 800;
    } else if (assessment.maxCharacteristicDimension<=20.0) {
      AcFromTable = 8000;
    } else if (assessment.maxCharacteristicDimension<=40.0) {
      AcFromTable = 80000.0;
    } else {AcFromTable = 80000.0;}
    assessment.CriticalArea = AcFromTable;
    return AcFromTable;
  };

  const CalculJARUSCriticalArea = () => {
    let Ac = Number(5);
    let rPerson = 0.3;
    let rD=rPerson+assessment.maxCharacteristicDimension/2.0;
    let Modulation=1.0;
    if (assessment.ObstaclesModulation === 'OUI') {
      Modulation=0.6;
    } else {
      Modulation=1.0;
    }
    if (assessment.maxCharacteristicDimension<=1.0) {
      Ac = 2.0*rD*assessment.dGlide+Math.PI*Math.pow(rD, 2);
    } else if (assessment.maxCharacteristicDimension<8.0) {
      Ac = Modulation*(2.0*rD*(assessment.dGlide+assessment.dSlideReduced)+Math.PI*rD*rD);
    } else if (assessment.maxCharacteristicDimension>=8.0) {
      Ac = 2.0*rD*(assessment.dGlide+assessment.dSlideReduced)+Math.PI*rD*rD;
    }
//    Ac = 2.0*rD*(assessment.dGlide+assessment.dSlideReduced)+Math.PI*rD*rD;
    assessment.CriticalArea = Ac;
    return Ac;
  }


  const AdviceThetaGlide = () => {
    if (assessment.maxCharacteristicDimension<=1.0) {
      //assessment.ThetaGlide = 35.0;
      return 35.0;
    } else {
      //assessment.ThetaGlide = 10.0;
      return 10.0;    
    }
  }

  const AdvicedSlideReduced = () => {
    if (assessment.DetailedJarusModel == 'OUI') {
      // Non-lethal kinetic energy limit : (290.0 J)
      let Knonlethal =290.0;
      //velocity_min_kill = np.sqrt(2 * lethal_kinetic_energy / aircraft.mass)
      let vnonlethal    = Math.sqrt(2 * Knonlethal /assessment.MTOW);
      // Coefficient of restitution 0.8 //0.65
      let coefficient_of_restitution=0.8;//-0.42*(assessment.ThetaGlide-10.0)/70.0;
      // horizontal_speed_from_angle =  np.fabs(  np.cos(np.radians(impact_angle            ))) * impact_speed
      let vhorizontale               = Math.abs(Math.cos(assessment.ThetaGlide*Math.PI/180.0))  * assessment.maxSpeed;
      // if (assessment.maxCharacteristicDimension>1.0) {
      //   let Vglide = assessment.maxSpeed*0.65;
      //   vhorizontale = Vglide;
      // }
      // Coefficient of friction 0.75 
      let Cg = 0.6;
      let GRAVITY = 9.81;
      let acceleration = Cg * GRAVITY;
      // t_safe = (aircraft.coefficient_of_restitution * horizontal_impact_speed - velocity_min_kill) / acceleration
      let tsafe = Math.max((coefficient_of_restitution          * vhorizontale            - vnonlethal       ) / acceleration,0.0);
      // slide_distance_non_lethal = (aircraft.coefficient_of_restitution * horizontal_impact_speed * t_safe) - (0.5 * acceleration * t_safe * t_safe)
      let dslide_reduced           = (coefficient_of_restitution          * vhorizontale            * tsafe ) - (0.5 * acceleration * tsafe  * tsafe );
      assessment.dSlideReduced = parseFloat(dslide_reduced.toFixed(2));
      return assessment.dSlideReduced;
    } else {
      return 0.0;
    }
  }

  const AdvicedGlide = () => {
    let hPerson = 1.8;
    if (assessment.DetailedJarusModel == 'OUI') {
      assessment.dGlide=parseFloat((hPerson / Math.tan(assessment.ThetaGlide * Math.PI / 180.0)).toFixed(2));
      return parseFloat(assessment.dGlide.toFixed(2));
      
    } else {
      return 0.0;
    }
  }
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (files) {
      const newFiles = Array.from(files);
      const invalidFiles = newFiles.filter(
        (file) =>
          !file.name.startsWith('Trajectoire_') &&
          (file.name.endsWith('.kml') || file.name.endsWith('.geojson'))
      );

      if (invalidFiles.length > 0) {
        setErrorMessage(
          "ERREUR : votre fichier doit avoir un nom de la forme 'Trajectoire_Nom-de-la-trajectoire' et être un fichier .kml ou .geojson"
        );
        return;
      }

      setErrorMessage(null);

      const fileCopies = await Promise.all(
        newFiles.map(async (file) => {
          const content = await file.text();
          return new File([content], file.name, { type: file.type });
        })
      );

      onChange({
        ...assessment,
        trajgeoFiles: [...(assessment.trajgeoFiles || []), ...fileCopies],
      });
    }
  };

  const handleRemoveFile = (index: number) => {
    const newFiles = [...(assessment.trajgeoFiles || [])];
    newFiles.splice(index, 1);
    onChange({ ...assessment, trajgeoFiles: newFiles });
  };

  return (
    <div className="space-y-8">
      <h2 className="text-xl font-semibold">Évaluation des Risques</h2>

      <section className="space-y-4">
        <h3 className="text-lg font-medium">Mission</h3>

        <div className="bg-gray-50 p-4 rounded-lg space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Tooltip text="Option Hauteur de vol">
                <label className="block text-sm font-medium text-gray-700">
                  Hauteur de Vol
                </label>
              </Tooltip>
              <select
                value={assessment.assessmentTypeHauteurVol}
                onChange={(e) =>
                  onChange({
                    ...assessment,
                    assessmentTypeHauteurVol: e.target
                      .value as assessmentTypeHauteurVol,
                    followTerrainHeight:
                      e.target.value === 'Hauteur de vol en suivi de terrain'
                        ? assessment.followTerrainHeight
                        : 0,
                  })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="Hauteur de vol suivant trajectoire(s)">
                  Hauteur de vol suivant trajectoire(s)
                </option>
                <option value="Hauteur de vol en suivi de terrain">
                  Hauteur de vol en suivi de terrain
                </option>
              </select>
            </div>

            {assessment.assessmentTypeHauteurVol ===
              'Hauteur de vol en suivi de terrain' && (
              <div>
                <Tooltip text="Hauteur qui sera appliquée suivant la topographie terrain.">
                  <label className="block text-sm font-medium text-gray-700">
                    Hauteur de la trajectoire
                  </label>
                </Tooltip>
                <input
                  type="number"
                  value={assessment.followTerrainHeight}
                  onChange={(e) =>
                    onChange({
                      ...assessment,
                      followTerrainHeight: parseInt(e.target.value) || 0,
                    })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Tooltip text=" XXX ">
                <label className="block text-sm font-medium text-gray-700">
                  Moduler la densité de population en fonction du temps de vol
                  le long de la trajectoire du drone
                </label>
              </Tooltip>
              <select
                value={assessment.PopulationDensityModulation}
                onChange={(e) =>
                  onChange({
                    ...assessment,
                    PopulationDensityModulation: e.target
                      .value as PopulationDensityModulation,
                  })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="NON">NON</option>
                <option value="OUI">OUI</option>
              </select>
            </div>
            {assessment.PopulationDensityModulation ===
              'OUI' && (
            <div>
              <Tooltip text="Heure Locale spécifiée à l'étape #1">
                <label className="block text-sm font-medium text-gray-700">
                  Heure de Démarrage des opérations
                </label>
              </Tooltip>
              <div className="mt-1 relative">
                <input
                  type="time"
                  value={assessment.assessmentStartTime}
                  onChange={(e) =>
                    onChange({
                      ...assessment,
                      assessmentStartTime: e.target.value,
                    })
                  }
                  className="block w-full pr-10 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  disabled
                />
                <Clock className="absolute right-3 top-2 h-5 w-5 text-gray-400" />
              </div>
            </div>
              )}
          </div>

          <div>
            <Tooltip text="Insérez vos trajectoires : un fichier par tajectoire sous le nom Trajectoire_Nom-de-la-trajectoire">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Trajectoire
              </label>
            </Tooltip>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-blue-500 transition-colors">
              <input
                ref={fileInputRef}
                type="file"
                accept=".kml,.geojson"
                onChange={handleFileChange}
                className="hidden"
                multiple
              />
              <div
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center justify-center gap-2 cursor-pointer"
              >
                <Upload className="w-5 h-5 text-gray-400" />
                <span className="text-gray-600">
                  Déposer des fichiers KML ou GeoJSON ici
                </span>
              </div>
            </div>
            {errorMessage && (
              <div className="mt-2 p-2 bg-red-50 text-red-600 rounded">
                {errorMessage}
              </div>
            )}
            {assessment.trajgeoFiles && assessment.trajgeoFiles.length > 0 && (
              <div className="mt-2 space-y-2">
                {assessment.trajgeoFiles.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 bg-white rounded"
                  >
                    <span className="text-sm text-gray-600">{file.name}</span>
                    <button
                      onClick={() => handleRemoveFile(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Supprimer
                    </button>
                  </div>
                ))}
              </div>
            )}

            <RiskAssessmentMap geoFiles={assessment.trajgeoFiles || []} />
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="text-lg font-medium">
          Determination de l'iGRC : Intrinsic Ground Risk Class 
        </h3>
        <div className="bg-gray-50 p-4 rounded-lg space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <h2 className="text-lg font-medium">
            Etape 1 : Determination de la surface critique de crash (Ac).
            </h2>
            <div>
              <Tooltip text="Aussi appelée Critical Area ou Surface de Crash">
                <label className="block text-sm font-medium text-gray-700">
                  Méthode d'évaluation de la Surface Critique
                </label>
              </Tooltip>
              <select
                value={assessment.assessmentCriticalArea}
                onChange={(e) =>
                  onChange({
                    ...assessment,
                    assessmentCriticalArea: e.target
                      .value as assessmentCriticalArea,
                    CriticalArea:
                      e.target.value === 'Spécifiée par le déposant'
                        ? assessment.CriticalArea
                        : 0,
                  })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="Sélectionner une méthode d'évaluation">
                  Sélectionner une méthode d'évaluation
                </option>
                <option value="Calcul selon les tables SORA">
                  Calcul selon les tables SORA
                </option>
                <option value="Calcul selon les Modèles JARUS">
                  Calcul selon les Modèles JARUS
                </option>
                <option value="Spécifiée par le déposant">
                  Spécifiée par le déposant
                </option>
              </select>
            </div>

          </div>
            {assessment.assessmentCriticalArea ===
              'Spécifiée par le déposant' ? (
                <div>
                  <div>
                    <Tooltip text="Valeur de la Surface Critique déclarée (m²) A justifier par l'opérateur en annexe ! ">
                      <label className="block text-sm font-medium text-gray-700">
                        Valeur de la Surface Critique déclarée (m²)
                      </label>
                    </Tooltip>
                    <input
                      type="number"
                      value={assessment.CriticalArea}
                      onChange={(e) =>
                        onChange({
                          ...assessment,
                          CriticalArea: parseInt(e.target.value) || 0,
                        })
                      }
                      step="1.0"
                      className="mt-1 block w-full rounded-md border-black border-2 font-bold  shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      
                    />
                  </div>
                  <div>
                  <Tooltip text="Si vous choisissez de déclarer votre propre valeur de surface critique, veuillez apporter une justification. Celle-ci doit établir clairement le mode de calcul adopté. Vous devrez fournir en annexe un document détaillant chaque étape de calcul et leur base de justification.">
                    <label className="block text-sm font-medium text-gray-700">
                      Justification de votre surface Critique
                    </label>
                  </Tooltip>
                  <textarea
                      value={assessment.UserCriticalArea_Justification}
                      onChange={(e) =>
                        onChange({
                          ...assessment,
                          UserCriticalArea_Justification: e.target.value,
                        })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      rows={4}
                    />
                  </div>
                </div>
              ) : assessment.assessmentCriticalArea ===
              'Calcul selon les Modèles JARUS' ? (
              <div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Valeur de la Surface Critique Calculée (m²)
                  </label>
                  <div className="mt-1 block w-full rounded-md border-black border-2 font-bold shadow-sm focus:border-blue-500 focus:ring-blue-500">
                    {Math.round(CalculJARUSCriticalArea())}
                  </div>
                </div>
                

                
                <div>
                  <Tooltip text=" ">
                    <label className="block text-sm font-medium text-gray-700">
                      L'appareil est-il capable de planer ?
                    </label>
                  </Tooltip>
                  <select
                    value={assessment.GlidingCapability}
                    onChange={(e) =>
                      onChange({
                        ...assessment,
                        GlidingCapability: e.target
                          .value as GlidingCapability,
                      })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="NON">NON</option>
                    <option value="OUI">OUI</option>
                  </select>
                </div>
                  
                {assessment.GlidingCapability === 'NON' && (
                  // L'angle d'impact serait-il supérieur à 60° ? 
                  <div>
                    <Tooltip text=" ">
                      <label className="block text-sm font-medium text-gray-700">
                        L'angle d'impact serait-il supérieur à 60° ?
                      </label>
                    </Tooltip>
                    <select
                      value={assessment.HighImpactAngle}
                      onChange={(e) =>
                        onChange({
                          ...assessment,
                          HighImpactAngle: e.target
                            .value as HighImpactAngle,
                        })
                      }
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                      <option value="NON">NON</option>
                      <option value="OUI">OUI</option>
                    </select>
                  </div>
                
                    
                      
              
                )} 
                
                {assessment.GlidingCapability === "OUI" || assessment.HighImpactAngle === 'NON' ? ( 
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <h3 className="text-lg font-medium">Jarus Model</h3>
                    {assessment.maxCharacteristicDimension >= 1 &&
                      assessment.maxCharacteristicDimension < 8 ? (
                      <div>
                        <Tooltip text=" Activable si la Dimensions caractéristiques maximales est comprise entre 1m et 8m (1m ≤ w < 8m) et en présence d'obstacles le justifiant.">
                          <label className="block text-sm font-medium text-gray-700">
                            Activer la réduction de 40% pour les obstacles
                          </label>
                        </Tooltip>
                        <select
                          value={assessment.ObstaclesModulation}
                          onChange={(e) =>
                            onChange({
                              ...assessment,
                              ObstaclesModulation: e.target
                                .value as ObstaclesModulation,
                            })
                          }
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        >
                          <option value="NON">NON</option>
                          <option value="OUI">OUI</option>
                        </select>
                      </div>
                    ) : (
                      <div>
                        <Tooltip text=" Activable si la Dimensions caractéristiques maximales est comprise entre 1m et 8m (1m ≤ w < 8m) et en présence d'obstacles le justifiant.">
                          <label className="block text-sm font-medium text-gray-700">
                            Activer la réduction de 40% pour les obstacles
                          </label>
                        </Tooltip>
                        <select
                          value={assessment.ObstaclesModulation}
                          onChange={(e) =>
                            onChange({
                              ...assessment,
                              ObstaclesModulation: e.target
                                .value as ObstaclesModulation,
                            })
                          }
                          disabled
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        >
                          <option value="NON">NON</option>
                          {/* <option value="OUI">OUI</option> */}
                        </select>
                      </div>
                    )}                    
                
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Dimensions caractéristiques maximales (m)
                      </label>
                      <div className="mt-1 p-2 bg-gray-50 rounded-md">
                        {assessment.maxCharacteristicDimension}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Vitesse maximales (m/s)
                      </label>
                      <div className="mt-1 p-2 bg-gray-50 rounded-md">
                        {assessment.maxSpeed}
                      </div>
                    </div>  
                    <div>
                        <Tooltip text="Données personalisées pour le modèle Jarus">
                          <label className="block text-sm font-medium text-gray-700">
                            Activer les fonctionnalités de calcul détaillé du modèle
                          </label>
                        </Tooltip>
                        <select
                          value={assessment.DetailedJarusModel}
                          onChange={(e) =>
                            onChange({
                              ...assessment,
                              DetailedJarusModel: e.target
                                .value as DetailedJarusModel,
                            })
                          }
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        >
                          <option value="NON">NON</option>
                          <option value="OUI">OUI</option>
                        </select>
                    </div>
                    <h3 className="text-lg font-medium">   </h3>

                    {assessment.DetailedJarusModel === 'OUI' && (
                      
                      <div>
                        <Tooltip text="Angle d'impact (de plané/fauché.) NB: Si Dimensions caractéristiques maximales ≤ 1m prendre 35°, et pour les appareil plus grand prendre 10°.">
                          <label className="block text-sm font-medium text-gray-700">
                            Theta_Glide (deg)
                          </label>
                        </Tooltip>
                        <input
                          type="number"
                          value={assessment.ThetaGlide}
                          onChange={(e) =>
                            onChange({
                              ...assessment,
                              ThetaGlide: parseFloat(e.target.value) || 0.000
                            })
                          }
                          step="0.1"
                          min={0}
                          max={90}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          placeholder={AdviceThetaGlide().toString()}
                        />     
                      
                        <label className="block text-sm font-medium text-gray-700">
                          Mass maximale MTOW (kg)
                        </label>
                        <div className="mt-1 p-2 bg-gray-50 rounded-md">
                          {assessment.MTOW}
                        </div>                 
                      </div>
                    )}
                    {assessment.DetailedJarusModel === 'OUI' && (
                      <div>
                        <Tooltip text="Si votre Angle d'impact ne respecte pas les consignes, apporter une justification. NB: Si Dimensions caractéristiques maximales ≤ 1m prendre 35°, et pour les appareil plus grand prendre 10°.">
                          <label className="block text-sm font-medium text-gray-700">
                            Theta_Glide Justification
                          </label>
                        </Tooltip>
                        <textarea
                            value={assessment.Theta_Glide_Justification}
                            onChange={(e) =>
                              onChange({
                                ...assessment,
                                Theta_Glide_Justification: e.target.value,
                              })}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            rows={4}
                          />
                      </div>
                    )}
                    
                    <div>
                      <Tooltip  text={
                                  <div>
                                    Distance de plané à hauteur d'homme.
                                    <br />
                                    d_Glide = hperson/tan θ
                                  </div>
                                }>
                        <label className="block text-sm font-medium text-gray-700">
                          d_Glide (m)
                        </label>
                      </Tooltip>
                      <input
                        type="number"
                        value={assessment.dGlide}
                        onChange={(e) =>
                          onChange({
                            ...assessment,
                            dGlide: parseFloat(e.target.value) || 0.000
                          })
                        }
                        step="0.01"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        placeholder={(AdvicedGlide()).toString()}
                        
                      />
                      
                    </div> 
                    <div>
                      <Tooltip  text={
                                  <div>
                                    Distance de glissement/friction.
                                    <br />
                                    d_Slide,reduced = e·vhorizontal·tsafe − 0,5·Cg·g(tsafe)²
                                  </div>
                                }>
                        <label className="block text-sm font-medium text-gray-700">
                          d_Slide,reduced (m)
                        </label>
                      </Tooltip>
                      <input
                        type="number"
                        value={assessment.dSlideReduced}
                        onChange={(e) =>
                          onChange({
                            ...assessment,
                            dSlideReduced: parseFloat(e.target.value) || 0.000
                          })
                        }
                        step="0.01"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        placeholder={AdvicedSlideReduced().toString()}
                      />
                      
                    </div>
                
                  </div>

                ) : ( 

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <h3 className="text-lg font-medium">High Impact Angle Model</h3>                 
                    
                  </div>

                )}




                
              </div>
              ) : assessment.assessmentCriticalArea ===
              'Calcul selon les tables SORA' ? (
                <div>
                <div>
                  <table className="min-w-full bg-white">
                    <thead>
                      <tr className="bg-black text-black">
                        <th className="bg-gray-200 py-2 px-4 border-b">Max. characteristic dimension (m)</th>
                        <th className="bg-white py-2 px-4 border-b">≤1</th>
                        <th className="bg-white py-2 px-4 border-b">≤3</th>
                        <th className="bg-white py-2 px-4 border-b">≤8</th>
                        <th className="bg-white py-2 px-4 border-b">≤20</th>
                        <th className="bg-white py-2 px-4 border-b">≤40</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="bg-gray-200">
                        <th className="bg-gray-200 py-2 px-4 border-b">Critical area (m²)</th>
                        <th className="bg-white py-2 px-4 border-b">8</th>
                        <th className="bg-white py-2 px-4 border-b">80</th>
                        <th className="bg-white py-2 px-4 border-b">800</th>
                        <th className="bg-white py-2 px-4 border-b">8000</th>
                        <th className="bg-white py-2 px-4 border-b">80000</th>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div>
                <Tooltip  text={
                                  <div>
                                    Valeur de la Surface Critique (m²) selon les tables SORA.
                                    <br />
                                    Ces valeurs peuvent être trop conservatrices pour certains cas d'utilisation!
                                  </div>
                                }>
                  <label className="block text-sm font-medium text-gray-700">
                    Valeur de la Surface Critique selon les tables (m²). 
                  </label>
                </Tooltip>
                <input
                  type="number"
                  value={ACtable()}
                  onChange={(e) =>
                    onChange({
                      ...assessment,
                      CriticalArea: parseInt(e.target.value) || 0,
                    })
                  }
                  className="mt-1 block w-full rounded-md border-black border-2 font-bold shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  disabled
                />
                </div>
                </div>
              ) : (
                <div>

                </div>
              )
            }
        </div> 

        <div className="bg-gray-50 p-4 rounded-lg space-y-4"> 
          <h2 className="text-lg font-medium">Etape 2 : Determination des Volumes d'évolution, de Contingence Zone Tampon et Adjacente  (Flight Geometry).</h2>
          <img 

            src={DefinitionOfVolumes}
            alt="Centres d'Essais Drones France" 
            className="w-auto h-auto mb-6 mx-auto"
          />
          <h2 className="text-lg font-medium">Etape 2.1 : Determination du Volume d'évolution (Flight Geometry).</h2> 
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">               
            <div>
              <Tooltip  text={
                                  <div>
                                    Largeur du Volume d'évolution. 
                                    <br />
                                    Attention : Des valeurs inférieures à 3 fois la dimension caractéristique maximale de l'appareil sont considérées irrecevables. 
                                    <br />
                                    S_FG≥ 3.maxCharacteristicDimension à l'arrondis supérieur.
                                  </div>
                                }>
                <label className="block text-sm font-medium text-gray-700">
                  S_FG : Largeur du Volume d'évolution (m)
                </label>
              </Tooltip>
              <input
                type="number"
                value={assessment.FlightGeographyWidth}
                onChange={(e) =>
                  onChange({
                    ...assessment,
                    FlightGeographyWidth: Math.max(parseFloat(e.target.value),Math.round(3*assessment.maxCharacteristicDimension+0.49)) || 0.000
                  })
                }
                step="1.0"
                //min={3 * assessment.maxCharacteristicDimension} // Définit la valeur minimale autorisée
                className="mt-1 block w-full rounded-md border-green-900 border-2 font-bold bg-green-50 text-green-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder={(Math.round(3*assessment.maxCharacteristicDimension+0.49)).toString()}
              />
            </div> 
            <div>
              <Tooltip  text={
                                  <div>
                                    Hauteur du Volume d'évolution. 
                                    <br />                                    
                                    Attention : Des valeurs inférieures à 3 fois la dimension caractéristique maximale de l'appareil sont considérées irrecevables. 
                                    <br />
                                    H_FG≥ 3.maxCharacteristicDimension à l'arrondis supérieur
                                  </div>
                                }>
                <label className="block text-sm font-medium text-gray-700">
                  H_FG : Hauteur du Volume d'évolution (m)
                </label>
              </Tooltip>
              <input
                type="number"
                value={assessment.FlightGeographyHeight}
                onChange={(e) =>
                  onChange({
                    ...assessment,
                    FlightGeographyHeight: Math.max(parseFloat(e.target.value),Math.round(3*assessment.maxCharacteristicDimension+0.49)) || 0.000
                  })
                }
                step="1.0"
                min={3 * assessment.maxCharacteristicDimension} // Définit la valeur minimale autorisée
                className="mt-1 block w-full rounded-md border-green-900 border-2 font-bold bg-green-50 text-green-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder={(Math.round(3*assessment.maxCharacteristicDimension+0.49)).toString()}
              />
            </div> 
          </div>   
          <div>
                <Tooltip text="Vous pouvez si vous le souhaitez apporter des éléments de justification de la définition de votre Volume d'évolution.">
                  <label className="block text-sm font-medium text-gray-700">
                    Justification de votre Volume d'évolution
                  </label>
                </Tooltip>
                <textarea
                    value={assessment.FlightGeography_Justification}
                    onChange={(e) =>
                      onChange({
                        ...assessment,
                        FlightGeography_Justification: e.target.value,
                      })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    rows={4}
                  />
          </div> 
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <h2 className="text-lg font-medium">Etape 2.2 : Determination du volume de Contingence (S_CV : Contingency Volume).</h2>
            <div>
              <Tooltip text="Le Volume de Contingence : volume dans lequel le drone est considéré comme étant dans une situation anormale et qui requiert l’exécution des procédures de contingence appropriée pour le faire revenir au-dessus de sa zone d’évolution. A minima la taille du volume de contingence est calculée comme la distance parcourue par le drone à sa vitesse sol maximale durant le temps de réaction du pilote pour s’apercevoir qu’il est sorti du volume d’évolution et de prendre les mesures adaptées.  La limite interne du volume de contingence doit correspondre à la limite externe du volume d’évolution.">
                <label className="block text-sm font-medium text-gray-700">
                  Méthode d'évaluation du Volume de Contingence
                </label>
              </Tooltip>
              <select
                value={assessment.assessmentContingencyVolume}
                onChange={(e) =>
                  onChange({
                    ...assessment,
                    assessmentContingencyVolume: e.target
                      .value as assessmentContingencyVolume,
                    ContingencyVolume:
                      e.target.value === 'Spécifiée par le déposant'
                        ? assessment.ContingencyVolume
                        : 0,
                  })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="Sélectionner une méthode d'évaluation du Volume">
                  Sélectionner une méthode d'évaluation du Volume
                </option>
                <option value="Spécifiée par le déposant">
                  Spécifiée par le déposant
                </option>
                <option value="Calcul selon le Guide">
                  Calcul selon le Guide 
                </option>
              </select>
            </div>
            
          </div>
            {assessment.assessmentContingencyVolume ===
              'Calcul selon le Guide' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Tooltip  text={
                                          <div>
                                            Largeur du Volume de Contingence. 
                                            <br />
                                            Attention : Des valeurs inférieures à la Largeur du Volume d'évolution sont considérées irrecevables. 
                                            <br />
                                            S_CV ≥ S_FG
                                          </div>
                                        }>
                        <label className="block text-sm font-medium text-gray-700">
                          S_CV : Largeur du Volume de Contingence (m)
                        </label>
                      </Tooltip>
                      <input
                        type="number"
                        value={assessment.ContingencyVolumeWidth}
                        // onChange={(e) =>
                        //   onChange({
                        //     ...assessment,
                        //     ContingencyVolumeWidth: Math.max(parseFloat(e.target.value),(assessment.FlightGeographyWidth)) || 0.000
                        //   })
                        // }
                        //step="0.1"
                        //min={assessment.FlightGeographyWidth} // Définit la valeur minimale autorisée
                        className="mt-1 block w-full rounded-md border-orange-900 border-2 font-bold bg-orange-50 text-orange-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        placeholder={CalculContingencyVolumeWidth(assessment.ContingencyVolumeSGPS,assessment.ContingencyVolumeSpos,assessment.ContingencyVolumeSK,assessment.ContingencyVolumeSRZ,assessment.ContingencyVolumeSCM)}//(assessment.FlightGeographyWidth)}
                        disabled
                      />  
                    </div> 
                    <div>
                      { (assessment.ContingencyVolumeSGPS === undefined || assessment.ContingencyVolumeSGPS === null) || (assessment.ContingencyVolumeSpos === undefined || assessment.ContingencyVolumeSpos === null) || (assessment.ContingencyVolumeSK === undefined || assessment.ContingencyVolumeSK === null) || (assessment.ContingencyVolumeSRZ === undefined || assessment.ContingencyVolumeSRZ === null) || (assessment.ContingencyVolumeSCM === undefined || assessment.ContingencyVolumeSCM === null)  ? (
                        <div className="mt-2 p-2 bg-red-50 text-red-600 rounded">
                          Attention : une donnée est indéfinie ou nulle.
                        </div>
                      ) : (
                        <Tooltip   text={
                          <div>
                            Les valeurs suivantes sont utilisées pour le calcul de la largeur du volume de contingence. Vérifier la cohérence avec l'affichage. 
                            <br />                                    
                            GPS - Inaccuracy = {assessment.ContingencyVolumeSGPS} m
                            <br />
                            Position Holding = {assessment.ContingencyVolumeSpos} m
                            <br />
                            Map error = {assessment.ContingencyVolumeSK} m
                            <br />
                            Temps de Réaction = {assessment.ContingencyTimeRZ} s
                            <br />
                            Distance de réaction S_RZ = {assessment.ContingencyVolumeSRZ} m
                            <br />
                            Manoeuvre de contigence S_CM = {assessment.ContingencyVolumeSCM} m
                          </div>
                        }>

                        <div>
                          <button
                            onClick={() => CalculContingencyVolumeWidth(assessment.ContingencyVolumeSGPS,assessment.ContingencyVolumeSpos,assessment.ContingencyVolumeSK,assessment.ContingencyVolumeSRZ,assessment.ContingencyVolumeSCM)}
                            className="rounded-md border-green-200 border-2 font-bold text-green-500 hover:text-blue-200"
                          >
                            Calculer
                          </button>
                        </div>
                        
                        </Tooltip>
                      )}

                      
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Tooltip  text={
                                          <div>
                                            Hauteur du Volume de Contingence. 
                                            <br />                                    
                                            Attention : Des valeurs inférieures à la Hauteur du Volume d'évolution sont considérées irrecevables.  
                                            <br />
                                            H_CV ≥ H_FG
                                          </div>
                                        }>
                        <label className="block text-sm font-medium text-gray-700">
                          H_CV : Hauteur du Volume de Contingence (m)
                        </label>
                      </Tooltip>
                      <input
                        type="number"
                        value={assessment.ContingencyVolumeHeight}
                        // onChange={(e) =>
                        //   onChange({
                        //     ...assessment,
                        //     ContingencyVolumeHeight: Math.max(parseFloat(e.target.value),(assessment.FlightGeographyHeight)) || 0.000
                        //   })
                        // }
                        // step="0.1"
                        // min={assessment.FlightGeographyHeight} // Définit la valeur minimale autorisée
                        className="mt-1 block w-full rounded-md border-orange-900 border-2 font-bold bg-orange-50 text-orange-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        placeholder={(assessment.FlightGeographyHeight)}
                        disabled
                      />
                    </div>
                    <div>
                      { (assessment.ContingencyVolumeHbaro === undefined || assessment.ContingencyVolumeHbaro === null) || (assessment.ContingencyVolumeHRZ === undefined || assessment.ContingencyVolumeHRZ === null) || (assessment.ContingencyVolumeHCM === undefined || assessment.ContingencyVolumeHCM === null)  ? (
                        <div className="mt-2 p-2 bg-red-50 text-red-600 rounded">
                          Attention : une donnée est indéfinie ou nulle.
                        </div>
                      ) : (
                        <Tooltip   text={
                          <div>
                            Les valeurs suivantes sont utilisées pour le calcul de la largeur du volume de contingence. Vérifier la cohérence avec l'affichage. 
                            <br />                                    
                            Erreur de mesure d'altitude = {assessment.ContingencyVolumeHbaro} m
                            <br />
                            Position Holding = {assessment.ContingencyVolumeSpos} m
                            <br />
                            Temps de Réaction = {assessment.ContingencyTimeRZ} s
                            <br />
                            Altitude de réaction H_RZ = {assessment.ContingencyVolumeHRZ} m
                            <br />
                            Altitude de contigence H_CM = {assessment.ContingencyVolumeHCM} m
                          </div>
                        }>

                        <div>
                          <button
                            onClick={() => CalculContingencyVolumeHeight(assessment.ContingencyVolumeHbaro,assessment.ContingencyVolumeHRZ,assessment.ContingencyVolumeHCM)}
                            className="rounded-md border-green-200 border-2 font-bold text-green-500 hover:text-blue-200"
                          >
                            Calculer
                          </button>
                        </div>
                        
                        </Tooltip>
                      )}

                      
                    </div>
                  </div>
                  <div>
                    <Tooltip  text={
                                        <div>
                                          GPS - Inaccuracy 
                                          <br />                                    
                                          En règle général, on assumera une erreur ≥ 3 mètres.  
                                          <br />
                                          ...
                                        </div>
                                      }>
                      <label className="block text-sm font-medium text-gray-700">
                      GPS - Inaccuracy (m)
                      </label>
                    </Tooltip>
                    <input
                      type="number"
                      defaultValue={1.0}
                      value={assessment.ContingencyVolumeSGPS}
                      onChange={(e) => onChange({ ...assessment, ContingencyVolumeSGPS: parseFloat(e.target.value), ContingencyVolumeWidth: CalculContingencyVolumeWidth(parseFloat(e.target.value),assessment.ContingencyVolumeSpos,assessment.ContingencyVolumeSK,assessment.ContingencyVolumeSRZ,assessment.ContingencyVolumeSCM) } )}
                      step="0.1"
                      min={0.0} // Définit la valeur minimale autorisée
                      className="mt-1 block w-full rounded-md border-grey-200 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      placeholder={'TO BE DEFINED'}
                    />
                  </div>
                  <div>
                    <Tooltip  text={
                                        <div>
                                          Erreur de mesure d'altitude. 
                                          <br />                                    
                                          En règle général, on assumera une erreur de 1 mètre pour une mesure barométrique.  
                                          <br />
                                          Et, on assumera une erreur de 4 mètre pour une mesure GPS.
                                        </div>
                                      }>
                      <label className="block text-sm font-medium text-gray-700">
                        Erreur de mesure d'altitude (m)
                      </label>
                    </Tooltip>
                    <input
                      type="number"
                      defaultValue={1.0}
                      value={assessment.ContingencyVolumeHbaro}
                      onChange={(e) => onChange({ ...assessment, ContingencyVolumeHbaro: parseFloat(e.target.value), ContingencyVolumeHeight: CalculContingencyVolumeHeight(parseFloat(e.target.value),assessment.ContingencyVolumeHRZ,assessment.ContingencyVolumeHCM) })}
                      step="0.1"
                      min={0.0} // Définit la valeur minimale autorisée
                      className="mt-1 block w-full rounded-md border-grey-200 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      placeholder={'TO BE DEFINED'}
                    />                  
                  </div>

                  <div>
                    <Tooltip  text={
                                        <div>
                                          Positionnement du maintien de la position (Position Holding)
                                          <br />                                    
                                          En règle général, on assumera une erreur ≥ 3 mètres.  
                                          <br />
                                          ...
                                        </div>
                                      }>
                      <label className="block text-sm font-medium text-gray-700">
                      Position Holding (m)
                      </label>
                    </Tooltip>
                    <input
                      type="number"
                      defaultValue={3.0}
                      value={assessment.ContingencyVolumeSpos}
                      onChange={(e) => onChange({ ...assessment, ContingencyVolumeSpos: parseFloat(e.target.value), ContingencyVolumeWidth: CalculContingencyVolumeWidth(assessment.ContingencyVolumeSGPS,parseFloat(e.target.value),assessment.ContingencyVolumeSK,assessment.ContingencyVolumeSRZ,assessment.ContingencyVolumeSCM)  })}
                      step="0.1"
                      min={0.5} // Définit la valeur minimale autorisée
                      className="mt-1 block w-full rounded-md border-grey-200 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      placeholder={'TO BE DEFINED'}
                    />
                  </div>
                  
                  <div>
                  </div>


                  <div>
                    <Tooltip  text={
                                        <div>
                                          Map error 
                                          <br />                                    
                                          En règle général, on assumera une erreur ≥ 1 mètre. 
                                          <br />
                                          ...
                                        </div>
                                      }>
                      <label className="block text-sm font-medium text-gray-700">
                      Map error (m)
                      </label>
                    </Tooltip>
                    <input
                      type="number"
                      defaultValue={1.0}
                      value={assessment.ContingencyVolumeSK}
                      onChange={(e) => onChange({ ...assessment, ContingencyVolumeSK: parseFloat(e.target.value) , ContingencyVolumeWidth: CalculContingencyVolumeWidth(assessment.ContingencyVolumeSGPS,assessment.ContingencyVolumeSpos,parseFloat(e.target.value),assessment.ContingencyVolumeSRZ,assessment.ContingencyVolumeSCM) })}
                      step="0.1"
                      min={0.0} // Définit la valeur minimale autorisée
                      className="mt-1 block w-full rounded-md border-grey-200  shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      placeholder={'TO BE DEFINED'}
                    />  
                  </div>
                  
                  <div>
                  </div>


                  <div>
                    <Tooltip  text={
                                        <div>
                                          Temps de Réaction de l'opérateur ou du système. 
                                          <br />                                    
                                          Temps nécessaire pour que l'opérateur prenne conscience de la situation et réagisse.
                                          <br />
                                          Cas de l'initialisation manuelle de mesures de contingence. t_RZ ≥ 1 seconde 
                                          <br />
                                          En cas d'automatisation type Geofence par exemple, ce temps peut-être plus court.  Dans ce cas apporter une justification. 
                                        </div>
                                      }>
                      <label className="block text-sm font-medium text-gray-700">
                      Temps de Réaction de l'opérateur ou du système (s)
                      </label>
                    </Tooltip>
                    <input
                      type="number"
                      defaultValue={1.0}
                      value={assessment.ContingencyTimeRZ}
                      onChange={(e) => onChange({ ...assessment, ContingencyTimeRZ: parseFloat(e.target.value), ContingencyVolumeSRZ: parseFloat(e.target.value)*assessment.maxSpeed, ContingencyVolumeHRZ: parseFloat(e.target.value)*0.7*assessment.maxSpeed , ContingencyVolumeWidth: CalculContingencyVolumeWidth(assessment.ContingencyVolumeSGPS,assessment.ContingencyVolumeSpos,assessment.ContingencyVolumeSK,parseFloat(e.target.value)*assessment.maxSpeed,assessment.ContingencyVolumeSCM), ContingencyVolumeHeight: CalculContingencyVolumeHeight(assessment.ContingencyVolumeHbaro,parseFloat(e.target.value)*0.7*assessment.maxSpeed ,assessment.ContingencyVolumeHCM)  })}
                      step="0.1"
                      min={0.0} // Définit la valeur minimale autorisée
                      className="mt-1 block w-full rounded-md border-grey-200 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      placeholder={'TO BE DEFINED'}
                    />
                  </div> 
                  
                  <div>
                  </div>

                  <div>
                    <div>                    
                      <label className="block text-sm font-medium text-gray-700">
                      Distance de réaction S_RZ (m)
                      </label>                    
                      <input
                        type="number"
                        value={assessment.ContingencyVolumeSRZ}
                        className="mt-1 block w-full rounded-md border-grey-200 border-2 font-bold shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        placeholder={(1.0*assessment.maxSpeed).toString()}
                        disabled
                      />
                    </div>
                  </div>
                  
                  <div>
                    <div>                   
                      <label className="block text-sm font-medium text-gray-700">
                      Altitude de réaction H_RZ (m)
                      </label>                    
                      <input
                        type="number"
                        value={assessment.ContingencyVolumeHRZ}
                        className="mt-1 block w-full rounded-md border-grey-200 border-2 font-bold shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        placeholder={(1.0*0.7*assessment.maxSpeed).toString()}
                        disabled
                      />
                    </div>
                  </div>
                    

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Manoeuvre de Contingence : Activation du Parachute
                      </label>
                      <input
                        type="checkbox"
                        checked={(assessment.ContingencyParachuteManeuver || []).includes('OUI')}
                        onChange={(e) =>
                          onChange({
                            ...assessment,
                            ContingencyParachuteManeuver: e.target.checked
                              ? 'OUI'
                              : 'NON',
                              ContingencyVolumeWidth: CalculContingencyVolumeWidth(assessment.ContingencyVolumeSGPS,assessment.ContingencyVolumeSpos,assessment.ContingencyVolumeSK,assessment.ContingencyVolumeSRZ,assessment.ContingencyVolumeSCM),
                              ContingencyVolumeHeight: CalculContingencyVolumeHeight(assessment.ContingencyVolumeHbaro,assessment.ContingencyVolumeHRZ,assessment.ContingencyVolumeHCM) ,
                              
                            ContingencyVolumeSCM: (CalculVolumeSCM()?.at(0)),
                            ContingencyVolumeHCM: (CalculVolumeSCM()?.at(1)),
                          })}
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                        
                      />
                      {(assessment.ContingencyParachuteManeuver || []).includes('OUI') ? (
                        <div>
                          <div>

                            <Tooltip  text={
                                            <div>
                                              Temps d'activation du parachute (s)  
                                              <br />                                    
                                              Doit prendre en compte le temps d'ouverture et de mise en descente.
                                              <br />
                                            </div>
                                          }>
                            <label className="block text-sm font-medium text-gray-700">
                                Temps d'activation du parachute (s) 
                            </label>
                            </Tooltip>
                            <input
                              type="number"
                              value={assessment.ParachuteTime}
                              defaultValue={1.0}
                              onChange={(e) => onChange({ ...assessment, ParachuteTime: parseFloat(e.target.value), ContingencyVolumeSCM: parseFloat(e.target.value)*assessment.maxSpeed, ContingencyVolumeHCM: parseFloat((parseFloat(e.target.value)*0.7*assessment.maxSpeed).toFixed(2)) , ContingencyVolumeWidth: CalculContingencyVolumeWidth(assessment.ContingencyVolumeSGPS,assessment.ContingencyVolumeSpos,assessment.ContingencyVolumeSK,assessment.ContingencyVolumeSRZ,parseFloat(e.target.value)*assessment.maxSpeed), ContingencyVolumeHeight: CalculContingencyVolumeHeight(assessment.ContingencyVolumeHbaro,assessment.ContingencyVolumeHRZ,parseFloat((parseFloat(e.target.value)*0.7*assessment.maxSpeed).toFixed(2))) })}
                              step="0.1"
                              min={1.0} // Définit la valeur minimale autorisée
                              className="mt-1 block w-full rounded-md border-grey-200 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                              placeholder={'TO BE DEFINED'}
                            />
                          </div>
                          <div>
                            <Tooltip  text={
                                            <div>
                                              Manoeuvre de contigence S_CM (m) 
                                              <br />                                    
                                              Alternative : Activation du Parachute.
                                              <br />
                                              S_CM = Vmax·t_parachute
                                              <br /> 
                                            </div>
                                          }>                    
                            <label className="block text-sm font-medium text-gray-700">
                              Manoeuvre de contigence S_CM (m) 
                            </label> 
                            </Tooltip>                   
                            <input
                              type="number" 
                              value={assessment.ContingencyVolumeSCM}
                              className="mt-1 block w-full rounded-md border-grey-200 border-2 font-bold shadow-sm focus:border-blue-500 focus:ring-blue-500"
                              placeholder={(1.0*assessment.maxSpeed).toString()}
                              disabled
                            />                         
                          </div>
                        </div>
                      ) : (
                        <div>
                          {(assessment.uasType || []).includes('Héli') || (assessment.uasType || []).includes('Multi') ? (  
                            <div>
                              <Tooltip  text={
                                              <div>
                                                ThetaStopCopter (deg) 
                                                <br />  
                                                Hypothèses : ThrustWeightRatio supérieur à 2.
                                                <br />
                                                ThetaStopCopter inf 45°
                                                <br />
                                                en assumant un angle de roulis φ nul.
                                              </div>
                                            }>
                                <label className="block text-sm font-medium text-gray-700">
                                  Theta Max Stop (deg) 
                                </label>
                              </Tooltip>
                              <input
                                type="number"
                                defaultValue={45.0}
                                value={assessment.ThetaStopCopter}
                                onChange={(e) => onChange({ ...assessment, ThetaStopCopter: parseFloat(e.target.value) , ContingencyVolumeWidth: CalculContingencyVolumeWidth(assessment.ContingencyVolumeSGPS,assessment.ContingencyVolumeSpos,assessment.ContingencyVolumeSK,assessment.ContingencyVolumeSRZ,assessment.ContingencyVolumeSCM), ContingencyVolumeHeight: CalculContingencyVolumeHeight(assessment.ContingencyVolumeHbaro,assessment.ContingencyVolumeHRZ,assessment.ContingencyVolumeHCM) })}
                                step="1.0"
                                min={0.0} // Définit la valeur minimale autorisée
                                max={45.0} // Définit la valeur maximale autorisée
                                className="mt-1 block w-full rounded-md border-grey-200 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                placeholder={'TO BE DEFINED'}
                              />
                            </div>
                          ) : (// (assessment.uasType || []).includes('Avion') || (assessment.uasType || []).includes('Hybride') ?( 
                            <div><Tooltip  text={
                                              <div>
                                                PhiMaxPlane (deg) 
                                                <br />  
                                                Hypothèses : Virrage à 180° en mode Avion.
                                                <br />
                                                PhiMaxPlane inf φ 30°
                                                <br />
                                                en assumant un angle de roulis  nul.
                                              </div>
                                            }>
                                <label className="block text-sm font-medium text-gray-700">
                                  PhiMaxPlane (deg) 
                                </label>
                              </Tooltip>
                              <input
                                type="number"
                                defaultValue={30.0}
                                value={assessment.PhiMaxPlane}
                                onChange={(e) => onChange({ ...assessment, PhiMaxPlane: parseFloat(e.target.value), ContingencyVolumeWidth: CalculContingencyVolumeWidth(assessment.ContingencyVolumeSGPS,assessment.ContingencyVolumeSpos,assessment.ContingencyVolumeSK,assessment.ContingencyVolumeSRZ,assessment.ContingencyVolumeSCM), ContingencyVolumeHeight: CalculContingencyVolumeHeight(assessment.ContingencyVolumeHbaro,assessment.ContingencyVolumeHRZ,assessment.ContingencyVolumeHCM) })}
                                step="1.0"
                                min={0.0} // Définit la valeur minimale autorisée
                                max={30.0} // Définit la valeur maximale autorisée
                                className="mt-1 block w-full rounded-md border-grey-200 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                placeholder={'TO BE DEFINED'}
                              />
                            </div>
                          
                          )}
                          <Tooltip  text={
                                          <div>
                                            Manoeuvre de contigence S_CM (m) 
                                            <br />                                    
                                            * Hélicoptère/Multi-rotor ≡ Arrêt d'urgence
                                            <br />
                                            S_CM = 1/2·Vmax²/(g·tan(θ))
                                            <br />  
                                            * Avion/Hybride/Plus léger que l'air ≡ Virage à 180°
                                            <br />
                                            S_CM = Vmax²/(g·tan(φ))
                                            <br />
                                            en assumant un angle de roulis φ de 30°.
                                            <br />
                                            ou bien 
                                            <br />
                                            S_CM = 180°/(2·taux de virage max)
                                          </div>
                                        }>
                            <label className="block text-sm font-medium text-gray-700">
                              Manoeuvre de contigence S_CM (m) 
                            </label>
                          </Tooltip>
                          <input
                            type="number"
                            value={assessment.ContingencyVolumeSCM}
                            onChange={(e) => onChange({ ...assessment, ContingencyVolumeSCM: parseFloat(e.target.value) })}
                            step="0.1"
                            min={1.0} // Définit la valeur minimale autorisée
                            className="mt-1 block w-full rounded-md border-grey-200 border-2 font-bold shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            placeholder={CalculVolumeSCM()?.at(0)}
                            disabled
                          />
                        </div>



                      )}
                    </div>
                    {/* {assessment.ContingencyParachuteManeuver ==='Manoeuvre de Contingence  Alternative "Parachute"' ? ( */}
                    <div>
                                          
                      <br />
                      <br />
                      
                      <br />
                      <br />
                      
                        
                      <div>
                        <Tooltip  text={
                                        <div>
                                          Manoeuvre de contigence verticale H_CM (m) 
                                          <br />                                    
                                          Alternative : Activation du Parachute.
                                          <br />
                                          H_CM = Vmax·t_parachute·0.7
                                          <br /> 
                                        </div>
                                      }>                    
                        <label className="block text-sm font-medium text-gray-700">
                        Altitude de contigence H_CM (m)
                        </label> 
                        </Tooltip>                   
                        <input
                          type="number"
                          value={assessment.ContingencyVolumeHCM}
                          className="mt-1 block w-full rounded-md border-grey-200 border-2 font-bold shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          placeholder={(1.0*0.7*assessment.maxSpeed).toString()}
                          disabled
                        />                                             
                      </div>
                    </div>
                                                    


                </div>               
              ) : assessment.assessmentContingencyVolume ===
              'Spécifiée par le déposant' ? (
                <div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                    <Tooltip  text={
                                        <div>
                                          Largeur du Volume de Contingence. 
                                          <br />
                                          Attention : Des valeurs inférieures à la Largeur du Volume d'évolution sont considérées irrecevables. 
                                          <br />
                                          S_CV ≥ S_FG
                                        </div>
                                      }>
                      <label className="block text-sm font-medium text-gray-700">
                        S_CV : Largeur du Volume de Contingence (m)
                      </label>
                    </Tooltip>
                    <input
                      type="number"
                      value={assessment.ContingencyVolumeWidth}
                      onChange={(e) => onChange({ ...assessment, ContingencyVolumeWidth: parseFloat(e.target.value) })}
                      step="0.1"
                      min={assessment.FlightGeographyWidth} // Définit la valeur minimale autorisée
                      className="mt-1 block w-full rounded-md border-orange-900 border-2 font-bold bg-orange-50 text-orange-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      placeholder={(assessment.FlightGeographyWidth)}
                    />
                    </div> 
                    <div>
                    <Tooltip  text={
                                        <div>
                                          Hauteur du Volume de Contingence. 
                                          <br />                                    
                                          Attention : Des valeurs inférieures à la Hauteur du Volume d'évolution sont considérées irrecevables.  
                                          <br />
                                          H_CV ≥ H_FG
                                        </div>
                                      }>
                      <label className="block text-sm font-medium text-gray-700">
                        H_CV : Hauteur du Volume de Contingence (m)
                      </label>
                    </Tooltip>
                    <input
                      type="number"
                      value={assessment.ContingencyVolumeHeight}
                      onChange={(e) =>
                        onChange({
                          ...assessment,
                          ContingencyVolumeHeight: Math.max(parseFloat(e.target.value),(assessment.FlightGeographyHeight)) || 0.000
                        })
                      }
                      step="0.1"
                      min={assessment.FlightGeographyHeight} // Définit la valeur minimale autorisée
                      className="mt-1 block w-full rounded-md border-orange-900 border-2 font-bold bg-orange-50 text-orange-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      placeholder={(assessment.FlightGeographyHeight)}
                    />
                    </div>
                  </div>
                  <div>
                    <Tooltip text="Vous devez apporter des éléments de justification de la définition de votre Volume de Contingence.">
                      <label className="block text-sm font-medium text-gray-700">
                        Justification de votre Volume de Contingence
                      </label>
                    </Tooltip>
                    <textarea
                        value={assessment.ContingencyVolume_Justification}
                        onChange={(e) =>
                          onChange({
                            ...assessment,
                            ContingencyVolume_Justification: e.target.value,
                          })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        rows={4}
                      />
                  </div>
                </div>

              ) : (
                <div></div>
              )
            }  
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">   
            <h2 className="text-lg font-medium">Etape 2.3 : Determination du Zone Tampon (Ground Risk Buffer).</h2>
                  {/* Limitation des choix possible en fonction du type d'UAS :   (assessment.uasType === 'Avion' || assessment.uasType === 'Hybride/VTOL') && (assessment.GlidingCapability === undefined || assessment.GlidingCapability === null) ? (*/}
                  {(assessment.uasType === 'Avion' || assessment.uasType === 'Hybride/VTOL') && assessment.GlidingCapability === 'OUI' ? (
                    <div>
                        <Tooltip text="Aussi appelée Ground Risk Buffer, cette zone est définie au niveau du sol directement adjacente au volume de contingence. Si l'UAS quitte la zone de contingence, il est assumé que l'UAS n'est plus sous contrôle de l'opérateur et qu'il doit être mis fin au vol. Dans ce cas le l'UAS doit retomber dans la zone Tampon.">
                          <label className="block text-sm font-medium text-gray-700">
                            Méthode d'évaluation de la Zone Tampon
                          </label>
                        </Tooltip>                  
                      <select
                      value={assessment.assessmentGRB}
                      onChange={(e) =>
                        onChange({
                          ...assessment,
                          assessmentGRB: e.target
                            .value as assessmentGRB,
                          GRB:
                            e.target.value === "Sélectionner une méthode d'évaluation de la zone tampon"
                              ? assessment.GRB
                              : 0
                        })
                      }
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      >
                        <option value="Sélectionner une méthode d'évaluation de la zone tampon">
                        Sélectionner une méthode d'évaluation de la zone tampon
                        </option>
                        <option value="Approche Simplifiée, Règle 1:1">
                        Approche Simplifiée, Règle 1:1
                        </option>
                        <option value="Terminaison Aile Fixe">
                        Terminaison Aile Fixe
                        </option>
                        <option value="Terminaison avec parachute">
                        Terminaison avec parachute
                        </option>
                        <option value="Spécifiée par le déposant">
                        Spécifiée par le déposant
                        </option> 
                      </select>
                    </div>
                  ): (assessment.uasType === 'Avion' || assessment.uasType === 'Hybride/VTOL') && assessment.GlidingCapability === 'NON' ? (
                    <div>
                        <Tooltip text="Aussi appelée Ground Risk Buffer, cette zone est définie au niveau du sol directement adjacente au volume de contingence. Si l'UAS quitte la zone de contingence, il est assumé que l'UAS n'est plus sous contrôle de l'opérateur et qu'il doit être mis fin au vol. Dans ce cas le l'UAS doit retomber dans la zone Tampon.">
                          <label className="block text-sm font-medium text-gray-700">
                            Méthode d'évaluation de la Zone Tampon
                          </label>
                        </Tooltip>
                      <select
                      value={assessment.assessmentGRB}
                      onChange={(e) =>
                        onChange({
                          ...assessment,
                          assessmentGRB: e.target
                            .value as assessmentGRB,
                          GRB:
                            e.target.value === "Sélectionner une méthode d'évaluation de la zone tampon"
                              ? assessment.GRB
                              : 0
                        })
                      }
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      >  
                        <option value="Sélectionner une méthode d'évaluation de la zone tampon">
                        Sélectionner une méthode d'évaluation de la zone tampon
                        </option>
                        <option value="Approche Simplifiée, Règle 1:1">
                        Approche Simplifiée, Règle 1:1
                        </option>
                        <option value="Terminaison avec parachute">
                        Terminaison avec parachute
                        </option>
                        <option value="Spécifiée par le déposant">
                        Spécifiée par le déposant
                        </option> 
                      </select>
                    </div>
                  
                  ) : (assessment.uasType === 'Avion' || assessment.uasType === 'Hybride/VTOL') && (assessment.GlidingCapability === undefined || assessment.GlidingCapability === null) ? (
                    <div>
                        <Tooltip text="Aussi appelée Ground Risk Buffer, cette zone est définie au niveau du sol directement adjacente au volume de contingence. Si l'UAS quitte la zone de contingence, il est assumé que l'UAS n'est plus sous contrôle de l'opérateur et qu'il doit être mis fin au vol. Dans ce cas le l'UAS doit retomber dans la zone Tampon.">
                          <label className="block text-sm font-medium text-gray-700">
                            Méthode d'évaluation de la Zone Tampon
                          </label>
                        </Tooltip>                  
                      <select
                      value={assessment.assessmentGRB}
                      onChange={(e) =>
                        onChange({
                          ...assessment,
                          assessmentGRB: e.target
                            .value as assessmentGRB,
                          GRB:
                            e.target.value === "Sélectionner une méthode d'évaluation de la zone tampon"
                              ? assessment.GRB
                              : 0
                        })
                      }
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      >
                        <option value="Sélectionner une méthode d'évaluation de la zone tampon">
                        Sélectionner une méthode d'évaluation de la zone tampon
                        </option>
                        <option value="Approche Simplifiée, Règle 1:1">
                        Approche Simplifiée, Règle 1:1
                        </option>
                        <option value="Terminaison Aile Fixe">
                        Terminaison Aile Fixe
                        </option>
                        <option value="Terminaison avec parachute">
                        Terminaison avec parachute
                        </option>
                        <option value="Spécifiée par le déposant">
                        Spécifiée par le déposant
                        </option> 
                      </select>
                    </div>
                  ):assessment.uasType === 'Hélicoptère' ? (
                    <div>
                        <Tooltip text="Aussi appelée Ground Risk Buffer, cette zone est définie au niveau du sol directement adjacente au volume de contingence. Si l'UAS quitte la zone de contingence, il est assumé que l'UAS n'est plus sous contrôle de l'opérateur et qu'il doit être mis fin au vol. Dans ce cas le l'UAS doit retomber dans la zone Tampon.">
                          <label className="block text-sm font-medium text-gray-700">
                            Méthode d'évaluation de la Zone Tampon
                          </label>
                        </Tooltip>
                      <select
                      value={assessment.assessmentGRB}
                      onChange={(e) =>
                        onChange({
                          ...assessment,
                          assessmentGRB: e.target
                            .value as assessmentGRB,
                          GRB:
                            e.target.value === "Sélectionner une méthode d'évaluation de la zone tampon"
                              ? assessment.GRB
                              : 0
                        })
                      }
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      ><option value="Sélectionner une méthode d'évaluation de la zone tampon">
                        Sélectionner une méthode d'évaluation de la zone tampon
                        </option>
                        <option value="Approche Simplifiée, Règle 1:1">
                        Approche Simplifiée, Règle 1:1
                        </option>
                        <option value="Approche Balistique (Hélicoptère ou Multirotor)">
                        Approche Balistique (Hélicoptère ou Multirotor)
                        </option>
                        <option value="Terminaison avec parachute">
                        Terminaison avec parachute
                        </option>
                        <option value="Spécifiée par le déposant">
                        Spécifiée par le déposant
                        </option> 
                      </select>
                    </div>
                  ): assessment.uasType === 'Multirotor' ? (
                    <div>
                        <Tooltip text="Aussi appelée Ground Risk Buffer, cette zone est définie au niveau du sol directement adjacente au volume de contingence. Si l'UAS quitte la zone de contingence, il est assumé que l'UAS n'est plus sous contrôle de l'opérateur et qu'il doit être mis fin au vol. Dans ce cas le l'UAS doit retomber dans la zone Tampon.">
                          <label className="block text-sm font-medium text-gray-700">
                            Méthode d'évaluation de la Zone Tampon
                          </label>
                        </Tooltip>
                      <select
                      value={assessment.assessmentGRB}
                      onChange={(e) =>
                        onChange({
                          ...assessment,
                          assessmentGRB: e.target
                            .value as assessmentGRB,
                          GRB:
                            e.target.value === "Sélectionner une méthode d'évaluation de la zone tampon"
                              ? assessment.GRB
                              : 0
                        })
                      }
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      ><option value="Sélectionner une méthode d'évaluation de la zone tampon">
                        Sélectionner une méthode d'évaluation de la zone tampon
                        </option>
                        <option value="Approche Simplifiée, Règle 1:1">
                        Approche Simplifiée, Règle 1:1
                        </option>
                        <option value="Approche Balistique (Hélicoptère ou Multirotor)">
                        Approche Balistique (Hélicoptère ou Multirotor)
                        </option>
                        <option value="Terminaison avec parachute">
                        Terminaison avec parachute
                        </option>
                        <option value="Spécifiée par le déposant">
                        Spécifiée par le déposant
                        </option> 
                      </select>
                    </div>
                  ): assessment.uasType === 'Plus léger que l\'air' ? (
                    <div>
                        <Tooltip text="Aussi appelée Ground Risk Buffer, cette zone est définie au niveau du sol directement adjacente au volume de contingence. Si l'UAS quitte la zone de contingence, il est assumé que l'UAS n'est plus sous contrôle de l'opérateur et qu'il doit être mis fin au vol. Dans ce cas le l'UAS doit retomber dans la zone Tampon.">
                          <label className="block text-sm font-medium text-gray-700">
                            Méthode d'évaluation de la Zone Tampon
                          </label>
                        </Tooltip>
                      <select
                      value={assessment.assessmentGRB}
                      onChange={(e) =>
                        onChange({
                          ...assessment,
                          assessmentGRB: e.target
                            .value as assessmentGRB,
                          GRB:
                            e.target.value === "Sélectionner une méthode d'évaluation de la zone tampon"
                              ? assessment.GRB
                              : 0
                        })
                      }
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      ><option value="Sélectionner une méthode d'évaluation de la zone tampon">
                        Sélectionner une méthode d'évaluation de la zone tampon
                        </option>
                        <option value="Approche Simplifiée, Règle 1:1">
                        Approche Simplifiée, Règle 1:1
                        </option>
                        <option value="Spécifiée par le déposant">
                        Spécifiée par le déposant
                        </option> 
                      </select>
                    </div>
                  ):( //Autre
                    <div>
                        <Tooltip text="Aussi appelée Ground Risk Buffer, cette zone est définie au niveau du sol directement adjacente au volume de contingence. Si l'UAS quitte la zone de contingence, il est assumé que l'UAS n'est plus sous contrôle de l'opérateur et qu'il doit être mis fin au vol. Dans ce cas le l'UAS doit retomber dans la zone Tampon.">
                          <label className="block text-sm font-medium text-gray-700">
                            Méthode d'évaluation de la Zone Tampon
                          </label>
                        </Tooltip>
                      <select
                      value={assessment.assessmentGRB}
                      onChange={(e) =>
                        onChange({
                          ...assessment,
                          assessmentGRB: e.target
                            .value as assessmentGRB,
                          GRB:
                            e.target.value === "Sélectionner une méthode d'évaluation de la zone tampon"
                              ? assessment.GRB
                              : 0
                        })
                      }
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      >
                        <option value="Sélectionner une méthode d'évaluation de la zone tampon">
                        Sélectionner une méthode d'évaluation de la zone tampon
                        </option>
                        <option value="Approche Simplifiée, Règle 1:1">
                        Approche Simplifiée, Règle 1:1
                        </option>
                        <option value="Spécifiée par le déposant">
                        Spécifiée par le déposant
                        </option> 
                      </select>
                    </div>
                  )}          
          
          
          </div>
          <div>
          
            {/* Limitation des choix possible en fonction du type d'UAS */}
            {(assessment.uasType === 'Avion' || assessment.uasType === 'Hybride/VTOL') ? (
              <div className="text-red-900 border-gray-300 rounded">
                  <b>Rappels</b> : Type d'UAS comme <b>{assessment.uasType}</b> 
                  <br />
                  Vous devez définir si votre appareil peut effectuer un vol plané. 
                  <br />
                  Attention de bien rester cohérent si vous changez votre déclaration vis à vis de celle utilisez dans le modèle JARUS pour l'évaluation de la zone de crash. 
                  <br />
                  Si aucune capacité de vol plané n'est possible, seule la règle 1:1 ou la terminaison avec parachute peuvent être appliquées.
                  <br />
                  Sinon, définissez votre propre GRB.
                  <br />
                  <br />
              </div>
            
            ): assessment.uasType === 'Hélicoptère' ? (
              <div className="text-red-900 border-gray-300 rounded">
                  <b>Rappels</b> : Type d'UAS comme <b>{assessment.uasType}</b> 
                  <br />
                  Seules les règles compatibles peuvent être appliquées.
                  <br />
                  Sinon, définissez votre propre GRB.
                  <br />
                  <br />
              </div>
            ): assessment.uasType === 'Multirotor' ? (
              <div className="text-red-900 border-gray-300 rounded">
                  <b>Rappels</b> : Type d'UAS comme <b>{assessment.uasType}</b> 
                  <br />
                  Seules les règles compatibles peuvent être appliquées.
                  <br />
                  Sinon, définissez votre propre GRB.
                  <br />
                  <br />
              </div>
            ): assessment.uasType === 'Plus léger que l\'air' ? (
              <div className="text-red-900 border-gray-300 rounded">
                  <b>Rappels</b> : Type d'UAS comme <b>{assessment.uasType}</b> 
                  <br />
                  Seule la règle 1:1 peut être appliquée.
                  <br />
                  Sinon, définissez votre propre GRB.
                  <br />
                  <br />
              </div>
            ):( //Autre
              <div className="text-red-900 border-gray-300 rounded">
                  <b>-Rappels</b> : Type d'UAS comme <b>{assessment.uasType}</b> 
                  <br />
                  Seule la règle 1:1 peut être appliquée.
                  <br />
                  Sinon, définissez votre propre GRB.
                  <br />
                  <br />
              </div>
            )}

            {/* Gestion des affichage selon le type de calcul spécifié pour la GRB */}
            {assessment.assessmentGRB ===
              'Approche Simplifiée, Règle 1:1' ? (
                <div>
                  {/* <label>'Approche Simplifiée, Règle 1:1'</label> */}
                  <div>
                    <Tooltip  text={
                                        <div>
                                          Largeur de votre Zone Tampon (Ground Risk Buffer)
                                          <br />
                                          
                                          <br />
                                          
                                        </div>
                                      }>
                      <label className="block text-sm font-medium text-gray-700">
                        GRB : Largeur de votre Zone Tampon (m)
                      </label>
                    </Tooltip>
                    <input
                      type="number"
                      value={CalulGRB()}
                      //defaultValue={assessment.ContingencyVolumeHeight}
                      onChange={(e) => onChange({ ...assessment, GRBWidth: parseFloat(e.target.value) })}
                      //step="0.1"
                      //min={assessment.ContingencyVolumeHeight} // Définit la valeur minimale autorisée
                      className="mt-1 block w-full rounded-md border-red-900 border-2 font-bold bg-red-50 text-red-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      placeholder={('Not yet computed')} 
                      disabled
                    />
                  </div> 
                                      
                  <div>
                    <Tooltip text="Vous devez apporter des éléments de justification de la définition de votre Volume de Contingence.">
                      <label className="block text-sm font-medium text-gray-700">
                        Justification de votre Zone Tampon (Ground Risk Buffer)
                      </label>
                    </Tooltip>
                    <textarea
                        value={assessment.GRB_Justification}
                        onChange={(e) =>
                          onChange({
                            ...assessment,
                            GRB_Justification: e.target.value,
                          })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        rows={4}
                      />
                  </div>
                </div>               
              ) : assessment.assessmentGRB ===
              'Approche Balistique (Hélicoptère ou Multirotor)' ? (
                // {assessment.uasType === ''}
                <div>
                  <label>'Approche Balistique (Hélicoptère ou Multirotor)'</label>
                  <div>
                    <Tooltip  text={
                                        <div>
                                          Largeur de votre Zone Tampon (Ground Risk Buffer)
                                          <br />
                                          
                                          <br />
                                          
                                        </div>
                                      }>
                      <label className="block text-sm font-medium text-gray-700">
                        GRB : Largeur de votre Zone Tampon (m)
                      </label>
                    </Tooltip>
                    <input
                      type="number"
                      value={CalulGRB()}
                      onChange={(e) => onChange({ ...assessment, GRBWidth: parseFloat(e.target.value) })}
                      //step="0.1"
                      //min={assessment.FlightGeographyWidth} // Définit la valeur minimale autorisée
                      className="mt-1 block w-full rounded-md border-red-900 border-2 font-bold bg-red-50 text-red-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      placeholder={('Not yet computed')}
                      disabled
                    />
                  </div> 
                                      
                  <div>
                    <Tooltip text="Vous devez apporter des éléments de justification de la définition de votre Volume de Contingence.">
                      <label className="block text-sm font-medium text-gray-700">
                        Justification de votre Zone Tampon (Ground Risk Buffer)
                      </label>
                    </Tooltip>
                    <textarea
                        value={assessment.GRB_Justification}
                        onChange={(e) =>
                          onChange({
                            ...assessment,
                            GRB_Justification: e.target.value,
                          })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        rows={4}
                      />
                  </div>
                </div>
              ) : assessment.assessmentGRB ===
              'Terminaison Aile Fixe' ? (
                // {assessment.uasType === ''}
                <div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Coupure de l'alimentation.
                      </label>
                      <input
                        type="checkbox"
                        //checked={(assessment.GRB_FixedWingPowerOff || []).includes('ACTIVATED')}
                        onChange={handleOnChangeFixedWingPowerOff}
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                        defaultChecked={GRB_FixedWingPowerOffActivationbydefault()}
                      />
                    </div>
                    {((assessment.GRB_FixedWingPowerOff).includes('ACTIVATED')) ?(
                      <div>
                        <div>
                          <b>Rappel :</b>Vous avez déclaré "{assessment.GlidingCapability}" pour la capacité de vol plané dans le Modèle JARUS pour l'évaluation de la Zone de Crash.
                          <br />
                          <br />
                          Sinon, définissez Theta_Glide en cohérence avec celui utilisé dans le Modèle JARUS, soit "{assessment.ThetaGlide}°".
                          
                        </div>

                      </div>
                    ):(
                      
                      <div>
                        Si vous n'activé pas de Coupure de l'alimentation la règle du 1:1 sera appliquée car GRB_FixedWingPowerOff = {assessment.GRB_FixedWingPowerOff}
                      </div>


                    )}

                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4"> 
                    <div>
                      <Tooltip text=" ">
                        <label className="block text-sm font-medium text-gray-700">
                          L'appareil est-il capable de planer ?
                        </label>
                      </Tooltip>
                      <select
                        value={assessment.GlidingCapability}
                        onChange={handleOnChangeGlidingCapability}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      >
                        <option value="NON">NON</option>
                        <option value="OUI">OUI</option>
                      </select>
                    </div> 
                    <div>
                          <Tooltip text="Angle d'impact (de plané/fauché.) NB: Si Dimensions caractéristiques maximales ≤ 1m prendre 35°, et pour les appareil plus grand prendre 10°.">
                            <label className="block text-sm font-medium text-gray-700">
                              Theta_Glide (deg)
                            </label>
                          </Tooltip>
                          <input
                            type="number"
                            value={assessment.ThetaGlide}
                            onChange={(e) =>
                              onChange({
                                ...assessment,
                                ThetaGlide: parseFloat(e.target.value) || 0.000
                              })
                            }
                            step="0.1"
                            min={0}
                            max={90}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            //placeholder={AdviceThetaGlide().toString()}
                            
                          /> 
                    </div>
                  </div>






                  <div>
                    <Tooltip  text={
                                        <div>
                                          Largeur de votre Zone Tampon (Ground Risk Buffer)
                                          <br />
                                          
                                          <br />
                                          
                                        </div>
                                      }>
                      <label className="block text-sm font-medium text-gray-700">
                        GRB : Largeur de votre Zone Tampon (m)
                      </label>
                    </Tooltip>
                    <input
                      type="number"
                      value={CalulGRB()}
                      onChange={(e) => onChange({ ...assessment, GRBWidth: parseFloat(e.target.value) })}
                      //step="0.1"
                      //min={assessment.FlightGeographyWidth} // Définit la valeur minimale autorisée
                      className="mt-1 block w-full rounded-md border-red-900 border-2 font-bold bg-red-50 text-red-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      placeholder={('Not yet computed')}
                      disabled
                    />
                  </div> 
                                      
                  <div>
                    <Tooltip text="Vous devez apporter des éléments de justification de la définition de votre Volume de Contingence.">
                      <label className="block text-sm font-medium text-gray-700">
                        Justification de votre Zone Tampon (Ground Risk Buffer)
                      </label>
                    </Tooltip>
                    <textarea
                        value={assessment.GRB_Justification}
                        onChange={(e) =>
                          onChange({
                            ...assessment,
                            GRB_Justification: e.target.value,
                          })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        rows={4}
                      />
                  </div>
                </div>
              ) : assessment.assessmentGRB ===
              'Terminaison avec parachute' ? (
                // {assessment.uasType === ''}
                <div>
                  
                  {/* Si ParachuteTime déjà définie on la rappelle ici en précisant origine de la def  */}
                  {assessment.ParachuteTime && (assessment.ContingencyParachuteManeuver || []).includes('OUI') ? (
                    
                      <label>Temps d'activation du parachute déjà définie pour la manoeuvre de contingence : {assessment.ParachuteTime}(s)</label>
                  ):( 
                    // Sinon on ajoute une entrée pour la spécifier
                      <div>
                        <Tooltip  text={
                                        <div>
                                          Temps d'activation du parachute (s)  
                                          <br />                                    
                                          Doit prendre en compte le temps d'ouverture et de mise en descente.
                                          <br />
                                          Ne peut être inférieur à 1 seconde.
                                        </div>
                                      }>
                        <label className="block text-sm font-medium text-gray-700">
                            Temps d'activation du parachute (s) 
                        </label>
                        </Tooltip>
                        <input
                          type="number"
                          value={assessment.ParachuteTime}
                          defaultValue={1.0}
                          onChange={(e) => onChange({ ...assessment, ParachuteTime: parseFloat(e.target.value), GRBWidth: CalulGRB()})}
                          step="0.1"
                          min={1.0} // Définit la valeur minimale autorisée
                          className="mt-1 block w-full rounded-md border-grey-200 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          placeholder={"1.0"}
                        />
                      </div>                          

                  )}
                  <div>
                    <Tooltip  text={
                                        <div>
                                          Vitesse de déscente sous parachute (m/s)
                                          <br />
                                          Généralement de l'ordred de 6.0 m/s
                                          <br />
                                          
                                        </div>
                                      }>
                      <label className="block text-sm font-medium text-gray-700">
                        Vitesse de déscente sous parachute (m/s)
                      </label>
                    </Tooltip>
                    <input
                      type="number"
                      value={assessment.VzParachute}
                      onChange={(e) => onChange({ ...assessment, VzParachute: parseFloat(e.target.value) })}
                      step="0.1"
                      min={3.0} // Définit la valeur minimale autorisée
                      className="mt-1 block w-full rounded-md border-grey-200 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      placeholder={"6.0"}
                    />
                  </div>
                  <div>
                    <Tooltip  text={
                                        <div>
                                          Vitesse du vent considéré pour la déscente sous parachute (m/s)
                                          <br />
                                          Elle doit être comprise entre la Vitesse maximale du vent au décollage et la Vitesse maximale de tenue à la rafale en évolution .
                                          <br />
                                          Ces valeur ont été déclarées dans la section "Limitations environnementales" à l'Étape 1 : Concept d'opérations / ConOps
                                        </div>
                                      }>
                      <label className="block text-sm font-medium text-gray-700">
                        Vitesse du vent considéré pour la déscente sous parachute (m/s)
                      </label>
                    </Tooltip>
                    <input
                      type="number"
                      value={assessment.VwindParachute}
                      onChange={(e) => onChange({ ...assessment, VwindParachute: parseFloat(e.target.value) })}
                      step="0.1"
                      min={assessment.environmentalLimitations.maxWindSpeedTakeoff} // Définit la valeur minimale autorisée
                      max={assessment.environmentalLimitations.maxGustSpeed} // Définit la valeur minimale autorisée
                      className="mt-1 block w-full rounded-md border-grey-200 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      placeholder={(assessment.environmentalLimitations.maxWindSpeedTakeoff).toString()}
                    />
                  </div>
                  <div>
                    <Tooltip  text={
                                        <div>
                                          Largeur de votre Zone Tampon (Ground Risk Buffer)
                                          <br />
                                          
                                          <br />
                                          
                                        </div>
                                      }>
                      <label className="block text-sm font-medium text-gray-700">
                        GRB : Largeur de votre Zone Tampon (m)
                      </label>
                    </Tooltip>
                    <input
                      type="number"
                      value={CalulGRB()}
                      onChange={(e) => onChange({ ...assessment, GRBWidth: parseFloat(e.target.value) })}
                      //step="0.1"
                      //min={assessment.FlightGeographyWidth} // Définit la valeur minimale autorisée
                      className="mt-1 block w-full rounded-md border-red-900 border-2 font-bold bg-red-50 text-red-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      placeholder={('Not yet computed')}
                      disabled
                    />
                  </div> 
                                      
                  <div>
                    <Tooltip text="Vous devez apporter des éléments de justification de la définition de votre Volume de Contingence.">
                      <label className="block text-sm font-medium text-gray-700">
                        Justification de votre Zone Tampon (Ground Risk Buffer)
                      </label>
                    </Tooltip>
                    <textarea
                        value={assessment.GRB_Justification}
                        onChange={(e) =>
                          onChange({
                            ...assessment,
                            GRB_Justification: e.target.value,
                          })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        rows={4}
                      />
                  </div>
                </div>
              ) : assessment.assessmentGRB ===
              'Spécifiée par le déposant' ? (
                // {assessment.uasType === ''}
                <div>
                  <label>'Autre Terminaison à préciser'</label>
                  <div>
                    <Tooltip  text={
                                        <div>
                                          Largeur de votre Zone Tampon (Ground Risk Buffer)
                                          <br />
                                          
                                          <br />
                                          
                                        </div>
                                      }>
                      <label className="block text-sm font-medium text-gray-700">
                        GRB : Largeur de votre Zone Tampon (m)
                      </label>
                    </Tooltip>
                    <input
                      type="number"
                      value={assessment.GRBWidth}
                      onChange={(e) => onChange({ ...assessment, GRBWidth: parseFloat(e.target.value) })}
                      step="0.1"
                      min={assessment.FlightGeographyWidth} // Définit la valeur minimale autorisée
                      className="mt-1 block w-full rounded-md border-red-900 border-2 font-bold bg-red-50 text-red-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      placeholder={(assessment.FlightGeographyWidth)}
                    />
                  </div> 
                                      
                  <div>
                    <Tooltip text="Vous devez apporter des éléments de justification de la définition de votre Volume de Contingence.">
                      <label className="block text-sm font-medium text-gray-700">
                        Justification de votre Zone Tampon (Ground Risk Buffer)
                      </label>
                    </Tooltip>
                    <textarea
                        value={assessment.GRB_Justification}
                        onChange={(e) =>
                          onChange({
                            ...assessment,
                            GRB_Justification: e.target.value,
                          })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        rows={4}
                      />
                  </div>
                </div>
              ) : (
                <div>
                  
                </div>
              )
            } 

          </div> 








          
          <h2 className="text-lg font-medium">Etape 2.4 : Determination de la Zone Adjacente (Adjacent Volume).</h2>    
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4"> 
          <div>
                <div>
                  <Tooltip  text={
                                      <div>
                                        Largeur Zone Adjacente (Adjacent Volume)
                                        <br />
                                         
                                        <br />
                                        
                                      </div>
                                    }>
                    <label className="block text-sm font-medium text-gray-700">
                    Largeur Zone Adjacente (m)
                    </label>
                  </Tooltip>
                  <input
                    type="number"
                    value={120.0*assessment.maxSpeed}
                    onChange={(e) => onChange({ ...assessment, AdjacentVolumeWidth: parseFloat(e.target.value) })}
                    //step="0.1"
                    //min={assessment.FlightGeographyWidth} // Définit la valeur minimale autorisée
                    className="mt-1 block w-full rounded-md border-black border-2 font-bold bg-gray-400 text-black  border-2 font-bold  shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder={(0.0)}
                    disabled
                  />  
                </div> 
                <div>
                  <Tooltip  text={
                                      <div>
                                        Hauteur Zone Adjacente (Adjacent Volume)
                                        <br />
                                         
                                        <br />
                                        
                                      </div>
                                    }>
                    <label className="block text-sm font-medium text-gray-700">
                    Hauteur Zone Adjacente (m)
                    </label>
                  </Tooltip>
                  <input
                    type="number"
                    value={assessment.ContingencyVolumeHeight+150.0}
                    onChange={(e) => onChange({ ...assessment, AdjacentVolumeHeight: parseFloat(e.target.value) })}
                    //step="0.1"
                    //min={assessment.FlightGeographyWidth} // Définit la valeur minimale autorisée
                    className="mt-1 block w-full rounded-md border-black border-2 font-bold bg-gray-400 text-black  border-2 font-bold  shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder={(0.0)}
                    disabled
                  />  
                </div>              
                </div>
          </div> 
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="text-lg font-medium">Ground Risk Assessment</h3>
        <div className="bg-gray-50 p-4 rounded-lg space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Scénario opérationnel
            </label>
            <select
              value={assessment.operationalScenario || 'VLOS'}
              onChange={(e) =>
                onChange({
                  ...assessment,
                  operationalScenario: e.target.value as OperationalScenario,
                })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="VLOS">VLOS</option>
              <option value="BVLOS">BVLOS</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Densité de population
            </label>
            <select
              value={assessment.populationDensity || 'low'}
              onChange={(e) =>
                onChange({
                  ...assessment,
                  populationDensity: e.target.value as PopulationDensity,
                })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="low">Faible</option>
              <option value="moderate">Modérée</option>
              <option value="high">Élevée</option>
            </select>
          </div>
        </div>
        <h2 className="text-2xl font-semibold">iGRC</h2>
          <div className="bg-gray-50 p-4 rounded-lg space-y-4">
            <div>
              <Tooltip text="Veuillez entrer le niveau GRC Initial calculé à l'aide de l'outil (c)DROSERA.">
                <label className="block text-sm font-medium text-gray-700">
                  iGRC
                </label>
              </Tooltip>
              <select
                value={assessment.iGRC}
                onChange={(e) =>
                              onChange({
                                ...assessment,
                                iGRC: e.target.value as iGRC,
                              })
                            }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="6">6</option>
                <option value="7">7</option>
                <option value="8">8</option>
              </select>
            </div>
          </div>
      </section>
    </div>
  );
}

export default RiskAssessmentForm;
