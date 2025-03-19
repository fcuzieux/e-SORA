import React, { useRef, useState } from 'react';

import {
  RiskAssessmentInfo,
  DroneInfo,
  OperationInfo,
  assessmentTypeHauteurVol,
  assessmentCriticalArea,
  PopulationDensityModulation,
  SailLevel,
  OperationalScenario,
  PopulationDensity,
  iGRC,
  ObstaclesModulation,
  GlidingCapability,
  HighImpactAngle,
  DetailedJarusModel,
} from '../../types/sora';
import { Tooltip } from '../common/Tooltip';
import { Upload, Clock, Pi } from 'lucide-react';
import { RiskAssessmentMap } from './RiskAssessmentMap';

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
    let rPerson = 0.5;
    let rD=rPerson+0.5*assessment.maxCharacteristicDimension/2.0;
    if (assessment.maxCharacteristicDimension<=1.0) {
      Ac = 2.0*rD*assessment.dGlide+Math.PI*Math.pow(rD, 2);
    } else if (assessment.maxCharacteristicDimension<8.0) {
      Ac = 0.6*(2*rD*(assessment.dGlide+assessment.dSlideReduced)+Math.PI*Math.pow(rD, 2));
    } else if (assessment.maxCharacteristicDimension>=8.0) {
      Ac = 2.0*rD*(assessment.dGlide+assessment.dSlideReduced)+Math.PI*Math.pow(rD, 2);
    }
    assessment.CriticalArea = Ac;
    return Ac;
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
            <div>
              <Tooltip text="Aussi appelée Critical Area ou Surface de Crash">
                <label className="block text-sm font-medium text-gray-700">
                  Surface Critique
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
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              ) : assessment.assessmentCriticalArea ===
              'Calcul selon les Modèles JARUS' ? (
              <div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Valeur de la Surface Critique Calculée (m²)
                  </label>
                  <div className="mt-1 p-2 bg-gray-50 rounded-md">
                    {CalculJARUSCriticalArea()}
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
                      <Tooltip text="Angle d'impact (de plané/fauché.)">
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
                        step="0.001"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />     
                      
                        <label className="block text-sm font-medium text-gray-700">
                          Mass maximale MTOW (kg)
                        </label>
                        <div className="mt-1 p-2 bg-gray-50 rounded-md">
                          {assessment.MTOW}
                        </div>                 
                      </div>
                    )}
                    
                    <div>
                      <Tooltip text="Distance de plané/fauché.">
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
                        step="0.001"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                      
                    </div> 
                    <div>
                      <Tooltip text="Distance de plané/fauché.">
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
                        step="0.001"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                      
                    </div>
                
                  </div>

                ) : ( 

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <h3 className="text-lg font-medium">High Impact Angle Model</h3>                 
                    
                  </div>

                )}




                
              </div>
              ) : (
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
                <Tooltip   text={
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
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  disabled
                />
                </div>
                </div>
            )}
            
            
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
