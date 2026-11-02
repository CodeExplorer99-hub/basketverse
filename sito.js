// BasketVerse — script del sito: menu mobile, spoiler, testata, comparsa delle schede.
(function () {
  var doc = document.documentElement;
  doc.classList.add("js");

  // Spoiler: la scelta resta nel browser (solo comodità, il sito funziona anche senza)
  var CHIAVE = "bv-spoiler";
  try { if (localStorage.getItem(CHIAVE) === "1") doc.classList.add("spoiler-ok"); } catch (e) {}
  document.addEventListener("click", function (ev) {
    var b = ev.target.closest("[data-svela]");
    if (!b) return;
    doc.classList.add("spoiler-ok");
    try { localStorage.setItem(CHIAVE, "1"); } catch (e) {}
  });

  // Menu mobile
  var btn = document.querySelector(".menu-btn");
  var nav = document.getElementById("nav-principale");
  if (btn && nav) {
    btn.addEventListener("click", function () {
      var aperto = nav.classList.toggle("aperto");
      btn.setAttribute("aria-expanded", aperto ? "true" : "false");
      btn.setAttribute("aria-label", aperto ? "Chiudi il menu" : "Apri il menu");
    });
    document.addEventListener("keydown", function (ev) {
      if (ev.key === "Escape" && nav.classList.contains("aperto")) { btn.click(); btn.focus(); }
    });
  }

  // Testata con bordo quando si scorre
  var testata = document.querySelector(".testata");
  var suScroll = function () { if (testata) testata.classList.toggle("scorsa", window.scrollY > 8); };
  window.addEventListener("scroll", suScroll, { passive: true });
  suScroll();

  // Comparsa morbida di schede e blocchi
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (voci) {
      voci.forEach(function (v) { if (v.isIntersecting) { v.target.classList.add("visto"); io.unobserve(v.target); } });
    }, { rootMargin: "0px 0px -8% 0px" });
    document.querySelectorAll(".scheda, .boss-riga, .tessera, .passi-lista li, .numeri div").forEach(function (el) {
      el.classList.add("compare");
      io.observe(el);
    });
  }
})();
