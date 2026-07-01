(() => {
  const track = document.getElementById("paintingsTrack");
  if (!track) return;

  const chips = Array.from(document.querySelectorAll("[data-jump-year]"));
  const slides = Array.from(track.querySelectorAll(".slide[data-year]"));

  const setActiveYear = (year) => {
    chips.forEach((c) => c.classList.toggle("is-active", c.dataset.jumpYear === year));
  };

  const scrollToYear = (year) => {
    const target = slides.find((s) => s.dataset.year === year);
    if (!target) return;
    track.scrollTo({ left: target.offsetLeft - track.offsetLeft, behavior: "smooth" });
    setActiveYear(year);
  };

  chips.forEach((chip) => {
    chip.addEventListener("click", () => scrollToYear(chip.dataset.jumpYear));
  });

  // Update active year while scrolling
  const onScroll = () => {
    const trackLeft = track.scrollLeft;
    let best = slides[0];
    let bestDist = Infinity;

    for (const s of slides) {
      const dist = Math.abs((s.offsetLeft - track.offsetLeft) - trackLeft);
      if (dist < bestDist) {
        bestDist = dist;
        best = s;
      }
    }
    if (best?.dataset.year) setActiveYear(best.dataset.year);
  };

  track.addEventListener("scroll", () => window.requestAnimationFrame(onScroll), { passive: true });
  onScroll();
})();
