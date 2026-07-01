(() => {
  const image = document.getElementById("randomArtworkImage");
  const button = document.getElementById("randomArtworkButton");
  const data = Array.isArray(window.paintingsData) ? window.paintingsData : [];

  if (!image || !button || !data.length) return;

  let currentIndex = -1;

  const pickRandomIndex = () => {
    if (data.length === 1) return 0;

    let nextIndex = currentIndex;
    while (nextIndex === currentIndex) {
      nextIndex = Math.floor(Math.random() * data.length);
    }
    return nextIndex;
  };

  const showRandomArtwork = () => {
    currentIndex = pickRandomIndex();
    const item = data[currentIndex];

    image.src = item.src;
    image.alt = item.title ? item.title : `Artwork, ${item.year}`;
  };

  button.addEventListener("click", showRandomArtwork);
  showRandomArtwork();
})();
