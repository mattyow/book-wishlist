import { getStore } from "@netlify/blobs";

// The whole list is stored as one JSON record. Per-user key leaves room to add
// multiple users later (e.g. keyed by an authenticated user id) without a rewrite.
const RECORD_KEY = "books";

export default async (req, context) => {
  // "strong" consistency so a save is immediately readable on another device.
  const store = getStore({ name: "reading-list", consistency: "strong" });

  // Reads are public — anyone with the URL can view the list.
  if (req.method === "GET") {
    const data = await store.get(RECORD_KEY, { type: "json" });
    return Response.json(Array.isArray(data) ? data : []);
  }

  // Writes require the owner's passphrase (data safety, not privacy):
  // this stops a random visitor from overwriting or wiping the list.
  if (req.method === "PUT") {
    const secret = process.env.LIST_SECRET;
    if (!secret) {
      return Response.json(
        { error: "Server not configured. Set the LIST_SECRET environment variable in Netlify." },
        { status: 500 }
      );
    }
    if (req.headers.get("x-list-key") !== secret) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    let body;
    try {
      body = await req.json();
    } catch {
      return Response.json({ error: "Invalid JSON" }, { status: 400 });
    }
    if (!Array.isArray(body)) {
      return Response.json({ error: "Expected an array of books" }, { status: 400 });
    }
    await store.setJSON(RECORD_KEY, body);
    return Response.json({ ok: true, count: body.length });
  }

  return Response.json({ error: "Method not allowed" }, { status: 405 });
};

export const config = { path: "/api/list" };
