import { motion } from 'framer-motion';
import { Calculator, TrendingUp, DollarSign, PieChart } from 'lucide-react';

function CoursPage() {
  const concepts = [
    {
      icon: Calculator,
      title: "ROI (Return on Investment)",
      formula: "ROI = (Gain - Coût) / Coût × 100%",
      description: "Mesure la rentabilité d'un investissement en pourcentage.",
      example: "Si vous investissez 1000€ et gagnez 200€, ROI = 20%"
    },
    {
      icon: TrendingUp,
      title: "VAN (Valeur Actuelle Nette)",
      formula: "VAN = Σ (CF_t / (1+r)^t) - C0",
      description: "Évalue la valeur actuelle des flux de trésorerie futurs.",
      example: "VAN > 0 : projet rentable"
    },
    {
      icon: DollarSign,
      title: "TRI (Taux de Rendement Interne)",
      formula: "Σ (CF_t / (1+TRI)^t) = 0",
      description: "Taux qui annule la VAN d'un projet.",
      example: "TRI > taux d'actualisation : projet acceptable"
    },
    {
      icon: PieChart,
      title: "Diversification de Portefeuille",
      formula: "σ_portefeuille = √(w₁²σ₁² + w₂²σ₂² + 2w₁w₂Cov₁₂)",
      description: "Réduction du risque par combinaison d'actifs non corrélés.",
      example: "Plus la corrélation est faible, plus la diversification est efficace"
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Cours d'Analyse Financière</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Concepts fondamentaux et formules essentielles pour l'analyse d'investissement
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {concepts.map((concept, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            className="bg-white rounded-lg shadow-md p-6 border border-gray-200"
          >
            <div className="flex items-center mb-4">
              <concept.icon className="h-8 w-8 text-blue-600 mr-3" />
              <h3 className="text-xl font-semibold text-gray-900">{concept.title}</h3>
            </div>

            <div className="mb-4">
              <h4 className="font-semibold text-gray-700 mb-2">Formule :</h4>
              <div className="bg-gray-50 p-3 rounded font-mono text-sm text-center">
                {concept.formula}
              </div>
            </div>

            <div className="mb-4">
              <h4 className="font-semibold text-gray-700 mb-2">Description :</h4>
              <p className="text-gray-600">{concept.description}</p>
            </div>

            <div>
              <h4 className="font-semibold text-gray-700 mb-2">Exemple :</h4>
              <p className="text-gray-600 italic">{concept.example}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Additional Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="mt-12 bg-blue-50 rounded-lg p-8"
      >
        <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
          Concepts Avancés
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Analyse de Risque</h3>
            <ul className="space-y-2 text-gray-600">
              <li>• Volatilité (écart-type des rendements)</li>
              <li>• Value at Risk (VaR)</li>
              <li>• Beta (sensibilité au marché)</li>
              <li>• Ratio de Sharpe</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Optimisation de Portefeuille</h3>
            <ul className="space-y-2 text-gray-600">
              <li>• Théorie moderne du portefeuille (Markowitz)</li>
              <li>• Frontière efficiente</li>
              <li>• Hierarchical Risk Parity (HRP)</li>
              <li>• Black-Litterman</li>
            </ul>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default CoursPage;