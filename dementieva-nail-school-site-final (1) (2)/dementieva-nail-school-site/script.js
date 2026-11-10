(() => {
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  // Mobile navigation
  const menuButton = $(".menu-toggle");
  const nav = $("#primary-nav");
  const closeMenu = () => {
    if (!menuButton || !nav) return;
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Открыть меню");
    nav.classList.remove("is-open");
  };

  if (menuButton && nav) {
    menuButton.addEventListener("click", () => {
      const isOpen = menuButton.getAttribute("aria-expanded") === "true";
      menuButton.setAttribute("aria-expanded", String(!isOpen));
      menuButton.setAttribute("aria-label", isOpen ? "Открыть меню" : "Закрыть меню");
      nav.classList.toggle("is-open", !isOpen);
    });
    $$("a", nav).forEach(link => link.addEventListener("click", closeMenu));
    document.addEventListener("keydown", event => {
      if (event.key === "Escape") closeMenu();
    });
  }

  // Two-step question builder. It only prepares a WhatsApp message; it does not submit data to a server.
  const quiz = $("#training-quiz");
  if (quiz) {
    const steps = [
      {
        title: "Какой у вас сейчас опыт?",
        options: [
          ["Начинаю с нуля", "Хочу познакомиться с профессией"],
          ["Уже работаю мастером", "Хочу узнать о развитии навыков"],
          ["Пока выбираю", "Хочу разобраться в возможностях"]
        ]
      },
      {
        title: "Что хотите узнать в первую очередь?",
        options: [
          ["Программу и содержание", "Темы занятий и практику"],
          ["Стоимость и длительность", "Актуальную цену и сроки"],
          ["Даты и формат", "Ближайшее время и организацию занятий"],
          ["Документ по итогам", "Вид документа и условия его выдачи"]
        ]
      }
    ];

    let step = 0;
    const answers = [];
    const question = $("#quiz-question");
    const options = $("#quiz-options");
    const progress = $("#quiz-progress-fill");
    const stepLabel = $("#quiz-step-label");
    const back = $("#quiz-back");
    const content = $("#quiz-content");
    const result = $("#quiz-result");
    const summary = $("#quiz-summary");
    const whatsapp = $("#quiz-whatsapp");

    const makeWhatsAppUrl = message =>
      "https://wa.me/79658848708?text=" + encodeURIComponent(message);

    const render = () => {
      const current = steps[step];
      question.textContent = current.title;
      options.replaceChildren();

      current.options.forEach(([title, description], index) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "quiz-option";
        const number = document.createElement("span");
        number.textContent = String(index + 1).padStart(2, "0");
        const name = document.createElement("b");
        name.textContent = title;
        const detail = document.createElement("small");
        detail.textContent = description;
        const arrow = document.createElement("i");
        arrow.setAttribute("aria-hidden", "true");
        arrow.textContent = "↗";
        button.append(number, name, detail, arrow);
        button.addEventListener("click", () => {
          answers[step] = title;
          if (step === 0) {
            step = 1;
            render();
          } else {
            const message = [
              "Здравствуйте! Хочу узнать об обучении в Dementieva Nail School.",
              "Мой опыт: " + answers[0] + ".",
              "Интересует: " + answers[1] + ".",
              "Подскажите, пожалуйста, актуальные условия."
            ].join(" ");
            summary.textContent = answers[0] + " · " + answers[1];
            whatsapp.href = makeWhatsAppUrl(message);
            content.hidden = true;
            result.hidden = false;
          }
        });
        options.append(button);
      });

      progress.style.width = step === 0 ? "50%" : "100%";
      stepLabel.textContent = "ШАГ " + (step + 1) + " / 2";
      back.hidden = step === 0;
    };

    back.addEventListener("click", () => {
      step = 0;
      answers.length = 0;
      render();
    });

    $("#quiz-reset").addEventListener("click", () => {
      step = 0;
      answers.length = 0;
      result.hidden = true;
      content.hidden = false;
      render();
    });

    render();
  }

  // Gallery lightbox
  const cards = $$(".gallery-card");
  const lightbox = $("#lightbox");
  const lightboxImage = $("#lightbox-image");
  const lightboxCaption = $("#lightbox-caption");
  let activeImage = 0;
  let previousFocus = null;

  const showImage = index => {
    if (!cards.length) return;
    activeImage = (index + cards.length) % cards.length;
    const card = cards[activeImage];
    lightboxImage.src = card.dataset.image;
    lightboxImage.alt = $("img", card).alt;
    lightboxCaption.textContent = card.dataset.caption || "";
  };

  const openLightbox = index => {
    previousFocus = document.activeElement;
    showImage(index);
    lightbox.hidden = false;
    lightbox.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
    $(".lightbox-close", lightbox).focus();
  };

  const closeLightbox = () => {
    lightbox.hidden = true;
    lightbox.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
    if (previousFocus && typeof previousFocus.focus === "function") previousFocus.focus();
  };

  cards.forEach((card, index) => {
    card.addEventListener("click", () => openLightbox(index));
  });

  $(".lightbox-close").addEventListener("click", closeLightbox);
  $(".lightbox-prev").addEventListener("click", () => showImage(activeImage - 1));
  $(".lightbox-next").addEventListener("click", () => showImage(activeImage + 1));
  lightbox.addEventListener("click", event => {
    if (event.target === lightbox) closeLightbox();
  });

  document.addEventListener("keydown", event => {
    if (lightbox.hidden) return;
    if (event.key === "Escape") closeLightbox();
    if (event.key === "ArrowLeft") showImage(activeImage - 1);
    if (event.key === "ArrowRight") showImage(activeImage + 1);
  });

  const year = $("#year");
  if (year) year.textContent = String(new Date().getFullYear());
})();