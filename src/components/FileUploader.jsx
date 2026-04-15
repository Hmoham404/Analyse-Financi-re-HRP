import { useCallback, useState } from 'react';
import toast from 'react-hot-toast';
import { parseFinancialFile, parseFromURL } from '../utils/fileParser.js';

function FileUploader({ onDataset, onError, loading, error }) {
  const [dragActive, setDragActive] = useState(false);
  const [url, setUrl] = useState('');

  const handleFile = useCallback(
    async (file) => {
      if (!file) return;
      try {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch('http://localhost:5000/analyze', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error('Erreur du serveur');
        }

        const data = await response.json();
        onError('');
        onDataset(data);
        toast.success('Analyse terminée ! Dendrogrammes générés.');
      } catch (err) {
        const errorMsg = err.message || 'Impossible de traiter le fichier.';
        onError(errorMsg);
        toast.error(errorMsg);
      }
    },
    [onDataset, onError]
  );

  const handleUrl = useCallback(
    async () => {
      if (!url.trim()) return;
      try {
        const dataset = await parseFromURL(url.trim());
        onError('');
        onDataset(dataset);
      } catch (err) {
        onError(err.message || 'Impossible de charger les données depuis l\'URL.');
      }
    },
    [url, onDataset, onError]
  );

  const handleDrop = useCallback(
    async (event) => {
      event.preventDefault();
      setDragActive(false);
      const file = event.dataTransfer?.files?.[0];
      if (file) {
        await handleFile(file);
      }
    },
    [handleFile]
  );

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-md">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Import de fichier</h2>
          <p className="mt-2 text-sm text-gray-600">
            Glissez-déposez un fichier .csv ou .xlsx, collez une URL Google Sheets, ou cliquez pour sélectionner les données de prix.
          </p>
          <div className="mt-4 flex gap-2">
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Collez l'URL d'un Google Sheet ou CSV"
              className="flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none"
            />
            <button
              onClick={handleUrl}
              disabled={loading || !url.trim()}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Charger
            </button>
          </div>
        </div>
        <span className="rounded-full bg-blue-100 px-3 py-2 text-sm text-blue-800">Analyse complète</span>
      </div>

      <label
        htmlFor="file-upload"
        onDragOver={(event) => {
          event.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
        className={`mt-6 flex min-h-[220px] cursor-pointer flex-col items-center justify-center rounded-lg border-2 transition ${
          dragActive ? 'border-blue-400 bg-blue-50' : 'border-dashed border-gray-300 bg-gray-50'
        }`}
      >
        <input
          id="file-upload"
          type="file"
          accept=".csv,.xlsx"
          className="hidden"
          onChange={async (event) => {
            const file = event.target.files?.[0];
            if (file) await handleFile(file);
          }}
        />
        <div className="flex flex-col items-center gap-4 px-4 py-8 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
            <span className="text-3xl">⬆</span>
          </div>
          <div>
            <p className="text-lg font-semibold text-gray-900">Déposez votre fichier ici</p>
            <p className="mt-2 text-sm text-gray-600">.csv ou .xlsx, dates en première colonne, prix en colonnes suivantes.</p>
          </div>
          <div className="rounded-lg bg-white px-4 py-2 text-sm text-gray-700 border border-gray-200">
            {loading ? 'Analyse en cours...' : 'Cliquez pour sélectionner un fichier'}
          </div>
        </div>
      </label>

      {error ? <p className="mt-4 text-sm text-red-600">Erreur : {error}</p> : null}
    </div>
  );
}

export default FileUploader;
