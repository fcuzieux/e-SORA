import React from 'react';
import { RiskAssessmentInfo,mitigationStrategique,reduceImpactAttenuation,necessaryToReduceRisk,GRC_Final } from '../../types/sora';
import { Tooltip } from '../common/Tooltip';

interface GroundRiskAttenuationProps {
  assessment: RiskAssessmentInfo;
  onChange: (assessment: RiskAssessmentInfo) => void;
}

export function GroundRiskAttenuation({ assessment, onChange }: GroundRiskAttenuationProps) {
  return (
    <div className="space-y-8">
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
            onChange={(e) =>
              onChange({
                ...assessment,
                mitigationStrategique: e.target.value as mitigationStrategique,
              })
            }
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
              onChange={(e) =>
                onChange({
                  ...assessment,
                  reduceImpactAttenuation: e.target.value as reduceImpactAttenuation,
                })
              }
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
              onChange={(e) =>
                onChange({
                  ...assessment,
                  necessaryToReduceRisk: e.target.value as necessaryToReduceRisk,
                })
              }
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
            onChange={(e) =>
              onChange({
                ...assessment,
                planInterventionUrgence: e.target.value as mitigationStrategique,
              })
            }
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
            onChange={(e) =>
              onChange({
                ...assessment,
                confinementRequirements: e.target.value as 'Basiques' | 'Amélioré',
              })
            }
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
