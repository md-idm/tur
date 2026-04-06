function checkScreenWidth() {
  document
    .querySelector('meta[name="viewport"]')
    .setAttribute(
      "content",
      "width=" +
        (screen.width <= 330 ? "330" : "device-width, height=device-height, initial-scale=1")
    );
}
window.addEventListener("DOMContentLoaded", checkScreenWidth);
window.addEventListener("resize", checkScreenWidth);

$(function () {
  let lastY = window.scrollY;
  let hideAt = 0;
  const $header = $("header");
  if (lastY > 0) {
    $header.addClass("header-fixed");
  }
  $(window).on("scroll", function () {
    let y = window.scrollY;
    y = Math.max(0, y);
    lastY = Math.max(0, lastY);
    if (y > 250 && y > lastY) {
      $header.addClass("hide");
      hideAt = y;
    } else {
      if (y < lastY && hideAt - y >= 100) {
        $header.removeClass("hide");
      }
      if (y > 250) {
        $header.addClass("header-fixed");
      } else {
        $header.removeClass("header-fixed");
      }
    }
    lastY = y;
  });
});

document.querySelectorAll(".dar-nav-anchor").forEach(function (el) {
  el.addEventListener("click", function () {
    const href = this.getAttribute("href");
    if (href && href.startsWith("#")) {
      gsap.to(window, { duration: 0, scrollTo: { y: href } });
    }
  });
});

(function () {
  const budget = document.getElementById("budget");
  const budgetValue = document.getElementById("budget-value");
  if (budget && budgetValue) {
    budget.addEventListener("input", function () {
      budgetValue.textContent = this.value;
    });
  }
})();

$(".dar-cta-vacation .btn, .dar-services .btn, .dar-cta-exclusive .btn").on(
  "click",
  function () {
    window.dataLayer = window.dataLayer || [];
    dataLayer.push({ event: "begin_form" });
  }
);

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

gsap.fromTo(
  ".dar-hero picture img",
  { scale: 1 },
  {
    scale: 1.3,
    ease: "none",
    scrollTrigger: {
      trigger: ".dar-hero",
      start: "top top",
      end: "bottom top",
      scrub: true,
    },
  }
);

gsap.utils
  .toArray(".dar-hero .btn, .dar-destinations .card, .dar-services .card")
  .forEach(function (el) {
    ScrollTrigger.create({
      trigger: el,
      start: "top 90%",
      onEnter: function () {
        el.classList.remove("invisible");
        el.classList.add("animate__animated", "animate__fadeIn");
      },
    });
  });

gsap.utils
  .toArray(
    '.dar-hero h1, .dar-hero p, .dar-hot-offers .row > div[class^="col"]:nth-child(4), .dar-hot-offers .row > div[class^="col"]:nth-child(7)'
  )
  .forEach(function (el) {
    ScrollTrigger.create({
      trigger: el,
      start: "top 90%",
      onEnter: function () {
        el.classList.remove("invisible");
        el.classList.add("animate__animated", "animate__fadeInUp");
      },
    });
  });

gsap.utils
  .toArray('.dar-hot-offers .row > div[class^="col"]:nth-child(3)')
  .forEach(function (el) {
    ScrollTrigger.create({
      trigger: el,
      start: "top 90%",
      onEnter: function () {
        el.classList.remove("invisible");
        el.classList.add("animate__animated", "animate__fadeInDown");
      },
    });
  });

gsap.utils
  .toArray(
    '.dar-hot-offers .row > div[class^="col"]:nth-child(2), .dar-hot-offers .row > div[class^="col"]:nth-child(5), .dar-hot-offers .row > div[class^="col"]:nth-child(6)'
  )
  .forEach(function (el) {
    ScrollTrigger.create({
      trigger: el,
      start: "top 90%",
      onEnter: function () {
        el.classList.remove("invisible");
        el.classList.add("animate__animated", "animate__fadeInLeft");
      },
    });
  });

gsap.utils.toArray(".dar-services-showcase .dar-showcase-collage img").forEach(function (el) {
  ScrollTrigger.create({
    trigger: el,
    start: "top 90%",
    onEnter: function () {
      el.classList.remove("invisible");
      el.classList.add("animate__animated", "animate__jackInTheBox");
    },
  });
});

gsap.utils.toArray(".dar-why-us .card").forEach(function (el) {
  ScrollTrigger.create({
    trigger: el,
    start: "top 90%",
    onEnter: function () {
      el.classList.remove("invisible");
      el.classList.add("animate__animated", "animate__zoomIn");
    },
  });
});
