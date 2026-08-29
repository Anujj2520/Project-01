/* =====================================================
   ECE LOGIN SYSTEM
===================================================== */


/* =====================================================
   GET HTML ELEMENTS
===================================================== */

const loginForm =
    document.getElementById("loginForm");

const email =
    document.getElementById("email");

const password =
    document.getElementById("password");

const togglePassword =
    document.getElementById("togglePassword");

const message =
    document.getElementById("message");

const remember =
    document.getElementById("remember");

const backButton =
    document.getElementById("backButton");

const loginButton =
    document.getElementById("loginButton");

const forgotPassword =
    document.getElementById("forgotPassword");


/* =====================================================
   BACK BUTTON
===================================================== */

backButton.addEventListener(
    "click",
    function () {

        /*
         * Go to previous page if available.
         */

        if (window.history.length > 1) {

            window.history.back();

        }

        /*
         * Otherwise go to home page.
         */

        else {

            window.location.href =
                "index.html";

        }

    }
);


/* =====================================================
   SHOW / HIDE PASSWORD
===================================================== */

togglePassword.addEventListener(
    "click",
    function () {

        if (
            password.type === "password"
        ) {

            password.type = "text";

            togglePassword.textContent =
                "🙈";

            togglePassword.setAttribute(
                "aria-label",
                "Hide password"
            );

        }

        else {

            password.type =
                "password";

            togglePassword.textContent =
                "👁";

            togglePassword.setAttribute(
                "aria-label",
                "Show password"
            );

        }

    }
);


/* =====================================================
   LOAD SAVED EMAIL
===================================================== */

window.addEventListener(
    "DOMContentLoaded",
    function () {

        const savedEmail =
            localStorage.getItem(
                "savedEmail"
            );

        if (savedEmail) {

            email.value =
                savedEmail;

            remember.checked =
                true;

        }

    }
);


/* =====================================================
   EMAIL VALIDATION
===================================================== */

function isValidEmail(value) {

    const emailPattern =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return emailPattern.test(value);

}


/* =====================================================
   DISPLAY MESSAGE
===================================================== */

function showMessage(
    text,
    type = "error"
) {

    message.textContent =
        text;

    if (type === "success") {

        message.style.color =
            "#22c55e";

    }

    else {

        message.style.color =
            "#ef4444";

    }

}


/* =====================================================
   LOGIN FORM
===================================================== */

loginForm.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();


        const emailValue =
            email.value.trim();

        const passwordValue =
            password.value.trim();


        /* Clear old message */

        message.textContent =
            "";


        /* =========================================
           EMAIL CHECK
        ========================================== */

        if (emailValue === "") {

            showMessage(
                "Please enter your email address."
            );

            email.focus();

            return;

        }


        if (!isValidEmail(emailValue)) {

            showMessage(
                "Please enter a valid email address."
            );

            email.focus();

            return;

        }


        /* =========================================
           PASSWORD CHECK
        ========================================== */

        if (passwordValue === "") {

            showMessage(
                "Please enter your password."
            );

            password.focus();

            return;

        }


        if (passwordValue.length < 6) {

            showMessage(
                "Password must contain at least 6 characters."
            );

            password.focus();

            return;

        }


        /* =========================================
           REMEMBER EMAIL
        ========================================== */

        if (remember.checked) {

            localStorage.setItem(
                "savedEmail",
                emailValue
            );

        }

        else {

            localStorage.removeItem(
                "savedEmail"
            );

        }


        /* =========================================
           LOGIN SUCCESS
        ========================================== */

        loginButton.disabled =
            true;

        loginButton.style.opacity =
            "0.7";

        loginButton.querySelector(
            "span:first-child"
        ).textContent =
            "Checking...";


        setTimeout(
            function () {

                showMessage(
                    "✓ Login successful! Redirecting...",
                    "success"
                );

            },
            500
        );


        /*
         * Redirect to dashboard.
         */

        setTimeout(
            function () {

                window.location.href =
                    "menu.html";

            },
            1500
        );

    }
);


/* =====================================================
   EMAIL INPUT EFFECT
===================================================== */

email.addEventListener(
    "input",
    function () {

        if (
            email.value.length > 0
        ) {

            email.style.borderColor =
                "#6366f1";

        }

        else {

            email.style.borderColor =
                "#263449";

        }

    }
);


/* =====================================================
   PASSWORD STRENGTH
===================================================== */

password.addEventListener(
    "input",
    function () {

        const value =
            password.value;


        if (value.length === 0) {

            password.style.borderColor =
                "#263449";

        }

        else if (
            value.length < 6
        ) {

            password.style.borderColor =
                "#ef4444";

        }

        else if (
            value.length < 10
        ) {

            password.style.borderColor =
                "#f59e0b";

        }

        else {

            password.style.borderColor =
                "#22c55e";

        }

    }
);


/* =====================================================
   FORGOT PASSWORD
===================================================== */

forgotPassword.addEventListener(
    "click",
    function (event) {

        event.preventDefault();

        showMessage(
            "Password recovery is not connected yet."
        );

    }
);


/* =====================================================
   KEYBOARD SHORTCUT
===================================================== */

document.addEventListener(
    "keydown",
    function (event) {

        /*
         * ESC = go back
         */

        if (
            event.key === "Escape"
        ) {

            backButton.click();

        }

    }
);


/* =====================================================
   CONSOLE MESSAGE
===================================================== */

console.log(
    "ECE Login System initialized successfully."
);