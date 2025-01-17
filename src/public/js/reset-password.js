let isBusy = false

const form = document.getElementById("resetPasswordForm");
if (form) {
    form.addEventListener('submit', handleSubmit); // 'handleSubmit' is the name of your function
}
const passwordInput = document.getElementById("password")
const confirmPasswordInput = document.getElementById("confirmPassword");
const showPasswordButton = document.getElementById("show-password")
const showPasswordConfirmationButton = document.getElementById("show-password-confirmation")

const messageEl = document.getElementById('resultMessage')
const resendButton = document.getElementById('resendButton')
if (resendButton) {
    resendButton.addEventListener('click', onResendCode)
}

function disableForm() {
    isBusy = true
    document.getElementById("submitButton").style.display = 'none';
    document.getElementById("loader").style.display = "unset";
}


const strengthMeter = document.getElementById('strengthMeter');
const strengthFeedback = document.getElementById('strengthFeedback');
const passwordStrengthSuggestion = document.getElementById('strengthSuggestion');

showPasswordButton.addEventListener('mousedown', () => showPassword(passwordInput, showPasswordButton));
showPasswordButton.addEventListener('mouseup', () => hidePassword(passwordInput, showPasswordButton));
showPasswordButton.addEventListener('mouseleave', () => hidePassword(passwordInput, showPasswordButton));
showPasswordConfirmationButton.addEventListener('mousedown', () => showPassword(confirmPasswordInput, showPasswordConfirmationButton));
showPasswordConfirmationButton.addEventListener('mouseup', () => hidePassword(confirmPasswordInput, showPasswordConfirmationButton));
showPasswordConfirmationButton.addEventListener('mouseleave', () => hidePassword(confirmPasswordInput, showPasswordConfirmationButton));

function showPassword(input, button) {
    input.type = 'text';
    button.textContent = 'Hide';
}

function hidePassword(input, button) {
    input.type = 'password';
    button.textContent = 'Show';
}
confirmPasswordInput.addEventListener('input', () => {
    if (passwordInput.value) {
        validateConfirmPassword()
    }
})
passwordInput.addEventListener('input', () => {
    const password = passwordInput.value;
    const result = checkPasswordStrength(password);
    if (result.score > 2) {
        passwordInput.setCustomValidity("")
        passwordInput.reportValidity()
    }
    // Update the strength meter
    strengthMeter.value = result.score; // Score ranges from 0 (weak) to 4 (strong)

    // Provide feedback to the user:
    switch (result.score) {
        case 0:
            strengthFeedback.textContent = "Very weak";
            strengthFeedback.style.color = "red";
            break;
        case 1:
            strengthFeedback.textContent = "Weak";
            strengthFeedback.style.color = "orange";
            strengthMeter.style.accentColor = "orange"

            break;
        case 2:
            strengthFeedback.textContent = "Fair";
            break;
        case 3:
            strengthFeedback.textContent = "Good";
            strengthFeedback.style.color = "green";
            strengthMeter.style.accentColor = "green"

            break;
        case 4:
            strengthFeedback.textContent = "Strong";
            strengthFeedback.style.color = "darkgreen";
            strengthMeter.style.accentColor = "darkgreen"

            break;
        default:
            strengthFeedback.textContent = "";
    }

    if (result.feedback.warning) {
        strengthFeedback.textContent = `${result.feedback.warning}`
    }
    if (result.feedback.suggestions.length) {
        passwordStrengthSuggestion.textContent = `${result.feedback.suggestions.join(" ")}`
    } else {
        passwordStrengthSuggestion.textContent = ''
    }
});
const options = {
    translations: zxcvbnts['language-en'].translations,
    graphs: zxcvbnts['language-common'].adjacencyGraphs,
    dictionary: {
        ...zxcvbnts['language-common'].dictionary,
        ...zxcvbnts['language-en'].dictionary,
    },
    useLevenshteinDistance: true,
}
zxcvbnts.core.zxcvbnOptions.setOptions(options)
function checkPasswordStrength(password) {
    return zxcvbnts.core.zxcvbn(password)
}

async function handleSubmit(event) {
    if (isBusy) {
        return
    }

    if (!validateConfirmPassword() || !validatePassword()) {
        event.preventDefault(); // Prevent form submission because of invalid input
    } else {
        disableForm()
    }
    return
}
function onResendCode() {
}
function validateConfirmPassword() {
    let error = ""

    if (passwordInput.value !== confirmPasswordInput.value) {
        error = "Passwords Don't Match"
    } else {
        error = ""
    }
    confirmPasswordInput.setCustomValidity(error);

    confirmPasswordInput.reportValidity();
    return error === "";
}
function validatePassword() {

    const strength = checkPasswordStrength(passwordInput.value)
    const error = getPasswordValidationMessage(strength.score)

    passwordInput.setCustomValidity(error)
    passwordInput.reportValidity();
    return error === "";

}
function getPasswordValidationMessage(score) {
    if (score <= 2) {
        return "Please use a stronger password"
    } else {
        return ""
    }
}