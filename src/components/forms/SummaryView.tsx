import React from 'react';
import { SoraForm } from '../../types/sora';

interface SummaryViewProps {
  formData: SoraForm;
}

export function SummaryView({ formData }: SummaryViewProps) {
  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <h3 className="text-lg font-semibold">Informations sur l'exploitant</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium">Nom :</span> {formData.operator.name}
          </div>
          <div>
            <span className="font-medium">N° d'enregistrement :</span> {formData.operator.registrationNumber}
          </div>
          <div>
            <span className="font-medium">Gestionnaire :</span> {formData.operator.managerName}
          </div>
          <div>
            <span className="font-medium">Contact opérationnel :</span> {formData.operator.operationalContact}
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="text-lg font-semibold">Informations sur le drone</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium">Fabricant :</span> {formData.drone.manufacturer}
          </div>
          <div>
            <span className="font-medium">Modèle :</span> {formData.drone.model}
          </div>
          <div>
            <span className="font-medium">Masse :</span> {formData.drone.mass} kg
          </div>
          <div>
            <span className="font-medium">Vitesse max :</span> {formData.drone.maxSpeed} m/s
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="text-lg font-semibold">Évaluation des risques</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium">GRC Initial :</span> {formData.riskAssessment.intrinsicGroundRisk}
          </div>
          <div>
            <span className="font-medium">GRC Final :</span> {formData.riskAssessment.finalGroundRisk}
          </div>
          <div>
            <span className="font-medium">ARC :</span> {formData.riskAssessment.airRisk}
          </div>
          <div>
            <span className="font-medium">SAIL :</span> {formData.riskAssessment.sailLevel}
          </div>
        </div>
      </section>

      <div className="text-sm text-gray-600 mt-8">
        <p>Vous pouvez maintenant télécharger votre dossier SORA complet en cliquant sur le bouton ci-dessous.</p>
      </div>
    </div>
  );
}