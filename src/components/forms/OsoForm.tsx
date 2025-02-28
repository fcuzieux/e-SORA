import React from 'react';
import { Oso, OsoRobustnessLevel } from '../../types/sora';

interface OsoFormProps {
  osos: Oso[];
  onChange: (osos: Oso[]) => void;
}

export function OsoForm({ osos, onChange }: OsoFormProps) {
  const handleOsoChange = (index: number, updates: Partial<Oso>) => {
    const updatedOsos = osos.map((oso, i) => 
      i === index ? { ...oso, ...updates } : oso
    );
    onChange(updatedOsos);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Objectifs de Sécurité Opérationnelle (OSO)</h2>
      
      {osos.map((oso, index) => (
        <div key={oso.id} className="p-4 border rounded-lg space-y-3">
          <h3 className="font-medium">OSO #{oso.number} - {oso.description}</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Niveau requis
              </label>
              <div className="mt-1 p-2 bg-gray-50 rounded-md">
                {oso.requiredLevel}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Niveau atteint
              </label>
              <select
                value={oso.status}
                onChange={(e) => handleOsoChange(index, { 
                  status: e.target.value as OsoRobustnessLevel 
                })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              >
                <option value="Low">Faible</option>
                <option value="Medium">Moyen</option>
                <option value="High">Élevé</option>
              </select>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Justification / Preuves
            </label>
            <textarea
              value={oso.evidence}
              onChange={(e) => handleOsoChange(index, { evidence: e.target.value })}
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
          </div>
        </div>
      ))}
    </div>
  );
}
