# hedonicsmarketing.studio

Static site for Hedonics Video Marketing. Plain HTML/CSS/JS, no build step. Hosted on GitHub Pages.

- `index.html`: the page
- `assets/js/footage.js`: **the only file to edit to add video.** Paste YouTube/Vimeo links or `assets/video/yourfile.mp4` paths.
- `assets/video/`: drop your own compressed .mp4 files here (keep each under ~20 MB; GitHub rejects files over 100 MB)
- `assets/css/site.css`: styles, built on Brand System V4 tokens
- `assets/js/site.js`: footage loader, mobile menu, Game Film form. Set `FORM_ENDPOINT` to a Formspree URL to have the form email you directly.

Fonts: Archivo and Inter Tight, self-hosted under the SIL Open Font License (see `assets/fonts/`).
