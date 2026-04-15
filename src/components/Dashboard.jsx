import CorrelationHeatmap from './CorrelationHeatmap.jsx';
import DistanceHeatmap from './DistanceHeatmap.jsx';
import Dendrogram from './Dendrogram.jsx';
import ResultsTable from './ResultsTable.jsx';

function Dashboard({ results }) {
  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-glow backdrop-blur-lg">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-100">Dendrogramme HRP</h2>
            <p className="mt-2 text-sm text-slate-400">Exploration des distances hiérarchiques entre vos actifs.</p>
          </div>
          <div className="rounded-2xl bg-slate-950/70 px-4 py-3 text-sm text-slate-300">
            {results.symbols.length} actifs · {results.observations} observations
          </div>
        </div>
        <div className="mt-6 min-h-[420px] rounded-3xl bg-slate-950/70 p-4">
          <Dendrogram tree={results.tree} labels={results.symbols} />
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-glow backdrop-blur-lg">
          <h3 className="text-lg font-semibold text-slate-100">Heatmap de corrélation</h3>
          <p className="mt-2 text-sm text-slate-400">Couleurs rouge → bleu indiquant les relations entre actifs.</p>
          <div className="mt-5 overflow-x-auto">
            <CorrelationHeatmap matrix={results.correlation} labels={results.symbols} />
          </div>
        </div>

        <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-glow backdrop-blur-lg">
          <h3 className="text-lg font-semibold text-slate-100">Heatmap de distance HRP</h3>
          <p className="mt-2 text-sm text-slate-400">Distances hiérarchiques utilisées pour le clustering.</p>
          <div className="mt-5 overflow-x-auto">
            <DistanceHeatmap matrix={results.distance} labels={results.symbols} />
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-glow backdrop-blur-lg">
        <h3 className="text-lg font-semibold text-slate-100">Ordre optimal des actifs</h3>
        <p className="mt-2 text-sm text-slate-400">Cette rangée affiche l’ordre HRP trouvé à partir du clustering.</p>
        <div className="mt-6 overflow-x-auto">
          <ResultsTable order={results.order} />
        </div>
      </section>
    </div>
  );
}

export default Dashboard;
