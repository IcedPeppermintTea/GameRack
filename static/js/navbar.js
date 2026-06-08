// navbar.js

document.addEventListener("DOMContentLoaded", function() { 

    // vars for handle search bar requests
    const searchBar = document.querySelector("#search-bar");
    const searchBarInput = searchBar.querySelector('input');
    const searchBarBtn = searchBar.querySelector('button[type="submit"]')

    // vars for display search bar results
    const gameResults = document.querySelector("#search-results");

    


    /* Handle Search Bar Requests */ 
    searchBar.addEventListener("submit", async e=> {
        // prevent default form submission from redirecting page
        e.preventDefault();

        // clear previous results
        gameResults.innerHTML = "";

        // handle GET requests with fetch

        // 1. get the search value
        const query = searchBarInput.value;

        // 2. call the flask search route
        const response = await fetch(`/search?q=${query}`);

        // 3. open the envelop
        const data = await response.json()

        // 4. display the data
        data.forEach(game => {
            // create a card element
            const gameCard = document.createElement("div");


            // fill with game data
            gameCard.innerHTML = `
            <img src="${game.cover_url}" alt="${game.title}">
             <p>${game.title}</p>
             <button class="shelf-btn" data-id="${game.rawg_id}" 
                data-title="${game.title}" 
                data-cover="${game.cover_url}">
            Add to shelf
            </button>
            `

            // append the data to results
            gameCard.classList.add("game-card");
            gameResults.appendChild(gameCard);
        })
    })

});

