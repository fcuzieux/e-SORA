import React from 'react';
import { Tooltip } from '../common/Tooltip';
import { RiskAssessmentInfo, OutdoorAssembliesAllowed, ShelterApplicable} from '../../types/sora';
import AdjacenteArea from '../../image/AdjacenteArea.png';

interface AdjacentAreasProps {
  assessment: RiskAssessmentInfo;
  onChange: (assessment: RiskAssessmentInfo) => void;
}

export function AdjacentAreas({ assessment, onChange }: AdjacentAreasProps) {

    const Compute_containmentRobustess = () => {
    let containmentRobustess = 'Aucun minimum1';
    let maxCharacteristicDimensionClass = assessment.maxCharacteristicDimension;
    //populationDensityAdjacentArea = 'Zone Contrôlée' | '<5' | '<50' | '<500' | '<5,000' | '<50,000' | '>50,000' ;
    let indexcolAveragePeopleDensity=-1;
    if (assessment.populationDensityAdjacentArea==='Zone Contrôlée') {
      indexcolAveragePeopleDensity=0;
    } else if (assessment.populationDensityAdjacentArea==='<5') {
      indexcolAveragePeopleDensity=4;
    } else if (assessment.populationDensityAdjacentArea==='<50') {
      indexcolAveragePeopleDensity=49;
    } else if (assessment.populationDensityAdjacentArea==='<500') {
      indexcolAveragePeopleDensity=499;
    } else if (assessment.populationDensityAdjacentArea==='<5,000') {
      indexcolAveragePeopleDensity=4999;
    } else if (assessment.populationDensityAdjacentArea==='<50,000') {
      indexcolAveragePeopleDensity=49999;
    } else { //'>50,000'
      indexcolAveragePeopleDensity=50001;
    }
    // Outdoor Assemblies Allowed = 'Sélectionner une valeur' | 'Assemblies < 40k people' | 'Assemblies of 40k to 400k' | '> 400k' ;
    let indexcolOutdoorAssembliesAllowed=-1;
    if (assessment.OutdoorAssembliesAllowed==='Assemblies < 40k people') {
      indexcolOutdoorAssembliesAllowed=39;
    } else if (assessment.OutdoorAssembliesAllowed==='Assemblies of 40k to 400k') {
      indexcolOutdoorAssembliesAllowed=400;
    } else if (assessment.OutdoorAssembliesAllowed==='> 400k') {
      indexcolOutdoorAssembliesAllowed=401;
    } 
    
    // if (assessment.UsemaxCharacteristicDimension === 'OUI') {
    //   maxCharacteristicDimensionClass = assessment.maxCharacteristicDimensionClass;
    // }
    // iGRC_colIndex = 1 | 2 | 3 | 4 | 5 | 6 ;

    if (assessment.iGRC_colIndex==1) { // SORA-v2.5-Main-Body-Release-JAR_doc25.pdf page 49 =>Table 8 - Containment requirements 1 m UA
      if (assessment.SAILNumber>=4) { 
        containmentRobustess = 'Faible_dim1-sail4';
      } else if (assessment.SAILNumber==3) {
        if (indexcolAveragePeopleDensity<=50000) { 
          if (indexcolOutdoorAssembliesAllowed<40) {         
          containmentRobustess = 'Faible_dim1-sail3a';
          }
          else if (indexcolOutdoorAssembliesAllowed<=400) {
          containmentRobustess = 'Faible_dim1-sail3b';
          } else {
          containmentRobustess = 'Moyen_dim1-sail3';
          }

        } else {
          if (indexcolOutdoorAssembliesAllowed<=400) {
          containmentRobustess = 'Faible_dim1-sail3c';
          } else {
          containmentRobustess = 'Moyen_dim1-sail3';
          }
        }
      } else if (assessment.SAILNumber<=2) {
        if (indexcolAveragePeopleDensity<=50000) {
           
          if (indexcolOutdoorAssembliesAllowed<40) {         
          containmentRobustess = 'Faible_dim1-sail12a';
          }
          else if (indexcolOutdoorAssembliesAllowed<=400) {
          containmentRobustess = 'Moyen_dim1-sail12a';
          } else {
          containmentRobustess = 'High_dim1-sail12a';
          }

          
        } else {
          if (indexcolOutdoorAssembliesAllowed<=400) {
          containmentRobustess = 'Moyen_dim1-sail12b';
          } else {
          containmentRobustess = 'High_dim1-sail12b';
          }
        }
      }


      
      
    } else if (assessment.iGRC_colIndex==2) {
      if (assessment.ShelterApplicable==='OUI') {
        containmentRobustess = 'Cas2_shelter';
      } else {
        containmentRobustess = 'Cas2_no-shelter';
      }
    } else if (assessment.iGRC_colIndex==3) {
      containmentRobustess = 'Cas3';
    } else if (assessment.iGRC_colIndex==4) {
      containmentRobustess = 'Cas4';
    } else if (assessment.iGRC_colIndex==5) {
      containmentRobustess = 'Cas5';
    } else if (assessment.iGRC_colIndex==6) {
      containmentRobustess = 'Cas6';
    } else {
      containmentRobustess = 'Aucun minimum2';
    }


    // if (maxCharacteristicDimensionClass <= 1.0) {
    //   containmentRobustess = 'Cas2';
    //     if (assessment.maxSpeed <= 25.0) {
    //       containmentRobustess = 'Cas3';
    //       if (assessment.SAIL.includes('1') || assessment.SAIL.includes('2')) {
    //         if (assessment.OutdoorAssembliesAllowed.includes('people')  && assessment.ShelterApplicable === 'OUI') {
    //           containmentRobustess = 'Cas4';
    //         } else if (assessment.OutdoorAssembliesAllowed.includes('of') && assessment.ShelterApplicable === 'NON') {
    //           containmentRobustess = 'Cas5';
    //         } else {
    //           containmentRobustess = 'Cas6';
    //         }
    //       } else {
    //         if (assessment.OutdoorAssembliesAllowed === 'OUI' && assessment.ShelterApplicable === 'OUI') {
    //           containmentRobustess = 'Faible';
    //         }
    //       }
    //     }
    //   } else {
    //     containmentRobustess = 'Tutu';
    //   }




      //     iGRC_colIndex = 1;
      //   } else if (assessment.maxSpeed <= 35.0) {
      //     iGRC_colIndex = 2;
      //   } else if (assessment.maxSpeed <= 75.0) {
      //     iGRC_colIndex = 3;
      //   } else if (assessment.maxSpeed <= 150.0) {
      //     iGRC_colIndex = 4;
      //   } else if (assessment.maxSpeed <= 200.0) {  
      //     iGRC_colIndex = 5;
      //   }  else {
      //     iGRC_colIndex = 6;
      //   }
      // } else if (maxCharacteristicDimensionClass <= 3.0) {
      //   if (assessment.maxSpeed <= 35.0) {
      //     iGRC_colIndex = 2;
      //   } else if (assessment.maxSpeed <= 75.0) {
      //     iGRC_colIndex = 3;
      //   } else if (assessment.maxSpeed <= 150.0) {
      //     iGRC_colIndex = 4;
      //   } else if (assessment.maxSpeed <= 200.0) {  
      //     iGRC_colIndex = 5;
      //   }  else {
      //     iGRC_colIndex = 6;
      //   }
      // } else if (maxCharacteristicDimensionClass <= 8.0) {
      //   if (assessment.maxSpeed <= 75.0) {
      //     iGRC_colIndex = 3;
      //   } else if (assessment.maxSpeed <= 150.0) {
      //     iGRC_colIndex = 4;
      //   } else if (assessment.maxSpeed <= 200.0) {  
      //     iGRC_colIndex = 5;
      //   }  else {
      //     iGRC_colIndex = 6;
      //   }
      // } else if (maxCharacteristicDimensionClass <= 20.0) {
      //   if (assessment.maxSpeed <= 150.0) {
      //     iGRC_colIndex = 4;
      //   } else if (assessment.maxSpeed <= 200.0) {  
      //     iGRC_colIndex = 5;
      //   }  else {
      //     iGRC_colIndex = 6;
      //   }
      // } else if (maxCharacteristicDimensionClass <= 40.0) {
      //   if (assessment.maxSpeed <= 200.0) {  
      //     iGRC_colIndex = 5;
      //   }  else {
      //     iGRC_colIndex = 6;
      //   }
      // } else {
      //   iGRC_colIndex = 6;
      // }
      return containmentRobustess;
  
    }
 
   return (
     <div className="space-y-8"> 
     
      <h3 className="text-2xl font-semibold">Rappel des données : Opération en catégorie {assessment.SAIL} </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4"> 
                  <img className="w-auto h-auto mb-6 mx-auto md:row-span-6"
                    src={AdjacenteArea}
                    alt="AdjacenteArea" 
                  />
                  <Tooltip  text={
                                                        <div>
                                                          Largeur Zone Adjacente (Adjacent Volume)
                                                          <br />
                                                          Calculé selon l'hyposthèse que l'UAS vole à sa vitesse maximale de croisière durant 3 minutes.
                                                          <br />
                                                          5 km &lt; Largeur Zone Adjacente &lt; 35 km
                                                          <br />
                                                          Sauf si le déposant peut démontrer que la portée maximale de l'UAS n'excèdera pas la condition des 3minutes à sa vitesse maximale de croisière.
                                                        </div>
                                                      }>
                                      <label className="block text-sm font-medium text-gray-700">
                                      Largeur Zone Adjacente (m)
                                      </label>
                                    </Tooltip>
                  <input
                    type="number"
                    value={assessment.AdjacentVolumeWidth || ''}
                    //onChange={(e) => onChange({ ...assessment, AdjacentVolumeWidth: parseFloat(e.target.value) })}
                    //step="0.1"
                    //min={assessment.FlightGeographyWidth} // Définit la valeur minimale autorisée
                    className="mt-1 block w-full rounded-md border-black border-2 font-bold bg-gray-400 text-black  border-2 font-bold  shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder={(5000.0)}
                    disabled
                  /> 
                  
                  <Tooltip  text={
                                      <div>
                                        Hauteur Zone Adjacente (Adjacent Volume)
                                        <br />
                                          𝐻𝐴𝑉 = 𝐻𝐶𝑉 + 150 𝑚
                                        <br />
                                        
                                      </div>
                                    }>
                    <label className="block text-sm font-medium text-gray-700">
                    Hauteur Zone Adjacente (m)
                    </label>
                  </Tooltip>
                  <input
                    type="number"
                    value={assessment.AdjacentVolumeHeight || ''}
                    //onChange={(e) => onChange({ ...assessment, AdjacentVolumeHeight: parseFloat(e.target.value) })}
                    //step="0.1"
                    //min={assessment.FlightGeographyWidth} // Définit la valeur minimale autorisée
                    className="mt-1 block w-full rounded-md border-black border-2 font-bold bg-gray-400 text-black  border-2 font-bold  shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder={(0.0)}
                    disabled
                  />  

                  
                  <label className="block text-sm font-medium text-gray-700">
                    Zone adjacente : Densité Moyenne de population(ppl/km²)
                  </label>
                  <input
                    type="text"
                    value={assessment.populationDensityAdjacentArea || ''}
                    //onChange={(e) => onChange({ ...assessment, AdjacentVolumeHeight: parseFloat(e.target.value) })}
                    //step="0.1"
                    //min={assessment.FlightGeographyWidth} // Définit la valeur minimale autorisée
                    className="mt-1 block w-full rounded-md border-black border-2 font-bold bg-gray-400 text-black  border-2 font-bold  shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder={'Compléter Etape 2'}
                    disabled
                  />
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Dimensions caractéristiques maximales (m)
                    </label>
                    <div className="mt-1 p-2 bg-gray-50 rounded-md">
                      {assessment.maxCharacteristicDimension}
                    </div>
                    <Tooltip text="Attention : Si vous avez justifié d'une valeur différente à l'Étape 2, celle ci sera utilisée ici.">
                                            {assessment.UsemaxCharacteristicDimension ===
                                          'OUI' ? (
                                            <div> Valeur utilisée à l'Étape 2: {assessment.maxCharacteristicDimensionClass}m</div>
                                              ): (
                                            <div> Valeur utilisée à l'Étape 2 : {assessment.maxCharacteristicDimension}m</div>)}
                                          </Tooltip>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Vitesse maximales (m/s)
                    </label>
                    <div className="mt-1 p-2 bg-gray-50 rounded-md">
                      {assessment.maxSpeed}
                    </div>
                  </div> 

          </div>



          <div className="space-y-8">
            <h2 className="text-2xl font-semibold">Niveau de robustesse du confinent requis</h2>
            <label className="block text-sm font-medium text-gray-300">
              Val. assessment.iGRC_colIndex={assessment.iGRC_colIndex} | assessment.populationDensityAdjacentArea={assessment.populationDensityAdjacentArea}
            </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4"> 
                    <label className="block text-sm font-medium text-gray-700">
                      Assemblées en plein air autorisées dans un rayon de 1 km autour du volume OPS
                    </label>
                    {/* //Si maxdim <3m & vmax<35m/s demander si le Sheltering est applicable pour l'UA dans la zone adjacente*/}
                    {assessment.iGRC_colIndex===1
                      ?  (
                      <label className="block text-sm font-medium text-gray-700">
                        Le Sheltering est considéré comme applicable pour l'UA coinsidéré dans la zone adjacente car 1m UA (&lt;25m/s)
                      </label>
                      ) : assessment.iGRC_colIndex===2 ? (
                      <label className="block text-sm font-medium text-gray-700">
                        Le Sheltering est-il applicable pour l'UA dans la zone adjacente
                      </label>) : (
                      <label className="block text-sm font-medium text-gray-700">
                        Le Sheltering est considéré comme non applicable pour l'UA coinsidéré dans la zone adjacente car &gt;3m UA (&gt;35m/s)
                      </label>)
                    }
                    <select
                      value={assessment.OutdoorAssembliesAllowed }
                      onChange={(e) =>
                        onChange({
                          ...assessment,
                          OutdoorAssembliesAllowed: e.target
                            .value as OutdoorAssembliesAllowed
                        })
                      }
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                      <option value="Sélectionner une valeur">
                        Sélectionner une valeur
                      </option>
                      <option value="Assemblies < 40k people">Assemblies &lt; 40k people</option>
                      <option value="Assemblies of 40k to 400k">Assemblies of 40k to 400k</option>
                      <option value="> 400k">&gt; 400k</option>
                    </select>
                    {assessment.iGRC_colIndex===1
                      ?  (
                        <div>{assessment.ShelterApplicable='OUI'}</div>
                      ) : assessment.iGRC_colIndex===2 ? (
                      <select
                      value={assessment.ShelterApplicable }
                      onChange={(e) =>
                        onChange({
                          ...assessment,
                          ShelterApplicable: e.target
                            .value as ShelterApplicable
                        })
                      }
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                      <option value="Sélectionner une valeur">
                        Sélectionner une valeur
                      </option>
                      <option value="OUI">
                        OUI
                      </option>
                      <option value="NON">
                        NON
                      </option>
                    </select>
                      ) : (
                      <div>{assessment.ShelterApplicable='NON'}</div>)
                    }
                  </div>
            <div className="mt-1 p-2 bg-gray-50 rounded-md">
                      {Compute_containmentRobustess()}
            </div>
          </div>


       
       <div className="space-y-8">
         <h2 className="text-2xl font-semibold">Justifications additionnelles</h2>
         <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                    
             <div>
               <Tooltip text="En quelques phrases, vous pouvez apporter des commentaires additionnels sur le niveau de SAIL de l'opération envisagée">
                 <label className="block text-sm font-medium text-gray-700">
                   Apporter vos justifications sur le niveau derobustesse du confinent atteint :
                 </label>
               </Tooltip>
               <textarea
                 value={assessment.SAILJustification}
                 onChange={(e) =>
                   onChange({
                     ...assessment,
                     SAILJustification: e.target.value,
                   })}
                 className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                 rows={4}
               />
             </div>
           
         </div>
       </div>
     </div>
  );
}
