import { agnes } from 'ml-hclust';
import { correlation } from './mathUtils.js';

const transpose = (matrix) => matrix[0].map((_, index) => matrix.map((row) => row[index]));

const clusterDistance = (clusterA, clusterB, dist) => {
  let min = Infinity;
  for (const a of clusterA.indices) {
    for (const b of clusterB.indices) {
      min = Math.min(min, dist[a][b]);
    }
  }
  return min;
};

const buildHierarchy = (distanceMatrix) => {
  const n = distanceMatrix.length;
  let active = Array.from({ length: n }, (_, index) => ({ id: index, indices: [index], children: [], height: 0 }));
  let nextId = n;

  while (active.length > 1) {
    let best = { distance: Infinity, i: 0, j: 1 };

    for (let i = 0; i < active.length; i += 1) {
      for (let j = i + 1; j < active.length; j += 1) {
        const distance = clusterDistance(active[i], active[j], distanceMatrix);
        if (distance < best.distance) {
          best = { distance, i, j };
        }
      }
    }

    const left = active[best.i];
    const right = active[best.j];
    const merged = {
      id: nextId,
      indices: [...left.indices, ...right.indices],
      children: [left, right],
      height: best.distance,
    };

    active = active.filter((_, index) => index !== best.i && index !== best.j);
    active.push(merged);
    nextId += 1;
  }

  return active[0];
};

const sortHierarchy = (node) => {
  if (!node.children || node.children.length === 0) return node;
  node.children = node.children.sort((a, b) => Math.min(...a.indices) - Math.min(...b.indices));
  node.children.forEach(sortHierarchy);
  return node;
};

const extractOrder = (node) => {
  if (!node.children || node.children.length === 0) return [node.id];
  return node.children.flatMap((child) => extractOrder(child));
};

export const computeReturns = (prices) =>
  prices.map((series) =>
    series.slice(1).map((value, index) => {
      const previous = series[index];
      if (!Number.isFinite(previous) || previous === 0) return 0;
      return value / previous - 1;
    })
  );

export const computeCorrelationMatrix = (returns) => {
  const n = returns.length;
  const matrix = Array.from({ length: n }, () => Array(n).fill(0));

  for (let i = 0; i < n; i += 1) {
    for (let j = 0; j < n; j += 1) {
      matrix[i][j] = i === j ? 1 : correlation(returns[i], returns[j]);
    }
  }

  return matrix;
};

export const computeDistanceMatrix = (correlationMatrix) =>
  correlationMatrix.map((row) => row.map((value) => Math.sqrt((1 - value) / 2)));

export const exportHrpCsv = (results) => {
  const rows = [['Position', 'Actif']].concat(
    results.order.map((symbol, index) => [String(index + 1), symbol])
  );
  const csv = rows.map((row) => row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = 'ihec-hrp-order.csv';
  anchor.click();
  URL.revokeObjectURL(url);
};

const buildTreeFromAgnes = (node, labels) => {
  if (node.isLeaf) {
    return { id: node.index, name: labels[node.index] };
  }
  return {
    children: [
      buildTreeFromAgnes(node.left, labels),
      buildTreeFromAgnes(node.right, labels)
    ],
    height: node.height
  };
};

export const computeHrpResults = (dataset) => {
  if (!dataset || !dataset.symbols || !dataset.prices || !dataset.prices.length) {
    throw new Error('Jeu de données invalide.');
  }

  const returns = computeReturns(dataset.prices);
  const correlationMatrix = computeCorrelationMatrix(returns);
  const distanceMatrix = computeDistanceMatrix(correlationMatrix);

  // Create condensed distance matrix
  const n = distanceMatrix.length;
  const condensedDist = [];
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      condensedDist.push(distanceMatrix[i][j]);
    }
  }

  // Perform hierarchical clustering
  const tree = agnes(condensedDist, { method: 'single' });

  // Convert to tree format for D3
  const d3Tree = buildTreeFromAgnes(tree.root, dataset.symbols);

  // Get order from leaves
  const order = tree.indices().map(i => dataset.symbols[i]);

  return {
    symbols: dataset.symbols,
    dates: dataset.dates,
    returns,
    correlation: correlationMatrix,
    distance: distanceMatrix,
    tree: d3Tree,
    order,
    observations: dataset.dates.length,
  };
};
