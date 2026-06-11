// add-game.js

document.addEventListener("DOMContentLoaded", function() {  

    const resultsContainer = document.querySelector("#search-results");

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

            // console log for now
            console.log(data);
        }
    })
});