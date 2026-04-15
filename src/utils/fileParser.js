import Papa from 'papaparse';
import * as XLSX from 'xlsx';

const parseNumber = (value) => {
  if (value === null || value === undefined || value === '') return NaN;
  if (value instanceof Date) return Number.isFinite(value.valueOf()) ? Number(value.valueOf()) : NaN;
  const cleaned = String(value).trim().replace(/\s+/g, '').replace(/,/g, '.');
  const number = Number(cleaned);
  return Number.isFinite(number) ? number : NaN;
};

const normalizeRows = (rows, headers) => {
  const dateKey = headers[0];
  const symbols = headers.slice(1).map((header) => String(header).trim()).filter(Boolean);

  const filteredRows = rows
    .map((row) => {
      const date = row[dateKey] || row[0];
      const values = symbols.map((symbol, index) => parseNumber(row[symbol] ?? row[index + 1]));
      return { date: date ? String(date) : '', values };
    })
    .filter((row) => row.date && row.values.every(Number.isFinite));

  if (!filteredRows.length) {
    throw new Error('Aucune donnée valide trouvée. Vérifiez le format du fichier.');
  }

  const dates = filteredRows.map((row) => row.date);
  const prices = symbols.map((_, index) => filteredRows.map((row) => row.values[index]));

  return { symbols, dates, prices };
};

export const parseFinancialFile = (file) =>
  new Promise((resolve, reject) => {
    const { name } = file;
    const extension = name.split('.').pop().toLowerCase();

    if (extension === 'csv') {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (result) => {
          try {
            if (!result.data || !result.meta.fields?.length) {
              throw new Error('Le fichier CSV est vide ou mal formaté.');
            }
            const dataset = normalizeRows(result.data, result.meta.fields);
            resolve({ default: dataset }); // Wrap in object for consistency
          } catch (error) {
            reject(error);
          }
        },
        error: (error) => reject(error),
      });
      return;
    }

    if (extension === 'xlsx') {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const arrayBuffer = event.target.result;
          const workbook = XLSX.read(arrayBuffer, { type: 'array' });
          const datasets = {};

          workbook.SheetNames.forEach((sheetName) => {
            const worksheet = workbook.Sheets[sheetName];
            const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: null });

            if (rows.length < 2) {
              console.warn(`Feuille ${sheetName} ignorée : pas assez de données.`);
              return;
            }

            const headers = rows[0].map((cell) => String(cell ?? '').trim());
            const rowObjects = rows.slice(1).map((row) => {
              const rowObject = {};
              headers.forEach((header, index) => {
                rowObject[header] = row[index];
              });
              return rowObject;
            });

            try {
              const dataset = normalizeRows(rowObjects, headers);
              datasets[sheetName] = dataset;
            } catch (error) {
              console.warn(`Erreur dans la feuille ${sheetName}: ${error.message}`);
            }
          });

          if (Object.keys(datasets).length === 0) {
            throw new Error('Aucune feuille valide trouvée dans le fichier XLSX.');
          }

          resolve(datasets);
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = () => reject(new Error('Impossible de lire le fichier XLSX.'));
      reader.readAsArrayBuffer(file);
      return;
    }

    reject(new Error('Format non pris en charge. Utilisez un fichier .csv ou .xlsx.'));
  });

const getCSVUrl = (url) => {
  // If already a CSV export URL, return as is
  if (url.includes('/export?format=csv')) {
    return url;
  }
  // Extract spreadsheet ID from Google Sheets URL
  const match = url.match(/\/d\/([a-zA-Z0-9-_]+)/);
  if (match) {
    return `/api/sheets/spreadsheets/d/${match[1]}/export?format=csv`;
  }
  // Assume it's a direct CSV URL, but for CORS, if it's external, might need proxy
  if (url.startsWith('http')) {
    // For external URLs, use proxy if needed, but for now, assume it's ok
    return url;
  }
  return url;
};

export const parseFromURL = (url) =>
  new Promise((resolve, reject) => {
    const csvUrl = getCSVUrl(url);
    fetch(csvUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Erreur HTTP: ${response.status}`);
        }
        return response.text();
      })
      .then((csvText) => {
        Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          complete: (result) => {
            try {
              if (!result.data || !result.meta.fields?.length) {
                throw new Error('Les données CSV sont vides ou mal formatées.');
              }
              const dataset = normalizeRows(result.data, result.meta.fields);
              resolve(dataset);
            } catch (error) {
              reject(error);
            }
          },
          error: (error) => reject(error),
        });
      })
      .catch((error) => reject(new Error(`Impossible de charger les données depuis l'URL: ${error.message}`)));
  });
