export const mean = (values) => {
  const total = values.reduce((sum, value) => sum + value, 0);
  return values.length ? total / values.length : 0;
};

export const variance = (values) => {
  const mu = mean(values);
  const squared = values.reduce((sum, value) => sum + (value - mu) ** 2, 0);
  return values.length > 1 ? squared / (values.length - 1) : 0;
};

export const standardDeviation = (values) => Math.sqrt(variance(values));

export const covariance = (seriesA, seriesB) => {
  const meanA = mean(seriesA);
  const meanB = mean(seriesB);
  const length = Math.min(seriesA.length, seriesB.length);
  if (length < 2) return 0;
  let total = 0;
  for (let i = 0; i < length; i += 1) {
    total += (seriesA[i] - meanA) * (seriesB[i] - meanB);
  }
  return total / (length - 1);
};

export const correlation = (seriesA, seriesB) => {
  const cov = covariance(seriesA, seriesB);
  const sdA = standardDeviation(seriesA);
  const sdB = standardDeviation(seriesB);
  if (!sdA || !sdB) return 0;
  return Math.max(-1, Math.min(1, cov / (sdA * sdB)));
};

export const correlationMatrix = (data) => {
  const n = data.length;
  const corr = Array(n).fill().map(() => Array(n).fill(0));
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      corr[i][j] = correlation(data[i], data[j]);
    }
  }
  return corr;
};

export const distanceMatrix = (corr) => {
  const n = corr.length;
  const dist = Array(n).fill().map(() => Array(n).fill(0));
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      dist[i][j] = Math.sqrt((1 - corr[i][j]) / 2);
    }
  }
  return dist;
};

export const returnsFromPrices = (prices) => {
  const returns = [];
  for (let i = 1; i < prices.length; i++) {
    returns.push((prices[i] - prices[i - 1]) / prices[i - 1]);
  }
  return returns;
};
