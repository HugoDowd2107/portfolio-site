# Card backgrounds

The project cards' gradient backgrounds are Figma shaders (`shaders/`), rendered once to
WebP images in `docs/images/card-bg-*.webp` rather than run live in the browser.

To re-render them after changing a shader's params in `render.js`:

1. From the repo root, run `python3 -m http.server 8000`
2. Open http://localhost:8000/tools/card-backgrounds/render.html in Chrome (needs WebGPU)
3. Download each image and replace the one with the same name in `docs/images`

Their opacity is set in CSS (`.project-card-shader` in `docs/css/site.css`), so it can
change without re-rendering.
