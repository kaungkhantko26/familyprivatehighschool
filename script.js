const body = document.body;
const nav = document.querySelector("[data-nav]");
const navToggle = document.querySelector("[data-nav-toggle]");
const yearNodes = document.querySelectorAll("[data-year]");

function setMenuState(isOpen) {
  if (!nav || !navToggle) {
    return;
  }

  nav.dataset.open = String(isOpen);
  navToggle.setAttribute("aria-expanded", String(isOpen));
  body.classList.toggle("menu-open", isOpen);
}

if (nav && navToggle) {
  navToggle.addEventListener("click", () => {
    const isOpen = nav.dataset.open === "true";
    setMenuState(!isOpen);
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => setMenuState(false));
  });

  document.addEventListener("click", (event) => {
    if (!nav.contains(event.target) && !navToggle.contains(event.target)) {
      setMenuState(false);
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      setMenuState(false);
    }
  });
}

const revealItems = Array.from(document.querySelectorAll(".reveal"));
const thingyanCountdown = document.querySelector('[data-countdown="thingyan"]');

revealItems.forEach((item, index) => {
  item.style.setProperty("--reveal-delay", `${(index % 6) * 70}ms`);
});

if ("IntersectionObserver" in window && revealItems.length > 0) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.18,
      rootMargin: "0px 0px -40px 0px",
    }
  );

  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

const currentYear = new Date().getFullYear();
yearNodes.forEach((node) => {
  node.textContent = String(currentYear);
});

if (thingyanCountdown) {
  const dateLabel = thingyanCountdown.querySelector("[data-thingyan-date]");
  const unitNodes = {
    days: thingyanCountdown.querySelector('[data-unit="days"]'),
    hours: thingyanCountdown.querySelector('[data-unit="hours"]'),
    minutes: thingyanCountdown.querySelector('[data-unit="minutes"]'),
    seconds: thingyanCountdown.querySelector('[data-unit="seconds"]'),
  };

  const getNextThingyanDate = () => {
    const now = new Date();
    let target = new Date(now.getFullYear(), 3, 13, 0, 0, 0, 0);
    if (now >= target) {
      target = new Date(now.getFullYear() + 1, 3, 13, 0, 0, 0, 0);
    }
    return target;
  };

  const updateThingyanCountdown = () => {
    const target = getNextThingyanDate();
    const now = new Date();
    const diff = Math.max(0, target.getTime() - now.getTime());

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    unitNodes.days.textContent = String(days).padStart(2, "0");
    unitNodes.hours.textContent = String(hours).padStart(2, "0");
    unitNodes.minutes.textContent = String(minutes).padStart(2, "0");
    unitNodes.seconds.textContent = String(seconds).padStart(2, "0");

    if (dateLabel) {
      dateLabel.textContent = target.toLocaleDateString(undefined, {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    }
  };

  updateThingyanCountdown();
  window.setInterval(updateThingyanCountdown, 1000);
}
