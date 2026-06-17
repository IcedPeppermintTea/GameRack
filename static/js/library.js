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
      });
    });
  });
  /* Handle exit button*/
  const closeBtn = document.querySelector("#modal-close");

  closeBtn.addEventListener("click", () => {
    gameModal.classList.toggle("disp-none");
  });
});
