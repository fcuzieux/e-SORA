import React from 'react';
import { Tooltip } from '../common/Tooltip';
import { RiskAssessmentInfo } from '../../types/sora';

interface AdjacentAreasProps {
  assessment: RiskAssessmentInfo;
  onChange: (assessment: RiskAssessmentInfo) => void;
}

export function AdjacentAreas({ assessment, onChange }: AdjacentAreasProps) {
  
 
   const tableData = [
     { ARC: 'ARC-d', Attenuation: 'Haut', Robustness: 'Haute' },
     { ARC: 'ARC-c', Attenuation: 'Moyen', Robustness: 'Moyenne' },
     { ARC: 'ARC-b', Attenuation: 'Faible', Robustness: 'Faible' },
     { ARC: 'ARC-a', Attenuation: 'Aucun minimum', Robustness: 'Aucun minimum' },
   ];
 
   return (
     <div className="space-y-8">
       <div className="space-y-8">
         <h2 className="text-2xl font-semibold">Détermination du SAIL</h2>
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
                     row.ARC === assessment.OperationalVolumeLevelMitigated//'ARC-b'//formData.riskAssessment.OperationalVolumeLevel//OperationalVolumeLevelState
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
         <h2 className="text-2xl font-semibold">Commentaires additionnels</h2>
         <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                    
             <div>
               <Tooltip text="En quelques phrases, vous pouvez apporter des commentaires additionnels sur le niveau de SAIL de l'opération envisagée">
                 <label className="block text-sm font-medium text-gray-700">
                   Apporter vos commentaires sur le niveau de SAIL si vous le souhaitez :
                 </label>
               </Tooltip>
               <textarea
                 value={assessment.SAILJustification}
                 onChange={(e) =>
                   onChange({
                     ...assessment,
                     SAILJustification: e.target.value,
                   })}
                 className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                 rows={4}
               />
             </div>
           
         </div>
       </div>
     </div>
  );
}
