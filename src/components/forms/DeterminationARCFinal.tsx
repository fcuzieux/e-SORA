import React, { useState, useEffect } from 'react';
import { Tooltip } from '../common/Tooltip';
import { ARCFinalInfo } from '../../types/sora';

interface DeterminationARCFinalProps {
  assessment: ARCFinalInfo;
  onChange: (data: ARCFinalInfo) => void;
}

export function DeterminationARCFinal({ assessment, onChange }: DeterminationARCFinalProps) {
  const [StrategicMitigationAvailableState, setStrategicMitigationAvailable] = useState<string>(assessment?.StrategicMitigationAvailable || 'ARC-a');
  const [OperationalVolumeLevelMitigatedState, setOperationalVolumeLevelMitigated] = useState<string>(assessment?.OperationalVolumeLevelMitigated || 'ARC-a');
  const [StrategicMitigationJustification, setStrategicMitigationJustification] = useState<string>('');
  const [dataLoaded, setDataLoaded] = useState(false);

  // Load saved data from localStorage only once on component mount
  useEffect(() => {
    const savedData = localStorage.getItem('determinationARCFinal');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        setStrategicMitigationAvailable(parsedData.StrategicMitigationAvailableState || 'ARC-a');
        setOperationalVolumeLevelMitigated(parsedData.OperationalVolumeLevelMitigatedState || 'ARC-a');
        setStrategicMitigationJustification(parsedData.StrategicMitigationJustification || '');
      } catch (error) {
        console.error('Error loading saved data:', error);
      }
    }
    setDataLoaded(true);
  }, []);

  // Update parent component and save to localStorage when data changes
  useEffect(() => {
    if (!dataLoaded) return;

    const dataToSave = {
      StrategicMitigationAvailableState,
      OperationalVolumeLevelMitigatedState,
      StrategicMitigationJustification,
    };

    localStorage.setItem('determinationARCFinal', JSON.stringify(dataToSave));

    const updatedAssessment = {
      StrategicMitigationAvailable: StrategicMitigationAvailableState,
      OperationalVolumeLevelMitigated: OperationalVolumeLevelMitigatedState,
    };

    onChange(updatedAssessment);
  }, [
    dataLoaded,
    StrategicMitigationAvailableState,
    OperationalVolumeLevelMitigatedState,
    StrategicMitigationJustification,
    onChange
  ]);

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
              value={StrategicMitigationAvailableState}
              onChange={(e) => setStrategicMitigationAvailable(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="OUI">OUI</option>
              <option value="NON">NON</option>
            </select>
          </div>
          {StrategicMitigationAvailableState === 'OUI' && (
            <div>
              <Tooltip text="En quelques phrases, veuillez décrire les moyens et StrategicMitigationJustifications de Mitigation Stratégique du risque Air">
                <label className="block text-sm font-medium text-gray-700">
                  Justifier vos éléments de Mitigation Stratégique du risque Air
                </label>
              </Tooltip>
              <textarea
                value={StrategicMitigationJustification}
                onChange={(e) => setStrategicMitigationJustification(e.target.value)}
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
              value={OperationalVolumeLevelMitigatedState}
              onChange={(e) => setOperationalVolumeLevelMitigated(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="ARC-a">ARC-a</option>
              <option value="ARC-b">ARC-b</option>
              <option value="ARC-c">ARC-c</option>
              <option value="ARC-d">ARC-d</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
