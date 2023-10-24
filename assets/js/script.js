// nick youtube api key: AIzaSyBWrhCB3guqUxUZxZX8HvCsGdb9BwsCyU0
// nick tmdb api key: 2ed376b49026ee5ba769954152774c28
// madison youtube api key:
// victor youtube api key: AIzaSyDjoFhFJosMUmPbXNBr0L87PtX4_I4PJYk
//victor tmdb api key: f1af2709945a3588fa0ae7c5d3f25da8



var tmdbAPI = "2ed376b49026ee5ba769954152774c28";
var ytAPI = "AIzaSyBWrhCB3guqUxUZxZX8HvCsGdb9BwsCyU0";
var movieSearchButton = document.getElementById("search-button");
var movieInput = document.getElementById("movie-input");
var movieContainer = document.getElementById("movie-container");
var modalVideo = document.getElementById("video-container");
var modalCard = document.getElementById("modal-card");
var movieTitle = document.getElementById("movie-title");
var moviePlot = document.getElementById("movie-plot");
// var movieImg = '../assets/images/dummy.png'
var genreCard = document.getElementById("genre-container")

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

  if (genreCard) {
    genreCard.style.display = "none";
  }

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
        var vote_average = data.vote_average;
        var overview = data.overview

        var movieDiv = document.createElement("div");
        movieDiv.classList.add("col-md-4");

        var posterBaseURL = "https://image.tmdb.org/t/p/w200";
        var moviePosterURL = posterBaseURL + moviePoster;
        // var img = document.createElement('img')
        // img.src = moviePosterURL 
        // img.alt = movieTitle
        // img.onerror = function() {
        // //   this.src = movieImg
        // }
        


        var modalData = {
          title: movieTitle,
          plot: "", // Initialize plot as empty
        };

        movieDiv.setAttribute("data-modal-title", modalData.title);
        movieDiv.setAttribute("data-modal-plot", modalData.plot);

        // const movieEl = document.createElement('div');
        movieDiv.classList.add('movie');
        movieDiv.innerHTML = `
                <img src="${moviePoster ? moviePosterURL : "./assets/images/dummy.png"}" alt="${movieTitle}">

                <div class="movie-info">
                    <h3 class="js-modal-trigger card-header" data-target="modal-card">${movieTitle}</h3>
                    <span class="${getColor(vote_average)}">${vote_average}</span>
                </div>
                   `

        // var movieCard = `
        //   <div class="movie-card" data-modal-data='${JSON.stringify(
        //     modalData
        //   )}'>
        //     <div class="card">
        //       <div class="card-header js-modal-trigger" data-target="modal-card">${movieTitle}</div>
        //       <div class="card-body">
        //         <p class="moviePoster"> <img src="${moviePosterURL}" alt="${movieTitle} Poster"></p>
        //       </div>
        //     </div>
        //   </div>
        // `;

        // movieDiv.innerHTML = movieEl;
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

//Victor's JS code
const API_KEY = 'api_key=2ed376b49026ee5ba769954152774c28';
const BASE_URL = 'https://api.themoviedb.org/3/'
const API_URL = BASE_URL + '/discover/movie?sort_by=popularity.desc&'+API_KEY;
const IMG_URL = 'https://image.tmdb.org/t/p/w500'

//Trial to add genre buttons on top (front page)
//Also, this sections allows us to filter by genre
const genres = [
    {"id": 28,
    "name": "Action"
    },
    {"id": 35,
    "name": "Comedy"
    },
    {"id": 18,
    "name": "Drama"
    },
    {"id":27,
    "name": "Horror"
    },
    {"id":10749,
    "name": "Romance"
    },
];

const main = document.getElementById('genre-container');
const tagsEl = document.getElementById('tags');

var selectedGenre = []
setGenre();
function setGenre() {
    tagsEl.innerHTML = '';
    genres.forEach(genre => {
        const t = document.createElement('div');
        t.classList.add('tag');
        t.id = genre.id;
        t.innerText = genre.name;
        t.addEventListener('click', () => {
            if(selectedGenre.length == 0){
                selectedGenre.push(genre.id);
            }else{
                if(selectedGenre.includes(genre.id)){
                    selectedGenre.forEach((id, index) => {
                        if(id == genre.id){
                            selectedGenre.splice(index, 1);
                        }
                    })
                }else{
                    selectedGenre.push(genre.id);
                }
            }
            console.log(selectedGenre)
            getMovies(API_URL + '&with_genres=' + encodeURI(selectedGenre.join(',')))
            highlightSelection()
        });
        tagsEl.append(t);

    })
}
//Add and Remove highlight when each genres are clicked
function highlightSelection() {
    const tags = document.querySelectorAll('.tag');
    tags.forEach(tag => {
        tag.classList.remove('highlight')
    })
    clearBtn()
    if(selectedGenre.length !=0) {
        selectedGenre.forEach(id => {
            const highlightedTag = document.getElementById(id);
            highlightedTag.classList.add('highlight');
        })
    }
    
}

//Add clear button to tag, which would reset the filter
function clearBtn(){
    let clearBtn = document.getElementById('clear');
    if(clearBtn){
        clearBtn.classList.add('highlight')
    }else{

        let clear = document.createElement('div');
        clear.classList.add('tag','highlight');
        clear.id = 'clear';
        clear.innerText = 'Clear x';
        clear.addEventListener('click',() => {
            selectedGenre = [];
            setGenre();
            getMovies(API_URL);
        })
        tagsEl.append(clear);
    }
}

getMovies(API_URL);
//End of Trial code to add buttons/end of filter



getMovies(API_URL);

function getMovies(url) {

    fetch(url).then(res => res.json()).then(data => {
        console.log(data.results)
        if(data.results.length !==0){
            showMovies(data.results);
        }else{
            main.innerHTML= `<h1 class="no-results">No Results Found</h1>`
        }
        
    })
}

function showMovies(data) {
    main.innerHTML = '';

    data.forEach(movie => {
        const {title, poster_path, vote_average, overview} = movie
        const movieEl = document.createElement('div');
        movieEl.classList.add('movie');
        movieEl.innerHTML = `
            <img src="${poster_path? IMG_URL+poster_path: "http://via.placeholder.com/1080x1580"}" alt="${title}">

            <div class="movie-info">
                <h3>${title}</h3>
                <span class="${getColor(vote_average)}">${vote_average}</span>
            </div>

            <div class="overview">
                <h3>overview</h3> 
                ${overview}
            </div>
        `

        main.appendChild(movieEl);
    })

}

function getColor(vote) {
    if(vote>= 8){
        return 'green'
    }else if(vote >= 5){
        return "orange"
    }else{
        return 'red'
    }
}
