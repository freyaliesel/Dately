let service;
var elem = document.querySelector("#restaurants");

function initSearch() {
    console.log("initsearch");
    const location = {
    lat: 41.84582,
    lng: -87.62474
  };
  service = new google.maps.places.PlacesService(elem);
  service.textSearch(
    {
      location: location,
      radius: 100,
      query: "restaurant"
    },
    callback
  );
}

function callback(results, status) {
  if (status === google.maps.places.PlacesServiceStatus.OK && results) {
      for (var i = 0; i < results.length; i++) {
        console.log(results[i]);
      }
    }
  }
