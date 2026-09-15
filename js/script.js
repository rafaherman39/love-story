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
// =====================================================
// TEXT REVEAL ANIMATION
// =====================================================

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
    music.volume -= volumeStep;
  }, stepTime);
}
/* =====================================================
   AUTO SCROLL CINEMATIC
   ===================================================== */

const autoScrollScenes = document.querySelectorAll(
  '#story > .story-scene'
);

let autoScrollTimer = null;
let autoScrollActive = false;
let userInteracting = false;


/*
   Waktu tunggu setiap scene.

   Scene yang teksnya sedikit dibuat lebih singkat,
   scene yang teksnya banyak dibuat lebih lama.
*/
const sceneDurations = [
  9000,   // Tentang Kamu
  13000,  // Doaku Untukmu
  16000,  // Tidak apa-apa
  16000,  // Namamu dalam Doaku
  14000,  // Harapan
  12000,  // Doa Lanjutan
  10000,  // Tentang Kita
  11000   // Prayer / Flowers
];


/* Mulai auto-scroll */
function startAutoScroll() {

  if (autoScrollActive) return;

  autoScrollActive = true;
  userInteracting = false;

  scheduleNextScene();
}


/* Atur scene berikutnya */
function scheduleNextScene() {

  clearTimeout(autoScrollTimer);

  if (!autoScrollActive) return;
  if (userInteracting) return;

  const currentScroll = window.scrollY;
  const viewportHeight = window.innerHeight;

  let currentSceneIndex = -1;

  autoScrollScenes.forEach((scene, index) => {

    const rect = scene.getBoundingClientRect();

    if (
      rect.top <= viewportHeight * 0.55 &&
      rect.bottom >= viewportHeight * 0.45
    ) {
      currentSceneIndex = index;
    }

  });


  /*
     Kalau belum masuk story,
     tunggu sampai scene pertama.
  */
  if (currentSceneIndex === -1) {

    const firstScene = autoScrollScenes[0];

    if (firstScene) {

      const rect = firstScene.getBoundingClientRect();

      if (rect.top > viewportHeight * 0.5) {

        autoScrollTimer = setTimeout(() => {

          if (!userInteracting) {
            firstScene.scrollIntoView({
              behavior: 'smooth',
              block: 'start'
            });
          }

        }, 5000);

        return;
      }
    }
  }


  /*
     Sudah sampai scene terakhir.
     Jangan scroll ke bawah lagi.
  */
  if (
    currentSceneIndex >= autoScrollScenes.length - 1
  ) {

    autoScrollActive = false;
    clearTimeout(autoScrollTimer);

    return;
  }


  /*
     Tentukan waktu tunggu
     berdasarkan scene sekarang.
  */
  const duration =
    sceneDurations[currentSceneIndex] || 12000;


  autoScrollTimer = setTimeout(() => {

    if (!autoScrollActive) return;
    if (userInteracting) return;

    const nextIndex =
      currentSceneIndex + 1;

    const nextScene =
      autoScrollScenes[nextIndex];

    if (!nextScene) return;


    nextScene.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });


    /*
       Beri waktu scroll selesai
       sebelum timer scene berikutnya dimulai.
    */
    setTimeout(() => {

      if (!userInteracting) {
        scheduleNextScene();
      }

    }, 1800);

  }, duration);
}


/* =====================================================
   USER CONTROL
   ===================================================== */

/*
   Kalau user melakukan scroll/swipe sendiri,
   auto-scroll berhenti.
*/
function stopAutoScrollByUser() {

  if (!autoScrollActive) return;

  userInteracting = true;
  autoScrollActive = false;

  clearTimeout(autoScrollTimer);
}


/*
   Mouse wheel
*/
window.addEventListener(
  'wheel',
  stopAutoScrollByUser,
  { passive: true }
);


/*
   Touch / swipe
*/
window.addEventListener(
  'touchstart',
  stopAutoScrollByUser,
  { passive: true }
);


/*
   Keyboard
*/
window.addEventListener(
  'keydown',
  (event) => {

    const keys = [
      'ArrowUp',
      'ArrowDown',
      'PageUp',
      'PageDown',
      'Home',
      'End',
      ' '
    ];

    if (keys.includes(event.key)) {
      stopAutoScrollByUser();
    }

  }
);


/* =====================================================
   AKTIFKAN SETELAH TOMBOL "BUKA"
   ===================================================== */

const originalStartBtn =
  document.getElementById('startBtn');


if (originalStartBtn) {

  originalStartBtn.addEventListener(
    'click',
    () => {

      /*
         Jangan langsung scroll.
         Beri kesempatan opening
         menikmati animasinya terlebih dahulu.
      */

      setTimeout(() => {

        if (!userInteracting) {
          startAutoScroll();
        }

      }, 4500);

    }
  );

}


/* =====================================================
   REPLAY
   ===================================================== */

const replayButton =
  document.getElementById('replayBtn');


if (replayButton) {

  replayButton.addEventListener(
    'click',
    () => {

      clearTimeout(autoScrollTimer);

      autoScrollActive = false;
      userInteracting = false;


      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });


      /*
         Setelah kembali ke opening,
         mulai lagi otomatis.
      */
      setTimeout(() => {

        startAutoScroll();

      }, 5000);

    }
  );

}
