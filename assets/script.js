// set global variables to empty strings
var date = "";

// event listeners
document.addEventListener("DOMContentLoaded", function () {
    // modal section
    var elems = document.querySelectorAll(".modal");
    var instances = M.Modal.init(elems);

    // datepicker section
    // jquery is the only option here due to how datepicker is written in materialize
    // when user picks a date in calendar, it stores date to 'userDate' variable in format yyyy-mm-dd
    var elems = document.querySelectorAll(".datepicker");
    var instances = M.Datepicker.init(elems);
    $("#datepicker").datepicker({
        onSelect: function (input) {
            date = input.toISOString().substring(0, 10);
            console.log("The value of userDate is: " + date);
            document.querySelector("input").value = date;
        },
    });

  // dropdown section
  // when user picks a location from dropdown, it stores location in 'userLocation' variable
  var dropSelect = document.getElementById("dropdown").addEventListener('change', function() {
    userLocation = this.value;
    console.log("The value of userLocation is: " + userLocation);
  });
});
