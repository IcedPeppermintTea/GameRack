// navbar.js

document.addEventListener("DOMContentLoaded", function() { 

    // handle search bar requests
    const searchBar = document.querySelector("#search-bar");
    const searchBarInput = searchBar.querySelector('input');
    const searchBarBtn = searchBar.querySelector('button[type="submit"]')

    /* Handle Search Bar Requests */ 
    searchBar.addEventListener("submit", async e=> {
        // prevent default form submission from redirecting page
        e.preventDefault();

        // handle GET requests with fetch

        // 1. get the search value
        const query = searchBarInput.value;

        // 2. call the flask search route
        const response = await fetch(`/search?q=${query}`);

        // 3. open the envelop
        const data = await response.json()

        // 4. [temporary] check what came back
        console.log(data)
    })

    /* Display Search Results in /Home */ 

});

