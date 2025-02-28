import { StepInfo } from '../types/navigation';

export const STEPS: StepInfo[] = [
  {
    id: 'operator-info',
    title: 'Informations sur l\'exploitant',
    description: 'Renseignez les informations concernant l\'exploitant du drone'
  },
  {
    id: 'conops',
    title: 'Étape 1 : Concept d\'opérations / ConOps',
    description: 'Définissez les caractéristiques du drone et de l\'opération'
  },
  {
    id: 'initial-grc',
    title: 'Étape 2 : Détermination du GRC Initial',
    description: 'Évaluez le risque sol intrinsèque'
  },
  {
    id: 'final-grc',
    title: 'Étape 3 : Atténuation du risque sol et GRC Final',
    description: 'Déterminez le risque sol final après atténuation'
  },
  {
    id: 'initial-arc',
    title: 'Étape 4 : Détermination de l\'ARC Initial',
    description: 'Évaluez le risque air initial'
  },
  {
    id: 'final-arc',
    title: 'Étape 5 : Atténuation du risque air et ARC Final',
    description: 'Déterminez le risque air final après atténuation'
  },
  {
    id: 'tactical-mitigation',
    title: 'Étape 6 : Atténuation tactique du risque « air »',
    description: 'Définissez les mesures tactiques d\'atténuation'
  },
  {
    id: 'sail',
    title: 'Étape 7 : Détermination du SAIL',
    description: 'Déterminez le niveau SAIL'
  },
  {
    id: 'oso',
    title: 'Étape 8 : Objectifs de sécurité opérationnels (OSO)',
    description: 'Définissez les objectifs de sécurité'
  },
  {
    id: 'adjacent-areas',
    title: 'Étape 9 : Considérations sur les espaces aériens ou sol adjacents',
    description: 'Évaluez l\'impact sur les zones adjacentes'
  },
  {
    id: 'summary',
    title: 'Résumé',
    description: 'Récapitulatif de votre dossier SORA'
  }
];