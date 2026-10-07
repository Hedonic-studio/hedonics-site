/* ============================================================
   HEDONICS · FOOTAGE
   This is the only file you edit to put video on the site.

   Paste a link between the quotes next to a slot name. Accepts:
     - YouTube:  https://www.youtube.com/watch?v=...  /  https://youtu.be/...  /  .../shorts/...
     - Vimeo:    https://vimeo.com/123456789
     - Your own file, uploaded into assets/video/:  "assets/video/hero.mp4"
     - A still image instead of video:  "assets/img/jake.jpg"

   Leave it as "" and the slot shows a labelled placeholder.
   Own .mp4 files: keep each under ~20 MB (GitHub refuses anything over 100 MB).
   The hero plays muted on a loop; everything else gets play controls.
   ============================================================ */

window.HEDONICS_FOOTAGE = {
  "hero-reel":   "assets/video/hero-reel.mp4",   // Top of the page · 16:9 showreel, 30–60s

  "case-psx":    "assets/img/case-psx.webp",   // PaulSklarXFit result · 9:16 vertical
  "case-cfws":   "assets/img/case-cfws-v2.webp",   // CrossFit Wilmington Strength · 16:9
  "case-tl":     "assets/img/case-tl-v2.webp",   // Transparent Labs Iceland BTS · 16:9

  "work-01":     "https://youtube.com/shorts/hK5U14LoKhA",   // Work grid · Reel 01 · 9:16 · gym promo
  "work-02":     "assets/img/work-02.webp",   // Work grid · Reel 02 · 9:16 · member testimonial
  "work-03":     "https://youtube.com/shorts/roi7cpzjThU",   // Work grid · Reel 03 · 9:16 · educational / talking head
  "work-04":     "https://youtu.be/VruJuE7d8vc",   // Work grid · Wide 01 · 16:9 · ad creative
  "work-05":     "https://youtu.be/8wsn8em40kA",   // Work grid · Wide 02 · 16:9 · organic-style ad (Q&A)

  "about-photo": "assets/img/about-jake.webp"    // About section · 4:5 portrait of you
};

/* Custom thumbnails for the YouTube spots (shown with the play button until clicked).
   Leave a spot out and it uses YouTube's own thumbnail. */
window.HEDONICS_POSTERS = {
  "work-01": "assets/img/work-01-v2.webp",
  "work-03": "assets/img/work-03-v2.webp",
  "work-04": "assets/img/work-04-v2.webp",
  "work-05": "assets/img/work-05-v2.webp"
};
