/* =====================================================
   CREATE ACCOUNT + OTP VERIFICATION
===================================================== */


/* =====================================================
   ELEMENTS
===================================================== */

const form =
    document.getElementById("createAccountForm");

const backButton =
    document.getElementById("backButton");

const nameInput =
    document.getElementById("name");

const emailInput =
    document.getElementById("email");

const phoneInput =
    document.getElementById("phone");

const degreeInput =
    document.getElementById("degree");

const branchInput =
    document.getElementById("branch");

const instituteInput =
    document.getElementById("institute");

const cgpaInput =
    document.getElementById("cgpa");

const currentYearInput =
    document.getElementById("currentYear");

const passingYearInput =
    document.getElementById("passingYear");

const addressInput =
    document.getElementById("address");

const cityInput =
    document.getElementById("city");

const stateInput =
    document.getElementById("state");

const passwordInput =
    document.getElementById("password");

const confirmPasswordInput =
    document.getElementById("confirmPassword");

const terms =
    document.getElementById("terms");

const createBtn =
    document.getElementById("createBtn");

const message =
    document.getElementById("message");

const profilePhoto =
    document.getElementById("profilePhoto");

const profileImage =
    document.getElementById("profileImage");

const photoPlaceholder =
    document.getElementById("photoPlaceholder");

const emailOtpBtn =
    document.getElementById("emailOtpBtn");

const phoneOtpBtn =
    document.getElementById("phoneOtpBtn");

const emailVerified =
    document.getElementById("emailVerified");

const phoneVerified =
    document.getElementById("phoneVerified");

const otpModal =
    document.getElementById("otpModal");

const closeOtp =
    document.getElementById("closeOtp");

const otpDescription =
    document.getElementById(
        "otpDescription"
    );

const otpInputs =
    document.querySelectorAll(".otp");

const verifyOtp =
    document.getElementById("verifyOtp");

const resendOtp =
    document.getElementById("resendOtp");

const timer =
    document.getElementById("timer");

const demoOtp =
    document.getElementById("demoOtp");

const otpMessage =
    document.getElementById(
        "otpMessage"
    );

const addressCount =
    document.getElementById(
        "addressCount"
    );

const strengthFill =
    document.getElementById(
        "strengthFill"
    );

const strengthText =
    document.getElementById(
        "strengthText"
    );

const togglePassword =
    document.getElementById(
        "togglePassword"
    );

const toggleConfirmPassword =
    document.getElementById(
        "toggleConfirmPassword"
    );


/* =====================================================
   OTP VARIABLES
===================================================== */

let currentOtp = "";

let otpType = "";

let emailIsVerified = false;

let phoneIsVerified = false;

let countdown = 60;

let timerInterval = null;


/* =====================================================
   GENERATE OTP
===================================================== */

function generateOTP() {

    return Math.floor(
        100000 +
        Math.random() * 900000
    ).toString();

}


/* =====================================================
   BACK BUTTON
===================================================== */

backButton.addEventListener(
    "click",
    () => {

        if (
            window.history.length > 1
        ) {

            window.history.back();

        } else {

            window.location.href =
                "login.html";

        }

    }
);


/* =====================================================
   PROFILE PHOTO
===================================================== */

profilePhoto.addEventListener(
    "change",
    () => {

        const file =
            profilePhoto.files[0];

        if (!file) return;


        const allowed =
            [
                "image/jpeg",
                "image/png",
                "image/jpg"
            ];


        if (
            !allowed.includes(
                file.type
            )
        ) {

            showMessage(
                "Only JPG and PNG images are allowed."
            );

            profilePhoto.value = "";

            return;

        }


        if (
            file.size >
            2 * 1024 * 1024
        ) {

            showMessage(
                "Profile photo must be below 2 MB."
            );

            profilePhoto.value = "";

            return;

        }


        const reader =
            new FileReader();


        reader.onload =
            event => {

                profileImage.src =
                    event.target.result;

                profileImage.style.display =
                    "block";

                photoPlaceholder.style.display =
                    "none";

            };


        reader.readAsDataURL(file);

    }
);


/* =====================================================
   PHONE INPUT
===================================================== */

phoneInput.addEventListener(
    "input",
    () => {

        phoneInput.value =
            phoneInput.value.replace(
                /\D/g,
                ""
            );

        phoneIsVerified = false;

        phoneVerified.classList.add(
            "hidden"
        );

    }
);


/* =====================================================
   EMAIL CHANGE
===================================================== */

emailInput.addEventListener(
    "input",
    () => {

        emailIsVerified = false;

        emailVerified.classList.add(
            "hidden"
        );

    }
);


/* =====================================================
   EMAIL OTP
===================================================== */

emailOtpBtn.addEventListener(
    "click",
    () => {

        const email =
            emailInput.value.trim();


        if (
            !isValidEmail(email)
        ) {

            showMessage(
                "Please enter a valid email address."
            );

            emailInput.focus();

            return;

        }


        openOtp(
            "email",
            email
        );

    }
);


/* =====================================================
   PHONE OTP
===================================================== */

phoneOtpBtn.addEventListener(
    "click",
    () => {

        const phone =
            phoneInput.value.trim();


        if (
            !/^[6-9]\d{9}$/.test(
                phone
            )
        ) {

            showMessage(
                "Enter a valid 10-digit mobile number."
            );

            phoneInput.focus();

            return;

        }


        openOtp(
            "phone",
            phone
        );

    }
);


/* =====================================================
   OPEN OTP MODAL
===================================================== */

function openOtp(
    type,
    destination
) {

    otpType =
        type;

    currentOtp =
        generateOTP();


    otpModal.classList.remove(
        "hidden"
    );


    otpDescription.textContent =
        type === "email"

        ? `Enter the OTP sent to ${destination}`

        : `Enter the OTP sent to +91 ${destination}`;


    /*
     * DEMO ONLY
     *
     * In a real application this OTP
     * would be sent by your backend/
     * SMS/email provider.
     */

    demoOtp.textContent =
        `Demo OTP: ${currentOtp}`;


    clearOtpInputs();

    startTimer();

    otpInputs[0].focus();

}


/* =====================================================
   OTP INPUT BEHAVIOR
===================================================== */

otpInputs.forEach(
    (input, index) => {

        input.addEventListener(
            "input",
            () => {

                input.value =
                    input.value.replace(
                        /\D/g,
                        ""
                    );


                if (
                    input.value &&
                    index <
                    otpInputs.length - 1
                ) {

                    otpInputs[
                        index + 1
                    ].focus();

                }

            }
        );


        input.addEventListener(
            "keydown",
            event => {

                if (
                    event.key ===
                    "Backspace" &&
                    !input.value &&
                    index > 0
                ) {

                    otpInputs[
                        index - 1
                    ].focus();

                }

            }
        );

    }
);


/* =====================================================
   GET ENTERED OTP
===================================================== */

function getEnteredOtp() {

    let otp = "";

    otpInputs.forEach(
        input => {

            otp += input.value;

        }
    );

    return otp;

}


/* =====================================================
   VERIFY OTP
===================================================== */

verifyOtp.addEventListener(
    "click",
    () => {

        const enteredOtp =
            getEnteredOtp();


        if (
            enteredOtp.length !== 6
        ) {

            otpMessage.textContent =
                "Please enter all 6 digits.";

            return;

        }


        if (
            enteredOtp !== currentOtp
        ) {

            otpMessage.textContent =
                "Incorrect OTP. Please try again.";

            return;

        }


        /*
         * OTP SUCCESS
         */

        otpMessage.style.color =
            "#22c55e";

        otpMessage.textContent =
            "✓ Verification successful";


        if (
            otpType === "email"
        ) {

            emailIsVerified =
                true;

            emailVerified.classList.remove(
                "hidden"
            );

            emailOtpBtn.textContent =
                "✓ Verified";

            emailOtpBtn.classList.add(
                "verified-btn"
            );

        }


        if (
            otpType === "phone"
        ) {

            phoneIsVerified =
                true;

            phoneVerified.classList.remove(
                "hidden"
            );

            phoneOtpBtn.textContent =
                "✓ Verified";

            phoneOtpBtn.classList.add(
                "verified-btn"
            );

        }


        setTimeout(
            closeOtpModal,
            800
        );

    }
);


/* =====================================================
   CLOSE OTP
===================================================== */

closeOtp.addEventListener(
    "click",
    closeOtpModal
);


function closeOtpModal() {

    otpModal.classList.add(
        "hidden"
    );

    clearInterval(
        timerInterval
    );

}


/* =====================================================
   CLEAR OTP
===================================================== */

function clearOtpInputs() {

    otpInputs.forEach(
        input => {

            input.value = "";

        }
    );

    otpMessage.textContent =
        "";

}


/* =====================================================
   OTP TIMER
===================================================== */

function startTimer() {

    clearInterval(
        timerInterval
    );


    countdown = 60;

    timer.textContent =
        countdown;

    resendOtp.disabled =
        true;


    timerInterval =
        setInterval(
            () => {

                countdown--;

                timer.textContent =
                    countdown;


                if (
                    countdown <= 0
                ) {

                    clearInterval(
                        timerInterval
                    );

                    resendOtp.disabled =
                        false;

                    timer.textContent =
                        "0";

                }

            },
            1000
        );

}


/* =====================================================
   RESEND OTP
===================================================== */

resendOtp.addEventListener(
    "click",
    () => {

        currentOtp =
            generateOTP();


        demoOtp.textContent =
            `Demo OTP: ${currentOtp}`;


        otpMessage.style.color =
            "#22c55e";

        otpMessage.textContent =
            "A new OTP has been generated.";


        clearOtpInputs();

        startTimer();

        otpInputs[0].focus();

    }
);


/* =====================================================
   PASSWORD SHOW / HIDE
===================================================== */

togglePassword.addEventListener(
    "click",
    () => {

        togglePasswordVisibility(
            passwordInput,
            togglePassword
        );

    }
);


toggleConfirmPassword.addEventListener(
    "click",
    () => {

        togglePasswordVisibility(
            confirmPasswordInput,
            toggleConfirmPassword
        );

    }
);


function togglePasswordVisibility(
    input,
    button
) {

    if (
        input.type ===
        "password"
    ) {

        input.type =
            "text";

        button.textContent =
            "🙈";

    } else {

        input.type =
            "password";

        button.textContent =
            "👁";

    }

}


/* =====================================================
   PASSWORD STRENGTH
===================================================== */

passwordInput.addEventListener(
    "input",
    () => {

        const password =
            passwordInput.value;

        let score = 0;


        if (
            password.length >= 8
        ) score++;


        if (
            password.length >= 12
        ) score++;


        if (
            /[A-Z]/.test(password)
        ) score++;


        if (
            /[0-9]/.test(password)
        ) score++;


        if (
            /[^A-Za-z0-9]/.test(password)
        ) score++;


        const levels = [

            ["0%", "Password strength"],

            ["20%", "Very Weak"],

            ["40%", "Weak"],

            ["60%", "Medium"],

            ["80%", "Strong"],

            ["100%", "Very Strong"]

        ];


        strengthFill.style.width =
            levels[score][0];

        strengthText.textContent =
            levels[score][1];

    }
);


/* =====================================================
   ADDRESS COUNTER
===================================================== */

addressInput.addEventListener(
    "input",
    () => {

        addressCount.textContent =
            addressInput.value.length;

    }
);


/* =====================================================
   EMAIL VALIDATION
===================================================== */

function isValidEmail(
    email
) {

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        .test(email);

}


/* =====================================================
   MESSAGE
===================================================== */

function showMessage(
    text,
    type = "error"
) {

    message.textContent =
        text;

    message.style.color =
        type === "success"
            ? "#22c55e"
            : "#ef4444";

}


/* =====================================================
   FORM VALIDATION
===================================================== */

form.addEventListener(
    "submit",
    event => {

        event.preventDefault();


        /* OTP CHECK */

        if (
            !emailIsVerified
        ) {

            showMessage(
                "Please verify your email with OTP."
            );

            emailOtpBtn.focus();

            return;

        }


        if (
            !phoneIsVerified
        ) {

            showMessage(
                "Please verify your mobile number with OTP."
            );

            phoneOtpBtn.focus();

            return;

        }


        /* PROFILE PHOTO */

        if (
            !profilePhoto.files.length
        ) {

            showMessage(
                "Please upload your profile photo."
            );

            return;

        }


        /* PERSONAL */

        if (
            nameInput.value.trim().length < 2
        ) {

            showMessage(
                "Please enter your full name."
            );

            nameInput.focus();

            return;

        }


        /* EDUCATION */

        if (
            degreeInput.value === ""
        ) {

            showMessage(
                "Please select your degree."
            );

            degreeInput.focus();

            return;

        }


        if (
            branchInput.value === ""
        ) {

            showMessage(
                "Please select your branch."
            );

            branchInput.focus();

            return;

        }


        if (
            instituteInput.value.trim().length < 3
        ) {

            showMessage(
                "Please enter your institute."
            );

            instituteInput.focus();

            return;

        }


        const cgpa =
            Number(
                cgpaInput.value
            );


        if (
            isNaN(cgpa) ||
            cgpa < 0 ||
            cgpa > 10
        ) {

            showMessage(
                "CGPA must be between 0 and 10."
            );

            cgpaInput.focus();

            return;

        }


        if (
            currentYearInput.value === ""
        ) {

            showMessage(
                "Please select your current year."
            );

            return;

        }


        if (
            passingYearInput.value === ""
        ) {

            showMessage(
                "Please select your passing year."
            );

            return;

        }


        /* ADDRESS */

        if (
            addressInput.value.trim().length < 10
        ) {

            showMessage(
                "Please enter your complete address."
            );

            addressInput.focus();

            return;

        }


        if (
            cityInput.value.trim().length < 2 ||
            stateInput.value.trim().length < 2
        ) {

            showMessage(
                "Please enter your city and state."
            );

            return;

        }


        /* PASSWORD */

        const password =
            passwordInput.value;


        if (
            password.length < 8 ||
            !/[A-Z]/.test(password) ||
            !/[a-z]/.test(password) ||
            !/[0-9]/.test(password)
        ) {

            showMessage(
                "Password must contain 8 characters, uppercase, lowercase and a number."
            );

            passwordInput.focus();

            return;

        }


        if (
            password !==
            confirmPasswordInput.value
        ) {

            showMessage(
                "Passwords do not match."
            );

            confirmPasswordInput.focus();

            return;

        }


        /* TERMS */

        if (
            !terms.checked
        ) {

            showMessage(
                "Please accept the Terms & Conditions."
            );

            return;

        }


        /* =========================================
           SAVE PROFILE
        ========================================== */

        const profileData = {

            name:
                nameInput.value.trim(),

            email:
                emailInput.value.trim(),

            phone:
                phoneInput.value.trim(),

            degree:
                degreeInput.value,

            branch:
                branchInput.value,

            institute:
                instituteInput.value.trim(),

            cgpa:
                cgpa,

            currentYear:
                currentYearInput.value,

            passingYear:
                passingYearInput.value,

            address:
                addressInput.value.trim(),

            city:
                cityInput.value.trim(),

            state:
                stateInput.value.trim(),

            emailVerified:
                emailIsVerified,

            phoneVerified:
                phoneIsVerified

        };


        localStorage.setItem(
            "profileData",
            JSON.stringify(
                profileData
            )
        );


        /*
         * Do NOT store the password
         * in localStorage in a real
         * application.
         */


        /* =========================================
           SUCCESS
        ========================================== */

        createBtn.disabled =
            true;

        createBtn.textContent =
            "✓ Account Created";


        showMessage(
            "Account created successfully! Redirecting...",
            "success"
        );


        setTimeout(
            () => {

                window.location.href =
                    "login.html";

            },
            1800
        );

    }
);


/* =====================================================
   DYNAMIC PASSING YEAR
===================================================== */

const currentYear =
    new Date().getFullYear();


for (
    let year =
        currentYear;
    year <=
        currentYear + 8;
    year++
) {

    const option =
        document.createElement(
            "option"
        );

    option.value =
        year;

    option.textContent =
        year;

    passingYear.appendChild(
        option
    );

}


/* =====================================================
   ESC KEY
===================================================== */

document.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Escape" &&
            !otpModal.classList.contains(
                "hidden"
            )
        ) {

            closeOtpModal();

        }

    }
);


/* =====================================================
   INITIALIZATION
===================================================== */

console.log(
    "ECE Create Account + OTP system initialized."
);