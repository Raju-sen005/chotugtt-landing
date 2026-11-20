/**
 * Transserve landing — sticky header scroll state + light theme lock.
 */
(function () {
  document.documentElement.setAttribute("data-theme", "light");

  const header = document.querySelector(".site-header");
  if (header) {
    const onScroll = () => {
      header.classList.toggle("is-scrolled", window.scrollY > 8);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  // Ensure hero entrance settles to full opacity (avoids mid-paint gray text).
  const hero = document.querySelector(".hero-enter");
  if (hero) {
    window.setTimeout(() => hero.classList.add("is-ready"), 1000);
  }
})();
