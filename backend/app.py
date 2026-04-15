from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from scipy.cluster.hierarchy import linkage, dendrogram, leaves_list
from scipy.spatial.distance import squareform
import io
import base64

app = Flask(__name__)
CORS(app)  # Allow cross-origin requests from frontend

# =========================================================
# PARAMETRES DES ACTIFS
# =========================================================
usa_assets = [
    "JPMorgan Chase (JPM)",
    "Bank of America (BAC)",
    "Citigroup (C)",
    "Wells Fargo (WFC)",
    "Goldman Sachs (GS)",
    "Morgan Stanley (MS)"
]

tun_assets = [
    "BNA",
    "BIAT",
    "AMEN BANK",
    "BT",
    "ATTIJARI BANK",
    "UIB"
]

# =========================================================
# FONCTION POUR TROUVER AUTOMATIQUEMENT LES FEUILLES
# =========================================================
def find_sheet(sheet_names, country_keywords, period_keywords):
    for s in sheet_names:
        s_low = s.lower()
        if any(k in s_low for k in country_keywords) and any(p in s_low for p in period_keywords):
            return s
    return None

# =========================================================
# FONCTION POUR CHARGER UNE FEUILLE
# =========================================================
def load_sheet(df, assets):
    # df is already loaded

    # chercher la colonne date
    possible_date_cols = ["Cours", "SEANCE", "Date", "DATE"]
    date_col = None
    for c in possible_date_cols:
        if c in df.columns:
            date_col = c
            break

    if date_col is None:
        raise ValueError("Aucune colonne date trouvée")

    df[date_col] = pd.to_datetime(df[date_col], errors="coerce")
    df = df.dropna(subset=[date_col])

    missing = [c for c in assets if c not in df.columns]
    if missing:
        raise ValueError(f"Colonnes manquantes : {missing}")

    df = df[[date_col] + assets].copy()

    for c in assets:
        df[c] = pd.to_numeric(df[c], errors="coerce")

    df = df.dropna()
    df = df.sort_values(date_col).reset_index(drop=True)

    return df, date_col

# =========================================================
# FONCTION D'ANALYSE HRP
# =========================================================
def run_hrp(df, assets):
    returns = df[assets].pct_change().dropna()

    corr = returns.corr()
    dist = np.sqrt((1 - corr) / 2)

    link = linkage(squareform(dist.values), method="single")
    order_idx = leaves_list(link)
    ordered_assets = corr.columns[order_idx].tolist()

    # Generate dendrogram image
    fig, ax = plt.subplots(figsize=(8, 6))
    dendrogram(link, labels=corr.columns.tolist(), ax=ax, leaf_rotation=0, leaf_font_size=10)
    ax.set_title("Dendrogramme HRP")
    ax.set_xlabel("Actions")
    ax.set_ylabel("Distance")
    ax.grid(True, linestyle="--", alpha=0.4)

    buf = io.BytesIO()
    fig.savefig(buf, format='png')
    buf.seek(0)
    img_base64 = base64.b64encode(buf.read()).decode('utf-8')
    plt.close(fig)

    return {
        "correlation": corr.round(4).to_dict(),
        "distance": dist.round(4).to_dict(),
        "ordered_assets": ordered_assets,
        "dendrogram": f"data:image/png;base64,{img_base64}"
    }

@app.route('/analyze', methods=['POST'])
def analyze():
    if 'file' not in request.files:
        return jsonify({"error": "Aucun fichier fourni"}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "Nom de fichier vide"}), 400

    try:
        xls = pd.ExcelFile(file)
        sheet_names = xls.sheet_names

        sheet_map = {
            ("USA", "Pré-COVID"): find_sheet(sheet_names, ["usa"], ["pre", "pré"]),
            ("USA", "COVID"): find_sheet(sheet_names, ["usa"], ["covid"]),
            ("USA", "Post-COVID"): find_sheet(sheet_names, ["usa"], ["post", "apres", "after"]),
            ("Tunisie", "Pré-COVID"): find_sheet(sheet_names, ["tunisie"], ["pre", "pré"]),
            ("Tunisie", "COVID"): find_sheet(sheet_names, ["tunisie"], ["covid"]),
            ("Tunisie", "Post-COVID"): find_sheet(sheet_names, ["tunisie"], ["post", "apres", "after"]),
        }

        results = {}
        for (country, period), sheet_name in sheet_map.items():
            if sheet_name is None:
                results[f"{country}_{period.replace('-', '_').lower()}"] = {"error": "Feuille non trouvée"}
                continue

            try:
                df = pd.read_excel(xls, sheet_name=sheet_name)
                assets = usa_assets if country == "USA" else tun_assets
                df, _ = load_sheet(df, assets)
                res = run_hrp(df, assets)
                results[f"{country}_{period.replace('-', '_').lower()}"] = res
            except Exception as e:
                results[f"{country}_{period.replace('-', '_').lower()}"] = {"error": str(e)}

        return jsonify(results)

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)