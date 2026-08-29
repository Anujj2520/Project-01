/* =========================================
   BACK BUTTON
========================================= */

const backButton =
    document.getElementById("backButton");


backButton.addEventListener(
    "click",
    function () {

        /*
            Go to the previous page
            in browser history.
        */

        if (window.history.length > 1) {

            window.history.back();

        } else {

            /*
                If there is no previous page,
                go to Home.
            */

            window.location.href = "home.html";

        }

    }
);



/* =========================================
   MOBILE NAVIGATION
========================================= */

const menuToggle =
    document.getElementById("menuToggle");

const navLinks =
    document.getElementById("navLinks");


menuToggle.addEventListener(
    "click",
    function () {

        navLinks.classList.toggle("show");


        if (navLinks.classList.contains("show")) {

            menuToggle.textContent = "✕";

        } else {

            menuToggle.textContent = "☰";

        }

    }
);



/* =========================================
   CLOSE MOBILE MENU
========================================= */

const links =
    document.querySelectorAll(
        ".nav-links a"
    );


links.forEach(
    function (link) {

        link.addEventListener(
            "click",
            function () {

                navLinks.classList.remove(
                    "show"
                );

                menuToggle.textContent = "☰";

            }
        );

    }
);



/* =========================================
   SKILL PROGRESS ANIMATION
========================================= */

const progressBars =
    document.querySelectorAll(
        ".progress-bar"
    );


const progressObserver =
    new IntersectionObserver(
        function (entries) {

            entries.forEach(
                function (entry) {

                    if (entry.isIntersecting) {

                        const bar =
                            entry.target;

                        const width =
                            bar.dataset.width;

                        bar.style.width =
                            width + "%";

                        progressObserver.unobserve(
                            bar
                        );

                    }

                }
            );

        },
        {
            threshold: 0.5
        }
    );


progressBars.forEach(
    function (bar) {

        progressObserver.observe(bar);

    }
);



/* =========================================
   COUNTER ANIMATION
========================================= */

const counters =
    document.querySelectorAll(
        ".counter"
    );


function animateCounter(counter) {

    const target =
        Number(
            counter.dataset.target
        );

    let current = 0;

    const duration = 1200;

    const increment =
        target / (duration / 20);


    const timer =
        setInterval(
            function () {

                current += increment;


                if (current >= target) {

                    current = target;

                    clearInterval(timer);

                }


                counter.textContent =
                    Math.floor(current);

            },
            20
        );

}



/* =========================================
   COUNTER OBSERVER
========================================= */

const counterObserver =
    new IntersectionObserver(
        function (entries) {

            entries.forEach(
                function (entry) {

                    if (entry.isIntersecting) {

                        animateCounter(
                            entry.target
                        );

                        counterObserver.unobserve(
                            entry.target
                        );

                    }

                }
            );

        },
        {
            threshold: 0.7
        }
    );


counters.forEach(
    function (counter) {

        counterObserver.observe(counter);

    }
);



/* =========================================
   SCROLL REVEAL
========================================= */

const revealElements =
    document.querySelectorAll(
        ".intro-card, " +
        ".timeline-item, " +
        ".skill-card, " +
        ".goals-section"
    );


revealElements.forEach(
    function (element) {

        element.style.opacity = "0";

        element.style.transform =
            "translateY(30px)";

        element.style.transition =
            "opacity .7s ease, " +
            "transform .7s ease";

    }
);


const revealObserver =
    new IntersectionObserver(
        function (entries) {

            entries.forEach(
                function (entry) {

                    if (entry.isIntersecting) {

                        entry.target.style.opacity =
                            "1";

                        entry.target.style.transform =
                            "translateY(0)";

                        revealObserver.unobserve(
                            entry.target
                        );

                    }

                }
            );

        },
        {
            threshold: 0.15
        }
    );


revealElements.forEach(
    function (element) {

        revealObserver.observe(element);

    }
);



/* =========================================
   ACTIVE NAVIGATION
========================================= */

const currentPage =
    window.location.pathname
        .split("/")
        .pop();


links.forEach(
    function (link) {

        const page =
            link.getAttribute("href");


        if (page === currentPage) {

            link.classList.add("active");

        }

    }
);



/* =========================================
   KEYBOARD BACK BUTTON
========================================= */

document.addEventListener(
    "keydown",
    function (event) {

        /*
            Alt + Left Arrow
            behaves like browser back.
        */

        if (
            event.altKey &&
            event.key === "ArrowLeft"
        ) {

            window.history.back();

        }

    }
);