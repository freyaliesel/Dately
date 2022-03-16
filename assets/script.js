// set global variables to empty strings
var date = "";
var cityArray = [];

// datepicker initialization
document.addEventListener("DOMContentLoaded", function () {
    // initialize
    M.AutoInit();

    // datepicker elements
    let today = new Date().toISOString().slice(0, 10)
    document.getElementById("datepicker").setAttribute('min', today);

    // when user picks a date in calendar, it stores date to 'userDate' variable in format yyyy-mm-dd
    $("#datepicker").datepicker({
        onSelect: function (input) {
            date = input.toISOString().substring(0, 10);
            console.log("The value of userDate is: " + date);
            document.querySelector("input").value = date;
        },
    });

    // autocomplete
    var data = {};

    // when user types in a location, it autocompletes based on the list of neighborhoods
    fetch('./assets/neighborhoods.txt')
	.then((response) => {
  		return response.text();
	})
	.then((text) => {
        cityArray = text.split('\n');
        
        for (const key of cityArray) {
            data[key] = null;
        }
    
      $('input.autocomplete').autocomplete({
            data: data,
            minLength: 3,
            limit: 5,
            onAutocomplete: function(val) {
                localStorage.setItem("userLocSelect", val);
            }
      });
    });
});

// parses form for user input then saves in localdata for search_results page
function saveParameters() {
    let input = localStorage.getItem("userLocSelect");

    if (input && date) {
        console.log("setting search parameters");
        let param = {
            date: date,
            location: input,
        };
        localStorage.setItem("yelpParam", JSON.stringify(param));
        window.location.href = "./search.html";
    }
}

// event listener - submits form and sends user to search_results
document.getElementById("submit-btn").addEventListener("click", function (event) {
    event.preventDefault();
    saveParameters();
});
