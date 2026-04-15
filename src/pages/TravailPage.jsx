import { useState } from 'react';
import { motion } from 'framer-motion';
import FileUploader from '../components/FileUploader';
import HRPAnalysis from '../components/HRPAnalysis';
import KPIs from '../components/KPIs';
import Theory from '../components/Theory';
import { Toaster } from 'react-hot-toast';

function TravailPage() {
  const [datasets, setDatasets] = useState(null);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleError = (message) => {
    setError(message);
    setLoading(false);
  };

  const handleDataset = async (data) => {
    setError('');
    setLoading(true);
    setResults(null);
    try {
      setDatasets(data);
    } catch (err) {
      setError(err.message || 'Impossible de traiter les données.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Analyse Financière HRP</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Importez vos séries de prix, calculez les corrélations, générez un dendrogramme et découvrez l'ordre optimal des actifs.
        </p>
      </div>

      {datasets && <KPIs datasets={datasets} />}

      <div className="mb-8">
        <Theory />
      </div>

      <div className="mb-8">
        <FileUploader onDataset={handleDataset} onError={handleError} loading={loading} error={error} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {datasets ? (
            <HRPAnalysis datasets={datasets} />
          ) : (
            <div className="bg-gray-50 rounded-lg p-12 text-center">
              <p className="text-gray-600">
                {error || 'Importez un fichier .csv ou .xlsx pour commencer l\'analyse HRP.'}
              </p>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Statistiques</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Nombre de datasets:</span>
                <span className="font-medium">{datasets ? Object.keys(datasets).length : 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <span className={`font-medium ${loading ? 'text-yellow-600' : datasets ? 'text-green-600' : 'text-gray-600'}`}>
                  {loading ? 'Chargement...' : datasets ? 'Prêt' : 'En attente'}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Instructions</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Importez un fichier Excel avec plusieurs feuilles</li>
              <li>• Chaque feuille représente une période différente</li>
              <li>• Les colonnes correspondent aux actifs financiers</li>
              <li>• Les données doivent être des prix ou rendements</li>
            </ul>
          </div>
        </div>
      </div>

      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#ffffff',
            color: '#374151',
            border: '1px solid #d1d5db',
          },
        }}
      />
    </motion.div>
  );
}

export default TravailPage;