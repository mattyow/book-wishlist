# The Reading List

A public book wishlist with cloud sync and catalog search. Anyone with the URL
can view it; only you can edit it. Your list lives in Netlify Blobs, so it's the
same on your phone and your computer. Search pulls real books (title, author,
cover, ISBN) from the Open Library catalog.

## What's in here

```
reading-list/
├── public/
│   └── index.html          ← the whole frontend (fonts embedded)
├── netlify/
│   └── functions/
│       └── list.mjs         ← reads/writes your list to Netlify Blobs
├── netlify.toml             ← tells Netlify where things live
├── package.json             ← function dependencies
└── README.md
```

## Viewing vs. editing

- **Viewing is open.** Anyone who opens the URL sees the list, read-only. No
  passphrase needed.
- **Editing is protected.** This isn't about privacy — it stops a random visitor
  from overwriting or deleting your list. You set an edit passphrase as an
  environment variable called `LIST_SECRET` in Netlify. On your own device, click
  **"Edit list"**, enter it once, and the editing controls appear. "Done editing"
  locks it again.

Viewing works even if `LIST_SECRET` is never set; you just won't be able to save
changes until it is.

---

## Deploy option A — Git (recommended)

1. Put this folder in a GitHub repo (create a repo, drop these files in, commit, push).
2. In Netlify: **Add new site → Import an existing project →** pick the repo.
3. Leave build settings as detected (the `netlify.toml` handles them).
4. Before/after the first deploy, go to **Site configuration → Environment variables**
   and add:
   - Key: `LIST_SECRET`
   - Value: *(any passphrase you choose — this is your edit key)*
5. Trigger a redeploy if you added the variable after deploying.


Updates later: just push to the repo; Netlify rebuilds automatically.

## Deploy option B — Netlify CLI (no Git)

```bash
npm install -g netlify-cli
cd reading-list
netlify deploy --build        # follow prompts; creates/links a site
netlify env:set LIST_SECRET "your-chosen-passphrase"
netlify deploy --build --prod # publish to the live URL
```

To run it locally while you tinker:

```bash
netlify dev                   # serves the site + functions at localhost
```

---

## First use

1. Open the site — the list shows immediately, read-only.
2. Click **"Edit list"** (top right) and enter your `LIST_SECRET` passphrase. The
   editing controls appear; "Done editing" hides them again.
3. Search a title in the top box, click **add +** on the right match.
4. "add by hand instead" lets you type a book manually; "or paste a list" takes
   a whole block of titles at once (one per line, `Title — Author`).
5. **Export CSV** (top toolbar) downloads your whole list as `Title, Author, ISBN`
   — opens cleanly in Excel, Numbers, or Google Sheets. ISBNs are filled in for
   books added via catalog search; manually-added books have an optional ISBN field.
   Export is available to anyone viewing, not just editors.

## Notes

- **Storage:** Netlify Blobs is zero-config — nothing to provision, it just works
  once the function is deployed. The whole list is stored as one JSON record under
  the key `books` in a store named `reading-list`.
- **Covers & data** come from Open Library (openlibrary.org), a free public catalog.
  No API key needed. Google Books is used as an automatic fallback: if a search
  returns nothing on Open Library, results come from Google Books instead, and when
  you add a book Open Library has no ISBN for, Google is checked to fill it in. This
  runs keyless (fine for personal volume); for higher/guaranteed quota you can paste
  a referrer-restricted Google Books API key into the `GBKEY` constant near the
  catalog-search code in `index.html`.
- **Going multi-user later:** the public-read / owner-edit model here is the right
  default for that future — each person's list would be viewable by default, with
  only its owner able to edit. The data is already stored under a record key, so
  adding per-user accounts is an extension rather than a rebuild — though real
  accounts mean adding a login system, which is a meaningfully bigger project.
- **Fonts** (Monarcha, Mint Book) are embedded directly in `index.html`. You confirmed
  you hold the web licenses for both.
