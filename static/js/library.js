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

  SaveBtn.addEventListener("click", async () => {
    // store the values
    const title = document.querySelector("#modal-title").textContent;
    const updatedStatus = document.querySelector("#modal-status").value;
    const updatedRating = document.querySelector("#modal-rating").value;
    const updatedReview = document.querySelector("#modal-review").value;

    const gameEditedMsg = document.querySelector("#game-edited");

    // send fetch request to flask
    const response = await fetch("/library/edit", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: title,
        status: updatedStatus,
        rating: updatedRating,
        review: updatedReview,
      }),
    });

    // open the envelop
    const data = await response.json();

    // if response is successful -> close modal
    if (data["success"] == true) {
      gameModal.classList.toggle("disp-none");
    } else {
      gameEditedMsg.innerHTML = `<p class="toast-msg">Something went wrong, please try again</p>`;
      // hide it after 3 seconds
      setTimeout(() => {
        gameEditedMsg.innerHTML = "";
      }, 3000);
    }
  });

  /* Handle exit button*/
  const closeBtn = document.querySelector("#modal-close");
  closeBtn.addEventListener("click", () => {
    gameModal.classList.toggle("disp-none");
  });
});
