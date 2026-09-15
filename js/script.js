const preloader = document.getElementById("preloader");
const startBtn = document.getElementById("startBtn");
const replayBtn = document.getElementById("replayBtn");
const opening = document.getElementById("opening");
const story = document.getElementById("story");
const music = document.getElementById("bgMusic");
const musicPlayer = document.getElementById("musicPlayer");
const musicToggle = document.getElementById("musicToggle");

document.body.classList.add("locked");

window.addEventListener("load", () => {
  setTimeout(() => {
    preloader.classList.add("hidden");
    document.querySelectorAll("#opening .reveal").forEach(el => {
      el.classList.add("visible");
    });
  }, 650);
});

function startStory() {
  document.body.classList.remove("locked");

  opening.style.transition =
    "opacity 1.2s ease, transform 1.2s ease";

  opening.style.opacity = "0";
  opening.style.transform = "scale(1.02)";

  setTimeout(() => {
    story.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  }, 450);

  /* MUSIC */
  if (music) {
    musicPlayer.classList.add("show");

    music.currentTime = 0;

    music.play()
      .then(() => {
        fadeMusicIn();

        musicPlayer.classList.add("playing");
      })
      .catch(() => {
        console.log("Browser menunggu interaksi pengguna untuk memutar musik.");
      });
  }
}

musicToggle.addEventListener("click", () => {

  if (!music) return;

  if (music.paused) {

    music.play()
      .then(() => {
        music.volume = 0.23;

        musicPlayer.classList.add("playing");
      })
      .catch(() => {});

  } else {

    music.pause();

    musicPlayer.classList.remove("playing");
  }

});

startBtn.addEventListener("click", startStory);

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("active");
      entry.target.querySelectorAll(".reveal").forEach(el => {
        el.classList.add("visible");
      });
    }
  });
}, { threshold: 0.34 });

document.querySelectorAll(".story-scene").forEach(scene => observer.observe(scene));

replayBtn.addEventListener("click", () => {

  if (music) {
    clearInterval(musicFadeTimer);

    music.pause();
    music.currentTime = 0;
    music.volume = 0;

    musicPlayer.classList.remove("playing");
  }

  opening.style.opacity = "1";
  opening.style.transform = "scale(1)";

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });

  document.querySelectorAll(".reveal")
    .forEach(el => el.classList.remove("visible"));

  musicPlayer.classList.remove("show");

  setTimeout(() => {

    document.querySelectorAll("#opening .reveal")
      .forEach(el => el.classList.add("visible"));

  }, 700);
});

/* ==============================
   MUSIC CONTROL
============================== */

let musicFadeTimer = null;

function fadeMusicIn() {
  if (!music) return;

  clearInterval(musicFadeTimer);

  music.volume = 0;

  const targetVolume = 0.23;
  const duration = 2500;
  const steps = 50;
  const stepTime = duration / steps;
  const volumeStep = targetVolume / steps;

  musicFadeTimer = setInterval(() => {
    if (music.volume + volumeStep >= targetVolume) {
      music.volume = targetVolume;
      clearInterval(musicFadeTimer);
      return;
    }

    music.volume += volumeStep;
  }, stepTime);
}

function fadeMusicOut() {
  if (!music) return;

  clearInterval(musicFadeTimer);

  const startVolume = music.volume;
  const steps = 30;
  const stepTime = 600 / steps;
  const volumeStep = startVolume / steps;

  musicFadeTimer = setInterval(() => {

    if (music.volume - volumeStep <= 0) {

      music.volume = 0;
      music.pause();

      clearInterval(musicFadeTimer);
      return;
    }

    music.volume -= volumeStep;

  }, stepTime);
}


/* =====================================================
   TEXT REVEAL ANIMATION
   ===================================================== */

const animatedTexts = document.querySelectorAll(
  '.text-animate, .text-title-animate, .text-stagger, .button-animate'
);

const textObserver = new IntersectionObserver((entries) => {

  entries.forEach(entry => {

    if (entry.isIntersecting) {
      entry.target.classList.add('show');
    }

  });

}, {
  threshold: 0.35
});


animatedTexts.forEach(el => {
  textObserver.observe(el);
});


/* =====================================================
   AUTO SCROLL — PERLAHAN & KONTINU
   ===================================================== */

let autoScrollActive = false;
let autoScrollFrame = null;
let lastScrollTime = null;


/*
   KECEPATAN AUTO SCROLL

   18 = kecepatan yang kamu bilang sudah mau/jalan
*/
const AUTO_SCROLL_SPEED = 13;


/* =====================================================
   MULAI AUTO SCROLL
   ===================================================== */

function startSlowAutoScroll() {

  if (autoScrollActive) return;

  autoScrollActive = true;
  lastScrollTime = null;

  autoScrollFrame =
    requestAnimationFrame(slowAutoScroll);
}


/* =====================================================
   AUTO SCROLL CONTINUOUS
   ===================================================== */

function slowAutoScroll(timestamp) {

  if (!autoScrollActive) {
    return;
  }


  if (lastScrollTime === null) {
    lastScrollTime = timestamp;
  }


  const deltaTime =
    (timestamp - lastScrollTime) / 1000;

  lastScrollTime = timestamp;


  /*
     Scroll perlahan ke bawah.
     Tidak lompat antar scene.
  */
  window.scrollBy({
    top: AUTO_SCROLL_SPEED * deltaTime,
    left: 0,
    behavior: "auto"
  });


  /*
     Cek apakah sudah sampai paling bawah.
  */
  const atBottom =
    window.innerHeight +
    window.scrollY >=
    document.documentElement.scrollHeight - 5;


  if (atBottom) {

    stopSlowAutoScroll();

    return;
  }


  autoScrollFrame =
    requestAnimationFrame(slowAutoScroll);
}


/* =====================================================
   STOP AUTO SCROLL
   ===================================================== */

function stopSlowAutoScroll() {

  autoScrollActive = false;
  lastScrollTime = null;

  if (autoScrollFrame) {

    cancelAnimationFrame(autoScrollFrame);

    autoScrollFrame = null;
  }
}


/* =====================================================
   USER SCROLL MANUAL
   ===================================================== */

let manualScrolling = false;
let manualScrollTimer = null;


function userTakeControl() {

  if (!autoScrollActive) return;

  manualScrolling = true;

  stopSlowAutoScroll();

  clearTimeout(manualScrollTimer);

  manualScrollTimer = setTimeout(() => {

    manualScrolling = false;

  }, 1000);
}


/* =====================================================
   MOUSE WHEEL
   ===================================================== */

window.addEventListener(
  "wheel",
  userTakeControl,
  { passive: true }
);


/* =====================================================
   TOUCH / SWIPE
   ===================================================== */

window.addEventListener(
  "touchstart",
  userTakeControl,
  { passive: true }
);


/* =====================================================
   KEYBOARD
   ===================================================== */

window.addEventListener(
  "keydown",
  (event) => {

    const scrollKeys = [
      "ArrowUp",
      "ArrowDown",
      "PageUp",
      "PageDown",
      "Home",
      "End",
      " "
    ];

    if (scrollKeys.includes(event.key)) {

      userTakeControl();

    }

  }
);


/* =====================================================
   MULAI AUTO SCROLL SETELAH BUKA
   ===================================================== */

const startButton =
  document.getElementById("startBtn");


if (startButton) {

  startButton.addEventListener(
    "click",
    () => {

      /*
         Tunggu sebentar setelah opening
         sebelum mulai bergerak.
      */

      setTimeout(() => {

        if (!manualScrolling) {
          startSlowAutoScroll();
        }

      }, 5000);

    }
  );

}


/* =====================================================
   REPLAY
   ===================================================== */

const replayButton =
  document.getElementById("replayBtn");


if (replayButton) {

  replayButton.addEventListener(
    "click",
    () => {

      stopSlowAutoScroll();

      manualScrolling = false;


      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });


      /*
         Tunggu sampai kembali ke opening,
         kemudian mulai auto-scroll lagi.
      */

      setTimeout(() => {

        startSlowAutoScroll();

      }, 5000);

    }
  );

}

}
