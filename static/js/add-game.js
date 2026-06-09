// add-game.js

document.addEventListener("DOMContentLoaded", function() {  

    const addGameBtn = document.querySelector(".shelf-btn");

    // on 'Add to Shelf' button click 
    addGameBtn.addEventListener("click", async e=> {
        // get game details
        const gameRawgId = addGameBtn.getAttribute("data-id");
        const gameTitle = addGameBtn.getAttribute("data-title");
        const gameCoverImg = addGameBtn.getAttribute("data-cover");

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
    })
});