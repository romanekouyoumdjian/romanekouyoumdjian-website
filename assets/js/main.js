(() => {
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
})();

(() => {
  let lightbox = null;

  const closeLightbox = () => {
    if (!lightbox) return;
    lightbox.remove();
    lightbox = null;
  };

  const openLightbox = (src, alt) => {
    closeLightbox();

    lightbox = document.createElement("div");
    lightbox.className = "gallery-lightbox";
    lightbox.setAttribute("role", "dialog");
    lightbox.setAttribute("aria-modal", "true");

    const closeButton = document.createElement("button");
    closeButton.className = "gallery-lightbox__close";
    closeButton.type = "button";
    closeButton.setAttribute("aria-label", "Back to carousel");
    closeButton.innerHTML = "&times;";

    const img = document.createElement("img");
    img.className = "gallery-lightbox__img";
    img.src = src;
    img.alt = alt || "";

    closeButton.addEventListener("click", closeLightbox);
    lightbox.addEventListener("click", (event) => {
      if (event.target === lightbox) closeLightbox();
    });

    lightbox.append(closeButton, img);
    document.body.appendChild(lightbox);
    closeButton.focus();
  };

  document.addEventListener("click", (event) => {
    const link = event.target.closest(".carousel__track a[href]");
    if (!link) return;

    const img = link.querySelector("img");
    if (!img) return;

    event.preventDefault();
    openLightbox(link.getAttribute("href"), img.alt);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeLightbox();
      return;
    }

    if (lightbox || (event.key !== "ArrowLeft" && event.key !== "ArrowRight")) return;

    const activeElement = document.activeElement;
    const isTyping = activeElement && ["INPUT", "TEXTAREA", "SELECT"].includes(activeElement.tagName);
    if (isTyping) return;

    const track = document.querySelector(".carousel__track");
    if (!track) return;

    const slides = Array.from(track.querySelectorAll(".slide"));
    if (!slides.length) return;

    event.preventDefault();

    const trackLeft = track.scrollLeft;
    let currentIndex = 0;
    let bestDist = Infinity;

    slides.forEach((slide, index) => {
      const dist = Math.abs((slide.offsetLeft - track.offsetLeft) - trackLeft);
      if (dist < bestDist) {
        bestDist = dist;
        currentIndex = index;
      }
    });

    const direction = event.key === "ArrowRight" ? 1 : -1;
    const nextIndex = Math.min(Math.max(currentIndex + direction, 0), slides.length - 1);
    const target = slides[nextIndex];

    track.scrollTo({
      left: target.offsetLeft - track.offsetLeft,
      behavior: "smooth"
    });
  });
})();
