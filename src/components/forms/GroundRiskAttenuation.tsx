import React from 'react';
import { RiskAssessmentInfo, mitigationStrategique, reduceImpactAttenuation, necessaryToReduceRisk, GRC_Final } from '../../types/sora';
import { Tooltip } from '../common/Tooltip';

interface GroundRiskAttenuationProps {
  assessment: RiskAssessmentInfo;
  onChange: (assessment: RiskAssessmentInfo) => void;
}

export function GroundRiskAttenuation({ assessment, onChange }: GroundRiskAttenuationProps) {

  const tableData = [
    { Integrity: 'Intégrité faible ', InsuranceLow: 'Robustesse faible', InsuranceMedium: 'Robustesse Faible ', InsuranceHigh: 'Robustesse Faible '  },
    { Integrity: 'Intégrité moyenne', InsuranceLow: 'Robustesse faible', InsuranceMedium: 'Robustesse Moyenne', InsuranceHigh: 'Robustesse Moyenne'  },
    { Integrity: 'Intégrité haute  ', InsuranceLow: 'Robustesse faible', InsuranceMedium: 'Robustesse Moyenne', InsuranceHigh: 'Robustesse Haute  '  },
  ];

  const CalculGRCFinal = () => {
    if (!assessment || !assessment.iGRC || !assessment.mitigationStrategique || !assessment.reduceImpactAttenuation || !assessment.planInterventionUrgence || !assessment.confinementRequirements) {
      return Number(assessment.iGRC);// Return a default value or handle the error as needed
    }

    let FinalGRCint = Number(assessment.iGRC);
    if (assessment.mitigationStrategique.includes('faible')) {
      FinalGRCint = FinalGRCint - 1;
    } else if (assessment.mitigationStrategique.includes('moyenne')) {
      FinalGRCint = FinalGRCint - 2;
    } else if (assessment.mitigationStrategique.includes('élevée')) {
      FinalGRCint = FinalGRCint - 4;
    } else {FinalGRCint = FinalGRCint - 0;}

    if (assessment.reduceImpactAttenuation.includes('faible')) {
      FinalGRCint = FinalGRCint - 0;
    } else if (assessment.reduceImpactAttenuation.includes('moyenne')) {
      FinalGRCint = FinalGRCint - 1;
    } else if (assessment.reduceImpactAttenuation.includes('élevée')) {
      FinalGRCint = FinalGRCint - 2;
    } else {FinalGRCint = FinalGRCint - 0;}
    
    if (assessment.planInterventionUrgence.includes('faible')) {
      FinalGRCint = FinalGRCint + 1;
    } else if (assessment.planInterventionUrgence.includes('moyenne')) {
      FinalGRCint = FinalGRCint - 0;
    } else if (assessment.planInterventionUrgence.includes('élevée')) {
      FinalGRCint = FinalGRCint - 1;
    } else {FinalGRCint = FinalGRCint +1;}
    // if ()
    return FinalGRCint;
  };

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-semibold">Tableau de Mitigation Tactique</h2>
      <table className="min-w-full bg-white">
        <thead>
          <tr className="bg-blue-500 text-white">
            <th className="py-2 px-4 border-b"> </th>
            <th className="py-2 px-4 border-b">Assurance faible</th>
            <th className="py-2 px-4 border-b">Assurance moyenne</th>
            <th className="py-2 px-4 border-b">Assurance haute</th>
          </tr>
        </thead>
        <tbody>
          {tableData.map((row, index) => (
            <tr
              key={index}
              className={
                index % 2 === 0
                  ? 'bg-gray-100 text-gray-800'
                  : 'bg-gray-200 text-gray-800'
              }
            >
              <td className="py-2 px-4 border-b">{row.Integrity}</td>
              <td className="py-2 px-4 border-b">{row.InsuranceLow}</td>
              <td className="py-2 px-4 border-b">{row.InsuranceMedium}</td>
              <td className="py-2 px-4 border-b">{row.InsuranceHigh}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h2 className="text-2xl font-semibold">Atténuation du risque sol</h2>

      <div className="bg-gray-50 p-4 rounded-lg space-y-4">
        <div>
          <Tooltip text="Sélectionnez l'une des quatre options. Dans le cas où l'évaluation des risques est basée sur la SORA, cela consiste en une atténuation M1.">
            <label className="block text-sm font-medium text-gray-700">
              M1 : Mitigation Stratégique
            </label>
          </Tooltip>
          <select
            value={assessment.mitigationStrategique}
            onChange={(e) =>{
              onChange({
                ...assessment,
                mitigationStrategique: e.target.value as mitigationStrategique,
              });
              CalculGRCFinal();
            }}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="Non">Non</option>
            <option value="Oui, faible">Oui, faible</option>
            <option value="Oui, moyenne">Oui, moyenne</option>
            <option value="Oui, élevée">Oui, élevée</option>
          </select>
        </div>

        <div className="flex space-x-4">
          <div className="flex-1">
            <Tooltip text="Sélectionnez l'une des quatre options de la première ligne. Dans le cas où l'évaluation des risques est basée sur le SORA, cela consiste en une atténuation M2. Même si le drone peut être équipé d'un tel système, cette atténuation peut ne pas être requise pour l'opération afin de réduire le risque au sol. Dans ce cas, dans la deuxième ligne, sélectionnez 'NON'. Si l'atténuation est utilisée pour réduire le risque au sol, sélectionnez 'OUI', et l'opérateur doit inclure les procédures associées dans le manuel d'exploitation.">
              <label className="block text-sm font-medium text-gray-700">
                M2 : Atténuation pour réduire l'effet de l'impact au sol
              </label>
            </Tooltip>
            <select
              value={assessment.reduceImpactAttenuation}
              onChange={(e) =>{
                onChange({
                  ...assessment,
                  reduceImpactAttenuation: e.target.value as reduceImpactAttenuation,
                });
                CalculGRCFinal();
              }}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="Non">Non</option>
              <option value="Oui, faible">Oui, faible</option>
              <option value="Oui, moyenne">Oui, moyenne</option>
              <option value="Oui, élevée">Oui, élevée</option>
            </select>
          </div>

          <div className="flex-1">
            <Tooltip text="Sélectionnez 'OUI' si l'atténuation est nécessaire pour réduire le risque au sol, ou 'NON' si ce n'est pas requis.">
              <label className="block text-sm font-medium text-gray-700">
                Nécessaire pour réduire le risque au sol
              </label>
            </Tooltip>
            <select
              value={assessment.necessaryToReduceRisk}
              onChange={(e) =>{
                onChange({
                  ...assessment,
                  necessaryToReduceRisk: e.target.value as necessaryToReduceRisk,
                });
                CalculGRCFinal();
              }}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="NON">NON</option>
              <option value="OUI">OUI</option>
            </select>
          </div>
        </div>

        <div>
          <Tooltip text="Sélectionnez l'une des quatre options. Dans le cas où l'évaluation des risques est basée sur la SORA, cela consiste en une atténuation M3.">
            <label className="block text-sm font-medium text-gray-700">
              M3 : Plan d'intervention d'urgence
            </label>
          </Tooltip>
          <select
            value={assessment.planInterventionUrgence}
            onChange={(e) =>{
              onChange({
                ...assessment,
                planInterventionUrgence: e.target.value as mitigationStrategique,
              });
              CalculGRCFinal();
            }}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="Non">Non</option>
            <option value="Oui, faible">Oui, faible</option>
            <option value="Oui, moyenne">Oui, moyenne</option>
            <option value="Oui, élevée">Oui, élevée</option>
          </select>
        </div>

        <div>
          <Tooltip text="Choisir une des deux options">
            <label className="block text-sm font-medium text-gray-700">
              Exigences techniques pour le confinement
            </label>
          </Tooltip>
          <select
            value={assessment.confinementRequirements}
            onChange={(e) =>{
              onChange({
                ...assessment,
                confinementRequirements: e.target.value as 'Basiques' | 'Amélioré',
              });
              CalculGRCFinal();
            }}
            
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="Basiques">Basiques</option>
            <option value="Amélioré">Amélioré</option>
          </select>
        </div>

        <div>
          <h3 className="text-lg font-medium">Remarques complémentaires</h3>
          <Tooltip text="Champ de texte libre pour l'ajout de toute remarque pertinente">
            <label className="block text-sm font-medium text-gray-700">
              Champ de texte libre pour l'ajout de toute remarque pertinente
            </label>
          </Tooltip>
          <textarea
            value={assessment.additionalRemarks}
            onChange={(e) =>
              onChange({
                ...assessment,
                additionalRemarks: e.target.value,
              })
            }
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            rows="4"
          ></textarea>
        </div>
      </div>
      <h2 className="text-2xl font-semibold">GRC Final</h2>

      <div>
        <Tooltip text="GRC Final calculé...">
          <label className="block text-sm font-medium text-gray-700">
            GRC Final Calculé :
          </label>
        </Tooltip>
        <h2 className="text-2xl font-semibold">{CalculGRCFinal()}</h2>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg space-y-4">
        <div>
          <Tooltip text="GRC Final.">
            <label className="block text-sm font-medium text-gray-700">
              GRC
            </label>
          </Tooltip>
          <select
            value={assessment.GRC_Final}
            onChange={(e) =>
              onChange({
                ...assessment,
                GRC_Final: e.target.value as GRC_Final,
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
    </div>
  );
}
