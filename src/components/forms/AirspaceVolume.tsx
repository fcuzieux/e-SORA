import React from 'react';
import { Tooltip } from '../common/Tooltip';

interface AirspaceVolumeProps {
  airspaceClass: string;
  onChange: (airspaceClass: string) => void;
}

export function AirspaceVolume({ airspaceClass, onChange }: AirspaceVolumeProps) {
  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-semibold">Volume d'espace aérien</h2>

      <div className="bg-gray-50 p-4 rounded-lg space-y-4">
        <div>
          <Tooltip text="Sélectionnez une ou plusieurs des neuf options. Sélectionnez 'Autre' si aucune des options précédentes ne s'applique (par exemple, les zones militaires).">
            <label className="block text-sm font-medium text-gray-700">
              Classe d'espace aérien de l'opération envisagée
            </label>
          </Tooltip>
          <select
            value={airspaceClass}
            onChange={(e) => onChange(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="A">A</option>
            <option value="B">B</option>
            <option value="C">C</option>
            <option value="D">D</option>
            <option value="E">E</option>
            <option value="F">F</option>
            <option value="G">G</option>
            <option value="U-Space">U-Space</option>
            <option value="Autre">Autre, Préciser</option>
          </select>
        </div>
      </div>
    </div>
  );
}
