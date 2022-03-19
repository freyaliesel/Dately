// set global variables to empty strings
var date = "";
cityArray = [];

// datepicker initialization
document.addEventListener("DOMContentLoaded", function () {
    // initialize
    M.AutoInit();
  
    // datepicker elements
    let today = new Date().toISOString().slice(0, 10);
    document.getElementById("datepicker").setAttribute("min", today);
  
    // when user picks a date in calendar, it stores date to 'userDate' variable in format yyyy-mm-dd
    $("#datepicker").datepicker({
      onSelect: function (input) {
        date = input.toISOString().substring(0, 10);
        console.log("The value of userDate is: " + date);
        document.querySelector("input").value = date;
      },
    });
  
    // when user types in a location, it autocompletes based on the list of neighborhoods
    fetch("./assets/neighborhoods.txt")
      .then((response) => {
        return response.text();
      })
      .then((text) => {
        cityArray = text.split("\n");
        let data = {};
  
        for (const key of cityArray) {
          data[key] = null;
        }
  
        $("input.autocomplete").autocomplete({
          data: data,
          minLength: 3,
          limit: 5,
        });
      });
  });
  
  // checks for valid input for location
  function checkValidInput() {
      let input = document.getElementById("location").value;
      if (cityArray.includes(input) == true) {
          return true;
      } else {
          return false;
      }
  }
  
// parses form for user input then saves in localdata for search_results page
function saveParameters() {
    // let input = localStorage.getItem("userLocSelect");
    let input = document.getElementById("location").value;

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
      if(checkValidInput()) {
        saveParameters();
    } else {
        console.log("invalid location");
    }
});


// function toggleSubmitButton () {
//   let button = document.getElementById("submit-btn");
//   let date = document.getElementById("datepicker").checkValidity();
//   if (checkValidInput() && date ){
//     button.classList.remove("disabled");

//   } else {
//     if (!button.className.includes("disabled"))  {
//       button.classList.add("disabled");
//     }
//   }
// }

document.querySelector("body").addEventListener("keydown", toggleSubmitButton());

document.querySelector("body").addEventListener("click", function(){
  toggleSubmitButton();
});

// responsive nav bar
  $(document).ready(function(){
    $('.sidenav').sidenav();
  });