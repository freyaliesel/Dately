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
    cardEl.className = "card event";
    cardEl.id = `card-${index}`;
    displayEl.appendChild(cardEl);
    index++;

    // div for image
    let divEl = document.createElement("div");
    divEl.className = "card-image";
    cardEl.appendChild(divEl);

    // image
    let imgEl = document.createElement("img");
    imgEl.setAttribute("src", event.image_url);
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

    // event name
    let spanEl = document.createElement("span");
    spanEl.className = "card-title";
    spanEl.textContent = event.name;
    divEl.appendChild(spanEl);

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

accessYelp();

document
  .getElementById("yelp-results")
  .addEventListener("click", function (event) {
    if (event.target.className == "material-icons") {
      console.log("button clicked");
      passEventCoords(event);
    }
  });

// google api
function callbackOne(request, status) {
  if (status === google.maps.places.PlacesServiceStatus.OK && request) {
    console.log("processing places");
    generatePlaceResults(request);
  }
}

function callbackTwo(placeRequest, status) {
  if (status == google.maps.places.PlacesServiceStatus.OK) {
    console.log(placeRequest);
  }
}

function generatePlaceResults(request) {
  console.log("displaying places");
  let places = request;
  let displayEl = document.getElementById("google-results");
  let i = 0;
  const placeArray = new Array();

  places.forEach((place) => {
    //create card
    let cardEl = document.createElement("div");
    cardEl.className = "card sticky-action event";
    cardEl.id = `card-${i}`;
    displayEl.appendChild(cardEl);
    //create array for cardEl.id and corresponding place_id
    placeArray.push([cardEl.id, place.place_id]);
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
    // divEl = document.createElement("div");
    // divEl.className = "card-reveal";
    // cardEl.appendChild(divEl);

    // // place name
    // spanEl = document.createElement("span");
    // spanEl.className = "card-title activator";
    // spanEl.textContent = place.name;
    // divEl.appendChild(spanEl);

    // place type
    // pEl = document.createElement("p");
    // divEl.appendChild(pEl);
    // let placeType = "";
    // for (i = 0; i < place.types.length; i++) {
    //   placeType = placeType + " " + place.types[i];
    //   i++;
    // }
    // pEl.textContent = "Category: " + placeType + ", ";
  });
  console.log(placeArray);
}

// on user click of place card, do api call on place_id
document
  .getElementById("google-results")
  .addEventListener("click", function (event) {
    if (event.target.className == "card") {
      console.log("button clicked");
      console.log(card.id);
      //getPlaceInfo(card.id, event);
    }
  });

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
  service.textSearch(request, callbackOne);
}

function getPlaceInfo(event) {
  let service;
  var elem = document.querySelector("#google-results");
  console.log("getting place details from place_id");

  // get place_id for the specific card user clicked

  var placeRequest = {
    placeId: placeId,
    fields: ["name", "formatted_phone_number", "photos", "website"],
  };
  console.log(placeRequest);

  service = new google.maps.places.PlacesService(elem);
  service.getDetails(placeRequest, callbackTwo);
}
