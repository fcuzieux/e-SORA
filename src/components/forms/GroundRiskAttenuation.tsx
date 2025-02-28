import React from 'react';
import { RiskAssessmentInfo } from '../../types/sora';

interface GroundRiskAttenuationProps {
  assessment: RiskAssessmentInfo;
  onChange: (assessment: RiskAssessmentInfo) => void;
}

export function GroundRiskAttenuation({ assessment, onChange }: GroundRiskAttenuationProps) {
  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-semibold">Atténuation du risque sol</h2>
      
      <div className="bg-gray-50 p-4 rounded-lg space-y-4">
        {/* Le contenu sera ajouté ultérieurement */}
        <p className="text-gray-600">
          Cette section permettra de définir les mesures d'atténuation du risque sol.
        </p>
      </div>
    </div>
  );
}