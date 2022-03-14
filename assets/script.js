// set global variables to empty strings
var date = "";

// event listeners
document.addEventListener("DOMContentLoaded", function () {
    // initialize all Materialize elements
    M.AutoInit();

    // when user picks a date in calendar, it stores date to 'userDate' variable in format yyyy-mm-dd
    $("#datepicker").datepicker({
        onSelect: function (input) {
            date = input.toISOString().substring(0, 10);
            console.log("The value of userDate is: " + date);
            document.querySelector("input").value = date;
        },
    });
});

// parses form for user input then saves in localdata for search_results page
function saveParameters() {
    let input = document.getElementById("location");
    let param = {
        date: date,
        location: input.value,
    };
    localStorage.setItem("yelpParam", JSON.stringify(param));
    console.log("setting search parameters")
    // console.log(param);
}

// event listener - submits form and sends user to search_results
document
    .getElementById("submit-btn")
    .addEventListener("click", function(){
      saveParameters();
      window.location.href = "./search_results.html"
    });
