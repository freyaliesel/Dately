// implementing Yelp API

function retrieveLocation() {
    let searchParameters = JSON.parse(localStorage.getItem("searchParameters"))
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
        .then((data) => generateEventResults(data.events));
}

function generateEventResults(events) {
    console.log("displaying results");
    console.log(events);
    let displayEl = document.getElementById("card-parent");

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
        let aEl = document.createElement("a");
        aEl.className = "btn-floating halfway-fab waves-effect waves-light red";
        divEl.appendChild(aEl);
        let iEl = document.createElement("i");
        iEl.className = "material-icons";
        iEl.textContent = "add";
        aEl.appendChild(iEl);
        
        // new div for content
        divEl = document.createElement("div");
        cardEl.appendChild(divEl);
        divEl.className = "card-content";
        
        // // icons - star
        // iEl = document.createElement("i");
        // divEl.appendChild(iEl);
        // iEl.className = "material-icons";
        // iEl.textContent = "star";
        // // icons - addcircle
        // iEl = document.createElement("i");
        // divEl.appendChild(iEl);
        // iEl.className = "material-icons";
        // iEl.textContent = "add_circle";
        
        // event name
        let spanEl = document.createElement("span");
        spanEl.className = "card-title";
        spanEl.textContent = event.name
        divEl.appendChild(spanEl);
        
        // date of event
        pEl = document.createElement("pEl");
        divEl.appendChild(pEl);
        pEl.textContent = dayjs(event.time_start).format("ddd, MMM D, h:mma");

        // cost
        pEl = document.createElement("pEl");
        divEl.appendChild(pEl);
        pEl.textContent = "$" + event.cost;

        // event address
        pEl = document.createElement("pEl");
        divEl.appendChild(pEl);
        pEl.textContent = "location: " + event.location.address1;

        // event category
        pEl = document.createElement("pEl");
        divEl.appendChild(pEl);
        pEl.textContent = event.category;

        // event description
        pEl = document.createElement("pEl");
        divEl.appendChild(pEl);
        pEl.textContent = event.description;

        // new div for links
        divEl = document.createElement("div");
        divEl.className = "card-action";
        cardEl.appendChild(divEl);

        // event site URL
        aEl = document.createElement("a");
        divEl.appendChild(aEl);
        aEl.setAttribute("href", event.event_site_url);
        aEl.textContent = "Visit Website";

        // yelp link
        aEl = document.createElement("a");
        divEl.appendChild(aEl);
        aEl.setAttribute("href", event.tickets_url);
        aEl.textContent = "Get Tickets";
    });
}

accessYelp();
