# Getting aefproductions.com indexed by Google

**TL;DR — the site has no SEO bug.** It's fully crawlable and correctly tagged for
indexing. It just hadn't been *submitted* to Google yet. The fix is a one-time Google
Search Console setup, not a code change.

## How we know the site is technically fine

Checked against the **live** site (including requests pretending to be Googlebot):

| Check | Result |
| --- | --- |
| `robots.txt` | ✅ Allows crawling (only `/keystatic` and `/api/` are blocked) |
| `sitemap.xml` | ✅ Live and valid — lists all pages |
| Homepage as Googlebot | ✅ HTTP 200 (no password / Vercel-protection wall) |
| `<meta name="robots">` | ✅ `index, follow` on every page |
| `<link rel="canonical">` | ✅ `https://aefproductions.com` |
| `noindex` anywhere | ✅ Zero occurrences |
| Title / description / JSON-LD | ✅ All present |
| DNS → Vercel, `www → apex` 301 | ✅ Correct |

The only missing piece was that Google had simply never been told the site exists. For a
brand-new domain with few inbound links, Google can take days–weeks to discover a site on
its own — Search Console skips that wait.

## ⚠️ Important: where DNS lives

DNS for `aefproductions.com` is managed at **Wix** (nameservers `ns0.wixdns.net` /
`ns1.wixdns.net`).

- The **website** is hosted on **Vercel** (A record → `216.198.79.1`).
- **Email** runs through **register.it** (SPF record).
- But **all DNS records are edited in the Wix panel** — *not* register.it, *not* Vercel.

So any DNS change (including the Google verification record below) goes in **Wix**, even
though Google's setup dialog gives "GoDaddy / Namecheap" as generic examples.

## Runbook

### 1. Verify the domain in Google Search Console (one time)
1. Go to **https://search.google.com/search-console** → Add property → **Domain** →
   enter `aefproductions.com`.
2. Google shows a **TXT record** like `google-site-verification=…`. Click **COPY** (the
   value is long — always copy, never retype).
3. In **Wix → Domains → aefproductions.com → Edit DNS → DNS Records**, under **TXT**,
   click **Add Record**:
   - **Host name:** `@`
   - **Value:** paste the `google-site-verification=…` string
   - **TTL:** default
   - ⚠️ There's already a TXT record there (the email SPF, `v=spf1…`). **Add a new
     record — do not overwrite it.** Both TXT records can coexist.
4. **Save** in Wix, wait ~5–15 minutes, then click **VERIFY** in Search Console. If it
   says "not found," that's just DNS propagation lag — wait an hour and retry. Don't
   delete anything.

> The verification string is **not a secret** — it's meant to sit publicly in DNS. Adding
> it does not affect the website or email; it only proves you own the domain.

### 2. Submit the sitemap
Search Console → **Sitemaps** → enter `sitemap.xml` → **Submit**. Expect "Success" with
all pages discovered.

### 3. Request indexing of the key pages
Search Console → **URL Inspection** → paste `https://aefproductions.com/` →
**Request indexing**. Repeat for `/projects` and one or two film pages. This nudges Google
to crawl now instead of waiting.

### 4. Monitor
Watch the **Pages** (Coverage) report in Search Console over the next few days to ~2
weeks. New domains index gradually — don't expect instant results.

### 5. (Optional) Speed up discovery
Add a few inbound links to the site — Instagram bio, Letterboxd, an IMDb company page,
partner/festival sites. More links = faster, more thorough crawling. Once those profiles
exist, we can also wire them into `SOCIAL_LINKS` in `src/lib/site.ts` so they appear as
`sameAs` in the site's Organization structured data (helps Google's knowledge graph).

## How to confirm it worked
- Terminal: `host -t TXT aefproductions.com` shows the `google-site-verification=…` record
  next to the SPF record.
- Search Console shows the property as **Verified** and the sitemap as **Success**.
- Within days, `site:aefproductions.com` on Google starts returning pages, and the **Pages**
  report lists indexed URLs.

## Notes for future maintainers
- No redeploy is needed for any of this — it's all DNS + Search Console.
- The codebase *also* supports the alternative meta-tag verification method via the
  `GOOGLE_SITE_VERIFICATION` env var (wired in `src/app/layout.tsx`), but the Domain/DNS
  method above is stronger and preferred, so that env var can stay unset.
- Canonical identity (URL, sitemap, robots) is centralized in `src/lib/site.ts`,
  `src/app/sitemap.ts`, and `src/app/robots.ts`.
