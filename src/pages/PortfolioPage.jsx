import { motion } from 'framer-motion';
import { Target, TrendingUp, BarChart3 } from 'lucide-react';

function PortfolioPage() {
  const objectives = [
    {
      icon: BarChart3,
      title: "Analyse de données financières",
      description: "Traitement et analyse de séries temporelles financières"
    },
    {
      icon: TrendingUp,
      title: "Gestion de portefeuille",
      description: "Optimisation de portefeuilles avec méthodes avancées"
    },
    {
      icon: Target,
      title: "Visualisation des performances",
      description: "Graphiques interactifs et tableaux de bord"
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Notre Portfolio</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Découvrez notre projet d'analyse financière réalisé dans le cadre de nos études à l'IHEC Carthage
        </p>
      </div>

      {/* Banking Case Study */}
      <section className="mb-16">
        <h2 className="text-3xl font-semibold text-gray-900 mb-8 text-center">
          Étude de cas bancaire
        </h2>
        <p className="text-center text-gray-600 mb-8 max-w-2xl mx-auto">
          Ce projet compare l’analyse financière de deux pays : la Tunisie et les États-Unis. Nous présentons une étude sur les banques clés de chaque marché,
          en mettant en évidence les périodes pré-COVID et post-COVID.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="text-2xl font-semibold text-gray-900 mb-3">Tunisie</h3>
            <p className="text-gray-600 mb-4">
              Analyse des performances des banques tunisiennes avant et après la crise du COVID. Cette partie met l'accent sur la stabilisation du portefeuille,
              la corrélation entre les actifs et l'impact du contexte macroéconomique local.
            </p>
            <p className="text-sm text-gray-500">
              Exemple : BIAT, ATTIJARI BANK et autres banques tunisiennes sont étudiées pour comprendre les dynamiques de risque et de rendement.
            </p>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="text-2xl font-semibold text-gray-900 mb-3">États-Unis</h3>
            <p className="text-gray-600 mb-4">
              Analyse des établissements financiers américains avant et après la pandémie. Nous mettons en lumière la réaction du marché,
              la corrélation entre les actifs et les changements de comportement des investisseurs.
            </p>
            <p className="text-sm text-gray-500">
              Exemple : JPMorgan Chase, Bank of America et d'autres banques américaines servent de base pour comparer les deux périodes.
            </p>
          </div>
        </div>
      </section>

      {/* Project Description */}
      <section className="mb-16">
        <div className="bg-gray-50 rounded-lg p-8">
          <h2 className="text-3xl font-semibold text-gray-900 mb-6 text-center">
            À propos du projet
          </h2>
          <div className="max-w-4xl mx-auto text-gray-700 space-y-4">
            <p className="text-lg">
              Ce projet de portfolio en analyse financière a été développé dans le cadre de notre cursus de 2ème année
              à l'Institut des Hautes Études Commerciales de Carthage (IHEC).
            </p>
            <p>
              Nous avons créé une application web complète permettant d'analyser des données financières,
              d'effectuer des calculs de rentabilité et de visualiser les performances de portefeuilles d'investissement.
            </p>
            <p>
              L'application intègre des concepts avancés d'analyse financière tels que l'optimisation de portefeuille
              selon la méthode Hierarchical Risk Parity (HRP), l'analyse de corrélations et la génération de rapports visuels.
            </p>
          </div>
        </div>
      </section>

      {/* Objectives */}
      <section>
        <h2 className="text-3xl font-semibold text-gray-900 mb-8 text-center">
          Objectifs du projet
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {objectives.map((obj, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2, duration: 0.5 }}
              className="bg-white rounded-lg shadow-md p-6 text-center border border-gray-200"
            >
              <obj.icon className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-3">{obj.title}</h3>
              <p className="text-gray-600">{obj.description}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </motion.div>
  );
}

export default PortfolioPage;