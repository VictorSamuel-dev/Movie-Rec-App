// nick youtube api key: AIzaSyBWrhCB3guqUxUZxZX8HvCsGdb9BwsCyU0
// nick tmdb api key: 2ed376b49026ee5ba769954152774c28
// madison youtube api key:


var tmdbAPI = "2ed376b49026ee5ba769954152774c28";
var ytAPI = "AIzaSyBWrhCB3guqUxUZxZX8HvCsGdb9BwsCyU0";
var movieSearchButton = document.getElementById("search-button");
var movieInput = document.getElementById("movie-input");
var movieContainer = document.getElementById("movie-container");
var modalVideo = document.getElementById("video-container");
var modalCard = document.getElementById("modal-card");
var movieTitle = document.getElementById("movie-title");
var moviePlot = document.getElementById("movie-plot");
var movieImg = '../assets/images/dummy.png'

// Function to open a modal
function openModal($el) {
  $el.classList.add("is-active");
}

// Function to close a modal
function closeModal($el) {
  $el.classList.remove("is-active");
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

function modalDisplay(modalData) {
  // Update the "movie-title" element with the retrieved title
  movieTitle.innerText = modalData.title;

  // Check if the plot is already available in modalData
  if (modalData.plot) {
    // Update the "movie-plot" element with the retrieved plot
    moviePlot.innerText = modalData.plot;
  } else {
    // If plot is not available in modalData, you can fetch it here
    var searchUrl = `https://api.themoviedb.org/3/search/movie?api_key=${tmdbAPI}&query=${modalData.title}`;

    fetch(searchUrl)
      .then(function (response) {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then(function (searchData) {
        if (searchData.results.length > 0) {
          var firstResult = searchData.results[0];
          var plot = firstResult.overview;
          // Update the "movie-plot" element with the retrieved plot
          moviePlot.innerText = plot;

          // Update the plot in modalData for future reference
          modalData.plot = plot;
        } else {
          // Handle the case where no results were found
          moviePlot.innerText = "No plot information available.";
        }
      })
      .catch(function (error) {
        console.error("Error fetching movie data:", error);
      });
  }
}

movieSearchButton.addEventListener("click", function () {
  // user's input from search
  var movieInputValue = movieInput.value;

  //clears search bar after click
  movieInput.value = "";

  var searchedMovie = `https://api.themoviedb.org/3/search/movie?api_key=${tmdbAPI}&query=${movieInputValue}`;

  fetch(searchedMovie)
    .then(function (response) {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then(function (data) {
      console.log(data);
      movieContainer.innerHTML = "";

      data.results.forEach(function (data) {
        var movieTitle = data.title;
        var moviePoster = data.poster_path;

        var movieDiv = document.createElement("div");
        movieDiv.classList.add("col-md-4");

        var posterBaseURL = "https://image.tmdb.org/t/p/w200";
        var moviePosterURL = posterBaseURL + moviePoster;
        var img = document.createElement('img')
        img.src = moviePosterURL 
        img.alt = movieTitle
        img.onerror = function() {
          this.src = movieImg
        }
        


        var modalData = {
          title: movieTitle,
          plot: "", // Initialize plot as empty
        };

        movieDiv.setAttribute("data-modal-title", modalData.title);
        movieDiv.setAttribute("data-modal-plot", modalData.plot);

        var movieCard = `
          <div class="movie-card" data-modal-data='${JSON.stringify(
            modalData
          )}'>
            <div class="card">
              <div class="card-header js-modal-trigger" data-target="modal-card">${movieTitle}</div>
              <div class="card-body">
                <p class="moviePoster"> <img src="${moviePosterURL}" alt="${movieTitle} Poster"></p>
              </div>
            </div>
          </div>
        `;

        movieDiv.innerHTML = movieCard;
        movieContainer.appendChild(movieDiv);

        movieDiv.addEventListener("click", function (event) {
          if (event.target.classList.contains("js-modal-trigger")) {
            var modalTitle = this.getAttribute("data-modal-title");
            var modalPlot = this.getAttribute("data-modal-plot");

            // Create the modalData object with title and plot
            var modalData = {
              title: modalTitle,
              plot: modalPlot,
            };

            // Pass the modalData to the modalDisplay function
            modalDisplay(modalData);

            // Fetch and update the plot data
            var searchUrl = `https://api.themoviedb.org/3/search/movie?api_key=${tmdbAPI}&query=${modalData.title}`;

            fetch(searchUrl)
              .then(function (response) {
                if (!response.ok) {
                  throw new Error("Network response was not ok");
                }
                return response.json();
              })
              .then(function (searchData) {
                if (searchData.results.length > 0) {
                  var firstResult = searchData.results[0];
                  modalData.plot = firstResult.overview;
                  // Update the "movie-plot" element with the retrieved plot
                  moviePlot.innerText = modalData.plot;
                } else {
                  // Handle the case where no results were found
                  modalData.plot = "No plot information available.";
                  // Update the "movie-plot" element with the message
                  moviePlot.innerText = modalData.plot;
                }
              })
              .catch(function (error) {
                console.error("Error fetching movie data:", error);
              });
            
              var youtubeLink = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${movieTitle}&key=${ytAPI}&maxResults=1`;

              console.log("Youtube API Request:", youtubeLink);
          
              fetch(youtubeLink)
              .then(function (response) {
                if (!response.ok) {
                  throw new Error("Network response was not ok");
                }
                return response.json();
              })
              .then(function (data) {
                // Assuming you want the first video from the search results
                if (data.items && data.items.length > 0) {
                  var videoId = data.items[0].id.videoId;
                  
                  // Create an iframe to embed the video
                  var iframe = document.createElement('iframe');
                  iframe.src = `https://www.youtube.com/embed/${videoId}`;
                  iframe.setAttribute("allowfullscreen", "allowfullscreen");
          
                  // Add the iframe to your modal or wherever you want to display the video
                  // Example: modalCard.appendChild(iframe);
                  document.getElementById("video-container").innerHTML = "";
          
                  document.getElementById("video-container").appendChild(iframe);
          
                } else {
                  // Handle the case where no video results were found
                  console.log("No video found for this movie.");
                }
              })
              .catch(function (error) {
                console.error("Error fetching video data:", error);
              });
            
            // Display the modal
            openModal(modalCard);
          }
        });
      });
    });
});
