// Utility functions that have no dependencies on other files

function removeProgressBar() {
    let yelpBar = document.querySelector(".progress");
    yelpBar.remove();
}

// opens a modal
function callModal(input) {
    console.log("popping up modal");
    let options = input;
    let modal = document.getElementById("alert-modal");

    if (options !== null || options !== undefined) {
        let instances = M.Modal.init(modal, options);
    } else {
        let instances = M.Modal.init(modal);
    }
    let instance = M.Modal.getInstance(modal);
    instance.open();
}

// expand the eateries container when a user selects an event
function openEateriesContainer() {
    console.log("opening Eateries Container");
    let div = document.querySelector("#yelp-container");
    div.classList.remove("l12");
    div.classList.add("l6");
    let googleContainer = document.querySelector("#google-container");
    googleContainer.classList.remove("hide");
    googleContainer.classList.add("l6");
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

// insert a save button onto the page
function createSaveButton() {
    let selectedCards = document.getElementsByClassName("selected");
    if (selectedCards.length == 2) {
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
}
