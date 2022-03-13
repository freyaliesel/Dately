// implementing Yelp API

function retrieveLocation() {
    let searchParameters = JSON.parse(localStorage.getItem("searchParameters"));
    searchParameters.date = dayjs(searchParameters.date).unix();
    searchParameters.location = searchParameters.location.replace(/\s/g, "");
    return searchParameters;
}
// console.log(retrieveLocation());

// use cors-anywhere to access yelp API
// accepts 2 variables as input: locaiton and date in unix
function accessYelp() {
    let param = retrieveLocation();
    let url =
        "https://cors-anywhere-bc.herokuapp.com/https://api.yelp.com/v3/events?";
    let location = "location=" + param.location;
    let startDate = "&start_date=" + param.date;
    let results = "&limit=10";
    let excluded =
        "&excluded_events=chicago-chicago-bachelor-party-exotic-dancers-topless-nudy-waitresses-call-us-312-488-4673";
    fetch(url + location + startDate + results + excluded, {
        method: "get",
        headers: new Headers({
            Authorization:
                "Bearer DdZGPiM69U6N1FeqeFAXnUK8NSX_7W9ozcMbNxCnJA16g309AiVdccMB2B9PEf8U7-aLoMGc3yp0H6ynxVMrVwgYHYJsMP7tqXt66pwj0kJDkBr4Mb34W-PjwGEpYnYx",
        }),
    })
        .then((response) => response.json())
        .then(function (data) {
            generateEventResults(data);
            localStorage.setItem("yelpData", JSON.stringify(data));
        });
}

function generateEventResults(data) {
    console.log("displaying results");
    let events = data.events;
    console.log(events);
    let displayEl = document.getElementById("yelp-results");
    let index = 0;
    events.forEach((event) => {
        // create card
        let cardEl = document.createElement("div");
        cardEl.className = "card event text-black";
        cardEl.id = `card-${index}`;
        displayEl.appendChild(cardEl);
        index++;

        // div for image
        let divEl = document.createElement("div");
        cardEl.appendChild(divEl);
        divEl.className = "card-image";

        // image
        let imgEl = document.createElement("img");
        imgEl.className = "activator";
        imgEl.setAttribute("src", event.image_url);
        divEl.appendChild(imgEl);

        // add button
        let buttonEl = document.createElement("button");
        buttonEl.className =
            "btn-floating halfway-fab waves-effect waves-light pink";
        divEl.appendChild(buttonEl);
        let iEl = document.createElement("i");
        iEl.className = "material-icons bucketlist-add";
        iEl.textContent = "place";
        buttonEl.appendChild(iEl);

        // card content
        divEl = document.createElement("div");
        cardEl.appendChild(divEl);
        divEl.className = "card-content";

        // event name
        let spanEl = document.createElement("span");
        spanEl.className = "card-title activator";
        spanEl.textContent = event.name;
        divEl.appendChild(spanEl);

        // create div for revealed content
        divEl = document.createElement("div");
        cardEl.appendChild(divEl);
        divEl.className = "card-reveal";

        spanEl = document.createElement("span");
        divEl.appendChild(spanEl);
        spanEl.className = "card-title";
        iEl = document.createElement("i");
        spanEl.appendChild(iEl);
        iEl.className = "material-icons right";
        iEl.textContent = "close";
        iEl.style.color = "black";

        // date of event
        pEl = document.createElement("p");
        divEl.appendChild(pEl);
        pEl.textContent = dayjs(event.time_start).format("ddd, MMM D, h:mma");

        // cost
        pEl = document.createElement("p");
        divEl.appendChild(pEl);
        event.cost !== null
            ? (pEl.textContent = "$" + event.cost)
            : (pEl.textContent = "Free");

        // event address
        pEl = document.createElement("p");
        divEl.appendChild(pEl);
        pEl.textContent = event.location.address1;

        // // event category
        // pEl = document.createElement("p");
        // divEl.appendChild(pEl);
        // pEl.textContent = event.category;

        // event description
        pEl = document.createElement("p");
        divEl.appendChild(pEl);
        pEl.textContent = event.description;
        pEl.style.borderTop = "1px solid white";
        pEl.style.paddingTop = "10px";

        // create div for button
        let dEl = document.createElement("div");
        divEl.appendChild(dEl);
        dEl.className = "card-action";
        // dEl.style.maxHeight = "21px";

        buttonEl = document.createElement("button");
        dEl.appendChild(buttonEl);
        buttonEl.className =
            "waves-effect waves-light white-text btn-flat pink center-align";
        buttonEl.textContent = "Find Restaurants";
        iEl = document.createElement("i");
        iEl.className = "material-icons left bucketlist-add";
        iEl.textContent = "place";
        buttonEl.appendChild(iEl);

        // create div for links
        divEl = document.createElement("div");
        divEl.className = "card-action";
        cardEl.appendChild(divEl);

        // event site URL
        let aEl = document.createElement("a");
        divEl.appendChild(aEl);
        aEl.setAttribute("href", event.event_site_url);
        aEl.textContent = "See on Yelp";

        // yelp link
        aEl = document.createElement("a");
        divEl.appendChild(aEl);
        aEl.setAttribute("href", event.tickets_url);
        aEl.textContent = "Get Tickets";
    });
}

function passEventCoords(event) {
    event.stopPropagation();
    let current = event.target;
    // console.log(current);

    let card = current.closest(".event");
    console.log(card);
    let index = card.getAttribute("id");
    index = index.substring(index.indexOf("-") + 1);

    let data = JSON.parse(localStorage.getItem("yelpData"));
    let coords = {
        latitude: data.events[index].latitude,
        longitude: data.events[index].longitude,
    };
    // console.log(coords)

    initSearch(coords);
}

// google api
// kicks off when user clicks a button for an event
function initSearch(coords) {
    let service;
    var elem = document.querySelector("#google-results");

    const location = {
        lat: coords.latitude,
        lng: coords.longitude,
    };

    var request = {
        location: location,
        radius: "100",
        type: ["restaurant"],
    };
    service = new google.maps.places.PlacesService(elem);
    service.textSearch(request, googleTextSearch);
}
const placeArray = new Array();

function googleTextSearch(request, status) {
    if (status === google.maps.places.PlacesServiceStatus.OK && request) {
        console.log("processing places");
        localStorage.setItem("places", JSON.stringify(request));
        generatePlaceResults();
    }
}



function generatePlaceResults() {
    console.log("displaying places");
    let places = JSON.parse(localStorage.getItem("places"));
    console.log(places);
    let displayEl = document.getElementById("google-results");
    let i = 0;

    places.forEach((place) => {
        //create card
        //add logic to not display closed businesses, but keep increasing the index of the array goes up
        let cardEl = document.createElement("div");
        cardEl.className = "card event";
        cardEl.id = `card-${i}`;
        displayEl.appendChild(cardEl);
        //create array for cardEl.id and corresponding place_id
        placeArray.push(place.place_id);
        i++;

        // div for image
        let divEl = document.createElement("div");
        divEl.className = "card-image";
        cardEl.appendChild(divEl);

        // image
        let imgEl = document.createElement("img");
        imgEl.className = "activator";
        imgEl.setAttribute("src", "./assets/links/drinks.jpg");
        divEl.appendChild(imgEl);

        // add button
        let buttonEl = document.createElement("button");
        buttonEl.className =
            "btn-floating halfway-fab waves-effect waves-light pink";
        divEl.appendChild(buttonEl);
        let iEl = document.createElement("i");
        iEl.className = "material-icons";
        iEl.textContent = "add";
        buttonEl.appendChild(iEl);

        // create div for content
        divEl = document.createElement("div");
        cardEl.appendChild(divEl);
        divEl.className = "card-content";

        // place name
        let spanEl = document.createElement("span");
        spanEl.className = "card-title activator";
        spanEl.textContent = place.name;
        divEl.appendChild(spanEl);

        // place address
        pEl = document.createElement("p");
        divEl.appendChild(pEl);
        pEl.textContent = place.formatted_address;

        // rating
        pEl = document.createElement("p");
        divEl.appendChild(pEl);
        place.rating !== 0
            ? (pEl.textContent = "Rating: " + place.rating + "/5")
            : (pEl.textContent = "No Rating");

        // create div for links
        divEl = document.createElement("div");
        divEl.className = "card-action";
        cardEl.appendChild(divEl);

        // create div for reveal
        divEl = document.createElement("div");
        divEl.className = "card-reveal";
        cardEl.appendChild(divEl);
    });
}

function prepPlaceSearch(event) {
    let current = event.target;
    let card = current.closest(".event");
    console.log(card);
    let index = card.getAttribute("id");
    index = index.substring(index.indexOf("-") + 1);
    localStorage.setItem("resCardIndex", index);
    let passId = placeArray[index];
    getPlaceDetails(passId);
}

function googlePlaceSearch(placeDetails, status) {
    if (status == google.maps.places.PlacesServiceStatus.OK) {
        generatePlaceDetails(placeDetails);
    }
}

function getPlaceDetails(passId) {
    let service;
    var elem = document.querySelector("#empty");
    console.log("getting place details from place_id");

    // get place_id for the specific card user clicked
    let placeId = passId;
    console.log(placeId);

    var placeRequest = {
        placeId: placeId,
        fields: [
            "name",
            "formatted_phone_number",
            "photos",
            "website",
            "international_phone_number",
            "opening_hours",
        ],
    };

    service = new google.maps.places.PlacesService(elem);
    service.getDetails(placeRequest, googlePlaceSearch);
}

function generatePlaceDetails(data) {
    console.log(data);
    let index = localStorage.getItem("resCardIndex");

    let parentContainer = document.querySelector("#google-results");

    let cards = parentContainer.children;
    //console.log(cards);

    //console.log(cards[index]);

    let reveal = cards[index].children[3];

    let cardEls = reveal.children;

    if (cardEls.length == 0) {
        // restaurant name
        let spanEl = document.createElement("span");
        spanEl.className = "card-title";
        let iEl = document.createElement("i");
        spanEl.appendChild(iEl);
        iEl.className = "material-icons right";
        iEl.textContent = "close";
        iEl.style.color = "black";
        reveal.appendChild(spanEl);
        spanEl.textContent = data.name;

        let pEl = document.createElement("p");
        reveal.appendChild(pEl);
        // pEl.textContent = data.opening_hours;
        // figure out how to display all the closing and opening hours for each day
        //console.log(data.opening_hours);

        let aEl = document.createElement("a");
        reveal.appendChild(aEl);
        aEl.setAttribute("href", "tel:" + data.international_phone_number);
        aEl.textContent = data.formatted_phone_number;

        let brEl = document.createElement("br");
        reveal.appendChild(brEl);

        aEl = document.createElement("a");
        reveal.appendChild(aEl);
        aEl.setAttribute("href", data.website);
        aEl.textContent = "Website";
    }
}





accessYelp();

document
    .getElementById("yelp-results")
    .addEventListener("click", function (event) {
        if (event.target.className.includes("bucketlist-add")) {
            console.log("button clicked");
            passEventCoords(event);
        }
    });

// listener for user click on a place card
document
    .getElementById("google-results")
    .addEventListener("click", function (event) {
        if (event.target.className.includes("activator")) {
            console.log("card clicked");
            prepPlaceSearch(event);
        }
    });
