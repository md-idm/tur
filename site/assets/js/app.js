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

document.querySelectorAll('form input[name="phone"]').forEach(function (el) {
  window.intlTelInput(el, {
    autoPlaceholder: "off",
    hiddenInput: el.name,
    initialCountry: "md",
    preferredCountries: ["md", "ro"],
    separateDialCode: true,
    utilsScript:
      "https://cdn.jsdelivr.net/npm/intl-tel-input@18.2.1/build/js/utils.js",
  });
});

document.querySelectorAll(".nika-nav-anchor").forEach(function (el) {
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

$(".nika-cta-vacation .btn, .nika-services .btn, .nika-cta-exclusive .btn").on(
  "click",
  function () {
    window.dataLayer = window.dataLayer || [];
    dataLayer.push({ event: "begin_form" });
  }
);

const reCaptcha_key = "6LclghArAAAAAPnRtcjj-MEjq9D5x5PLjsy1GSnl";
const reCaptcha = document.createElement("script");
reCaptcha.src = "https://www.google.com/recaptcha/api.js?render=" + reCaptcha_key;
document.head.appendChild(reCaptcha);

var form_start = false;
$("form .form-control").on("focus", function () {
  if (!form_start) {
    form_start = true;
    window.dataLayer = window.dataLayer || [];
    dataLayer.push({ event: "form_start" });
    grecaptcha.ready(function () {
      grecaptcha.execute(reCaptcha_key, { action: "homepage" }).then(function (token) {
        $("form").append(
          $("<input>", { type: "hidden", name: "g-recaptcha-response", value: token })
        );
      });
    });
  }
});

const formAlertMessages =
  document.documentElement.lang === "ru"
    ? {
        recaptcha:
          "Проверка безопасности не удалась.\nСтраница будет перезагружена, чтобы попробовать снова.",
        fail: "Ошибка при отправке формы. Пожалуйста, попробуйте снова.",
      }
    : {
        recaptcha:
          "Verificarea de securitate nu a reușit.\nVom reîncărca pagina pentru a încerca din nou.",
        fail: "Eroare în timpul expedierii formularului. Vă rugăm să încercați din nou.",
      };

$("form").on("submit", function (e) {
  e.preventDefault();
  const $btn = $(this).find('button[type="submit"]');
  const prevText = $btn.text();
  const waitText = $btn.data("txtexecute");
  $btn.prop("disabled", true).text(waitText);
  window.dataLayer = window.dataLayer || [];
  dataLayer.push({ event: "form_submit" });
  $.ajax({
    url: $(this).attr("action"),
    method: $(this).attr("method"),
    data: $(this).serialize() + "&submit=submit",
    dataType: "json",
  })
    .done(function (res) {
      if (typeof res === "object" && res.recaptcha_error === true) {
        alert(formAlertMessages.recaptcha);
        location.reload();
        return;
      }
      if ($("#popup").hasClass("show")) {
        const popup = document.getElementById("popup");
        const inst = popup ? bootstrap.Modal.getInstance(popup) : null;
        if (inst) {
          inst.hide();
        }
      }
      new bootstrap.Modal($("#send-response")[0]).show();
      $("#send-response .modal-body p").addClass("d-none");
      if (res === 1 || res === true) {
        $("#send-response .bg-success").removeClass("d-none");
        dataLayer.push({ event: "lead_generated" });
      } else {
        $("#send-response .bg-danger").removeClass("d-none");
      }
    })
    .fail(function () {
      alert(formAlertMessages.fail);
    })
    .always(function () {
      $btn.prop("disabled", false).text(prevText);
    });
  this.reset();
});

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

gsap.fromTo(
  ".nika-hero picture img",
  { scale: 1 },
  {
    scale: 1.3,
    ease: "none",
    scrollTrigger: {
      trigger: ".nika-hero",
      start: "top top",
      end: "bottom top",
      scrub: true,
    },
  }
);

gsap.utils
  .toArray(".nika-hero .btn, .nika-destinations .card, .nika-services .card")
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
    '.nika-hero h1, .nika-hero p, .nika-hot-offers .row > div[class^="col"]:nth-child(4), .nika-hot-offers .row > div[class^="col"]:nth-child(7)'
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
  .toArray('.nika-hot-offers .row > div[class^="col"]:nth-child(3)')
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
    '.nika-hot-offers .row > div[class^="col"]:nth-child(2), .nika-hot-offers .row > div[class^="col"]:nth-child(5), .nika-hot-offers .row > div[class^="col"]:nth-child(6)'
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

gsap.utils.toArray(".nika-services-showcase .nika-showcase-collage img").forEach(function (el) {
  ScrollTrigger.create({
    trigger: el,
    start: "top 90%",
    onEnter: function () {
      el.classList.remove("invisible");
      el.classList.add("animate__animated", "animate__jackInTheBox");
    },
  });
});

gsap.utils.toArray(".nika-why-us .card").forEach(function (el) {
  ScrollTrigger.create({
    trigger: el,
    start: "top 90%",
    onEnter: function () {
      el.classList.remove("invisible");
      el.classList.add("animate__animated", "animate__zoomIn");
    },
  });
});
