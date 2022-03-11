// figuring out google maps stuff

// This example requires the Places library. Include the libraries=places
// parameter when you first load the API. For example:
// <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places">
let map;
let service;
let infowindow;

function initMap() {
    const location = new google.maps.LatLng(41.90362, -87.67588);

    infowindow = new google.maps.InfoWindow();
    map = new google.maps.Map(document.getElementById("map"), {
        center: location,
        zoom: 16,
    });

    const request = {
        query: "Empty Bottle",
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

// figuring out Yelp stuff

var date = dayjs().unix();
var place = "logansquare";

// use cors-anywhere to access yelp API
// accepts 2 variables as input: locaiton and date in unix
function accessYelp(place, date) {
    let url =
        "https://cors-anywhere-bc.herokuapp.com/https://api.yelp.com/v3/events?";
    let location = "location=" + place;
    let startDate = "&start_date=" + date;
    let results = "&limit=10";
    let excluded = "&excluded_events=chicago-chicago-bachelor-party-exotic-dancers-topless-nudy-waitresses-call-us-312-488-4673"
    fetch(url + location + startDate + results + excluded, {
        method: "get",
        headers: new Headers({
            Authorization:
                "Bearer DdZGPiM69U6N1FeqeFAXnUK8NSX_7W9ozcMbNxCnJA16g309AiVdccMB2B9PEf8U7-aLoMGc3yp0H6ynxVMrVwgYHYJsMP7tqXt66pwj0kJDkBr4Mb34W-PjwGEpYnYx",
        }),
    })
        .then((response) => response.json())
        .then((data) => parseResults(data.events));
}

accessYelp(place, date);

function parseResults(events) {
    console.log("displaying results");
    console.log(events);
    let displayEl = document.getElementById("results");

    events.forEach((event) => {
        let imgEl = document.createElement("img");
        displayEl.appendChild(imgEl);
        imgEl.setAttribute("src", event.image_url);
        imgEl.style.maxHeight = "300px";
        imgEl.style.maxWidth = "500px";

        let nameEl = document.createElement("ul");
        let li = document.createElement("li");
        displayEl.appendChild(nameEl);
        nameEl.appendChild(li);
        li.textContent = event.name;

        li = document.createElement("li");
        nameEl.appendChild(li);
        li.textContent = event.category;

        li = document.createElement("li");
        nameEl.appendChild(li);
        li.textContent = event.description;

        li = document.createElement("li");
        nameEl.appendChild(li);
        li.textContent = "$" + event.cost;

        li = document.createElement("li");
        nameEl.appendChild(li);
        let a = document.createElement("a");
        li.appendChild(a);
        a.setAttribute("href", event.event_site_url);
        a.textContent = event.name;

        li = document.createElement("li");
        nameEl.appendChild(li);
        li.textContent = "location: " + event.location.address1;

        li = document.createElement("li");
        nameEl.appendChild(li);
        li.textContent = `coordinates: ${event.latitude}, ${event.longitude}`;

        li = document.createElement("li");
        nameEl.appendChild(li);
        a = document.createElement("a");
        li.appendChild(a);
        a.setAttribute("href", event.tickets_url);
        a.textContent = "Link to Yelp Event";

        li = document.createElement("li");
        nameEl.appendChild(li);
        li.textContent = dayjs(event.time_start).format("ddd, MMM D, h:mma");
        // dayjs.utc(event.time_start).local().format("ddd, MMM D, h:mma")
    });
}
