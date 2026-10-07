/* Hedonics · site behaviour: footage slots, mobile nav, Game Film request form. */
(function () {
  "use strict";

  /* ---------- Config ---------- */
  var CONTACT_EMAIL = "jake@hedonicsmarketing.studio";
  // Optional: paste a Formspree (or similar) endpoint here and the form will submit
  // straight to your inbox without opening the visitor's email app.
  var FORM_ENDPOINT = "";

  /* ---------- Footage slots ---------- */
  var FOOTAGE = window.HEDONICS_FOOTAGE || {};

  function youtubeId(url) {
    var m = url.match(/(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/)|youtu\.be\/)([\w-]{6,})/);
    return m ? m[1] : null;
  }
  function vimeoId(url) {
    var m = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
    return m ? m[1] : null;
  }

  /* Clean YouTube preview: thumbnail + play button; the real player loads on click. */
  function ytFacade(slot, id) {
    var tall = slot.classList.contains("slot--9x16");
    var label = slot.getAttribute("data-label") || "video";
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "yt-facade";
    btn.setAttribute("aria-label", "Play video: " + label);
    var img = document.createElement("img");
    var fallback = "https://i.ytimg.com/vi/" + id + "/hqdefault.jpg";
    img.alt = "";
    img.loading = "lazy";
    img.decoding = "async";
    img.onload = function () { if (img.naturalWidth <= 120 && img.src !== fallback) img.src = fallback; };
    img.onerror = function () { if (img.src !== fallback) img.src = fallback; };
    var poster = (window.HEDONICS_POSTERS || {})[slot.getAttribute("data-footage")];
    img.src = poster || ("https://i.ytimg.com/vi/" + id + "/" + (tall ? "oar2.jpg" : "maxresdefault.jpg"));
    var play = document.createElement("span");
    play.className = "yt-facade__play";
    play.setAttribute("aria-hidden", "true");
    btn.appendChild(img);
    btn.appendChild(play);
    btn.addEventListener("click", function () {
      var f = document.createElement("iframe");
      f.src = "https://www.youtube-nocookie.com/embed/" + id + "?autoplay=1&rel=0&modestbranding=1&playsinline=1";
      f.allow = "autoplay; encrypted-media; picture-in-picture; fullscreen";
      f.allowFullscreen = true;
      f.title = label;
      slot.replaceChild(f, btn);
    });
    return btn;
  }

  function fill(slot) {
    var key = slot.getAttribute("data-footage");
    var src = (FOOTAGE[key] || "").trim();
    var isHero = key === "hero-reel";

    if (!src) {
      slot.classList.add("slot--empty");
      var cap = document.createElement("span");
      cap.className = "slot__cap";
      cap.textContent = "Footage · " + (slot.getAttribute("data-label") || key);
      slot.appendChild(cap);
      return;
    }

    var el, yt = youtubeId(src), vm = vimeoId(src);
    if (yt && !isHero) { slot.appendChild(ytFacade(slot, yt)); return; }
    if (yt) {
      el = document.createElement("iframe");
      el.src = "https://www.youtube-nocookie.com/embed/" + yt + "?rel=0&modestbranding=1&playsinline=1" +
        (isHero ? "&autoplay=1&mute=1&loop=1&controls=0&playlist=" + yt : "");
      el.allow = "autoplay; encrypted-media; picture-in-picture; fullscreen";
      el.loading = isHero ? "eager" : "lazy";
      el.title = slot.getAttribute("data-label") || "Video";
    } else if (vm) {
      el = document.createElement("iframe");
      el.src = "https://player.vimeo.com/video/" + vm + (isHero ? "?autoplay=1&muted=1&loop=1&background=1" : "?dnt=1");
      el.allow = "autoplay; fullscreen; picture-in-picture";
      el.loading = isHero ? "eager" : "lazy";
      el.title = slot.getAttribute("data-label") || "Video";
    } else if (/\.(jpe?g|png|webp|avif|gif)$/i.test(src)) {
      el = document.createElement("img");
      el.src = src;
      el.alt = slot.getAttribute("data-label") || "";
      el.loading = "lazy";
    } else {
      el = document.createElement("video");
      el.src = src;
      el.playsInline = true;
      el.preload = "metadata";
      if (isHero) {
        el.muted = true; el.defaultMuted = true; el.setAttribute("muted", "");
        el.autoplay = true; el.loop = true; el.preload = "auto";
        var kick = function () { var p = el.play(); if (p && p.catch) p.catch(function () {}); };
        el.addEventListener("canplay", kick, { once: true });
        setTimeout(kick, 0);
      }
      else { el.controls = true; }
    }
    slot.appendChild(el);
  }

  Array.prototype.forEach.call(document.querySelectorAll("[data-footage]"), fill);

  /* ---------- Mobile nav ---------- */
  var toggle = document.querySelector(".nav__toggle");
  var menu = document.getElementById("nav-menu");
  if (toggle && menu) {
    toggle.addEventListener("click", function () {
      var open = menu.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    menu.addEventListener("click", function (e) {
      if (e.target.tagName === "A") {
        menu.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* ---------- Game Film request ---------- */
  var form = document.getElementById("gf-form");
  var note = document.getElementById("gf-note");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var ok = true;
      Array.prototype.forEach.call(form.querySelectorAll("input[required]"), function (input) {
        var bad = !input.value.trim() || (input.type === "email" && !/^\S+@\S+\.\S+$/.test(input.value));
        input.setAttribute("aria-invalid", bad ? "true" : "false");
        if (bad) ok = false;
      });
      if (!ok) { note.textContent = "Fill in the highlighted fields."; return; }

      var d = {
        gym: form.gym.value.trim(), ig: form.ig.value.trim(),
        email: form.email.value.trim(), site: form.site.value.trim()
      };

      if (FORM_ENDPOINT) {
        fetch(FORM_ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json", "Accept": "application/json" },
          body: JSON.stringify(d)
        }).then(function (r) {
          if (!r.ok) throw new Error();
          form.reset();
          note.textContent = "Got it. Your Game Film is on the way within two business days.";
        }).catch(function () {
          note.textContent = "That didn't send. Email " + CONTACT_EMAIL + " instead.";
        });
        return;
      }

      var body =
        "Gym: " + d.gym + "\n" +
        "Instagram: " + d.ig + "\n" +
        "Email: " + d.email + "\n" +
        (d.site ? "Website / Google listing: " + d.site + "\n" : "") +
        "\nI'd like a Game Film.";
      window.location.href = "mailto:" + CONTACT_EMAIL +
        "?subject=" + encodeURIComponent("Game Film request · " + d.gym) +
        "&body=" + encodeURIComponent(body);
      note.textContent = "Your email app should open with the request filled in. Hit send and you're done.";
    });
  }

  /* ---------- Mobile button: hide it while a Game Film button is already on screen ---------- */
  var mcta = document.querySelector(".mobile-cta");
  if (mcta && "IntersectionObserver" in window) {
    var onScreen = [];
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        var i = onScreen.indexOf(e.target);
        if (e.isIntersecting && i < 0) onScreen.push(e.target);
        if (!e.isIntersecting && i > -1) onScreen.splice(i, 1);
      });
      mcta.classList.toggle("is-hidden", onScreen.length > 0);
    });
    [".hero__ctas", "#svc-game-film", "#game-film"].forEach(function (sel) {
      var el = document.querySelector(sel); if (el) io.observe(el);
    });
  }

  /* ---------- Problem section: draw the upward break when it scrolls into view ---------- */
  var contrast = document.querySelector(".contrast");
  if (contrast && "IntersectionObserver" in window) {
    contrast.classList.add("contrast--anim");
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { contrast.classList.add("is-in"); cio.disconnect(); } });
    }, { threshold: 0.35 });
    cio.observe(contrast);
  }

  /* ---------- Year ---------- */
  var yr = document.getElementById("yr");
  if (yr) yr.textContent = new Date().getFullYear();
})();
