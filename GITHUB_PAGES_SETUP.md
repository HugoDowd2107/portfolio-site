# GitHub Pages Setup Guide

This guide will help you set up and deploy your portfolio site on GitHub Pages.

## What is GitHub Pages?

GitHub Pages is a free static site hosting service that publishes any HTML, CSS, and JavaScript files pushed to a GitHub repository.

**Your site will be live at:** `https://HugoDowd2107.github.io/portfolio-site/`

## Prerequisites

✅ GitHub account (you already have one!)
✅ Repository: `HugoDowd2107/portfolio-site`
✅ Files in `docs/` folder

## Setup Instructions

### Step 1: Configure GitHub Pages Settings

1. Go to your repository: https://github.com/HugoDowd2107/portfolio-site
2. Click **Settings** tab
3. In the left sidebar, click **Pages**
4. Under "Source", select:
   - **Branch:** `main`
   - **Folder:** `/docs`
5. Click **Save**

GitHub will now build and deploy your site automatically.

### Step 2: Wait for Deployment

1. You'll see a message: "Your site is live at https://hugodowd2107.github.io/portfolio-site/"
2. Wait 1-2 minutes for the first build to complete
3. Check the **Actions** tab to monitor build progress

### Step 3: Verify Your Site

- Visit: https://hugodowd2107.github.io/portfolio-site/
- Test all navigation links
- Check on mobile (responsive design)
- Verify images load correctly

## File Structure

Your `docs/` folder should look like this:

```
docs/
├── index.html                 # Homepage (required)
├── css/
│   └── style.css             # Stylesheet
├── js/
│   └── main.js               # JavaScript
├── images/                    # All images
│   ├── safari-frame.png
│   ├── myconnect-frame.png
│   ├── searten-frame.png
│   └── ... (other images)
└── documents/                 # PDFs
    ├── resume-hugodowd-pd-uk.pdf
    ├── myconnect-case-study.pdf
    └── searten-case-study.pdf
```

## Making Updates

Any changes pushed to the `docs/` folder in the `main` branch will automatically rebuild your site.

### To update your site:

```bash
# Edit files in docs/
# For example: docs/index.html

# Stage changes
git add docs/

# Commit
git commit -m "Update: description of changes"

# Push to GitHub
git push origin main
```

**The site rebuilds automatically** (usually within 1-2 minutes).

You can monitor the build in the **Actions** tab of your repository.

## Deployment Status

To check if your site deployed successfully:

1. Go to your repository
2. Click the **Actions** tab
3. Look for the latest workflow run
4. It should show a ✅ green checkmark

If it shows ❌, click on the failed job to see error details.

## Custom Domain (Optional)

To use a custom domain like `hugodowd.com`:

1. In **Settings** → **Pages**, scroll to "Custom domain"
2. Enter your domain: `hugodowd.com`
3. Click **Save**
4. GitHub will show DNS configuration instructions
5. Update your domain DNS records accordingly

Once DNS propagates (10 minutes to 48 hours):
- Your site will be available at `https://hugodowd.com`
- GitHub Pages provides free HTTPS/SSL certificate

## Troubleshooting

### Site Not Loading

**Check 1:** Is GitHub Pages enabled?
- Go to **Settings** → **Pages**
- Verify **Branch:** `main`, **Folder:** `/docs`

**Check 2:** Did the build succeed?
- Click **Actions** tab
- Check latest deployment workflow
- Look for ✅ or ❌ status

**Check 3:** Are the files in the right place?
```bash
# From your repo root, run:
ls -la docs/
ls -la docs/css/
ls -la docs/js/
```

### Images Not Loading

1. Check browser console (F12 → Network tab)
2. Look for 404 errors on images
3. Verify paths in HTML are correct:
   ```html
   <!-- Correct -->
   <img src="images/filename.png" alt="...">

   <!-- Incorrect -->
   <img src="./images/filename.png" alt="...">
   <img src="/images/filename.png" alt="...">
   ```

### CSS Not Styling

1. Hard refresh browser: `Ctrl+Shift+R` (or `Cmd+Shift+R` on Mac)
2. Check DevTools (F12) → Network tab
3. Verify CSS file path in HTML: `css/style.css`
4. Check file size: should be ~7KB

### Build Takes Too Long

- GitHub Pages builds usually take 1-2 minutes
- Max wait time is ~10 minutes
- If longer, check the **Actions** tab for errors

## Performance Monitoring

### Check Your Site Speed

1. **Google PageSpeed Insights:** https://pagespeed.web.dev/
   - Enter your GitHub Pages URL
   - Get performance recommendations

2. **GTmetrix:** https://gtmetrix.com/
   - Analyze site performance
   - See waterfall chart

3. **WebPageTest:** https://www.webpagetest.org/
   - Detailed performance analysis

### Expected Performance

Your site should load in:
- **First Contentful Paint:** <1 second
- **Total Page Load:** 2-3 seconds
- **Page Size:** ~15KB (without images)

## Analytics

Google Analytics is already configured with ID: `G-0L169JQ1XT`

To view analytics:
1. Go to Google Analytics: https://analytics.google.com/
2. Select the property: "Hugo Dowd's Portfolio"
3. View real-time visitors and page views

To update the GA ID:
1. Edit `docs/index.html`
2. Find the script tag with `gtag.js`
3. Change `G-0L169JQ1XT` to your new ID

## SEO & Visibility

To improve search visibility:

### 1. Add Meta Tags

Edit `docs/index.html` `<head>`:
```html
<meta name="description" content="Product Designer specializing in healthcare UX. View my portfolio work.">
<meta name="keywords" content="Product Designer, Healthcare, UX Design, Portfolio">
<meta name="author" content="Hugo Dowd">
```

### 2. Create sitemap.xml

Create `docs/sitemap.xml`:
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://hugodowd2107.github.io/portfolio-site/</loc>
    <lastmod>2024-02-16</lastmod>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
```

### 3. Create robots.txt

Create `docs/robots.txt`:
```
User-agent: *
Allow: /
Sitemap: https://hugodowd2107.github.io/portfolio-site/sitemap.xml
```

### 4. Submit to Search Engines

- **Google:** https://search.google.com/search-console
- **Bing:** https://www.bing.com/webmasters

## Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| Site shows 404 | Files must be in `docs/` folder |
| Build failed | Check GitHub Actions tab for error messages |
| Images broken | Use relative paths: `images/filename.png` |
| CSS not working | Hard refresh: `Ctrl+Shift+R` or clear cache |
| Domain not working | Wait 24-48 hours for DNS propagation |
| Redirect not working | Check custom domain config in Settings |

## Advanced: Using a Custom Workflow

If you want more control, create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./docs
```

This gives you more control over the build process.

## Useful Links

- **GitHub Pages Docs:** https://docs.github.com/en/pages
- **Deploy to GitHub Pages:** https://docs.github.com/en/pages/getting-started-with-github-pages
- **Configure Custom Domain:** https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site

## Next Steps

1. ✅ Configure GitHub Pages settings
2. ✅ Verify site is live at https://hugodowd2107.github.io/portfolio-site/
3. ✅ Test all links and functionality
4. ✅ Submit to Google Search Console
5. ✅ Share your portfolio!

---

**Your portfolio is now live on GitHub Pages! 🎉**

Share the link: https://hugodowd2107.github.io/portfolio-site/
