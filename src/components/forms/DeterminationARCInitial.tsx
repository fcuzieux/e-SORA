import React from 'react';
import { AirspaceVolume } from './AirspaceVolume';

interface DeterminationARCInitialProps {
  airspaceClass: string;
  onChange: (airspaceClass: string) => void;
}

export function DeterminationARCInitial({ airspaceClass, onChange }: DeterminationARCInitialProps) {
  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-semibold">Étape 4 : Détermination de l'ARC Initial</h2>

      <AirspaceVolume airspaceClass={airspaceClass} onChange={onChange} />
    </div>
  );
}
