/* ==================================================
   PORTFOLIO DASHBOARD - PROFESSIONAL JAVASCRIPT
================================================== */


/* ==================================================
   GLOBAL VARIABLES
================================================== */

const sections =
    document.querySelectorAll(".section");

const menuButtons =
    document.querySelectorAll(".menu-btn");

const backButton =
    document.getElementById("backButton");

const darkMode =
    document.getElementById("darkMode");

const message =
    document.getElementById("message");


/* ==================================================
   SECTION NAVIGATION
================================================== */

function showSection(sectionId, clickedButton = null) {

    const target =
        document.getElementById(sectionId);

    if (!target) {
        console.error(
            `Section "${sectionId}" not found.`
        );

        return;
    }


    /* Hide every section */

    sections.forEach(section => {

        section.classList.remove("active");

    });


    /* Show selected section */

    target.classList.add("active");


    /* Update sidebar */

    menuButtons.forEach(button => {

        button.classList.remove("active");

    });


    if (clickedButton) {

        clickedButton.classList.add("active");

    } else {

        menuButtons.forEach(button => {

            const onclickValue =
                button.getAttribute("onclick");

            if (
                onclickValue &&
                onclickValue.includes(
                    `'${sectionId}'`
                )
            ) {

                button.classList.add("active");

            }

        });

    }


    /* Update browser URL */

    history.replaceState(
        null,
        "",
        `#${sectionId}`
    );


    /* Scroll to top */

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });


    /* Animate skill bars */

    if (sectionId === "skills") {

        setTimeout(
            animateSkills,
            150
        );

    }

}


/* ==================================================
   OPEN SECTION FROM URL
================================================== */

function loadSectionFromURL() {

    const hash =
        window.location.hash.replace(
            "#",
            ""
        );


    if (
        hash &&
        document.getElementById(hash)
    ) {

        showSection(hash);

    } else {

        showSection("home");

    }

}


loadSectionFromURL();


/* ==================================================
   BROWSER BACK / FORWARD
================================================== */

window.addEventListener(
    "hashchange",
    function () {

        loadSectionFromURL();

    }
);


/* ==================================================
   BACK BUTTON
================================================== */

if (backButton) {

    backButton.addEventListener(
        "click",
        function () {

            if (
                window.history.length > 1 &&
                document.referrer
            ) {

                window.history.back();

            } else {

                window.location.href =
                    "index.html";

            }

        }
    );

}


/* ==================================================
   KEYBOARD SHORTCUT
================================================== */

document.addEventListener(
    "keydown",
    function (event) {

        /*
            ESC = return to Introduction
        */

        if (
            event.key === "Escape"
        ) {

            showSection("home");

        }


        /*
            Alt + Left Arrow = Browser Back
        */

        if (
            event.altKey &&
            event.key === "ArrowLeft"
        ) {

            window.history.back();

        }

    }
);


/* ==================================================
   SKILL BAR ANIMATION
================================================== */

function animateSkills() {

    const bars =
        document.querySelectorAll(
            ".progress-bar"
        );


    bars.forEach(bar => {

        let width = "0";


        if (
            bar.classList.contains("html")
        ) {

            width = "90%";

        }

        else if (
            bar.classList.contains("css")
        ) {

            width = "85%";

        }

        else if (
            bar.classList.contains("javascript")
        ) {

            width = "70%";

        }

        else if (
            bar.classList.contains("python")
        ) {

            width = "75%";

        }

        else if (
            bar.classList.contains("cpp")
        ) {

            width = "65%";

        }

        else if (
            bar.classList.contains("robotics")
        ) {

            width = "70%";

        }


        bar.style.width = width;

    });

}


/* ==================================================
   SETTINGS - LOCAL STORAGE
================================================== */

function loadSettings() {

    const savedDarkMode =
        localStorage.getItem(
            "portfolioDarkMode"
        );


    const savedNotifications =
        localStorage.getItem(
            "portfolioNotifications"
        );


    if (
        savedDarkMode === "true"
    ) {

        darkMode.checked = true;

    }


    if (
        savedNotifications === "false"
    ) {

        const notificationSwitch =
            document.querySelectorAll(
                ".switch input"
            )[1];

        if (notificationSwitch) {

            notificationSwitch.checked =
                false;

        }

    }

}


loadSettings();


/* ==================================================
   SAVE SETTINGS
================================================== */

function saveSettings() {

    const notificationSwitch =
        document.querySelectorAll(
            ".switch input"
        )[1];


    localStorage.setItem(
        "portfolioDarkMode",
        darkMode.checked
    );


    localStorage.setItem(
        "portfolioNotifications",
        notificationSwitch.checked
    );


    showMessage(
        "✓ Settings saved successfully"
    );

}


/* ==================================================
   SETTINGS MESSAGE
================================================== */

function showMessage(text) {

    message.textContent = text;


    setTimeout(
        function () {

            message.textContent = "";

        },
        3000
    );

}


/* ==================================================
   DARK MODE TOGGLE
================================================== */

darkMode.addEventListener(
    "change",
    function () {

        /*
            Your dashboard already uses a dark theme.
            This switch provides a softer visual mode.
        */

        if (darkMode.checked) {

            document.body.style.filter =
                "brightness(.9)";

        } else {

            document.body.style.filter =
                "brightness(1)";

        }


        localStorage.setItem(
            "portfolioDarkMode",
            darkMode.checked
        );

    }
);


/* ==================================================
   BUTTON RIPPLE EFFECT
================================================== */

document.addEventListener(
    "click",
    function (event) {

        const button =
            event.target.closest(
                "button"
            );


        if (!button) return;


        const ripple =
            document.createElement(
                "span"
            );


        ripple.className =
            "ripple";


        button.appendChild(
            ripple
        );


        setTimeout(
            function () {

                ripple.remove();

            },
            500
        );

    }
);


/* ==================================================
   CARD MOUSE EFFECT
================================================== */

const cards =
    document.querySelectorAll(
        ".stat-card, " +
        ".skill-card, " +
        ".project-card, " +
        ".info-card"
    );


cards.forEach(card => {

    card.addEventListener(
        "mousemove",
        function (event) {

            const rect =
                card.getBoundingClientRect();


            const x =
                event.clientX -
                rect.left;


            const y =
                event.clientY -
                rect.top;


            const centerX =
                rect.width / 2;


            const centerY =
                rect.height / 2;


            const rotateX =
                (y - centerY) / 30;


            const rotateY =
                (centerX - x) / 30;


            card.style.transform =
                `perspective(700px)
                 rotateX(${rotateX}deg)
                 rotateY(${rotateY}deg)
                 translateY(-4px)`;

        }
    );


    card.addEventListener(
        "mouseleave",
        function () {

            card.style.transform =
                "";

        }
    );

});


/* ==================================================
   WELCOME NOTIFICATION
================================================== */

window.addEventListener(
    "load",
    function () {

        console.log(
            "Portfolio Dashboard loaded successfully."
        );

        console.log(
            "Keyboard shortcut: ESC → Introduction"
        );

    }
);