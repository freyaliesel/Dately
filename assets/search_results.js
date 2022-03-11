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
            generateEventResults(data)
        } );
}

function generateEventResults(data) {
    console.log("displaying results");
    let events = data.events;
    console.log(events);
    let displayEl = document.getElementById("yelp-results");

    events.forEach((event) => {
        // create card
        let cardEl = document.createElement("div");
        cardEl.className = "card event";
        displayEl.appendChild(cardEl);

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
        buttonEl.className = "btn-floating halfway-fab waves-effect waves-light pink";
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
        spanEl.textContent = event.name
        divEl.appendChild(spanEl);
        
        // date of event
        pEl = document.createElement("p");
        divEl.appendChild(pEl);
        pEl.textContent = dayjs(event.time_start).format("ddd, MMM D, h:mma");

        // cost
        pEl = document.createElement("p");
        divEl.appendChild(pEl);
        event.cost !== null ? pEl.textContent = "$" + event.cost : pEl.textContent = "Free";

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
    console.log(event.target);
}

accessYelp();

document.getElementById("yelp-results").addEventListener("click", function(event){
    console.log("clicked" + event.target);
    
    passEventCoords(event);
})