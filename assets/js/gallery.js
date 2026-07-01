(() => {
  const track = document.getElementById("paintingsTrack");
  const yearStrip = document.getElementById("yearStrip");
  if (!track || !yearStrip) return;

  const carousel = track.closest(".carousel");
  const galleryLabel = carousel?.dataset.galleryLabel || "Artwork";

  const loadGalleryData = async () => {
    try {
      const res = await fetch("assets/data/paintings.json", { cache: "no-store" });
      if (!res.ok) throw new Error("Could not load paintings.json");
      return await res.json();
    } catch (err) {
      if (Array.isArray(window.paintingsData)) return window.paintingsData;
      throw err;
    }
  };

  const setActiveYear = (chips, year) => {
    chips.forEach((chip) => {
      chip.classList.toggle("is-active", chip.dataset.jumpYear === year);
    });
  };

  const initGallery = async () => {
    let data;
    try {
      data = await loadGalleryData();
    } catch (err) {
      track.innerHTML = "<p style='padding:12px'>Could not load the gallery data.</p>";
      return;
    }

    data.sort((a, b) => {
      const ya = Number(a.year);
      const yb = Number(b.year);
      if (ya !== yb) return yb - ya;
      return String(a.filename).localeCompare(String(b.filename));
    });

    const yearsInOrder = [];

    data.forEach((item) => {
      if (!yearsInOrder.includes(item.year)) yearsInOrder.push(item.year);

      const fig = document.createElement("figure");
      fig.className = "slide";
      fig.dataset.year = item.year;

      fig.innerHTML = `
        <a href="${item.src}">
          <img src="${item.src}" alt="${galleryLabel}, ${item.year}" loading="lazy" />
        </a>
        <figcaption>
          <span class="meta__year">${item.year}</span>
        </figcaption>
      `;
      track.appendChild(fig);
    });

    yearsInOrder.forEach((year) => {
      const btn = document.createElement("button");
      btn.className = "year-chip";
      btn.type = "button";
      btn.dataset.jumpYear = year;
      btn.textContent = year;
      yearStrip.appendChild(btn);
    });

    const chips = Array.from(yearStrip.querySelectorAll("[data-jump-year]"));
    const slides = Array.from(track.querySelectorAll(".slide[data-year]"));

    const scrollToYear = (year) => {
      const target = slides.find((slide) => slide.dataset.year === year);
      if (!target) return;
      track.scrollTo({ left: target.offsetLeft - track.offsetLeft, behavior: "smooth" });
      setActiveYear(chips, year);
    };

    chips.forEach((chip) => {
      chip.addEventListener("click", () => scrollToYear(chip.dataset.jumpYear));
    });

    const onScroll = () => {
      const trackLeft = track.scrollLeft;
      let best = slides[0];
      let bestDist = Infinity;

      for (const slide of slides) {
        const dist = Math.abs((slide.offsetLeft - track.offsetLeft) - trackLeft);
        if (dist < bestDist) {
          bestDist = dist;
          best = slide;
        }
      }

      if (best && best.dataset.year) setActiveYear(chips, best.dataset.year);
    };

    track.addEventListener("scroll", () => window.requestAnimationFrame(onScroll), { passive: true });

    if (yearsInOrder.length) setActiveYear(chips, yearsInOrder[0]);
    onScroll();
  };

  initGallery();
})();
