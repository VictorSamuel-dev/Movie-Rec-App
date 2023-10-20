// nick youtube api key: AIzaSyBWrhCB3guqUxUZxZX8HvCsGdb9BwsCyU0
// nick omdb api key: 261cdc84
// madison youtube api key:
// Send all data requests to:
// http://www.omdbapi.com/?apikey=[yourkey]&
// Poster API requests:
// http://img.omdbapi.com/?apikey=[yourkey]&

var omdbAPI = "261cdc84";
var ytAPI = "AIzaSyBWrhCB3guqUxUZxZX8HvCsGdb9BwsCyU0";
var movieSearchButton = document.getElementById("search-button");
var movieInput = document.getElementById("movie-input");
var movieContainer = document.getElementById("movie-container");
var modalLink = document.getElementById("modal-link");
var modalCard = document.getElementById("modal-card");
var movieTitle = document.getElementById("modal-title");
var moviePlot = document.getElementById("movie-plot");

// Functions to open and close a modal
function openModal($el) {
  $el.classList.add("is-active");
}

function closeModal($el) {
  $el.classList.remove("is-active");
}

function closeAllModals() {
  (document.querySelectorAll(".modal") || []).forEach(($modal) => {
    closeModal($modal);
  });
}

// Add a click event on buttons to open a specific modal
(document.querySelectorAll(".js-modal-trigger") || []).forEach(($trigger) => {
  const modal = $trigger.dataset.target;
  const $target = document.getElementById(modal);

  $trigger.addEventListener("click", () => {
    openModal($target);
  });
});

// Add a click event on various child elements to close the parent modal
(
  document.querySelectorAll(
    ".modal-background, .modal-close, .modal-card-head .delete, .modal-card-foot .button"
  ) || []
).forEach(($close) => {
  const $target = $close.closest(".modal");

  $close.addEventListener("click", () => {
    closeModal($target);
  });
});

// Add a keyboard event to close all modals
document.addEventListener("keydown", (event) => {
  if (event.code === "Escape") {
    closeAllModals();
  }
});

// modalLink.addEventListener("click", function () {

//     var youtubeLink = "https://www.googleapis.com/youtube/v3/search?part=snippet&q=" + movie + "&key=" + ytAPI;

//     fetch(youtubeLink)
//     .then(function (response) {
//       console.log(response);
//       if (!response.ok) {
//         throw new Error("Network response was not ok");
//       }
//       return response.json();
//     })
//     .then(function (data) {
//       console.log(data);
//     });
// });

function modalDisplay(movieData) {
    var movie = movieInput.value;
    movieTitle.innerText = "";
    movieTitle.innerText = movieData.title

    moviePlotShort = "https://www.omdbapi.com/?apikey=" + omdbAPI + "&t=" + movie + "&plot=short&r=json";


    fetch(moviePlotShort)
        .then(function (response) {
            console.log(response);
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.json();
        })
        .then(function () {

            moviePlot.innerText = "";
            moviePlot.innerText = movieData.plot
        })

    
};

movieSearchButton.addEventListener("click", function () {
  // user's input from search
  var movie = movieInput.value;

  //clears search bar after click
  movieInput.value = "";

  var searchedMovie =
    "https://www.omdbapi.com/?apikey=" +
    omdbAPI +
    "&s=" +
    movie +
    "&page=10&y=&r=json";

  fetch(searchedMovie)
    .then(function (response) {
      console.log(response);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then(function (data) {
      console.log(data);

      movieContainer.innerHTML = "";

      data.Search.forEach(function (data) {
        var movieTitle = data.Title;
        var moviePlot = data.Plot;
        var moviePoster = data.Poster;

        var modalDataOBJ = {
            title: movieTitle,
            plot: moviePlot,
            // video: ytEmbed,
        }

        var movieDiv = document.createElement("div")

        var movieCard = `
                    <div class="col-md-2 movie-card">
                        <div class="card">
                            <div class="card-header js-modal-trigger" data-target="modal-card">${movieTitle}</div>
                            <div class="card-body">
                                <p class="moviePoster"> <img src="${moviePoster}" alt="${movieTitle} Poster"></p>
                            </div>
                        </div>
                    </div>
                `;

        
        movieDiv.innerHTML = movieCard;

        movieContainer.appendChild(movieDiv);

        movieDiv.addEventListener("click", function(event) {
            console.log(event);
            if (event.target.classList.contains("js-modal-trigger")) {
                modalDisplay(modalDataOBJ);
            }
        })

      });

      (document.querySelectorAll(".js-modal-trigger") || []).forEach(
        ($trigger) => {
          const modal = $trigger.dataset.target;
          const $target = document.getElementById(modal);

          $trigger.addEventListener("click", () => {
            openModal($target);
          });
        }
      );
    })
    .catch(function (error) {
      console.error("Error fetching movie data; ", error);
    });
});


// TEST COMMENT