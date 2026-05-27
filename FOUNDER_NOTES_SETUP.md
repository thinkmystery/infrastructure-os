# Founder Notes Setup

Create an Airtable table named:

Founder Notes

Recommended fields:

- Note — Long text
- Related Record Type — Single select or text
- Related Record Name — Single line text
- Submitted By — Single line text
- Sentiment — Single select
- Priority — Single select or text
- Status — Single select
- Source URL — URL

Then create an Airtable personal access token with permission to create records in the base.

Add these environment variables locally and in Vercel:

AIRTABLE_TOKEN
AIRTABLE_BASE_ID
AIRTABLE_NOTES_TABLE

Default table name is Founder Notes.
