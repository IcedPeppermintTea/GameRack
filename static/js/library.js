// library.js

document.addEventListener("DOMContentLoaded", function () {
  /* when game card is clicked -> open modal for that game */

  const libraryGrid = document.querySelectorAll(".library-grid");
  const gameModal = document.querySelector("#game-modal");

  // grab each of the game cards inside the state grids
  libraryGrid.forEach((grid) => {
    const gameCard = grid.querySelectorAll(".game-card");

    // game is clicked -> show modal with game values
    gameCard.forEach((card) => {
      card.addEventListener("click", (e) => {
        // show modal
        gameModal.classList.toggle("disp-none");

        // get game details from library.html
        const title = card.dataset.title;
        const cover = card.dataset.cover;
        const state = card.dataset.state;
        const rating = card.dataset.rating;
        const review = card.dataset.review;

        // populate game details in the modal
        document.querySelector("#modal-cover").src = cover;
        document.querySelector("#modal-cover").alt = title;
        document.querySelector("#modal-title").textContent = title;
        document.querySelector("#modal-status").value = state;
      });
    });
  });

  /* Handle saving changes */
  const SaveBtn = document.querySelector("#modal-save");

  SaveBtn.addEventListener("click", () => {
    // store the values
    const updatedStatus = document.querySelector("#modal-status").value;
    const updatedRating = document.querySelector("#modal-rating").value;
    const updatedReview = document.querySelector("#modal-review").value;

    // send them in fetch request
  });

  /* Handle exit button*/
  const closeBtn = document.querySelector("#modal-close");
  closeBtn.addEventListener("click", () => {
    gameModal.classList.toggle("disp-none");
  });
});
