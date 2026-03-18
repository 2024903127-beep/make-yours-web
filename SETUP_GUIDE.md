# MakeYourWeb — Deployment & Admin Setup Guide

## What You Have Now

```
makeyourweb/
├── index.html              ← Main portfolio (mobile-fixed ✅)
├── styles.css              ← Full responsive CSS ✅
├── script.js               ← Unchanged
├── admin/
│   ├── index.html          ← Login page (password: makeyourweb2025)
│   └── dashboard.html      ← Full admin panel ✅
└── demos/
    ├── hotel/
    ├── gym/
    ├── restaurant/
    ├── clinic/
    ├── education/
    ├── real-estate/
    └── business/
```

---

## Step 1 — Change Your Admin Password

Open `admin/index.html` and find this line near the bottom:

```js
const ADMIN_PASSWORD = 'makeyourweb2025';
```

Change it to whatever you want. Keep it private.

---

## Step 2 — Push to GitHub (One Time)

1. Go to https://github.com/new
2. Create a **private** repo named `makeyourweb`
3. Upload all your files (drag & drop on GitHub, or use Git)
4. Note your GitHub username and repo name

---

## Step 3 — Deploy on Netlify (Free, One Time)

1. Go to https://app.netlify.com
2. Click **"Add new site"** → **"Import an existing project"**
3. Choose **GitHub** → authorize → select your `makeyourweb` repo
4. Build settings: leave blank (it's a static site)
5. Click **"Deploy site"**
6. Your site goes live at a `.netlify.app` URL
7. Add your custom domain `makeyourweb.xyz` in Domain Settings

---

## Step 4 — Create a GitHub Personal Access Token (One Time)

1. Go to GitHub → Settings → Developer settings
2. → Personal access tokens → Tokens (classic)
3. → Generate new token
4. Give it a name like "makeyourweb-admin"
5. Set expiry: No expiration (or 1 year)
6. Check scope: ✅ `repo` (full repo access)
7. Click Generate and **copy the token** (starts with `ghp_`)

---

## Step 5 — Configure the Admin Panel

1. Go to `yourdomain.xyz/admin` on your live site
2. Log in with your password
3. Click **"GitHub & Deploy"** in the sidebar
4. Fill in:
   - GitHub Username: your-github-username
   - Repository Name: makeyourweb
   - Branch: main
   - Token: paste your `ghp_xxx` token
5. Click **Save Config**, then **Test Connection**
6. You should see "✓ Connected!"

---

## Adding a New Demo (Your Normal Workflow)

1. Build your new website (e.g. a portfolio for a bakery client)
2. Go to `yourdomain.xyz/admin` → **Upload Demo**
3. Drag & drop all the files (index.html, styles.css, etc.)
4. Fill in: Title, Slug (e.g. `demos/bakery`), Category, Color, Description
5. Click **Publish to GitHub**
6. Files upload to GitHub → Netlify auto-deploys in ~30 seconds
7. Done! The new demo is live at `makeyourweb.xyz/demos/bakery/`

---

## Hosting Cost

- **GitHub**: Free (private repos included)
- **Netlify**: Free (100GB bandwidth/month, plenty for this)
- **Domain**: You already have `makeyourweb.xyz`

**Total monthly cost: ₹0**

---

## Security Notes

- The admin panel uses `sessionStorage` for auth — it auto-logs out when you close the browser tab
- Your GitHub token is stored in `localStorage` in your browser only — never sent anywhere except GitHub's API
- The admin pages are just static HTML — they are publicly accessible by URL, but the password protects them
- For extra security later, you can add Netlify Identity or password-protect the `/admin` path in Netlify settings (free)
