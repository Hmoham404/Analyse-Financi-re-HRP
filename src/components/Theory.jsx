import { motion } from 'framer-motion';

function Theory() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="rounded-lg border border-gray-200 bg-white p-6 shadow-md"
    >
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Théorie de l'Analyse HRP</h2>
      <div className="text-sm text-gray-600 space-y-4">
        <p>
          <strong>Hierarchical Risk Parity (HRP)</strong> est une méthode d'optimisation de portefeuille qui vise à équilibrer les risques entre les actifs en utilisant une approche hiérarchique basée sur les corrélations.
        </p>
        <p>
          Contrairement aux méthodes traditionnelles comme Markowitz, HRP utilise le clustering hiérarchique pour grouper les actifs similaires et allouer les poids de manière récursive, réduisant ainsi la concentration des risques.
        </p>
        <p>
          <strong>Étapes clés :</strong>
        </p>
        <ul className="list-disc list-inside space-y-1">
          <li>Calcul des rendements quotidiens à partir des prix.</li>
          <li>Construction de la matrice de corrélation.</li>
          <li>Transformation en matrice de distance.</li>
          <li>Clustering hiérarchique (méthode single linkage).</li>
          <li>Allocation des poids selon l'ordre hiérarchique.</li>
        </ul>
        <p>
          Cette analyse compare les banques américaines et tunisiennes sur trois périodes : Pré-COVID, COVID, et Post-COVID, révélant l'impact des crises sur la diversification des portefeuilles.
        </p>
      </div>
    </motion.div>
  );
}

export default Theory;