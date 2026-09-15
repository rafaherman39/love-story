/* =====================================================
   ELECTRIC LOVE STORY
   SCRIPT.JS — CLEAN FINAL VERSION
===================================================== */


/* =====================================================
   ELEMENT
===================================================== */

const preloader = document.getElementById("preloader");
const startBtn = document.getElementById("startBtn");
const replayBtn = document.getElementById("replayBtn");
const opening = document.getElementById("opening");
const story = document.getElementById("story");

const music = document.getElementById("bgMusic");
const musicPlayer = document.getElementById("musicPlayer");
const musicToggle = document.getElementById("musicToggle");


/* =====================================================
   INITIAL STATE
===================================================== */

document.body.classList.add("locked");


/* =====================================================
   MUSIC TIMER
===================================================== */

let musicFadeTimer = null;


/* =====================================================
   AUTO SCROLL VARIABLES
===================================================== */

let autoScrollActive = false;
let autoScrollFrame = null;
let lastScrollTime = 0;

const AUTO_SCROLL_SPEED = 8;


/* =====================================================
   SCROLL BEHAVIOR
===================================================== */

let originalScrollBehavior = "";


/* =====================================================
   PRELOADER
===================================================== */

window.addEventListener("load", () => {

    setTimeout(() => {

        if (preloader) {
            preloader.classList.add("hidden");
        }

        document
            .querySelectorAll("#opening .reveal")
            .forEach((el) => {
                el.classList.add("visible");
            });

    }, 650);

});


/* =====================================================
   MUSIC FADE IN
===================================================== */

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


/* =====================================================
   MUSIC FADE OUT
===================================================== */

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
   START STORY
===================================================== */

function startStory() {

    /* ==============================
       STOP AUTO SCROLL SEBELUMNYA
    ============================== */

    stopSlowAutoScroll();


    /* ==============================
       UNLOCK PAGE
    ============================== */

    document.body.classList.remove("locked");


    /* ==============================
       FADE OPENING
    ============================== */

    if (opening) {

        opening.style.transition =
            "opacity 1.2s ease, transform 1.2s ease";

        opening.style.opacity = "0";

        /* FIX:
           scale harus ditutup dengan )
        */

        opening.style.transform = "scale(1.02)";
    }


    /* ==============================
       PINDAH KE STORY
    ============================== */

    setTimeout(() => {

        if (story) {

            window.scrollTo({
                top: story.offsetTop,
                left: 0,
                behavior: "smooth"
            });

        }

    }, 450);


    /* ==============================
       MUSIC
    ============================== */

    if (music) {

        if (musicPlayer) {
            musicPlayer.classList.add("show");
        }

        music.currentTime = 0;
        music.volume = 0;

        music.play()
            .then(() => {

                fadeMusicIn();

                if (musicPlayer) {
                    musicPlayer.classList.add("playing");
                }

            })
            .catch(() => {

                console.log(
                    "Browser menunggu interaksi pengguna untuk memutar musik."
                );

            });

    }


    /* ==============================
       START AUTO SCROLL
    ============================== */

    setTimeout(() => {

        startSlowAutoScroll();

    }, 6000);

}


/* =====================================================
   START BUTTON
===================================================== */

if (startBtn) {

    startBtn.addEventListener("click", startStory);

}


/* =====================================================
   MUSIC TOGGLE
===================================================== */

if (musicToggle) {

    musicToggle.addEventListener("click", () => {

        if (!music) return;


        /* ==============================
           PLAY
        ============================== */

        if (music.paused) {

            music.play()
                .then(() => {

                    music.volume = 0.23;

                    if (musicPlayer) {
                        musicPlayer.classList.add("playing");
                    }

                })
                .catch(() => {});

        }


        /* ==============================
           PAUSE
        ============================== */

        else {

            music.pause();

            if (musicPlayer) {
                musicPlayer.classList.remove("playing");
            }

        }

    });

}


/* =====================================================
   STORY INTERSECTION OBSERVER
===================================================== */

const observer = new IntersectionObserver(
    (entries) => {

        entries.forEach((entry) => {

            if (entry.isIntersecting) {

                entry.target.classList.add("active");

                entry.target
                    .querySelectorAll(".reveal")
                    .forEach((el) => {

                        el.classList.add("visible");

                    });

            }

        });

    },
    {
        threshold: 0.34
    }
);


/* =====================================================
   OBSERVE STORY SCENES
===================================================== */

document
    .querySelectorAll(".story-scene")
    .forEach((scene) => {

        observer.observe(scene);

    });


/* =====================================================
   TEXT REVEAL ANIMATION
===================================================== */

const animatedTexts =
    document.querySelectorAll(
        ".text-animate, .text-title-animate, .text-stagger, .button-animate"
    );


if (animatedTexts.length > 0) {

    const textObserver = new IntersectionObserver(
        (entries) => {

            entries.forEach((entry) => {

                if (entry.isIntersecting) {

                    entry.target.classList.add("show");

                }

            });

        },
        {
            threshold: 0.35
        }
    );


    animatedTexts.forEach((el) => {

        textObserver.observe(el);

    });

}


/* =====================================================
   REPLAY
===================================================== */

if (replayBtn) {

    replayBtn.addEventListener("click", () => {


        /* ==============================
           STOP AUTO SCROLL
        ============================== */

        stopSlowAutoScroll();


        /* ==============================
           STOP MUSIC
        ============================== */

        if (music) {

            clearInterval(musicFadeTimer);

            music.pause();

            music.currentTime = 0;

            music.volume = 0;

        }


        /* ==============================
           HIDE MUSIC PLAYER
        ============================== */

        if (musicPlayer) {

            musicPlayer.classList.remove("playing");
            musicPlayer.classList.remove("show");

        }


        /* ==============================
           RESTORE OPENING
        ============================== */

        if (opening) {

            opening.style.opacity = "1";
            opening.style.transform = "scale(1)";

        }


        /* ==============================
           REMOVE ALL REVEALS
        ============================== */

        document
            .querySelectorAll(".reveal")
            .forEach((el) => {

                el.classList.remove("visible");

            });


        /* ==============================
           REMOVE ACTIVE SCENE STATES
        ============================== */

        document
            .querySelectorAll(".story-scene")
            .forEach((scene) => {

                scene.classList.remove("active");

            });


        /* ==============================
           RETURN TO TOP
        ============================== */

        window.scrollTo({
            top: 0,
            left: 0,
            behavior: "smooth"
        });


        /* ==============================
           SHOW OPENING TEXT
        ============================== */

        setTimeout(() => {

            document
                .querySelectorAll("#opening .reveal")
                .forEach((el) => {

                    el.classList.add("visible");

                });

        }, 700);


        /* ==============================
           START AUTO SCROLL AGAIN
        ============================== */

        setTimeout(() => {

            startSlowAutoScroll();

        }, 2500);

    });

}


/* =====================================================
   AUTO SCROLL — CINEMATIC CONTINUOUS
===================================================== */

function startSlowAutoScroll() {

    /* ==============================
       CEGAH LOOP GANDA
    ============================== */

    if (autoScrollActive) return;


    /* ==============================
       PASTIKAN PAGE TIDAK TERKUNCI
    ============================== */

    document.body.classList.remove("locked");


    /* ==============================
       SIMPAN SCROLL BEHAVIOR ASLI
    ============================== */

    originalScrollBehavior =
        document.documentElement.style.scrollBehavior;


    /* ==============================
       MATIKAN SMOOTH SCROLL SEMENTARA
       
       Ini penting.
       CSS kamu menggunakan:
       
       html {
           scroll-behavior: smooth;
       }
       
       Auto-scroll membutuhkan pergerakan
       langsung setiap frame.
    ============================== */

    document.documentElement.style.scrollBehavior = "auto";


    /* ==============================
       AKTIFKAN AUTO SCROLL
    ============================== */

    autoScrollActive = true;

    lastScrollTime = performance.now();


    /* ==============================
       MULAI FRAME
    ============================== */

    autoScrollFrame =
        requestAnimationFrame(slowAutoScroll);

}


/* =====================================================
   AUTO SCROLL LOOP
===================================================== */

function slowAutoScroll(currentTime) {

    if (!autoScrollActive) return;


    /* ==============================
       HITUNG WAKTU ANTAR FRAME
    ============================== */

    const deltaTime =
        (currentTime - lastScrollTime) / 1000;

    lastScrollTime = currentTime;


    /* ==============================
       POSISI SEKARANG
    ============================== */

    const currentPosition =
        window.scrollY;


    /* ==============================
       HITUNG POSISI BERIKUTNYA
       
       18 PIXEL / DETIK
    ============================== */

    const nextPosition =
        currentPosition +
        (AUTO_SCROLL_SPEED * deltaTime);


    /* ==============================
       GERAKKAN HALAMAN
    ============================== */

    window.scrollTo({
        top: nextPosition,
        left: 0,
        behavior: "auto"
    });


    /* ==============================
       HITUNG BATAS BAWAH
    ============================== */

    const maxScroll =
        document.documentElement.scrollHeight -
        window.innerHeight;


    /* ==============================
       CEK APAKAH SUDAH SAMPAI BAWAH
    ============================== */

    if (nextPosition >= maxScroll) {

        window.scrollTo({
            top: maxScroll,
            left: 0,
            behavior: "auto"
        });

        stopSlowAutoScroll();

        return;
    }


    /* ==============================
       FRAME BERIKUTNYA
    ============================== */

    autoScrollFrame =
        requestAnimationFrame(slowAutoScroll);

}


/* =====================================================
   STOP AUTO SCROLL
===================================================== */

function stopSlowAutoScroll() {

    autoScrollActive = false;

    lastScrollTime = 0;


    /* ==============================
       BATALKAN FRAME
    ============================== */

    if (autoScrollFrame !== null) {

        cancelAnimationFrame(autoScrollFrame);

        autoScrollFrame = null;

    }


    /* ==============================
       KEMBALIKAN SCROLL BEHAVIOR CSS
    ============================== */

    document.documentElement.style.scrollBehavior =
        originalScrollBehavior;

}


/* =====================================================
   USER TAKE CONTROL
===================================================== */

function userTakeControl() {

    if (!autoScrollActive) return;


    /* ==============================
       USER MULAI SCROLL SENDIRI
       AUTO SCROLL BERHENTI
    ============================== */

    stopSlowAutoScroll();

}


/* =====================================================
   MOUSE WHEEL
===================================================== */

window.addEventListener(
    "wheel",
    userTakeControl,
    {
        passive: true
    }
);


/* =====================================================
   TOUCH / SWIPE
===================================================== */

window.addEventListener(
    "touchmove",
    userTakeControl,
    {
        passive: true
    }
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
