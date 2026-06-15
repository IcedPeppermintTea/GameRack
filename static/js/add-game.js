// add-game.js

document.addEventListener("DOMContentLoaded", function() {  

    const resultsContainer = document.querySelector("#search-results");
    const gameAddedMsg = document.querySelector("#game-added");

    // on 'Add to Shelf' button click 
    resultsContainer.addEventListener("click", async e=> {
        // check if the clicked element was a shelf button

        if (e.target.classList.contains("shelf-btn")) {
            // get game details
            const gameRawgId = e.target.getAttribute("data-id");
            const gameTitle = e.target.getAttribute("data-title");
            const gameCoverImg = e.target.getAttribute("data-cover");


            // send Flask POST request
            const response = await fetch("/library/add", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    rawg_id: gameRawgId,
                    title: gameTitle,
                    cover_url: gameCoverImg
                })
            });

            // open the envelop
            const data = await response.json()

            // check if response is successful
            if (data["success"] == true) {
                gameAddedMsg.innerHTML = `<p class="toast-msg">Game Added Successfully</p>`

                // hide it after 3 seconds
                setTimeout(() => {
                gameAddedMsg.innerHTML = ""
                }, 3000)
            }
            else {
                gameAddedMsg.innerHTML = `<p class="toast-msg">Something went wrong, please try again</p>`

                // hide it after 3 seconds
                setTimeout(() => {
                gameAddedMsg.innerHTML = ""
                }, 3000)
            }
        }
    })
});