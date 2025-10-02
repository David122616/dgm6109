"use strict";
document.getElementById("submit")
    .addEventListener("click", function () {
        let fahrenheit = document.getElementById("inputF").value;//Beijing Jan 2025 average temp in 57°F： https://zh.weatherspark.com/h/y/131055/2025/2025%E5%B9%B4-in-%E4%B8%AD%E5%9B%BD%E3%80%81%E5%8C%97%E4%BA%AC%E5%B8%82%E6%9C%9F%E9%97%B4%E7%9A%84%E5%8E%86%E5%8F%B2%E5%A4%A9%E6%B0%94#google_vignette
        let conversionType = document.getElementById("conversionChoice").value;
        let celsius = (fahrenheit - 32) * 5 / 9;
        let kelvin = celsius + 273.15;
        output("Temperature (fahrenheit): " + fahrenheit);
        if (conversionType === "c") {
            output("Temperature (celsius): " + celsius);
        }
        else { output("Temperature (kelvin): " + kelvin); }
        //I think both if/else and if/if are good, and to me personally they are very similar, but if/else seems easier to understand.

         /* if (conversionType === "c") {
            output("Temperature (celsius): " + celsius);
        }
        else { output("Temperature (kelvin): " + kelvin); } */
    });
