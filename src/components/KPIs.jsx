function KPIs({ datasets }) {
  if (!datasets) return null;

  const validResults = Object.values(datasets).filter(res => res && !res.error);
  const totalAssets = validResults.length > 0 ? Object.keys(validResults[0].correlation || {}).length : 0;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <div className="rounded-lg bg-blue-50 p-4 text-center border border-blue-200">
        <p className="text-2xl font-bold text-blue-600">{validResults.length}</p>
        <p className="text-sm text-gray-600">Périodes analysées</p>
      </div>
      <div className="rounded-lg bg-blue-50 p-4 text-center border border-blue-200">
        <p className="text-2xl font-bold text-blue-600">{totalAssets}</p>
        <p className="text-sm text-gray-600">Actifs par période</p>
      </div>
      <div className="rounded-lg bg-blue-50 p-4 text-center border border-blue-200">
        <p className="text-2xl font-bold text-blue-600">HRP</p>
        <p className="text-sm text-gray-600">Méthode d'analyse</p>
      </div>
    </div>
  );
}

export default KPIs;