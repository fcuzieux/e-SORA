import React from 'react';
import { Tooltip } from '../common/Tooltip';
import { RiskAssessmentInfo, StrategicMitigationAvailable, OperationalVolumeLevelMitigated } from '../../types/sora';

interface DeterminationARCFinalProps {
  assessment: RiskAssessmentInfo;
  onChange: (assessment: RiskAssessmentInfo) => void;
}

export function DeterminationARCFinal({ assessment, onChange }: DeterminationARCFinalProps) {

  return (
    <div className="space-y-8">
      <div className="space-y-8">
        <h2 className="text-2xl font-semibold">Mitigation Stratégique Risque Air</h2>
        <div className="bg-gray-50 p-4 rounded-lg space-y-4">
          <div>
            <Tooltip text="L'étape 5 permet de réduire l’ARC en justifiant d’une probabilité réduite de rencontre avec d'autres aéronefs s’appuyant par exemple sur une densité aérienne plus faible, sur une coordination avec les services de contrôle, sur une information des autres usagers de l’espace aérien, etc. La réduction de l’ARC proposée doit être explicitement justifiée et argumentée.">
              <label className="block text-sm font-medium text-gray-700">
                Une Mitigation Stratégique est-elle mise en place
              </label>
            </Tooltip>
            <select
              value={assessment.StrategicMitigationAvailable}
              onChange={(e) =>
                            onChange({
                              ...assessment,
                              StrategicMitigationAvailable: e.target.value as StrategicMitigationAvailable,
                            })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="OUI">OUI</option>
              <option value="NON">NON</option>
            </select>
          </div>
          {assessment.StrategicMitigationAvailable === 'OUI' && (
            <div>
              <Tooltip text="En quelques phrases, veuillez décrire les moyens et StrategicMitigationJustifications de Mitigation Stratégique du risque Air">
                <label className="block text-sm font-medium text-gray-700">
                  Justifier vos éléments de Mitigation Stratégique du risque Air
                </label>
              </Tooltip>
              <textarea
                value={assessment.StrategicMitigationJustification}
                onChange={(e) =>
                  onChange({
                    ...assessment,
                    StrategicMitigationJustification: e.target.value,
                  })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                rows={4}
              />
            </div>
          )}
        </div>
      </div>
      <div className="space-y-8">
        <h2 className="text-2xl font-semibold">Niveau de Risque Air Résiduel après Mitigation Stratégique </h2>
        <div className="bg-gray-50 p-4 rounded-lg space-y-4">
          <div>
            <Tooltip text="Sélectionnez le niveau de risque résiduel pour l'opération envisagée.">
              <label className="block text-sm font-medium text-gray-700">
                Volume Opérationnel
              </label>
            </Tooltip>
            <select
              value={assessment.OperationalVolumeLevelMitigated}
              onChange={(e) =>
                onChange({
                  ...assessment,
                  OperationalVolumeLevelMitigated: e.target.value as OperationalVolumeLevelMitigated,
                })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value='ARC-a'>ARC-a</option>
              <option value='ARC-b'>ARC-b</option>
              <option value='ARC-c'>ARC-c</option>
              <option value='ARC-d'>ARC-d</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
