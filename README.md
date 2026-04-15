# IHEC

IHEC est une application React frontend pour l’analyse financière HRP (Hierarchical Risk Parity).

## Installation

1. Installez Node.js et npm.
2. Depuis le dossier `IHEC`, exécutez :
   ```bash
   npm install
   npm run dev
   ```

## Fonctionnalités

- Import de fichiers `.csv` et `.xlsx`
- Analyse des rendements des actifs dans le navigateur
- Calcul de la matrice de corrélation
- Calcul de la matrice de distance HRP
- Clustering hiérarchique et génération d’un dendrogramme
- Heatmaps interactives et tableau d’ordre optimal

## Structure

- `src/components/` : composants UI
- `src/utils/` : parsing et calculs HRP
- `src/App.jsx` : logique principale

## Note

Aucun backend n’est nécessaire : toute l’analyse s’exécute côté client.
# Analyse-Financi-re-HRP
