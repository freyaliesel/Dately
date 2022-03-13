// set global variables to empty strings
var date = "";

// event listeners
document.addEventListener("DOMContentLoaded", function () {
    // modal section
    // var elems = document.querySelectorAll(".modal");
    // var instances = M.Modal.init(elems);
    M.AutoInit();
    // datepicker section
    // jquery is the only option here due to how datepicker is written in materialize
    // when user picks a date in calendar, it stores date to 'userDate' variable in format yyyy-mm-dd
    // var elems = document.querySelectorAll(".datepicker");
    // instances = M.Datepicker.init(elems);
    $("#datepicker").datepicker({
        onSelect: function (input) {
            date = input.toISOString().substring(0, 10);
            console.log("The value of userDate is: " + date);
            document.querySelector("input").value = date;
        },
    });
});

function saveParameters() {
    let input = document.getElementById("location");
    let param = {
        date: date,
        location: input.value,
    };
    localStorage.setItem("yelpParam", JSON.stringify(param));
    // console.log(param);
}

document
    .getElementById("submit-btn")
    .addEventListener("click", function(){
      saveParameters();
      window.location.href = "./search_results.html"
    });
