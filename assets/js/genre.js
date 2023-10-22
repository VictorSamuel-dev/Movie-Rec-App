const apiKey = 'f1af2709945a3588fa0ae7c5d3f25da8';
const baseUrl = 'https://api.themoviedb.org/3';
const genreIds = {
    action: 28,
    comedy: 35,
    drama: 18,
    horror: 27,
    romance: 10749,
    // Add more genres as needed
};

// Function to fetch top movies for a specific genre
async function fetchTopMoviesByGenre(genre, genreId) {
    const response = await axios.get(`${baseUrl}/discover/movie`, {
        params: {
            api_key: apiKey,
            with_genres: genreId,
            sort_by: 'popularity.desc',
            page: 1,
        },
    });

    return response.data.results.slice(0, 5); // Get the top 5 movies
}

// Function to display movies in a genre container
async function displayTopMovies(genre) {
    const genreContainer = document.getElementById(genre);
    const movieList = document.getElementById(`${genre}-movies`);
    const genreId = genreIds[genre];

    try {
        const movies = await fetchTopMoviesByGenre(genre, genreId);
        movies.forEach(movie => {
            const listItem = document.createElement('li');
            listItem.textContent = movie.title;
            movieList.appendChild(listItem);
        });
    } catch (error) {
        console.error(`Error fetching data for ${genre}: ${error.message}`);
    }
}

// Call the displayTopMovies function for each genre
displayTopMovies('action');
// Call it for other genres as well



// Function to fetch top movies for a specific genre
async function fetchTopMoviesByGenre(genre, genreId) {
    try {
        const response = await axios.get(`${baseUrl}/discover/movie`, {
            params: {
                api_key: apiKey,
                with_genres: genreId,
                sort_by: 'popularity.desc',
                page: 1,
            },
        });

        return response.data.results.slice(0, 5); // Get the top 5 movies
    } catch (error) {
        throw new Error(`Error fetching data for ${genre}: ${error.message}`);
    }
}

// Function to display movies in a genre container
async function displayTopMovies(genre, genreId) {
    const genreContainer = document.getElementById(genre);
    const movieList = document.createElement('ul');
    movieList.classList.add('movie-list');
    genreContainer.appendChild(movieList);

    try {
        const movies = await fetchTopMoviesByGenre(genre, genreId);
        movies.forEach(movie => {
            const listItem = document.createElement('li');
            listItem.textContent = movie.title;
            movieList.appendChild(listItem);
        });
    } catch (error) {
        console.error(error);
    }
}

// Call the displayTopMovies function for each genre
for (const genre in genreIds) {
    if (genreIds.hasOwnProperty(genre)) {
        displayTopMovies(genre, genreIds[genre]);
    }
}


// Youtube API KEY    
        // Your YouTube API key
        const API_KEY = "AIzaSyDjoFhFJosMUmPbXNBr0L87PtX4_I4PJYk";

        function searchVideos() {
            const searchQuery = document.getElementById("searchQuery").value;
            const url = `https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&q=${searchQuery}&part=snippet&type=video`;

            fetch(url)
                .then(response => response.json())
                .then(data => {
                    displaySearchResults(data.items);
                })
                .catch(error => console.error(error));
        }

        function displaySearchResults(items) {
            const searchResults = document.getElementById("searchResults");
            searchResults.innerHTML = "";

            items.forEach(item => {
                const videoTitle = item.snippet.title;
                const videoId = item.id.videoId;
                const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;

                const videoLink = document.createElement("a");
                videoLink.href = videoUrl;
                videoLink.textContent = videoTitle;

                const resultItem = document.createElement("div");
                resultItem.appendChild(videoLink);

                searchResults.appendChild(resultItem);
            });
        }

        async function fetchTopMoviesByGenre(genre, genreId) {
            try {
                const response = await axios.get(`${baseUrl}/discover/movie`, {
                    params: {
                        api_key: apiKey,
                        with_genres: genreId,
                        sort_by: 'popularity.desc',
                        page: 1,
                    },
                });

                return response.data.results.slice(0, 5); // Get the top 5 movies
            } catch (error) {
                throw new Error(`Error fetching data for ${genre}: ${error.message}`);
            }
        }

        async function displayTopMovies() {
            const genreContainer = document.getElementById('genre-container');

            for (const genre in genreIds) {
                if (genreIds.hasOwnProperty(genre)) {
                    const movies = await fetchTopMoviesByGenre(genre, genreIds[genre]);
                    const genreDiv = document.createElement('div');
                    genreDiv.innerHTML = `<h2>${genre}</h2><ul>${movies.map(movie => `<li>${movie.title}</li>`).join('')}</ul>`;
                    genreContainer.appendChild(genreDiv);
                }
            }
        }

        displayTopMovies();
   

