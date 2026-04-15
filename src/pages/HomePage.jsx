import { motion } from 'framer-motion';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';

function HomePage() {
  return (
    <div className="min-h-[80vh] flex flex-col justify-center items-center text-center px-4">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl"
      >
        {/* Logo Space */}
        <div className="mb-8 flex justify-center">
          <div className="h-24 w-24 rounded-full overflow-hidden shadow-lg border border-slate-200 bg-white">
            <img src="/project-logo.svg" alt="Logo du projet" className="h-full w-full object-cover" />
          </div>
        </div>

        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
          Bienvenue dans notre projet de portfolio
        </h1>
        <h2 className="text-2xl md:text-3xl font-semibold text-blue-600 mb-4">
          Analyse Financière IHEC Carthage
        </h2>
        <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
          Projet réalisé par étudiants de 2ème année Analyse Financière
        </p>

        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link
            to="/portfolio"
            className="inline-flex items-center px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg shadow-lg hover:bg-blue-700 transition-colors"
          >
            Accéder au portfolio
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </motion.div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
        className="mt-16"
      >
        <ChevronDown className="h-8 w-8 text-gray-400 animate-bounce" />
      </motion.div>
    </div>
  );
}

export default HomePage;