"use strict"

/* IC: Declare global variables to store user-entered information and results here */
let choice, amount;

/* IC: We have set up the form buttons for you, as well as the code that will clear the output once the user has successfully filled out the form and the program has given them final output (instead of telling them they need to correct something). We have set things up so that the output area is cleared, but the form remains filled out. This is to make it easier to test your project with slightly different versions of information rather than having to fill out the whole form every time. */

document.getElementById("submit").addEventListener("click", processForm);

document.getElementById("reset").addEventListener("click", function () {
    clear();
    document.getElementById("submit").toggleAttribute("hidden");
    document.getElementById("reset").toggleAttribute("hidden");
});

function processForm() {
    choice = document.getElementById("opt").value; //1 2 3
    amount = document.getElementById("quant").value.trim();

    /* IC: This code looks for a true or false for whether the data is valid. It only continues to evaluate the answers if the data is valid. You DO NOT need to modify any code between here and the end of the function, nor should you, unless you have a good reason. All versions of this project can be completed WITHOUT modifying the code from this comment to the end of the function, so you should attempt to work with that restriction! */

    let evaluationCompleted = false;

    if (validateData()) {
        evaluationCompleted = evaluateAnswers();
    }

    if (evaluationCompleted) {
        document.getElementById("submit").toggleAttribute("hidden");
        document.getElementById("reset").toggleAttribute("hidden");
    } else {
        rule();
    }
}

/* IC: In this function, do any validation with validate the data was correctly entered in general, not for specific cases. Return false if you have told the user that they need to correct something. Return true if all data is valid. We have provided you with the basic constraints for the data, but you may improve the validation as a bonus (as long as you don't mess up our ability to test every option in your evaluateAnswers function!) */

function validateData() {
    let valid = true;

    if (amount.length !== 9) {
        output("Please enter a 9-digit number (digits only).");
        return false;
    }
   
    for (let i = 0; i < amount.length; i++) {
        const ch = amount[i];
        if (ch < '0' || ch > '9') {
            output("Please enter a 9-digit number (digits only).");
            return false;
        }
    }

    if (!["1", "2", "3"].includes(choice)) {
        output("Please select a valid option.");
        return false;
    }
    return true;
}

/* IC: In this function, use conditional logic to figure out if the user's input meets all of the constraints that we have provided. Return false if you have told the user that they need to correct something. Return true if all data is valid. NOTE: Although the focuses of this project are conditional logic and function returns, you may need to create additional variables, do some calculations, and/or do some String manipulation in order to successfully complete your project! */

function evaluateAnswers() {
    output("All form data is valid.");
    return true;
}
/* TIP: The above two functions are written using different techniques for communicating success or failure. In your project, we will be looking for consistency -- i.e., choose ONE of these methods (early returns, or tracking the success in a variable) and use it throughout your project! */