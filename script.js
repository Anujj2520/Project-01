/* =========================================
   MOBILE NAVIGATION
========================================= */

const menuToggle =
    document.getElementById("menuToggle");

const navigation =
    document.querySelector(".link");


menuToggle.addEventListener(
    "click",
    function () {

        navigation.classList.toggle("show");

        if (navigation.classList.contains("show")) {

            menuToggle.textContent = "✕";

        } else {

            menuToggle.textContent = "☰";

        }

    }
);


/* =========================================
   CLOSE MENU AFTER CLICK
========================================= */

const navigationLinks =
    document.querySelectorAll(".link a");


navigationLinks.forEach(
    function (link) {

        link.addEventListener(
            "click",
            function () {

                navigation.classList.remove(
                    "show"
                );

                menuToggle.textContent = "☰";

            }
        );

    }
);


/* =========================================
   ACTIVE NAVIGATION
========================================= */

const currentPage =
    window.location.pathname
        .split("/")
        .pop();


navigationLinks.forEach(
    function (link) {

        const linkPage =
            link.getAttribute("href");

        if (linkPage === currentPage) {

            link.classList.add("active");

        }

    }
);


/* =========================================
   SCROLL ANIMATION
========================================= */

const animatedElements =
    document.querySelectorAll(
        ".purpose-card, .ece-section, .cta"
    );


const observer =
    new IntersectionObserver(
        function (entries) {

            entries.forEach(
                function (entry) {

                    if (entry.isIntersecting) {

                        entry.target.style.opacity =
                            "1";

                        entry.target.style.transform =
                            "translateY(0)";

                    }

                }
            );

        },
        {
            threshold: 0.15
        }
    );


animatedElements.forEach(
    function (element) {

        element.style.opacity = "0";

        element.style.transform =
            "translateY(30px)";

        element.style.transition =
            "opacity 0.7s ease, transform 0.7s ease";

        observer.observe(element);

    }
);