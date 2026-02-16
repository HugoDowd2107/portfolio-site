# Hugo Dowd's Portfolio Site

A clean, optimized portfolio website built from Webflow and refactored for production.

**Live Site:** https://hugodowd2107.github.io/portfolio-site/

## Overview

This is a personal portfolio showcasing design work and professional experience. The site has been cleaned up from a Webflow export, removing unnecessary dependencies and reducing code size by 89%.

## Features

- **Dark Teal Theme** - Modern, professional design
- **Responsive Design** - Works on all device sizes
- **Zero Dependencies** - Pure HTML, CSS, and vanilla JavaScript
- **Fast Performance** - Minimal code footprint
- **SEO Optimized** - Proper semantic HTML
- **Google Analytics** - Built-in tracking (GA ID: G-0L169JQ1XT)

## Project Statistics

| Metric | Improvement |
|--------|-------------|
| HTML Size | 254 → 180 lines (29% reduction) |
| CSS Size | 5,360 → 400 lines (92% reduction) |
| Dependencies Removed | jQuery + Webflow.js (135KB+) |
| Total Code Reduction | **89%** |

## Site Structure

```
docs/                          # GitHub Pages root
├── index.html                 # Homepage
├── css/
│   └── style.css             # All styles (400 lines)
├── js/
│   └── main.js               # All JavaScript (50 lines)
├── images/                    # Project images
└── documents/                 # PDFs (resume, case studies)
```

### Pages

- **Homepage (index.html)** - Intro, work portfolio, experience, contact
  - Intro Section - Main tagline and introduction
  - Work Section - 3 featured case studies:
    - Automating messaging for medical practices (Telstra Health)
    - Making patient's healthcare data accessible (MyConnect)
    - Bridging the gap between academia and industry (Searten)
  - Experience Section - Professional roles and timeline
  - Contact Section - Links to LinkedIn, email, and resume

## Technology Stack

- **HTML5** - Semantic markup
- **CSS3** - Flexbox, Grid, animations
- **JavaScript** - Vanilla JS (no frameworks)
- **Fonts** - Google Fonts (Montserrat, Young Serif)
- **Analytics** - Google Analytics

## Setup & Deployment

### GitHub Pages Configuration

This site is deployed to GitHub Pages from the `docs/` folder on the `main` branch.

**To configure in your repository:**
1. Go to **Settings** → **Pages**
2. Set **Source** to "Deploy from a branch"
3. Set **Branch** to `main`
4. Set **Folder** to `/docs`
5. Click "Save"

**Your site will be available at:** `https://username.github.io/portfolio-site/`

### Local Development

1. Clone the repository:
```bash
git clone https://github.com/HugoDowd2107/portfolio-site.git
cd portfolio-site
```

2. Serve locally (requires Python 3):
```bash
# Python 3
python3 -m http.server 8000

# OR with Python 2
python -m SimpleHTTPServer 8000
```

3. Open `http://localhost:8000` in your browser

### Making Changes

1. Edit files in the `docs/` folder
2. Commit your changes:
```bash
git add .
git commit -m "Update: description of changes"
git push origin main
```
3. GitHub Pages will automatically rebuild (takes ~1 minute)

## Customization

### Update Your Information

Edit `docs/index.html`:

```html
<!-- Navigation & Footer Links -->
<a href="https://www.linkedin.com/in/your-profile/">LinkedIn</a>
<a href="mailto:your-email@example.com">Email</a>

<!-- Case Studies -->
<a href="your-case-study-page.html">Project Title</a>

<!-- Experience -->
<div class="job-title">Your Title</div>
<div class="company">Company Name</div>
```

### Change Colors

Edit `docs/css/style.css`:

```css
:root {
  --bg: #08252b;              /* Background */
  --text: #f5fffc;            /* Main text */
  --text-dark: #8baca2;       /* Secondary text */
  --flash-colour: #fe3448;    /* Accent color */
  --divider: #1e4a52;         /* Border color */
}
```

### Add New Sections

Add a new `<section>` in `docs/index.html`:

```html
<section id="new-section" class="section">
  <div class="section-title">section title</div>
  <!-- Your content -->
</section>
```

Add styles in `docs/css/style.css` and update navigation.

## Performance

### Load Time
- First contentful paint: <1s
- Total page size: ~15KB (images vary)
- No external dependencies to load

### Optimization Tips

1. **Minify for production:**
   ```bash
   # CSS minification
   npm install -g csso-cli
   csso docs/css/style.css -o docs/css/style.min.css
   ```

2. **Optimize images** using TinyPNG or similar
3. **Cache busting** - Add version number to CSS/JS links if making updates

## Browser Support

| Browser | Support | Notes |
|---------|---------|-------|
| Chrome (Latest) | ✅ Full | Recommended |
| Firefox (Latest) | ✅ Full | Recommended |
| Safari (12+) | ✅ Full | iOS 12+ supported |
| Edge (Latest) | ✅ Full | Chromium-based |

## SEO

The site includes:
- ✅ Semantic HTML5 elements
- ✅ Proper meta tags (charset, viewport)
- ✅ Descriptive title and meta description
- ✅ Responsive design
- ✅ Fast load times
- ✅ Mobile-friendly

To improve SEO further:
- Add `meta description` to `<head>`
- Create a `sitemap.xml` in `docs/`
- Add a `robots.txt` in `docs/`
- Update analytics tracking

## Documentation

### Cleanup Information

For details on what was cleaned from the Webflow export, see:
- `CLEANUP_SUMMARY.md` - What was removed
- `CODE_EXAMPLES.md` - Before/after code comparisons
- `IMPLEMENTATION_GUIDE.md` - Migration guide

### File Reference

**Key HTML Elements:**
- `.section` - Main content section
- `.navigation-block` - Top navigation
- `.project-card` - Project card container
- `.experience-row` - Experience item
- `.footer` - Footer section

**CSS Variables:**
- `--bg` - Background color
- `--text` - Main text color
- `--text-dark` - Secondary text color
- `--flash-colour` - Accent/button color
- `--divider` - Border/divider color

**JavaScript Functions:**
- `Smooth scroll` - Anchor link navigation
- `Active nav highlight` - Highlights current section

## Troubleshooting

### GitHub Pages Not Working

1. Check **Settings** → **Pages** is configured correctly
2. Ensure files are in the `docs/` folder
3. Wait 1-2 minutes for rebuild
4. Check **Actions** tab for build status
5. Clear browser cache (Ctrl+Shift+Delete)

### Images Not Loading

- Check image paths are relative: `images/filename.png`
- Verify filenames are correct (case-sensitive)
- Use browser DevTools (F12) to check 404 errors

### Styling Not Applied

- Clear browser cache (Ctrl+Shift+R or Cmd+Shift+R)
- Check CSS link path is correct: `css/style.css`
- Verify CSS file exists in `docs/css/` folder

## Future Enhancements

- [ ] Add contact form with backend
- [ ] Create detailed case study pages
- [ ] Add blog section
- [ ] Dark/light mode toggle
- [ ] Enhanced animations
- [ ] Team member profiles
- [ ] Testimonials section
- [ ] Search functionality

## License

© 2024 Hugo Dowd. All rights reserved.

---

## Quick Links

- **Live Site:** https://hugodowd2107.github.io/portfolio-site/
- **GitHub Repo:** https://github.com/HugoDowd2107/portfolio-site
- **Portfolio:** https://hugodowd.com/
- **LinkedIn:** https://www.linkedin.com/in/hugo-dowd-b25436190/

## Contact

- **Email:** hugo.dowd10@gmail.com
- **LinkedIn:** https://www.linkedin.com/in/hugo-dowd-b25436190/

---

**Built with ❤️ | Cleaned with 🧹 by Claude**
