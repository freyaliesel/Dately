// This example requires the Places library. Include the libraries=places
// parameter when you first load the API. For example:
// <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places">
let map;
let service;
let infowindow;

function initMap() {
    const sydney = new google.maps.LatLng(41.90362, -87.67588);

    infowindow = new google.maps.InfoWindow();
    map = new google.maps.Map(document.getElementById("map"), {
        center: sydney,
        zoom: 15,
    });

    const request = {
        query: "Wicker Park",
        fields: ["name", "geometry"],
    };

    service = new google.maps.places.PlacesService(map);
    service.findPlaceFromQuery(request, (results, status) => {
        console.log(results);
        if (status === google.maps.places.PlacesServiceStatus.OK && results) {
            for (let i = 0; i < results.length; i++) {
                createMarker(results[i]);
            }

            map.setCenter(results[0].geometry.location);
        }
    });
}

function createMarker(place) {
    if (!place.geometry || !place.geometry.location) return;

    const marker = new google.maps.Marker({
        map,
        position: place.geometry.location,
    });

    google.maps.event.addListener(marker, "click", () => {
        infowindow.setContent(place.name || "");
        infowindow.open(map);
    });
}





var date = dayjs().unix();
var place = "chicago"

// use cors-anywhere to access yelp API
// accepts 2 variables as input: locaiton and date in unix
function accessYelp(place, date) {
    let url =
        "https://cors-anywhere-bc.herokuapp.com/https://api.yelp.com/v3/events?";
    let location = "location=" + place;
    let startDate = "&start_date=" + date;
    fetch(url + location + startDate, {
        method: "get",
        headers: new Headers({
            Authorization:
                "Bearer DdZGPiM69U6N1FeqeFAXnUK8NSX_7W9ozcMbNxCnJA16g309AiVdccMB2B9PEf8U7-aLoMGc3yp0H6ynxVMrVwgYHYJsMP7tqXt66pwj0kJDkBr4Mb34W-PjwGEpYnYx",
        }),
    })
        .then((response) => response.json())
        .then((data) => console.log(data));
}

accessYelp(place, date);