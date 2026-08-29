/* =========================================
   GET ELEMENTS
========================================= */

const form =
    document.getElementById("contactForm");

const nameInput =
    document.getElementById("name");

const emailInput =
    document.getElementById("email");

const subjectInput =
    document.getElementById("subject");

const messageInput =
    document.getElementById("message");

const counter =
    document.getElementById("counter");

const submitButton =
    document.getElementById("submitButton");

const buttonText =
    document.getElementById("buttonText");

const buttonIcon =
    document.getElementById("buttonIcon");

const successMessage =
    document.getElementById("successMessage");


/* =========================================
   CHARACTER COUNTER
========================================= */

messageInput.addEventListener(
    "input",
    function () {

        const length =
            messageInput.value.length;

        counter.textContent =
            `${length} / 500`;


        /*
            Change counter color when
            approaching the limit.
        */

        if (length >= 450) {

            counter.style.color =
                "#f87171";

        } else {

            counter.style.color =
                "#475569";
        }

    }
);


/* =========================================
   EMAIL VALIDATION
========================================= */

function isValidEmail(email) {

    const emailPattern =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return emailPattern.test(email);

}


/* =========================================
   SET ERROR
========================================= */

function setError(
    input,
    errorElement,
    message
) {

    input.classList.add(
        "input-error"
    );

    errorElement.textContent =
        message;

}


/* =========================================
   CLEAR ERROR
========================================= */

function clearError(
    input,
    errorElement
) {

    input.classList.remove(
        "input-error"
    );

    errorElement.textContent =
        "";

}


/* =========================================
   VALIDATE FORM
========================================= */

function validateForm() {

    let valid = true;


    /* Get error elements */

    const nameError =
        document.getElementById(
            "nameError"
        );

    const emailError =
        document.getElementById(
            "emailError"
        );

    const subjectError =
        document.getElementById(
            "subjectError"
        );

    const messageError =
        document.getElementById(
            "messageError"
        );


    /* =====================================
       NAME
    ===================================== */

    const name =
        nameInput.value.trim();


    if (name === "") {

        setError(
            nameInput,
            nameError,
            "Please enter your name."
        );

        valid = false;

    }

    else if (name.length < 2) {

        setError(
            nameInput,
            nameError,
            "Name must contain at least 2 characters."
        );

        valid = false;

    }

    else {

        clearError(
            nameInput,
            nameError
        );

    }


    /* =====================================
       EMAIL
    ===================================== */

    const email =
        emailInput.value.trim();


    if (email === "") {

        setError(
            emailInput,
            emailError,
            "Please enter your email."
        );

        valid = false;

    }

    else if (!isValidEmail(email)) {

        setError(
            emailInput,
            emailError,
            "Please enter a valid email address."
        );

        valid = false;

    }

    else {

        clearError(
            emailInput,
            emailError
        );

    }


    /* =====================================
       SUBJECT
    ===================================== */

    const subject =
        subjectInput.value.trim();


    if (subject === "") {

        setError(
            subjectInput,
            subjectError,
            "Please enter a subject."
        );

        valid = false;

    }

    else if (subject.length < 3) {

        setError(
            subjectInput,
            subjectError,
            "Subject is too short."
        );

        valid = false;

    }

    else {

        clearError(
            subjectInput,
            subjectError
        );

    }


    /* =====================================
       MESSAGE
    ===================================== */

    const message =
        messageInput.value.trim();


    if (message === "") {

        setError(
            messageInput,
            messageError,
            "Please enter your message."
        );

        valid = false;

    }

    else if (message.length < 10) {

        setError(
            messageInput,
            messageError,
            "Message must contain at least 10 characters."
        );

        valid = false;

    }

    else {

        clearError(
            messageInput,
            messageError
        );

    }


    return valid;

}


/* =========================================
   FORM SUBMISSION
========================================= */

form.addEventListener(
    "submit",
    function (event) {

        /*
            Prevent actual page reload.
        */

        event.preventDefault();


        /*
            Hide previous success message.
        */

        successMessage.classList.remove(
            "show"
        );


        /*
            Validate everything.
        */

        const valid =
            validateForm();


        /*
            Stop if validation failed.
        */

        if (!valid) {

            return;

        }


        /*
            Show loading state.
        */

        submitButton.disabled =
            true;

        buttonText.textContent =
            "Processing...";

        buttonIcon.textContent =
            "⌛";


        /*
            Simulate sending.

            In a real project, this is where
            fetch() would send the form data
            to your backend/API.
        */

        setTimeout(
            function () {

                submitButton.disabled =
                    false;

                buttonText.textContent =
                    "Message Sent";

                buttonIcon.textContent =
                    "✓";


                /*
                    Show success message.
                */

                successMessage.classList.add(
                    "show"
                );


                /*
                    Clear form.
                */

                form.reset();


                /*
                    Reset counter.
                */

                counter.textContent =
                    "0 / 500";


                /*
                    Return button to normal
                    after a few seconds.
                */

                setTimeout(
                    function () {

                        buttonText.textContent =
                            "Send Message";

                        buttonIcon.textContent =
                            "→";

                    },
                    3000
                );

            },
            1200
        );

    }
);


/* =========================================
   REAL-TIME INPUT CLEANUP
========================================= */

nameInput.addEventListener(
    "input",
    function () {

        nameInput.classList.remove(
            "input-error"
        );

        document.getElementById(
            "nameError"
        ).textContent = "";

    }
);


emailInput.addEventListener(
    "input",
    function () {

        emailInput.classList.remove(
            "input-error"
        );

        document.getElementById(
            "emailError"
        ).textContent = "";

    }
);


subjectInput.addEventListener(
    "input",
    function () {

        subjectInput.classList.remove(
            "input-error"
        );

        document.getElementById(
            "subjectError"
        ).textContent = "";

    }
);


messageInput.addEventListener(
    "input",
    function () {

        messageInput.classList.remove(
            "input-error"
        );

        document.getElementById(
            "messageError"
        ).textContent = "";

    }
