import pandas as pd
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent
CSV_TO_JSON = {
    "Initiatives-Grid view.csv": "src/data/infrastructure/initiatives.json",
    "Resources-Grid view.csv": "src/data/infrastructure/resources.json",
    "Decisions-Grid view.csv": "src/data/infrastructure/decisions.json",
    "Open Questions-Grid view.csv": "src/data/infrastructure/questions.json",
}

def clean(value):
    if pd.isna(value):
        return ""
    if isinstance(value, str):
        return value.strip()
    return value

for csv_name, output_name in CSV_TO_JSON.items():
    csv_path = ROOT / csv_name
    output_path = ROOT / output_name

    if not csv_path.exists():
        print(f"Skipping missing file: {csv_path}")
        continue

    df = pd.read_csv(csv_path).fillna("")
    records = [{key: clean(value) for key, value in row.items()} for row in df.to_dict(orient="records")]
    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(json.dumps(records, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"Wrote {output_path}")
