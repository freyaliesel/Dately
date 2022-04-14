// yelp API call functions

// use cors-anywhere to access yelp API
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

// yelp response error checking
function checkError(response) {
    let modal = document.getElementById("alert-modal");
    let mTitle = modal.querySelector("h4");
    let mContent = modal.querySelector("p");
    if (response.status >= 200 && response.status <= 299) {
        return response.json();
    } else {
        if (response.status === 400) {
            // let the user know they need to check their input and try again
            mTitle.textContent = "400 Error";
            mContent.textContent = "Search error, please try another location";
            callModal();
        } else if (response.status === 500) {
            // let the user know that something is wrong with yelp
            mTitle.textContent = "500 Error";
            mContent.textContent =
                "Yelp is experiencing difficulties, please try again, and if the problems persist, come back later.";
            callModal();
        } else {
            // let the user know that something happened and to try again, if it happens again, let the project owners know
            mTitle.textContent = "Unexpected Error";
            mContent.textContent = "Something went wrong, please try again.";
            console.log(response.status, response.statusText);
        }
        throw Error(response.statusText);
    }
}
