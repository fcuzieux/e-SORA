import React, { useState, useEffect } from 'react';
import { Tooltip } from '../common/Tooltip';
import { TacticalMitigationInfo } from '../../types/sora';

interface TacticalMitigationProps {
  assessment: TacticalMitigationInfo;
  onChange: (data: TacticalMitigationInfo) => void;
}

export function TacticalMitigation({ assessment, onChange }: TacticalMitigationProps) {
  const [selectedClasses, setSelectedClasses] = useState<string[]>(assessment?.airspaceClasses || []);
  const [uspaceProviderState, setUspaceProvider] = useState<string>(assessment?.uspaceProvider || '');
  const [otherDetailsState, setOtherDetails] = useState<string>(assessment?.otherDetails || '');
  const [OperationalVolumeLevelState, setOperationalVolumeLevel] = useState<string>(assessment?.OperationalVolumeLevel || 'ARC-a');
  const [AdjacentVolumeLevelState, setAdjacentVolumeLevel] = useState<string>(assessment?.AdjacentVolumeLevel || 'ARC-a');
  const [detectAndAvoidState, setDetectAndAvoid] = useState<string>(assessment?.detectAndAvoid || '');
  const [trafficDetectionState, setTrafficDetection] = useState<string>(assessment?.trafficDetection || '');
  const [additionalDetailsState, setAdditionalDetails] = useState<string>(assessment?.additionalDetails || '');

  useEffect(() => {
    const savedData = localStorage.getItem('tacticalMitigation');
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      setSelectedClasses(parsedData.selectedClasses);
      setUspaceProvider(parsedData.uspaceProviderState);
      setOtherDetails(parsedData.otherDetailsState);
      setOperationalVolumeLevel(parsedData.OperationalVolumeLevelState);
      setAdjacentVolumeLevel(parsedData.AdjacentVolumeLevelState);
      setDetectAndAvoid(parsedData.detectAndAvoidState);
      setTrafficDetection(parsedData.trafficDetectionState);
      setAdditionalDetails(parsedData.additionalDetailsState);
    }
  }, []);

  useEffect(() => {
    onChange({
      airspaceClasses: selectedClasses,
      uspaceProvider: uspaceProviderState,
      otherDetails: otherDetailsState,
      OperationalVolumeLevel: OperationalVolumeLevelState,
      AdjacentVolumeLevel: AdjacentVolumeLevelState,
      detectAndAvoid: detectAndAvoidState,
      trafficDetection: trafficDetectionState,
      additionalDetails: additionalDetailsState,
    });

    localStorage.setItem('tacticalMitigation', JSON.stringify({
      selectedClasses,
      uspaceProviderState,
      otherDetailsState,
      OperationalVolumeLevelState,
      AdjacentVolumeLevelState,
      detectAndAvoidState,
      trafficDetectionState,
      additionalDetailsState,
    }));
  }, [
    selectedClasses,
    uspaceProviderState,
    otherDetailsState,
    OperationalVolumeLevelState,
    AdjacentVolumeLevelState,
    detectAndAvoidState,
    trafficDetectionState,
    additionalDetailsState,
    onChange,
  ]);

  const handleCheckboxChange = (className: string) => {
    setSelectedClasses((prevSelected) =>
      prevSelected.includes(className)
        ? prevSelected.filter((cls) => cls !== className)
        : [...prevSelected, className]
    );
  };

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
                    checked={selectedClasses.includes(cls)}
                    onChange={() => handleCheckboxChange(cls)}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                  />
                  <label className="ml-2 text-sm text-gray-700">{cls}</label>
                  {cls === 'U-Space' && selectedClasses.includes(cls) && (
                    <input
                      type="text"
                      value={uspaceProviderState}
                      onChange={(e) => setUspaceProvider(e.target.value)}
                      className="ml-4 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      placeholder="Fournisseur de service USSP"
                    />
                  )}
                  {cls === 'Autre, Préciser' && selectedClasses.includes(cls) && (
                    <input
                      type="text"
                      value={otherDetailsState}
                      onChange={(e) => setOtherDetails(e.target.value)}
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
              value={OperationalVolumeLevelState}
              onChange={(e) => setOperationalVolumeLevel(e.target.value)}
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
              value={AdjacentVolumeLevelState}
              onChange={(e) => setAdjacentVolumeLevel(e.target.value)}
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
              value={detectAndAvoidState}
              onChange={(e) => setDetectAndAvoid(e.target.value)}
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
              value={trafficDetectionState}
              onChange={(e) => setTrafficDetection(e.target.value)}
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
              value={additionalDetailsState}
              onChange={(e) => setAdditionalDetails(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Autre, préciser"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
