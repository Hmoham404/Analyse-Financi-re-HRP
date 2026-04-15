function ResultsTable({ order }) {
  if (!order?.length) {
    return <p className="text-gray-500">Aucun ordre disponible pour l'instant.</p>;
  }

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
      <div className="grid grid-cols-[48px_1fr] gap-px bg-gray-200 text-gray-700 text-xs uppercase tracking-[0.16em]">
        <div className="bg-white p-3">#</div>
        <div className="bg-white p-3">Actif</div>
      </div>
      <div className="divide-y divide-gray-200 bg-white">
        {order.map((symbol, index) => (
          <div key={symbol} className="grid grid-cols-[48px_1fr] items-center gap-4 px-4 py-3 text-sm text-gray-900">
            <span className="font-semibold text-blue-600">{index + 1}</span>
            <span>{symbol}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ResultsTable;
