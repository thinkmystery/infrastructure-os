import type { APIRoute } from "astro";

export const prerender = false;

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
    },
  });

export const POST: APIRoute = async ({ request }) => {
  try {
    const token = import.meta.env.AIRTABLE_TOKEN;
    const baseId = import.meta.env.AIRTABLE_BASE_ID;
    const tableName = import.meta.env.AIRTABLE_NOTES_TABLE || "Founder Notes";

    if (!token || !baseId) {
      return json(
        {
          ok: false,
          error:
            "Missing Airtable settings. Confirm .env has AIRTABLE_TOKEN and AIRTABLE_BASE_ID, then restart npm run dev.",
        },
        500
      );
    }

    let body: any = {};
    try {
      body = await request.json();
    } catch {
      return json({ ok: false, error: "Invalid request body." }, 400);
    }

    const note = String(body.note || "").trim();
    const relatedType = String(body.relatedType || "").trim();
    const relatedName = String(body.relatedName || "").trim();
    const submittedBy = String(body.submittedBy || "Founder").trim();
    const priority = String(body.priority || "").trim();
    const sentiment = String(body.sentiment || "Comment").trim();
    const currentUrl = String(body.currentUrl || "").trim();

    if (!note) return json({ ok: false, error: "Note is required." }, 400);
    if (!relatedType || !relatedName) {
      return json({ ok: false, error: "Related record information is missing." }, 400);
    }

    const fields: Record<string, string> = {
      Note: note,
      "Related Record Type": relatedType,
      "Related Record Name": relatedName,
      "Submitted By": submittedBy,
      Sentiment: sentiment,
      Status: "New",
      "Source URL": currentUrl,
    };

    if (priority) fields.Priority = priority;

    const airtableUrl = `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(tableName)}`;

    const airtableResponse = await fetch(airtableUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        records: [{ fields }],
      }),
    });

    const responseText = await airtableResponse.text();

    let airtableData: any = null;
    try {
      airtableData = responseText ? JSON.parse(responseText) : null;
    } catch {
      airtableData = { raw: responseText };
    }

    if (!airtableResponse.ok) {
      return json(
        {
          ok: false,
          error:
            airtableData?.error?.message ||
            airtableData?.error?.type ||
            `Airtable rejected the note with status ${airtableResponse.status}.`,
          airtableStatus: airtableResponse.status,
          detail: airtableData,
        },
        502
      );
    }

    return json({
      ok: true,
      id: airtableData?.records?.[0]?.id || null,
    });
  } catch (error) {
    return json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Unknown server error.",
      },
      500
    );
  }
};
