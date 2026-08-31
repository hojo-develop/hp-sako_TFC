const menuButton = document.querySelector(".menu");
const headerNav = document.querySelector(".header nav");

if (menuButton && headerNav) {
  menuButton.addEventListener("click", () => {
    const isOpen = headerNav.classList.toggle("is-open");
    menuButton.setAttribute("aria-expanded", String(isOpen));
  });

  headerNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      headerNav.classList.remove("is-open");
      menuButton.setAttribute("aria-expanded", "false");
    });
  });
}

const hero = document.querySelector(".hero-cinematic");

if (hero) {
  const slides = [...hero.querySelectorAll(".hero-slide")];
  const copies = [...hero.querySelectorAll(".hero-copy")];
  const dots = [...hero.querySelectorAll(".hero-dot")];
  const brand = hero.querySelector(".hero-brand-lockup");
  const actions = hero.querySelector(".hero-actions");
  const scriptText = hero.querySelector(".hero-script");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let activeIndex = 0;
  let autoTimer = null;
  let isAnimating = false;

  const setActiveState = (index) => {
    slides.forEach((slide, slideIndex) => {
      slide.classList.toggle("is-active", slideIndex === index);
    });
    copies.forEach((copy, copyIndex) => {
      copy.classList.toggle("is-active", copyIndex === index);
    });
    dots.forEach((dot, dotIndex) => {
      dot.classList.toggle("is-active", dotIndex === index);
      dot.setAttribute("aria-current", dotIndex === index ? "true" : "false");
    });
  };

  const restartAutoPlay = () => {
    window.clearInterval(autoTimer);
    if (!reducedMotion) {
      autoTimer = window.setInterval(() => {
        showSlide((activeIndex + 1) % slides.length);
      }, 7200);
    }
  };

  const showSlideFallback = (nextIndex) => {
    setActiveState(nextIndex);
    activeIndex = nextIndex;
  };

  const showSlide = (nextIndex, userInitiated = false) => {
    if (nextIndex === activeIndex || isAnimating) return;

    const currentIndex = activeIndex;
    const currentSlide = slides[currentIndex];
    const nextSlide = slides[nextIndex];
    const currentCopy = copies[currentIndex];
    const nextCopy = copies[nextIndex];

    if (reducedMotion || typeof window.gsap === "undefined") {
      showSlideFallback(nextIndex);
      if (userInitiated) restartAutoPlay();
      return;
    }

    isAnimating = true;
    activeIndex = nextIndex;

    nextSlide.classList.add("is-active");
    nextCopy.classList.add("is-active");

    dots.forEach((dot, index) => {
      dot.classList.toggle("is-active", index === nextIndex);
      dot.setAttribute("aria-current", index === nextIndex ? "true" : "false");
    });

    const nextImage = nextSlide.querySelector("img");
    const nextLines = nextCopy.querySelectorAll(".hero-copy-line");

    gsap.killTweensOf(currentSlide);
    gsap.killTweensOf(currentSlide.querySelector("img"));
    gsap.killTweensOf(currentCopy);
    gsap.killTweensOf(nextSlide);
    gsap.killTweensOf(nextImage);
    gsap.killTweensOf(nextCopy);
    gsap.killTweensOf(nextLines);

    gsap.set(nextSlide, { opacity: 0, zIndex: 3 });
    gsap.set(nextImage, { scale: 1.075, xPercent: -1.25 });
    gsap.set(nextCopy, { opacity: 1, y: 0 });
    gsap.set(nextLines, { yPercent: 110, opacity: 0 });

    const transition = gsap.timeline({
      defaults: { ease: "power3.inOut" },
      onComplete: () => {
        currentSlide.classList.remove("is-active");
        currentCopy.classList.remove("is-active");
        gsap.set(currentSlide, { clearProps: "all" });
        gsap.set(currentSlide.querySelector("img"), { clearProps: "all" });
        gsap.set(currentCopy, { clearProps: "all" });
        gsap.set(nextSlide, { zIndex: 2 });
        isAnimating = false;
      },
    });

    transition
      .to(currentCopy, { opacity: 0, y: -12, duration: 0.55 }, 0)
      .to(currentSlide, { opacity: 0, duration: 1.25 }, 0.1)
      .to(nextSlide, { opacity: 1, duration: 1.35, ease: "power2.inOut" }, 0.25)
      .to(
        nextLines,
        {
          yPercent: 0,
          opacity: 1,
          duration: 0.85,
          stagger: 0.1,
          ease: "power3.out",
        },
        0.75,
      );

    gsap.to(nextImage, {
      scale: 1.01,
      xPercent: 1,
      duration: 7.2,
      ease: "none",
      overwrite: true,
    });

    if (userInitiated) restartAutoPlay();
  };

  dots.forEach((dot) => {
    dot.addEventListener("click", () => {
      showSlide(Number(dot.dataset.slide), true);
    });
  });

  setActiveState(0);

  if (!reducedMotion && typeof window.gsap !== "undefined") {
    const intro = gsap.timeline({ defaults: { ease: "power3.out" } });
    const initialLines = copies[0].querySelectorAll(".hero-copy-line");

    gsap.set(initialLines, { yPercent: 115, opacity: 0 });
    intro
      .from(brand, { opacity: 0, x: -34, duration: 1.05 })
      .to(
        initialLines,
        { yPercent: 0, opacity: 1, duration: 0.9, stagger: 0.13 },
        "-=0.7",
      )
      .from(actions, { opacity: 0, y: 16, duration: 0.75 }, "-=0.4")
      .from(scriptText, { opacity: 0, rotate: -11, scale: 0.92, duration: 0.8 }, "-=0.6");

    gsap.to(slides[0].querySelector("img"), {
      scale: 1.01,
      xPercent: 1,
      duration: 7.2,
      ease: "none",
    });
  }

  restartAutoPlay();

  hero.addEventListener("mouseenter", () => window.clearInterval(autoTimer));
  hero.addEventListener("mouseleave", restartAutoPlay);
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      window.clearInterval(autoTimer);
    } else {
      restartAutoPlay();
    }
  });
}

const brandOrbit = document.querySelector(".brand-orbit");
if (brandOrbit && typeof window.gsap !== "undefined" && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const visual = brandOrbit.closest(".about-brand-visual");
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      gsap.fromTo(brandOrbit, { scale: .72, opacity: 0, rotate: -14 }, { scale: 1, opacity: 1, rotate: 0, duration: 1.2, ease: "power3.out" });
      const mark = visual?.querySelector("img");
      if (mark) gsap.fromTo(mark, { scale: .9, opacity: 0 }, { scale: 1, opacity: .94, duration: .9, delay: .18, ease: "power3.out" });
      observer.disconnect();
    });
  }, { threshold: .35 });
  if (visual) observer.observe(visual);
}

const contactForm = document.querySelector("#contactForm");
if (contactForm) {
  const params = new URLSearchParams(window.location.search);
  if (params.get("type") === "sponsor") {
    const typeSelect = contactForm.querySelector("#type");
    if (typeSelect) typeSelect.value = "スポンサーについて";
  }

  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(contactForm);
    const subject = `[栄生TFC] ${data.get("type")}`;
    const body = [
      `お問い合わせ内容：${data.get("type")}`,
      `お名前：${data.get("name")}`,
      `メールアドレス：${data.get("email")}`,
      `学年 / 年代：${data.get("grade") || "未入力"}`,
      `電話番号：${data.get("phone") || "未入力"}`,
      "",
      "お問い合わせ詳細：",
      data.get("message"),
    ].join("\n");
    window.location.href = `mailto:info.sakotfc.jr@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  });
}

/* TOP values / owner reveal: motion supports understanding and follows reduced-motion preference. */
(() => {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduced || typeof window.gsap === "undefined") return;

  const revealOnce = (element, callback, threshold = .18) => {
    if (!element) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        callback();
        observer.disconnect();
      });
    }, { threshold });
    observer.observe(element);
  };

  const values = document.querySelector(".values-section");
  revealOnce(values, () => {
    gsap.from(".values-heading > *", { opacity: 0, y: 22, duration: .8, stagger: .09, ease: "power3.out" });
    gsap.from(".values-list article", { opacity: 0, y: 28, duration: .75, stagger: .12, ease: "power3.out" });
    gsap.from(".values-visual img", { opacity: 0, scale: .9, rotate: -8, duration: 1.25, ease: "power3.out" });
    gsap.from(".values-ring", { opacity: 0, scale: .78, duration: 1.1, stagger: .16, ease: "power3.out" });
  });

  const owner = document.querySelector(".owner-story");
  revealOnce(owner, () => {
    gsap.from(".owner-photo img", { opacity: .35, scale: 1.05, duration: 1.3, ease: "power2.out" });
    gsap.from(".owner-content > .label, .owner-content > h2", { opacity: 0, y: 22, duration: .8, stagger: .12, ease: "power3.out" });
  });
})();

/* microCMS player rendering.
   Production requests go through /api/players.php so the API key never ships to the browser. */
(() => {
  const topContainer = document.querySelector("#topPlayers");
  const allContainer = document.querySelector("#allPlayers");
  const detailContainer = document.querySelector("#playerDetail");

  const text = (value, fallback = "-") => value === null || value === undefined || value === "" ? fallback : String(value);
  const imageUrl = (player) => player?.image?.url || player?.image || "assets/images/player-main.png";
  const escapeHtml = (value) => text(value, "").replace(/[&<>'\"]/g, (char) => ({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"}[char]));

  const playerCard = (player) => `
    <article class="player-card">
      <a href="player.html?id=${encodeURIComponent(player.id)}" aria-label="${escapeHtml(player.name)} 選手詳細">
        <img src="${escapeHtml(imageUrl(player))}" alt="${escapeHtml(player.name)}">
        <strong>${escapeHtml(player.number)}</strong>
        <span>${escapeHtml(player.position)}</span>
        <b>${escapeHtml(player.name)}</b>
      </a>
    </article>`;

  const fetchPlayers = async (topOnly = false) => {
    const response = await fetch(`api/players.php${topOnly ? "?top=1" : ""}`, { headers: { "Accept": "application/json" } });
    if (!response.ok) throw new Error(`players API: ${response.status}`);
    return response.json();
  };

  if (topContainer) {
    fetchPlayers(true).then((data) => {
      const players = Array.isArray(data.contents) ? data.contents.slice(0, 4) : [];
      if (players.length) topContainer.innerHTML = players.map(playerCard).join("");
    }).catch(() => {
      // Keep the designed fallback cards when microCMS is not configured yet.
    });
  }

  if (allContainer) {
    allContainer.innerHTML = '<div class="players-loading">選手情報を読み込んでいます。</div>';
    fetchPlayers(false).then((data) => {
      const players = Array.isArray(data.contents) ? data.contents : [];
      allContainer.innerHTML = players.length ? players.map(playerCard).join("") : '<div class="players-loading">現在公開中の選手情報はありません。</div>';
    }).catch(() => {
      allContainer.innerHTML = '<div class="players-loading">microCMSの接続設定後、ここに選手一覧が表示されます。</div>';
    });
  }

  if (detailContainer) {
    const id = new URLSearchParams(location.search).get("id");
    if (!id) {
      detailContainer.innerHTML = '<div class="player-detail-copy"><p>選手が指定されていません。</p><a class="page-back" href="players.html">選手一覧へ戻る →</a></div>';
      return;
    }
    fetch(`api/players.php?id=${encodeURIComponent(id)}`, { headers: { "Accept": "application/json" } })
      .then((response) => {
        if (!response.ok) throw new Error("not found");
        return response.json();
      })
      .then((p) => {
        detailContainer.innerHTML = `<div class="player-detail-shell">
          <div class="player-detail-photo"><img src="${escapeHtml(imageUrl(p))}" alt="${escapeHtml(p.name)}"></div>
          <div class="player-detail-copy">
            <div class="player-detail-number">${escapeHtml(p.number)}</div>
            <h1>${escapeHtml(p.name)}</h1>
            <div class="player-detail-nickname">${escapeHtml(p.nickname, "")}</div>
            <div class="player-detail-position">${escapeHtml(p.position)}</div>
            <div class="player-meta">
              <div><small>HEIGHT / WEIGHT</small><b>${escapeHtml(p.height)}cm / ${escapeHtml(p.weight)}kg</b></div>
              <div><small>BIRTHDAY</small><b>${escapeHtml(p.birthday)}</b></div>
              <div><small>BIRTHPLACE</small><b>${escapeHtml(p.birthplace)}</b></div>
              <div><small>DOMINANT FOOT</small><b>${escapeHtml(p.dominantFoot)}</b></div>
            </div>
            <div class="player-career"><h2>CAREER / 経歴</h2><p>${escapeHtml(p.career)}</p></div>
            <div class="player-intro"><h2>PROFILE / 紹介</h2><p>${escapeHtml(p.introduction)}</p></div>
            <a class="page-back" href="players.html">選手一覧へ戻る →</a>
          </div>
        </div>`;
      })
      .catch(() => {
        detailContainer.innerHTML = '<div class="player-detail-copy"><p>選手情報を取得できませんでした。</p><a class="page-back" href="players.html">選手一覧へ戻る →</a></div>';
      });
  }
})();
