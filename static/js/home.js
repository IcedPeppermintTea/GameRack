// home.js

document.addEventListener("DOMContentLoaded", function () {
  // on homepage load -> call insights route
  window.addEventListener("load", async (e) => {
    /* call the summary route */
    const summaryResponse = await fetch(`/library/summary`);

    // open the envelop
    const summaryData = await summaryResponse.json();

    // display newest data
    summaryData.newest.forEach((game) => {
      // create a card element
      const recentlyAddedDiv = document.querySelector(
        "#recently-added .cards-row",
      );
      const gameCard = document.createElement("div");

      // fill with game data
      gameCard.innerHTML = `
      <img src="${game[1]}" alt="${game[0]}">
      <div>
          <p>${game[0]}</p>
          <span class="genres">${game[2]}</span>
          <p>Added ${game[3]}</p>
      </div>
      `;

      // append the data to results
      gameCard.classList.add("summary-card");
      recentlyAddedDiv.appendChild(gameCard);
    });

    // display top rated data
    summaryData.top_rated.forEach((game) => {
      // create a card element
      const topRatedDiv = document.querySelector("#top-rated .cards-row");
      const gameCard = document.createElement("div");

      // fill with game data
      gameCard.innerHTML = `
      <img src="${game[1]}" alt="${game[0]}">
      <div>
          <p>${game[0]}</p>
          <span class="genres">${game[2]}</span>
          <p>Rated ${game[3]}</p>
          <p class="review">${game[4]}</p>
      </div>
      `;

      // append the data to results
      gameCard.classList.add("summary-card");
      topRatedDiv.appendChild(gameCard);
    });

    /* call the insights route */
    const insightsResponse = await fetch(`/insights`);
    // open the envelop
    const insightsData = await insightsResponse.json();

    const insightsDiv = document.querySelector("#insights");
    const insightsCard = document.createElement("div");

    // display newest data
    if (insightsData.favorite_genre.length > 0) {
      insightsCard.innerHTML = `
        <div class="insight-stat">
            <span class="insight-label">Favourite Genre</span>
            <span class="insight-value">${insightsData.favorite_genre[0][0]}</span>
            <span class="insight-count">${insightsData.favorite_genre[0][1]} games</span>
        </div>
        <div class="insight-stat">
            <span class="insight-label">Least Played Genre</span>
            <span class="insight-value">${insightsData.least_favorite_genre[0]}</span>
            <span class="insight-count">${insightsData.least_favorite_genre[1]} games</span>
        </div>
        <div class="insight-stat">
            <span class="insight-label">Favourite Decade</span>
            <span class="insight-value">${insightsData.favorite_decade[0][0]}</span>
            <span class="insight-count">${insightsData.favorite_decade[0][1]} games</span>
        </div>
        <div class="insight-stat">
            <span class="insight-label">Least Played Decade</span>
            <span class="insight-value">${insightsData.least_favorite_decade[0]}</span>
            <span class="insight-count">${insightsData.least_favorite_decade[1]} games</span>
        </div>
    `;
      insightsDiv.appendChild(insightsCard);
    }
  });
});
