// determine if need to call api on page load
function checkSearchHistory() {
    let yelpParam = JSON.parse(localStorage.getItem("yelpParam"));
    let yelpData = JSON.parse(localStorage.getItem("yelpData"));
    // if the search parameters exist
    if (yelpParam !== null && yelpParam.date && yelpParam.location) {
        // send to api, then clear the previous search's stored information
        console.log("performing new yelp search");
        parseLocation(yelpParam);
        localStorage.removeItem("yelpParam");
        if (localStorage.getItem("gTextData")) {
            localStorage.removeItem("gTextData");
        }
        if (localStorage.getItem("likedEvent")) {
            localStorage.removeItem("likedEvent");
        }
        if (localStorage.getItem("likedEatery")) {
            localStorage.removeItem("likedEatery");
        }
        if (localStorage.getItem("gIDs")) {
            localStorage.removeItem("gIDs");
        }
    } // if not, check if there is valid stored search data
    else if (yelpData !== null && yelpData.length > 0) {
        // send yelpData to populate event results
        console.log("populating yelp results based on last search performed");
        populateEventResults(yelpData);
        let liked = JSON.parse(localStorage.getItem("likedEvent"));
        if (liked) {
            selectCard(liked);
        }
        // check if there is stored google search data
        let savedEateries = JSON.parse(localStorage.getItem("gTextData"));
        if (savedEateries && savedEateries.eateries.length > 0) {
            populatePlaceResults();
            console.log("populating restaurants based on last event selected");
        } else {
            // remove liked eatery from memory
            liked = JSON.parse(localStorage.getItem("likedEatery"));
            if (liked) {
                localStorage.removeItem(liked);
            }
        }
    } // something went wrong and alert the user
    else {
        let displayEl = document.getElementById("yelp-results");
        if (document.getElementsByTagName("h4").length > 0) {
            console.log(
                "checkHistory: something went wrong on first search on page"
            );
            // needs a modal or pop up to alert user something went wrong
        } else if (document.querySelectorAll(".card").length > 0) {
            // Need an alert of some kind, either text in-line or modal
            console.log(
                "checkHistory: something went wrong on secondary search"
            );
        } else {
            // user has not yet performed a search
            let textEl = document.createElement("h4");
            displayEl.appendChild(textEl);
            textEl.textContent = "Search for an event to get started!";
            textEl.className = "white-text";
        }
    }
}

function bucketList() {
    this.event = {};
    this.eatery = {
        text: {},
        details: {},
    };
}
const newPair = new bucketList();

// prepare parameters to send to Yelp API
function parseLocation(param) {
    param.date = dayjs(param.date).unix();
    param.location = param.location.replace(/\s/g, "");
    accessYelp(param);
}

// use cors-anywhere to access yelp API
// this will need to change if/when implementing variable parameter calls - will need additional function
function accessYelp(param) {
    // accepts object with properties "location" value string with no spaces and "date" value unix time stamp
    let url =
        "https://cors-anywhere-bc.herokuapp.com/https://api.yelp.com/v3/events?";
    let location = "location=" + param.location + ",Chicago";
    let radius = "&radius=1609";
    let categories =
        "&categories=" +
        "music,visual-arts,film,fashion,festivals-fairs,sports-active-life,nightlife";
    let startDate = "&start_date=" + param.date;
    let results = "&limit=10";
    let excluded =
        "&excluded_events=chicago-chicago-bachelor-party-exotic-dancers-topless-nudy-waitresses-call-us-312-488-4673";
    fetch(
        url + location + radius + categories + startDate + results + excluded,
        {
            method: "get",
            headers: new Headers({
                Authorization:
                    "Bearer DdZGPiM69U6N1FeqeFAXnUK8NSX_7W9ozcMbNxCnJA16g309AiVdccMB2B9PEf8U7-aLoMGc3yp0H6ynxVMrVwgYHYJsMP7tqXt66pwj0kJDkBr4Mb34W-PjwGEpYnYx",
            }),
        }
    )
        .then(checkError)
        .then(function (data) {
            parseEventResults(data);
        })
        .catch((error) => {
            console.error(error);
            return;
        });
}

// error checking
function checkError(response) {
    if (response.status >= 200 && response.status <= 299) {
        return response.json();
    } else {
        if (response.status === 400) {
            // let the user know they need to check their input and try again
        } else if (response.status === 500) {
            // let the user know that something is wrong with yelp
        } else {
            // let the user know that something happened and to try again, if it happens again, let the project owners know
            console.log(response.status, response.statusText);
        }
        throw Error(response.statusText);
    }
}

function parseEventResults(data) {
    if (data.events.length > 0) {
        populateEventResults(data.events);
        localStorage.setItem("yelpData", JSON.stringify(data.events));
    } else {
        //let the user know something went wrong
    }
}

// make cards for yelp results
function populateEventResults(events) {
    console.log("displaying results");
    let displayEl = document.getElementById("yelp-results");
    emptyElement(displayEl);
    let index = 0;
    events.forEach((event) => {
        // create card
        let cardEl = document.createElement("div");
        cardEl.className = "card sticky-action search-card event";
        cardEl.id = `event-${index}`;
        displayEl.appendChild(cardEl);
        index++;

        // div for image
        let divEl = document.createElement("div");
        cardEl.appendChild(divEl);
        divEl.className = "card-image";

        // image
        let imgEl = document.createElement("img");
        imgEl.className = "activator";
        if (event.image_url) {
            imgEl.setAttribute("src", event.image_url);
        } else {
            imgEl.setAttribute(
                "src",
                "https://s3-media0.fl.yelpcdn.com/assets/srv0/yelp_styleguide/fd429e4199e6/assets/img/default_avatars/event_300_square.png"
            );
        }
        divEl.appendChild(imgEl);

        // add button
        let buttonEl = document.createElement("button");
        buttonEl.className =
            "btn-floating halfway-fab waves-effect waves-light pink bucketlist-add";
        divEl.appendChild(buttonEl);
        let iEl = document.createElement("i");
        iEl.className = "material-icons heart";
        iEl.textContent = "favorite_border";
        buttonEl.appendChild(iEl);

        // card content
        divEl = document.createElement("div");
        cardEl.appendChild(divEl);
        divEl.className = "card-content";

        // event name
        let spanEl = document.createElement("span");
        spanEl.className = "card-title activator";

        if (event.name.length > 45) {
            spanEl.textContent = event.name.slice(0, 45) + "...";
        } else {
            spanEl.textContent = event.name;
        }
        divEl.appendChild(spanEl);

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
        pEl = document.createElement("p");
        divEl.appendChild(pEl);
        pEl.textContent =
            event.location.city +
            ", " +
            event.location.state +
            ", " +
            event.location.zip_code;

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

        // make the button
        buttonEl = document.createElement("button");
        dEl.appendChild(buttonEl);
        buttonEl.className =
            "waves-effect waves-light white-text btn-flat pink center-align bucketlist-add";
        buttonEl.textContent = "Find Eateries";
        iEl = document.createElement("i");
        iEl.className = "material-icons heart left";
        iEl.textContent = "favorite_border";
        buttonEl.appendChild(iEl);
    });
}

function emptyElement(element) {
    if (element.children.length > 0) {
        $(element).empty();
    }
}

// prepare and pass parameters for google search
function passEventCoords(event) {
    event.stopPropagation();
    let current = event.target;
    let card = current.closest(".search-card");

    let index = card.getAttribute("id");
    index = index.substring(index.indexOf("-") + 1);

    let data = JSON.parse(localStorage.getItem("yelpData"));
    let coords = {
        latitude: data[index].latitude,
        longitude: data[index].longitude,
        eventIndex: index,
    };
    initSearch(coords);
    newPair.event = data[index];
}

// send parameters to google for initial place information
function initSearch(coords) {
    let service;
    var elem = document.querySelector("#google-results");
    //let placeType = ""; //option to choose 'bar' or 'restaurant' for search

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

    let newObject = {
        event: coords.eventIndex,
        eateries: [],
    };
    localStorage.setItem("gTextData", JSON.stringify(newObject));

    service.textSearch(request, googleTextSearch);
}

// if status is okay, send data to make cards
function googleTextSearch(request, status) {
    if (status === google.maps.places.PlacesServiceStatus.OK && request) {
        console.log("processing places");
        let newObject = JSON.parse(localStorage.getItem("gTextData"));
        newObject.eateries = request;
        localStorage.setItem("gTextData", JSON.stringify(newObject));
        populatePlaceResults();
    }
}

// make cards for google results
function populatePlaceResults() {
    console.log("displaying places");
    let placeArray = [];
    let places = JSON.parse(localStorage.getItem("gTextData")).eateries;
    // only give 10 eatery options
    places = places.slice(0, 10);
    let displayEl = document.getElementById("google-results");
    emptyElement(displayEl);
    let index = 0;

    // array for random photos in case an eatery lacks photos
    var eateryPhotos = [];
    eateryPhotos = [
        "./assets/eatery-photos/eatery-1.jpg",
        "./assets/eatery-photos/eatery-2.jpg",
        "./assets/eatery-photos/eatery-3.jpg",
        "./assets/eatery-photos/eatery-4.jpg",
        "./assets/eatery-photos/eatery-5.jpg",
        "./assets/eatery-photos/eatery-6.jpg",
        "./assets/eatery-photos/eatery-7.jpg",
        "./assets/eatery-photos/eatery-8.jpg",
        "./assets/eatery-photos/eatery-9.jpg",
        "./assets/eatery-photos/eatery-10.jpg",
    ];

    var randomNums = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    shuffle(randomNums);

    places.forEach((place) => {
        //create card
        //add logic to not display closed businesses, but keep increasing the index of the array goes up
        if (place.business_status !== "OPERATIONAL") {
            console.log("no card created for closed business");
            index++;
        } else {
            let cardEl = document.createElement("div");
            cardEl.className = "card search-card";
            cardEl.id = `eatery-${index}`;
            displayEl.appendChild(cardEl);
            //create array for cardEl.id and corresponding place_id
            placeArray.push(place.place_id);

            // div for image
            let divEl = document.createElement("div");
            divEl.className = "card-image";
            cardEl.appendChild(divEl);

            // image
            let imgEl = document.createElement("img");
            imgEl.className = "activator";
            // grab image from eateryPhotos array, using shuffled randomNums array
            if (index != randomNums.length) {
                let r = randomNums[index];
                imgEl.setAttribute("src", eateryPhotos[r]);
            }
            divEl.appendChild(imgEl);

            // add button
            let buttonEl = document.createElement("button");
            buttonEl.className =
                "btn-floating halfway-fab waves-effect waves-light pink bucketlist-add";
            divEl.appendChild(buttonEl);
            let iEl = document.createElement("i");
            iEl.className = "material-icons heart";
            iEl.textContent = "favorite_border";
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

            // star rating - round rating to nearest 1/2 integer and populate stars and 1/2 star if needed
            var rating = Math.round(place.rating * 2) / 2;
            var halfStar = rating % 1; //return 0 or 0.5
            if (rating !== 0) {
                for (var i = 1; i <= rating; i++) {
                    iEl = document.createElement("i");
                    iEl.className = "material-icons";
                    divEl.appendChild(iEl);
                    iEl.innerHTML += "star";
                }
                if (halfStar === 0.5) {
                    iEl = document.createElement("i");
                    iEl.className = "material-icons";
                    divEl.appendChild(iEl);
                    iEl.innerHTML += "star_half";
                    halfStar = 0;
                }
            } else {
                iEl.textContent = "No rating";
            }

            // create div for reveal
            divEl = document.createElement("div");
            divEl.className = "card-reveal";
            cardEl.appendChild(divEl);

            index++;
        }
    });
    // add placeIDs to local storage for placeDetails search
    localStorage.setItem("gIDs", JSON.stringify(placeArray));
}

// Fisher-Yates shuffle to randomize arrays
function shuffle(array) {
    let currentIndex = array.length,
        randomIndex;

    // While there remain elements to shuffle...
    while (currentIndex != 0) {
        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex],
            array[currentIndex],
        ];
    }
    return array;
}

// prepare parameters for details search
function prepDetailsSearch(event) {
    let current = event.target;
    let card = current.closest(".search-card");
    let detailsEl = card.querySelector(".card-reveal");
    let details = detailsEl.children;
    let needsSave = false;

    function getID() {
        let index = card.getAttribute("id");
        index = index.substring(index.indexOf("-") + 1);
        localStorage.setItem("resCardIndex", index);
        let placeArray = JSON.parse(localStorage.getItem("gIDs"));
        return placeArray[index];
    }

    // check origin of function call
    // if event came from the add to bucketlist button,
    if (current.className.includes("bucketlist-add")) {
        // if there arent any details yet
        if (details.length == 0) {
            // get the details and save them to the bucketlist
            needsSave = true;
            getPlaceDetails(getID(), needsSave);
        } else {
            //pass details to bucketlist function
            console.log("details exist, pass to bucketlist");
        }
    } else if (current.className.includes("activator")) {
        // check if details exist before making API call
        details.length == 0
            ? getPlaceDetails(getID(), needsSave)
            : console.log("details exist");
    }
}

// send parameters to google for detailed information
function getPlaceDetails(passId, needsSave) {
    // let service;
    var elem = document.querySelector("#empty");
    console.log("getting place details from place_id");

    var placeRequest = {
        placeId: passId,
        fields: [
            "name",
            "formatted_phone_number",
            "photos",
            "website",
            "international_phone_number",
            "opening_hours",
        ],
    };

    let service = new google.maps.places.PlacesService(elem);

    if (needsSave === true) {
        console.log("passing to save details");
        service.getDetails(placeRequest, saveDetails);
    } else {
        console.log("passing details");
        service.getDetails(placeRequest, googleDetailSearch);
    }
}

// because google doesnt let us handle the api call ourselves, this has to be a separate function
function saveDetails(details, status) {
    if (status == google.maps.places.PlacesServiceStatus.OK) {
        populatePlaceDetails(details);
        bucketlistAddDetails(details);
    }
}

// if status is okay, send data to make cards
function googleDetailSearch(placeDetails, status) {
    if (status == google.maps.places.PlacesServiceStatus.OK) {
        populatePlaceDetails(placeDetails);
    }
}

// populate details on card if not already present
function populatePlaceDetails(data) {
    let index = localStorage.getItem("resCardIndex");
    localStorage.removeItem("resCardIndex");

    let parentContainer = document.querySelector("#google-results");
    let cards = parentContainer.children;
    let card = cards[index];
    let reveal = card.children[2];
    let cardEls = reveal.children;

    if (cardEls.length == 0) {
        // restaurant name
        let spanEl = document.createElement("span");
        reveal.appendChild(spanEl);
        spanEl.className = "card-title";
        spanEl.textContent = data.name;
        let iEl = document.createElement("i");
        spanEl.appendChild(iEl);
        iEl.className = "material-icons right";
        iEl.textContent = "close";

        // opening hours
        let pEl = document.createElement("p");
        reveal.appendChild(pEl);
        for (var i = 0; i < data.opening_hours.weekday_text.length; i++) {
            pEl.textContent = data.opening_hours.weekday_text[i];
            pEl = document.createElement("p");
            reveal.appendChild(pEl);
        }

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

        // create div for button
        let dEl = document.createElement("div");
        reveal.appendChild(dEl);
        dEl.className = "card-action";

        // make the button
        buttonEl = document.createElement("button");
        dEl.appendChild(buttonEl);
        buttonEl.className =
            "waves-effect waves-light white-text btn-flat pink center-align bucketlist-add";
        buttonEl.textContent = "Like Eatery";
        iEl = document.createElement("i");
        buttonEl.appendChild(iEl);

        let heart = card.querySelector(".heart");
        heart.textContent == "favorite"
            ? (iEl.textContent = "favorite")
            : (iEl.textContent = "favorite_border");
        iEl.className = "material-icons left heart";
    }
}

function selectCard(cardID) {
    console.log("applying glow to selected card");

    let current = document.getElementById(cardID);
    let container = current.closest(".card-container");
    let previous = container.querySelector(".selected");
    let parent = current.closest(".card-parent");

    current.classList.add("selected");

    if (parent.id == "yelp-results") {
        storeSelectedEvent(cardID);
    }

    if (previous) {
        let prevID = previous.id;
        if (prevID !== cardID) {
            previous.classList.remove("selected");
        }
    }
    toggleHeartIcon(current, previous);
}

function toggleHeartIcon(current) {
    console.log("toggling heart icon");
    let container = current.closest(".card-container");

    let fullHearts = container.querySelectorAll(".heart");
    if (fullHearts !== null && fullHearts.length > 0) {
        for (let i = 0; i < fullHearts.length; i++) {
            console.log("setting all hearts in container to empty");
            fullHearts[i].textContent = "favorite_border";
        }
    }

    let emptyHearts = current.querySelectorAll(".heart");
    console.log(emptyHearts);
    if (emptyHearts && emptyHearts !== null && emptyHearts.length > 0) {
        for (let i = 0; i < emptyHearts.length; i++) {
            console.log("changing only this card's hearts to full");
            emptyHearts[i].textContent = "favorite";
        }
    }
}

function storeSelectedEvent(cardID) {
    console.log("storing selected card");
    localStorage.setItem("likedEvent", JSON.stringify(cardID));
    console.log("removing stored eatery");
    localStorage.removeItem("likedEatery");
}

function bucketlistAddEatery(event) {
    console.log("adding eatery");
    let card = event.target.closest(".search-card");
    let index = card.getAttribute("id");
    index = index.substring(index.indexOf("-") + 1);
    let data = JSON.parse(localStorage.getItem("gTextData"));
    newPair.eatery.text = data.eateries[index];
    newPair.event = JSON.parse(localStorage.getItem("yelpData"))[data.event];
}

function bucketlistAddDetails(details) {
    // save the details to the bucketlist
    console.log("saving details to new bucketlist pair");
    newPair.eatery.details = details;
    createSaveButton();
}

function createSaveButton() {
    console.log("adding save button");
    let main = document.querySelector("main");

    let divEl = document.createElement("div");
    divEl.className = "fixed-action-btn";
    main.appendChild(divEl);

    let btn = document.createElement("button");
    btn.className = "btn-large pink waves-effect waves-light";
    btn.id = "bucketlist-save-btn";
    btn.textContent = "Add to Bucketlist";
    divEl.appendChild(btn);

    let icon = document.createElement("i");
    icon.className = "material-icons left";
    icon.textContent = "file_download";
    btn.appendChild(icon);
}

function saveBucketlist(event) {
    event.preventDefault();
    console.log("saves to bucket list");
    let bList = JSON.parse(localStorage.getItem("bucketlist"));
    let newList = [newPair];

    // if the bucketlist exists and has entries, return it, else make a new list
    bList && bList.length > 0
        ? (bList = newList.concat(bList))
        : (bList = newList);
    localStorage.setItem("bucketlist", JSON.stringify(bList));
    window.location.href = "./bucketlist.html";
}

function openEateriesContainer() {
    console.log("opening Eateries Container");
    let div = document.querySelector("#yelp-container");
    div.classList.remove("l12");
    div.classList.add("l6");
    let googleContainer = document.querySelector("#google-container");
    googleContainer.classList.remove("hide");
    googleContainer.classList.add("l6");
}

// on page load, parse and pass most recent search data to yelp API
checkSearchHistory();

// click query selector event delegator
document.querySelector("body").addEventListener("click", function (event) {
    let bListSave = document.querySelector("#bucketlist-save-btn");
    if (bListSave && event.target == bListSave) {
        saveBucketlist(event);
    }

    let container = event.target.closest(".card-parent");

    if (container !== null) {
        let click = event.target;
        let btn = click.parentElement;
        card = click.closest(".card");
        let cardID = card.id;
        if (container.id == "yelp-results") {
            if (
                click.className.includes("bucketlist-add") ||
                btn.className.includes("bucketlist-add")
            ) {
                console.log("button clicked");
                passEventCoords(event);
                selectCard(cardID);
                openEateriesContainer();
            }
        } else if (container.id == "google-results") {
            console.log("google container clicked");
            // prep details search regardless, but if bucketlist add, select card
            prepDetailsSearch(event);
            if (
                click.className.includes("bucketlist-add") ||
                btn.className.includes("bucketlist-add")
            ) {
                selectCard(cardID);
                bucketlistAddEatery(event);
            }
        }
    }
});

// responsive nav bar
$(document).ready(function () {
    $(".sidenav").sidenav();
});
