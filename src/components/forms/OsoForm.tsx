import React from 'react';
import { Tooltip } from '../common/Tooltip';
import { Oso, OsoRobustnessLevel } from '../../types/sora';
import { RiskAssessmentInfo } from '../../types/sora';

interface OsoFormProps {
  osos: Oso[];
    assessment: RiskAssessmentInfo;
  onChange: (osos: Oso[]) => void;
}

export function OsoForm({ osos,assessment, onChange }: OsoFormProps) {
  if (!osos) {
    return <div>Loading...</div>;
  } else {

    const ReqInfoSail = ['Non Requis' , 'Faible' , 'Moyen' , 'Élevé'];
    let Tableau: number[] = [];
    // switch (assessment.SAIL.toString()) {
    //   case 'SAIL 1':
    //     Tableau = [0,0,1,0,0,0,1,1,1,1,1,1,1,1,1,1,1,0,0];
    //     break;
    //   case 'SAIL 2':
    //     Tableau = [0,0,1,0,0,0,1,1,1,1,1,1,1,1,1,1,1,0,0];
    //     break;
    // }
    
     if (assessment.SAIL.toString().includes('SAIL 1')) {
        Tableau=[0,0,1,0,0,0,1,1,1,1,1,1,1,1,1,1,1,0,0] ;
     } else if (assessment.SAIL.toString().includes('SAIL 2')) {
        Tableau=[1,0,1,0,0,1,1,2,1,1,2,1,1,2,1,1,1,0,0] ;
     } else if (assessment.SAIL.toString().includes('SAIL 3')) {
        Tableau=[2,1,2,0,1,1,2,3,2,2,3,2,2,3,2,2,2,1,1] ;
     } else if (assessment.SAIL.toString().includes('SAIL 4')) {
        Tableau=[3,2,2,1,2,2,2,3,2,2,3,2,3,3,2,2,2,2,2] ;
     } else if (assessment.SAIL.toString().includes('SAIL 5')) {
        Tableau=[3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,2] ;
     } else if (assessment.SAIL.toString().includes('SAIL 6')) {
        Tableau=[3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3] ;
     } else if (assessment.SAIL.toString().includes('Certifié')) {
        Tableau=[3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3] ;
     }
     const SAILMap=Tableau;

    osos = [
      {
        id: 'OSO1',
        number: '01',
        description: 'Opérateur UAS compétent et/ou approuvé',
        requiredLevel: ReqInfoSail.at(SAILMap.at(0)),
        status: assessment.OSOS_Levels[0],
        evidence: '',
        tooltip:'<div>Elément de réponse attendu :<br /> (a) Plan de formation générale. <br /> (b) Formation de l’équipage spécifique sur l’UAS concerné. <br />(c) Expérience de l’opérateur et précédentes opérations. <br />(d) Checklist et manuel d’entretien</div>',
      },
      {
        id: 'OSO2',
        number: '02',
        description: 'Constructeur UAS compétent et/ou approuvé',
        requiredLevel: ReqInfoSail.at(SAILMap.at(1)),
        status: assessment.OSOS_Levels[1],
        evidence: '',
        tooltip:'Elément de réponse attendu : ',
      },
      {
        id: 'OSO3',
        number: '03',
        description: 'Maintenance UAS assurée par une entité compétente et/ou approuvée',
        requiredLevel: ReqInfoSail.at(SAILMap.at(2)),
        status: assessment.OSOS_Levels[2],
        evidence: '',
        tooltip:'Elément de réponse attendu : ',
      },
      {
        id: 'OSO4',
        number: '04',
        description: 'UAS développé selon des standards reconnus par l’autorité',
        requiredLevel: ReqInfoSail.at(SAILMap.at(3)),
        status: assessment.OSOS_Levels[3],
        evidence: '',
        tooltip:'Elément de réponse attendu : ',
      },
      {
        id: 'OSO5',
        number: '05',
        description: 'UAS conçu selon des standards de fiabilité et de sécurité',
        requiredLevel: ReqInfoSail.at(SAILMap.at(4)),
        status: assessment.OSOS_Levels[4],
        evidence: '',
        tooltip:'Elément de réponse attendu : ',
      },
      {
        id: 'OSO6',
        number: '06',
        description: 'Performances du Lien C3 appropriées pour la mission',
        requiredLevel: ReqInfoSail.at(SAILMap.at(5)),
        status: assessment.OSOS_Levels[5],
        evidence: '',
        tooltip:'Elément de réponse attendu : ',
      },
      {
        id: 'OSO7',
        number: '07',
        description: 'Inspections de l’UAS pour assurer la validité du ConOps',
        requiredLevel: ReqInfoSail.at(SAILMap.at(6)),
        status: assessment.OSOS_Levels[6],
        evidence: '',
        tooltip:'Elément de réponse attendu : ',
      },
      {
        id: 'OSO8',
        number: '08',
        description: 'Procédures opérationnelles définies, validées et appliquées',
        requiredLevel: ReqInfoSail.at(SAILMap.at(7)),
        status: assessment.OSOS_Levels[7],
        evidence: '',
        tooltip:'Elément de réponse attendu : ',
      },
      {
        id: 'OSO9',
        number: '09',
        description: 'Equipage formé, entrainé régulièrement et capable de faire face aux situations anormales',
        requiredLevel: ReqInfoSail.at(SAILMap.at(8)),
        status: assessment.OSOS_Levels[8],
        evidence: '',
        tooltip:'Elément de réponse attendu : ',
      },
      {
        id: 'OSO10',
        number: '10',
        description: 'Retour à la normale en toute sécurité après un problème technique',
        requiredLevel: ReqInfoSail.at(SAILMap.at(9)),
        status: assessment.OSOS_Levels[9],
        evidence: '',
        tooltip:'Elément de réponse attendu : ',
      },
      {
        id: 'OSO11',
        number: '11',
        description: 'Des procédures sont en place pour supporter la détérioration des systèmes externes de soutien à l’opération',
        requiredLevel: ReqInfoSail.at(SAILMap.at(10)),
        status: assessment.OSOS_Levels[10],
        evidence: '',
        tooltip:'Elément de réponse attendu : ',
      },
      {
        id: 'OSO12',
        number: '12',
        description: 'L’UAS est conçu pour supporter la détérioration des systèmes externes de soutien',
        requiredLevel: ReqInfoSail.at(SAILMap.at(11)),
        status: assessment.OSOS_Levels[11],
        evidence: '',
        tooltip:'Elément de réponse attendu : ',
      },
      {
        id: 'OSO13',
        number: '13',
        description: 'Les systèmes externes de soutien sont adéquats pour l’opération',
        requiredLevel: ReqInfoSail.at(SAILMap.at(12)),
        status: assessment.OSOS_Levels[12],
        evidence: '',
        tooltip:'Elément de réponse attendu : ',
      },
      {
        id: 'OSO14',
        number: '14',
        description: 'Procédures opérationnelles définies, validées et appliquées',
        requiredLevel: ReqInfoSail.at(SAILMap.at(13)),
        status: assessment.OSOS_Levels[13],
        evidence: '',
        tooltip:'Elément de réponse attendu : ',
      },
      {
        id: 'OSO15',
        number: '15',
        description: 'Equipage formé, entrainé régulièrement et capable de faire face aux situations anormales',
        requiredLevel: ReqInfoSail.at(SAILMap.at(14)),
        status: assessment.OSOS_Levels[14],
        evidence: '',
        tooltip:'Elément de réponse attendu : ',
      },
      {
        id: 'OSO16',
        number: '16',
        description: 'Coordination intra-équipage',
        requiredLevel: ReqInfoSail.at(SAILMap.at(15)),
        status: assessment.OSOS_Levels[15],
        evidence: '',
        tooltip:'Elément de réponse attendu : ',
      },
      {
        id: 'OSO17',
        number: '17',
        description: 'Equipage en capacité d’exploiter',
        requiredLevel: ReqInfoSail.at(SAILMap.at(16)),
        status: assessment.OSOS_Levels[16],
        evidence: '',
        tooltip:'Elément de réponse attendu : ',
      },
      {
        id: 'OSO18',
        number: '18',
        description: 'Protection automatique de l’enveloppe de vol, résistance à l’erreur humaine',
        requiredLevel: ReqInfoSail.at(SAILMap.at(17)),
        status: assessment.OSOS_Levels[17],
        evidence: '',
        tooltip:'Elément de réponse attendu : ',
      },
      {
        id: 'OSO19',
        number: '19',
        description: 'Retour à la normale en toute sécurité après une erreur humaine',
        requiredLevel: ReqInfoSail.at(SAILMap.at(18)),
        status: assessment.OSOS_Levels[18],
        evidence: '',
        tooltip:'Elément de réponse attendu : ',
      },
    ];
  }

  const isRequiredLevelMet = (oso: Oso, assessmentLevel: string) => {

    const OsoRobustnessLevelOptions = {
      options: [
        { value: 'Non Requis', label: 'Non Requis' },
        { value: 'Faible', label: 'Faible' },
        { value: 'Moyen', label: 'Moyen' },
        { value: 'Élevé', label: 'Élevé' },
      ],
    };
    const indexrequiredLevel = OsoRobustnessLevelOptions.options.findIndex(
    (option) => option.value === oso.requiredLevel
    );
    
    const indexLeveldeclared = OsoRobustnessLevelOptions.options.findIndex(
    (option) => option.value === assessmentLevel
    );
    return (indexLeveldeclared-indexrequiredLevel) //oso.requiredLevel === assessmentLevel;
  };

  const handleOsoChange = (index: number, updates: Partial<Oso>) => {
    const updatedOsos = osos.map((oso, i) =>
      i === index ? { ...oso, ...updates } : oso
    );
    onChange(updatedOsos);
    assessment.OSOS_Levels = updatedOsos.map(oso => oso.status);
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

              <div className={
                          oso.requiredLevel=='Faible'
                          ? 'mt-1 p-2 bg-yellow-400 rounded-md'
                          : oso.requiredLevel=='Moyen'
                            ? 'mt-1 p-2 bg-orange-400 rounded-md'
                          : oso.requiredLevel=='Élevé'
                            ? 'mt-1 p-2 bg-red-400 rounded-md'
                            : 'mt-1 p-2 bg-green-400 rounded-md'
                          }>
                {oso.requiredLevel}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Niveau atteint
              </label>
              <select
                value={assessment.OSOS_Levels[index]}
                //value={assessment.OSOS_Levels ? assessment.OSOS_Levels[index] : 'Sélectionner une valeur'}
                onChange={(e) => handleOsoChange(index, {
                  status: e.target.value as OsoRobustnessLevel
                })}
                className={
                          assessment.OSOS_Levels[index]=='Faible'
                          ? 'mt-1 p-2 bg-yellow-400 rounded-md'
                          : assessment.OSOS_Levels[index]=='Moyen'
                            ? 'mt-1 p-2 bg-orange-400 rounded-md'
                          : assessment.OSOS_Levels[index]=='Élevé'
                            ? 'mt-1 p-2 bg-red-400 rounded-md'
                          : assessment.OSOS_Levels[index]=='Non Requis'
                            ? 'mt-1 p-2 bg-green-400 rounded-md'
                            : 'mt-1 p-2 bg-grey-400 rounded-md'
                          }
              >
                <option value="Sélectionner une valeur">Sélectionner une valeur</option>
                <option value="Non Requis">Non Requis</option>
                <option value="Faible">Faible</option>
                <option value="Moyen">Moyen</option>
                <option value="Élevé">Élevé</option>
              </select>
            </div>
          </div>
          {
            isRequiredLevelMet(oso, assessment.OSOS_Levels[index])==0
              ? <label className="block text-sm font-medium text-green-700">Niveau requis atteint </label>
            : isRequiredLevelMet(oso, assessment.OSOS_Levels[index])>0
              ? <label className="block text-sm font-medium text-green-700">Niveau requis dépassé </label>
            : <label className="block text-sm font-medium text-red-700">Niveau requis non atteint</label>
          }
          

          <div>
          <Tooltip
            text={
              <div dangerouslySetInnerHTML={{ __html: oso.tooltip }} />
            }
          >
            <label className="block text-sm font-medium text-gray-700">
              Justification / Preuves
            </label></Tooltip>
            <textarea
              value={oso.evidence}
              onChange={(e) => handleOsoChange(index, { evidence: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                rows={4}

              //placeholder={oso.tooltip}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
