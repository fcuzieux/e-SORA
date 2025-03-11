import React, { useState, useEffect } from 'react';
import { Tooltip } from '../common/Tooltip';
import { TacticalMitigationInfo } from '../../types/sora';
import { ARCFinalInfo } from '../../types/sora';

interface TacticalMitigationProps {
  assessment: TacticalMitigationInfo;
	assessmentARCFinalInfo: ARCFinalInfo; 
  onChange: (data: TacticalMitigationInfo) => void;
}

export function TacticalMitigation({ assessment, assessmentARCFinalInfo, onChange }: TacticalMitigationProps) {
  const [TacticalMitigationAvailableState, setTacticalMitigationAvailable] = useState<string>(assessment?.TacticalMitigationAvailable || 'NON');
  const [TacticalMitigationJustification, setTacticalMitigationJustification] = useState<string>('');
  const [dataLoaded, setDataLoaded] = useState(false);
  const [OperationalVolumeLevelState, setOperationalVolumeLevelState] = useState<string>(assessmentARCFinalInfo?.OperationalVolumeLevelState || 'ARC-b');

  // Load saved data from localStorage only once on component mount
  useEffect(() => {
    const savedData = localStorage.getItem('tacticalMitigation');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        setTacticalMitigationAvailable(parsedData.TacticalMitigationAvailableState || 'NON');
        setTacticalMitigationJustification(parsedData.TacticalMitigationJustification || '');
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
      TacticalMitigationAvailableState,
      TacticalMitigationJustification,
    };

    localStorage.setItem('tacticalMitigation', JSON.stringify(dataToSave));

    const updatedAssessment = {
      TacticalMitigationAvailable: TacticalMitigationAvailableState,
    };

    onChange(updatedAssessment);
  }, [
    dataLoaded,
    TacticalMitigationAvailableState,
    TacticalMitigationJustification,
    onChange
  ]);

  const tableData = [
    { ARC: 'ARC-d', Attenuation: 'Haut', Robustness: 'Haute' },
    { ARC: 'ARC-c', Attenuation: 'Moyen', Robustness: 'Moyenne' },
    { ARC: 'ARC-b', Attenuation: 'Faible', Robustness: 'Faible' },
    { ARC: 'ARC-a', Attenuation: 'Aucun minimum', Robustness: 'Aucun minimum' },
  ];

  return (
    <div className="space-y-8">
      <div className="space-y-8">
        <h2 className="text-2xl font-semibold">Tableau de Mitigation Tactique</h2>
        <table className="min-w-full bg-white">
          <thead>
            <tr className="bg-blue-500 text-white">
              <th className="py-2 px-4 border-b">ARC-Final</th>
              <th className="py-2 px-4 border-b">Niveau d'atténuation Tactique</th>
              <th className="py-2 px-4 border-b">Robustesse de l'atténuation</th>
            </tr>
          </thead>
          <tbody>
            {tableData.map((row, index) => (
              <tr
                key={index}
                className={
                  row.ARC === OperationalVolumeLevelState
                    ? 'bg-white'
                    : 'bg-gray-200'
                }
              >
                <td className="py-2 px-4 border-b">{row.ARC}</td>
                <td className="py-2 px-4 border-b">{row.Attenuation}</td>
                <td className="py-2 px-4 border-b">{row.Robustness}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
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
              value={TacticalMitigationAvailableState}
              onChange={(e) => setTacticalMitigationAvailable(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="OUI">OUI</option>
              <option value="NON">NON</option>
            </select>
          </div>
          {TacticalMitigationAvailableState === 'OUI' && (
            <div>
              <Tooltip text="En quelques phrases, veuillez décrire les moyens et TacticalMitigationJustifications de Mitigation Stratégique du risque Air">
                <label className="block text-sm font-medium text-gray-700">
                  Justifier vos éléments de Mitigation Stratégique du risque Air
                </label>
              </Tooltip>
              <textarea
                value={TacticalMitigationJustification}
                onChange={(e) => setTacticalMitigationJustification(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                rows={4}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
