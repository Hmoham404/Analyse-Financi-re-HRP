import { Fragment } from 'react';
import { scaleLinear } from 'd3';

function DistanceHeatmap({ matrix, labels }) {
  if (!matrix || !matrix.length) return null;

  const size = labels.length;
  const maxDistance = Math.max(...matrix.flat());
  const colorScale = scaleLinear().domain([0, maxDistance]).range(['#0f172a', '#38bdf8']);

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
      <div className="grid grid-cols-[120px_repeat(var(--grid-count),minmax(32px,1fr))] gap-px bg-gray-200 text-gray-700" style={{ '--grid-count': size }}>
        <div className="bg-white p-3 text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">Actifs</div>
        {labels.map((label) => (
          <div key={label} className="bg-white p-3 text-xs font-semibold uppercase tracking-[0.12em] text-gray-500">
            {label}
          </div>
        ))}

        {matrix.map((row, rowIndex) => (
          <Fragment key={`row-${rowIndex}`}>
            <div className="bg-white p-3 text-sm font-medium text-gray-900">
              {labels[rowIndex]}
            </div>
            {row.map((value, colIndex) => (
              <div
                key={`cell-${rowIndex}-${colIndex}`}
                className="flex h-10 items-center justify-center text-xs font-medium text-white"
                style={{ backgroundColor: colorScale(value) }}
                title={value.toFixed(3)}
              >
                {value.toFixed(2)}
              </div>
            ))}
          </Fragment>
        ))}
      </div>
    </div>
  );
}

export default DistanceHeatmap;
