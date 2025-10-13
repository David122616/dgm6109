"use strict"

let routing, type, locationName;

document.getElementById("submit").addEventListener("click", processFormValues);

document.getElementById("reset").addEventListener("click", function () {
    clear();
    document.getElementById("submit").toggleAttribute("hidden");
    document.getElementById("reset").toggleAttribute("hidden");
});

/* IC: Process your form values here */

function processFormValues() {

 routing = document.getElementById("routing").value.trim();
 type = document.getElementById("type").value;
 locationName = document.getElementById("location").value;
clear(); // clear old output on each submit

// Validate first; only process when valid
if(validateData())   {
processData();
// swap buttons after success
document.getElementById("submit").toggleAttribute("hidden");
document.getElementById("reset").toggleAttribute("hidden");
}
}

/* ==========================================
   validateData()
   Checks:
   1) routing is exactly 9 digits
   2) type is one of 4 options
   3) location is one of 3 options
   4) type <-> routing rules; local deposit uses
      location <-> routing prefix rules
   Returns true if valid, otherwise outputs
   an error message and returns false.
   ========================================== */
function validateData() {
  // 1) shape of routing
  if (routing.length !== 9 || isNaN(Number(routing))) {
    output("Please enter a 9-digit routing number (digits only).");
    return false; // early return
  }


/* IC: Use this function to check that all form values (that are not limited by HTML) are within accepable ranges. Output an error and return false if not. If you want to divide your validate function into smaller functions, then call the additional functions from this one. */ 

// valid type
if (
    !(
      type === "Treasury check" ||
      type === "Money order" ||
      type === "Savings bond" ||
      type === "Local deposit"
    )
  ) {
    output("Please select a valid transaction type.");
    return false;
  }
// valid location
if (
    !(
      locationName === "Cleveland, OH" ||
      locationName === "Peoria, IL" ||
      locationName === "Chicago, IL"
    )
  ) {
    output("Please select a valid transaction location.");
    return false;
  }
  //type-specific routing checks
if (type === "Treasury check") {
    if (routing !== "000000518") {
      output("The routing number is incorrect for this type of transaction.");
      return false;
    }
  } else if (type === "Money order") {
    if (
      !(
        routing === "000000204" ||
        routing === "000001193" ||
        routing === "000008002"
      )
    ) {
      output("The routing number is incorrect for this type of transaction.");
      return false;
    }
  } else if (type === "Savings bond") {
    if (routing !== "000090007") {
      output("The routing number is incorrect for this type of transaction.");
      return false;
    }
  } else if (type === "Local deposit") {
    // first 4 digits must match the chosen location
    let prefix4 = routing.substring(0, 4);


    let isClevelandOk =
      locationName === "Cleveland, OH" && (prefix4 === "0410" || prefix4 === "0412");
    let isPeoriaOk =
      locationName === "Peoria, IL" && prefix4 === "0711";
    let isChicagoOk =
      locationName === "Chicago, IL" &&
      (prefix4 === "0710" || prefix4 === "0712" || prefix4 === "0719");

    if (!(isClevelandOk || isPeoriaOk || isChicagoOk)) {
      output("The routing number is incorrect for this transaction location.");
      return false;
    }
  }
  // all checks passed
  return true;
}

   function processData() {
  let partial = buildPartialView(routing);
  let code = buildConfirmationCode(routing);

  let msg =
    "Your " +
    type +
    " has been initiated at our branch in " +
    locationName +
    " using routing number " +
    partial +
    " (only the last 4 digits are shown, for security purposes). " +
    "Your confirmation code is " +
    code +
    ".";
    output(msg);
}

function buildPartialView(routing) {
  let mid = routing.substring(5, 8); 
  let last = routing.substring(8); 
  return "XXXX-X" + mid + "-" + last;
}


function buildConfirmationCode(routing) {
  function sum3(start) {
    
    return (
      Number(routing[start]) +
      Number(routing[start + 1]) +
      Number(routing[start + 2])
    );
  }
  let s1 = String(sum3(0)).padStart(2, "0");
  let s2 = String(sum3(3)).padStart(2, "0");
  let s3 = String(sum3(6)).padStart(2, "0");
  return s1 + s2 + s3;
}