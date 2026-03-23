document.addEventListener("DOMContentLoaded", function() {
    /* variables */
    const signUpForm = document.querySelector("#signup-form");
    const letter = document.querySelector("#letter");
    const capital = document.querySelector("#capital");
    const number = document.querySelector("#number");
    const length = document.querySelector("#length");

    const valid_letters = /[a-z]/g;
    const valid_capital = /[A-Z]/g;
    const valid_number = /[0-9]/g;
    const valid_length = 8;

    const entered_pswd = document.querySelector("#pswd");
    const confirmed_pswd = document.querySelector("#confirm_pswd");
    const createAccBtn = document.querySelector("#create_acc");

    let isPasswordValid = false;
    // password includes the necessary values
    entered_pswd.addEventListener("keyup", e=> {
        let user_input = e.target.value;

        isPasswordValid = false;

        console.log(user_input);
        
        if (user_input.match(valid_letters)) {
            letter.classList.add("valid");
        }
        else {
            letter.classList.remove("valid");
        }
        if (user_input.match(valid_capital)) {
            capital.classList.add("valid");
        }
        else {
            capital.classList.remove("valid");
        }
        if (user_input.match(valid_number)) {
            number.classList.add("valid");
        }
        else {
            number.classList.remove("valid");
        }
        if (user_input.length >= valid_length) {
            length.classList.add("valid");
        }
        else {
            length.classList.remove("valid");
        }

        if (user_input.match(valid_letters) && user_input.match(valid_capital)
        && user_input.match(valid_number) && user_input.length >= valid_length) {
            isPasswordValid = true;
        }
    });

    // password confirmed correctly
    createAccBtn.addEventListener("click", e => {
        e.preventDefault();
        let pswd = String(entered_pswd.value);
        let conf_pswd = String(confirmed_pswd.value);

        if (pswd === conf_pswd && isPasswordValid) {
            console.log("Passwords Match!")
            signUpForm.submit();
        }
        else {
            console.log("Passwords Do Not Match!")
        }
    })

});