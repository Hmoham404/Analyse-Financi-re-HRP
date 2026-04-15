import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';
import { computeHrpResults } from '../utils/hrp.js';
import Dendrogram from './Dendrogram.jsx';

const usaAssets = [
  "JPMorgan Chase (JPM)",
  "Bank of America (BAC)",
  "Citigroup (C)",
  "Wells Fargo (WFC)",
  "Goldman Sachs (GS)",
  "Morgan Stanley (MS)"
];

const tunAssets = [
  "BNA",
  "BIAT",
  "AMEN BANK",
  "BT",
  "ATTIJARI BANK",
  "UIB"
];

const periods = ["Pré-COVID", "COVID", "Post-COVID"];

const findSheet = (sheetNames, countryKeywords, periodKeywords) => {
  for (const s of sheetNames) {
    const sLow = s.toLowerCase();
    if (countryKeywords.some(k => sLow.includes(k)) && periodKeywords.some(p => sLow.includes(p))) {
      return s;
    }
  }
  return null;
};

function HRPAnalysis({ datasets }) {
  if (!datasets) return null;

  const exportResults = () => {
    const dataStr = JSON.stringify(datasets, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = 'hrp-results.json';
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const getKey = (country, period) => `${country}_${period.replace('-', '_').toLowerCase()}`;

  const renderItem = (country, period) => {
    const key = getKey(country, period);
    const res = datasets[key];
    const flag = country === 'USA' ? '🇺🇸' : '🇹🇳';

    if (!res || res.error) {
      return (
        <motion.div
          key={key}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gray-50 p-4 rounded-lg border border-gray-200"
        >
          <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
            {flag} {period}
          </h3>
          <div className="h-[420px] flex items-center justify-center text-gray-500">
            {res?.error || 'Données non disponibles'}
          </div>
        </motion.div>
      );
    }

    // Prepare chart data: bar chart for correlations of first asset
    const firstAsset = Object.keys(res.correlation)[0];
    const chartData = Object.entries(res.correlation[firstAsset]).map(([asset, corr]) => ({
      asset,
      correlation: corr
    }));

    return (
      <motion.div
        key={key}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm"
      >
        <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
          {flag} {period}
        </h3>
        <img src={res.dendrogram} alt={`Dendrogramme ${country} ${period}`} className="w-full h-auto rounded-lg mb-4" />
        <div className="mb-4">
          <h4 className="text-xs text-gray-600 mb-2">Corrélations ({firstAsset})</h4>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="asset" stroke="#374151" fontSize={10} />
              <YAxis stroke="#374151" fontSize={10} />
              <Tooltip
                contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #d1d5db', borderRadius: '8px' }}
                labelStyle={{ color: '#374151' }}
              />
              <Bar dataKey="correlation" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <details className="mt-2">
          <summary className="text-xs text-gray-600 cursor-pointer">Voir détails</summary>
          <pre className="text-xs text-gray-700 mt-1 overflow-auto max-h-32">
            Ordre HRP: {res.ordered_assets.join(', ')}
          </pre>
        </details>
      </motion.div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="rounded-lg border border-gray-200 bg-white p-6 shadow-md"
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900">Analyse HRP - Dendrogrammes & Graphiques</h2>
        <button
          onClick={exportResults}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
        >
          Exporter JSON
        </button>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {/* USA Row */}
        <div className="col-span-3 text-center text-gray-700 mb-2 font-semibold">🇺🇸 États-Unis</div>
        {['Pré-COVID', 'COVID', 'Post-COVID'].map(period => renderItem('USA', period))}
        {/* Tunisia Row */}
        <div className="col-span-3 text-center text-gray-700 mb-2 mt-4 font-semibold">🇹🇳 Tunisie</div>
        {['Pré-COVID', 'COVID', 'Post-COVID'].map(period => renderItem('Tunisie', period))}
      </div>
    </motion.div>
  );
}

export default HRPAnalysis;