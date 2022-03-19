function checkBucketList() {
    console.log("checking for bucketlist");
    let list = JSON.parse(localStorage.getItem("bucketlist"));
    console.log(list);

    // if the bucket list exists, do something with it
    if (list && list.length > 0) {
        sortBucketList(list);
    } else {
        // tell user to add items to their list to see them here
        console.log("no bucketlist");
    }
}

function sortBucketList(list) {
    console.log("sorting bucketlist");
    // some logic goes here to determine which bucket list items to display first

    // do we want to sort by start date, and then end date, or do we want to sort by date added
    // date added is not currently a property, but can be added pretty easily

    populateBucketList(list);
}

function populateBucketList(list) {
    console.log("populating bucketlist");

    let container = document.querySelector(".card-parent");
    console.log(container);
    let index = 0;

    list.forEach((pair) => {
        console.log(pair);

        let cardEl = document.createElement("div");
        cardEl.className = "card bucketlist-card";
        cardEl.id = index;
        console.log(cardEl);
        container.appendChild(cardEl);

        populateEventSide(cardEl, pair.event);
        populateEaterySide(cardEl, pair.eatery, index);

        index++;
    });
}

function populateEventSide(parent, event) {
    console.log("filling in event info");
    console.log(parent);
    console.log(event);

    let cardEl = document.createElement("div");
    cardEl.className = "card sticky-action search-card event";

    parent.appendChild(cardEl);

    // div for image
    let divEl = document.createElement("div");
    cardEl.appendChild(divEl);
    divEl.className = "card-image";

    // image
    let imgEl = document.createElement("img");
    imgEl.className = "activator";
    imgEl.setAttribute("src", event.image_url);
    divEl.appendChild(imgEl);

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

    // yelp link
    let aEl = document.createElement("a");
    divEl.appendChild(aEl);
    aEl.setAttribute("href", event.event_site_url);
    aEl.textContent = "See on Yelp";

    // event site URL
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

    // do we want an option to "save visited events" and have a history of places the user has been to
    // this could be a smaller list, populated with just names, date, and links
}

function populateEaterySide(parent, eatery, index) {

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

    console.log("filling in eatery info");
    console.log(eatery);
    let text = eatery.text;
    let dets = eatery.details;

    let cardEl = document.createElement("div");
    cardEl.className = "card sticky-action search-card";
    parent.appendChild(cardEl);

    // div for image
    let divEl = document.createElement("div");
    cardEl.appendChild(divEl);
    divEl.className = "card-image";

    // image
    let imgEl = document.createElement("img");
    imgEl.className = "activator";
    // grab image from eateryPhotos array, using shuffled randomNums array
    if (index != randomNums.length) {
        let r = randomNums[index];
        imgEl.setAttribute("src", eateryPhotos[r]);
    }
    divEl.appendChild(imgEl);

    // create div for content
    divEl = document.createElement("div");
    cardEl.appendChild(divEl);
    divEl.className = "card-content";

    // place name
    let spanEl = document.createElement("span");
    spanEl.className = "card-title activator";
    spanEl.textContent = text.name;
    divEl.appendChild(spanEl);

    // star rating
    pEl = document.createElement("p");
    divEl.appendChild(pEl);

    // possibly change this to star icons
    let rating = Math.round(text.rating);
    // round rating to nearest integer
    if (rating !== 0) {
        for (var i = 1; i <= rating; i++) {
            pEl.textContent += "✭";
        }
    } else {
        pEl.textContent = "No rating";
    }

    // create div for links
    divEl = document.createElement("div");
    divEl.className = "card-action";
    cardEl.appendChild(divEl);

    let aEl = document.createElement("a");
    divEl.appendChild(aEl);
    aEl.setAttribute("href", dets.website);
    aEl.textContent = "Visit Website";

    // create div for reveal
    divEl = document.createElement("div");
    divEl.className = "card-reveal";
    cardEl.appendChild(divEl);

    // eatery name
    spanEl = document.createElement("span");
    divEl.appendChild(spanEl);
    spanEl.className = "card-title";
    spanEl.textContent = text.name;
    let iEl = document.createElement("i");
    spanEl.appendChild(iEl);
    iEl.className = "material-icons right";
    iEl.textContent = "close";

    pEl = document.createElement("p");
    divEl.appendChild(pEl);
    pEl.textContent = "Opening Hours: ";

    aEl = document.createElement("a");
    divEl.appendChild(aEl);
    aEl.setAttribute("href", "tel:" + dets.international_phone_number);
    aEl.textContent = dets.formatted_phone_number;
}

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

function clearBucketList() {
    console.log("clearing bucketlist");
}

checkBucketList();

// responsive nav bar
$(document).ready(function () {
    $(".sidenav").sidenav();
});
