import React from 'react';
import { Tooltip } from '../common/Tooltip';
import { RiskAssessmentInfo, airspaceClasses, OperationalVolumeLevel, AdjacentVolumeLevel } from '../../types/sora';

interface DeterminationARCInitialProps {
  assessment: RiskAssessmentInfo;
  onChange: (assessment: RiskAssessmentInfo) => void;
}

export function DeterminationARCInitial({ assessment, onChange }: DeterminationARCInitialProps) {

  const checkboxes = [
    'Classe - A',
    'Classe - B',
    'Classe - C',
    'Classe - D',
    'Classe - E',
    'Classe - F',
    'Classe - G',
    'U-Space',
    'Autre, Préciser',
  ];

  return (
    <div className="space-y-8">
        <h2 className="text-2xl font-semibold">Rappel des donnes :</h2>      
            <div className="bg-gray-50 p-4 rounded-lg space-y-4">
              <label className="block text-sm font-medium text-gray-700">
                Limite verticale du Volume d'évolution (Flight Geometry) :
              </label>
              <div className="mt-1 p-2 bg-gray-100 rounded-md">
                {assessment.FlightGeographyHeight} m
              </div>
              <label className="block text-sm font-medium text-gray-700">
                Limite verticale du Volume de contingence (Contingency Volume) :
              </label>
              <div className="mt-1 p-2 bg-gray-100 rounded-md">
                {assessment.ContingencyVolumeHeight} m
              </div>
              <label className="block text-sm font-medium text-gray-700">
                Limite verticale du Volume Adjacent (Adjacent Volume) :
              </label>
              <div className="mt-1 p-2 bg-gray-100 rounded-md">
                {assessment.AdjacentVolumeHeight} m
              </div>

            </div>
      
      <div className="space-y-8">
        <h2 className="text-2xl font-semibold">Volume d'espace aérien</h2>

        <div className="bg-gray-50 p-4 rounded-lg space-y-4">
          <div>
            <Tooltip text="Sélectionnez une ou plusieurs des neuf options. Sélectionnez 'Autre' si aucune des options précédentes ne s'applique (par exemple, les zones militaires).">
              <label className="block text-sm font-medium text-gray-700">
                Classe d'espace aérien de l'opération envisagée
              </label>
            </Tooltip>
            <div className="mt-1 space-y-2">
              {checkboxes.map((cls) => (
                <div key={cls} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={(assessment.airspaceClasses || []).includes(cls)}
                    onChange={
                      (e) =>
                        onChange({
                          ...assessment,
                          airspaceClasses: e.target.checked
                            ? [...(assessment.airspaceClasses || []), cls]
                            : (assessment.airspaceClasses || []).filter((c) => c !== cls),
                        })}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                  />
                  <label className="ml-2 text-sm text-gray-700">{cls}</label>
                  {cls === 'U-Space' && (assessment.airspaceClasses || []).includes('U-Space') && (
                    <input
                      type="text"
                      value={assessment.uspaceProvider}
                      onChange={(e) =>
                        onChange({
                          ...assessment,
                          uspaceProvider: e.target.value,
                        })}
                      className="ml-4 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      placeholder="Fournisseur de service USSP"
                    />
                  )}
                  {cls === 'Autre, Préciser' && (assessment.airspaceClasses || []).includes('Autre, Préciser') && (
                    <input
                      type="text"
                      value={assessment.otherDetails}
                      onChange={(e) =>
                        onChange({
                          ...assessment,
                          otherDetails: e.target.value,
                        })}
                      className="ml-4 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      placeholder="Préciser la nature de l'espace aérien"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
        <h2 className="text-2xl font-semibold">Niveau de Risque Résiduel</h2>
        <div className="bg-gray-50 p-4 rounded-lg space-y-4">
          <div>
            <Tooltip text="Sélectionnez le niveau de risque résiduel pour l'opération envisagée.">
              <label className="block text-sm font-medium text-gray-700">
                Volume Opérationnel
              </label>
            </Tooltip>
            <select
              value={assessment.OperationalVolumeLevel}
              onChange={(e) =>
                            onChange({
                              ...assessment,
                              OperationalVolumeLevel: e.target.value as OperationalVolumeLevel,
                            })
                          }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="ARC-a">ARC-a</option>
              <option value="ARC-b">ARC-b</option>
              <option value="ARC-c">ARC-c</option>
              <option value="ARC-d">ARC-d</option>
            </select>
          </div>
          <div>
            <Tooltip text="Sélectionnez le niveau de risque résiduel pour le volume adjacent.">
              <label className="block text-sm font-medium text-gray-700">
                Volume Adjacent
              </label>
            </Tooltip>
            <select
              value={assessment.AdjacentVolumeLevel}
              onChange={(e) =>
                onChange({
                  ...assessment,
                  AdjacentVolumeLevel: e.target.value as AdjacentVolumeLevel,
                })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="ARC-a">ARC-a</option>
              <option value="ARC-b">ARC-b</option>
              <option value="ARC-c">ARC-c</option>
              <option value="ARC-d">ARC-d</option>
            </select>
          </div>
        </div>
        <h2 className="text-2xl font-semibold">Solutions Additionnels</h2>
        <div className="bg-gray-50 p-4 rounded-lg space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Detect And Avoid
            </label>
            <input
              type="text"
              value={assessment.detectAndAvoid}
              onChange={(e) =>
                onChange({
                  ...assessment,
                  detectAndAvoid: e.target.value,
                })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Detect And Avoid"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Détection du trafic environnant
            </label>
            <input
              type="text"
              value={assessment.trafficDetection}
              onChange={(e) =>
                onChange({
                  ...assessment,
                  trafficDetection: e.target.value,
                })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Détection du trafic environnant"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Autre, préciser
            </label>
            <input
              type="text"
              value={assessment.additionalDetails}
              onChange={(e) =>
                onChange({
                  ...assessment,
                  additionalDetails: e.target.value,
                })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Autre, préciser"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
