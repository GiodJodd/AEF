# Giving clients access to the CMS (`/keystatic`)

The CMS is **git-based**: editors sign in with **GitHub**, and saving commits to the
`GiodJodd/AEF` repo, which triggers a redeploy. The "password screen" is GitHub's own
sign-in; access is controlled by who's a collaborator on the repo.

- **Dev (your machine):** storage is `local` — no login, edits write to the working tree.
- **Production:** storage switches to `github` automatically once
  `NEXT_PUBLIC_KEYSTATIC_GITHUB_APP_SLUG` (+ the other vars) are set.

The code is wired; you only need the three account steps below. `KEYSTATIC_SECRET` is
already generated in `.env.local` — reuse that same value on Vercel.

---

## Step 1 — Create the GitHub App (one time)

You need four values: `KEYSTATIC_GITHUB_CLIENT_ID`, `KEYSTATIC_GITHUB_CLIENT_SECRET`,
`NEXT_PUBLIC_KEYSTATIC_GITHUB_APP_SLUG`, and `KEYSTATIC_SECRET` (already generated).

### Option A — automated wizard (try first)
1. In `.env.local`, uncomment `NEXT_PUBLIC_KEYSTATIC_SETUP=true`, then `npm run dev`.
2. Open **http://localhost:3000/keystatic** → click **"Set up GitHub"** and follow it
   (it creates the App for you and shows the values).
3. Paste the three GitHub values into `.env.local`, then re-comment
   `NEXT_PUBLIC_KEYSTATIC_SETUP`.

> If `/keystatic` is blank in setup mode, just use Option B — it's reliable.

### Option B — create the App manually (reliable)
1. GitHub → **Settings → Developer settings → GitHub Apps → New GitHub App**.
2. Fill in:
   - **Name:** e.g. `AEF Keystatic`
   - **Homepage URL:** `https://aefproductions.com`
   - **Callback URL:** `https://aefproductions.com/api/keystatic/github/oauth/callback`
     (add a second one for local: `http://127.0.0.1:3000/api/keystatic/github/oauth/callback`)
   - ✅ **Request user authorization (OAuth) during installation**
   - **Webhook:** uncheck **Active**
   - **Permissions → Repository:** **Contents: Read & write**, **Metadata: Read-only**
     (add **Pull requests: Read & write** if you later want a review workflow)
   - **Where can this be installed:** Only on this account
3. **Create**, then: copy the **Client ID**, **Generate a client secret** (copy it), and
   note the **App slug** (the `…/apps/THE-SLUG` part of its public page).
4. **Install** the App on the **`GiodJodd/AEF`** repo.

---

## Step 2 — Set the four env vars

Add to **Vercel → your project → Settings → Environment Variables** (Production + Preview),
and to your local `.env.local`, then **redeploy**:

| Variable | Value |
|---|---|
| `KEYSTATIC_SECRET` | the value already in `.env.local` |
| `KEYSTATIC_GITHUB_CLIENT_ID` | from Step 1 |
| `KEYSTATIC_GITHUB_CLIENT_SECRET` | from Step 1 |
| `NEXT_PUBLIC_KEYSTATIC_GITHUB_APP_SLUG` | the App slug from Step 1 |

Setting the slug is what flips production to GitHub mode.

---

## Step 3 — Add editors + share the link

1. GitHub → `GiodJodd/AEF` → **Settings → Collaborators → Add people** → their username
   → **Write**. They accept the email invite.
   - CLI alternative: `gh api -X PUT repos/GiodJodd/AEF/collaborators/USERNAME -f permission=push`
2. Send them **https://aefproductions.com/keystatic** → they click **Sign in with GitHub**,
   authorize, and edit. Saves commit to the repo and auto-redeploy.

Each editor needs a **GitHub account** with write access to the repo.

---

## Notes

- Until the env vars are live, a deployed `/keystatic` has **no login** (renders read-only
  but is publicly viewable). Do Steps 1–2 before launch.
- `NEXT_PUBLIC_KEYSTATIC_SETUP` is dev-only (ignored in production builds).
- If GitHub accounts are too much friction for the AEF team, **Keystatic Cloud**
  (email-based team login, no GitHub accounts) is a config swap — ask the dev to switch
  `storage` to `{ kind: "cloud" }`.
