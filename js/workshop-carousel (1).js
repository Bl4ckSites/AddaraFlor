document.addEventListener("DOMContentLoaded", () => {

  const track = document.querySelector(".carousel-track");
  const slides = Array.from(track.children);
  const nextBtn = document.querySelector(".next");
  const prevBtn = document.querySelector(".prev");
  const dotsNav = document.querySelector(".carousel-dots");

  let index = 0;
  let interval;

  function updateSlide(i) {
    track.style.transform = `translateX(-${i * 100}%)`;
    document.querySelectorAll(".carousel-dots span")
      .forEach(dot => dot.classList.remove("active"));
    dotsNav.children[i].classList.add("active");
    index = i;
  }

  function createDots() {
    slides.forEach((_, i) => {
      const dot = document.createElement("span");
      if (i === 0) dot.classList.add("active");
      dot.addEventListener("click", () => updateSlide(i));
      dotsNav.appendChild(dot);
    });
  }

  function next() {
    let newIndex = (index + 1) % slides.length;
    updateSlide(newIndex);
  }

  function prev() {
    let newIndex = (index - 1 + slides.length) % slides.length;
    updateSlide(newIndex);
  }

  function autoPlay() {
    interval = setInterval(next, 5000);
  }

  nextBtn.addEventListener("click", next);
  prevBtn.addEventListener("click", prev);

  track.addEventListener("mouseenter", () => clearInterval(interval));
  track.addEventListener("mouseleave", autoPlay);

  let startX = 0;

  track.addEventListener("touchstart", e => {
    startX = e.touches[0].clientX;
  });

  track.addEventListener("touchend", e => {
    let endX = e.changedTouches[0].clientX;
    if (startX - endX > 50) next();
    if (endX - startX > 50) prev();
  });

  createDots();
  autoPlay();

});