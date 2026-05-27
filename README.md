# Infrastructure OS Dashboard

Standalone Astro/Vercel project generated from Airtable CSV exports.

## Local setup

```bash
npm install
npm run dev
```

Open the local URL Astro prints in the terminal.

## Deploy to a new Vercel project

1. Create a new GitHub repo, for example `infrastructure-os-dashboard`.
2. Put these files in that repo.
3. Push to GitHub.
4. In Vercel, click **Add New Project** and import that repo.
5. Use the default Vercel settings:
   - Framework Preset: Astro
   - Build Command: `npm run build`
   - Output Directory: `dist`
6. Deploy.

## Updating the Airtable data

For now this is a static CSV/JSON version. To update the dashboard:

1. Export the Airtable tables as CSV.
2. Replace the matching CSV files in the project root.
3. Run:

```bash
python convert_csv_to_json.py
```

4. Commit and push.

The dashboard reads from `src/data/infrastructure/*.json`.
