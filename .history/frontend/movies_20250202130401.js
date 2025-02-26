document.addEventListener("DOMContentLoaded", () => {

    let lastQuery = {};
    const moviesRanks = [];
    const peopleRanks = [];
    class Item {
        constructor(id, title, rank, rankerName, post) {
            this.id = id;
            this.title = title;
            this.rank = rank;
            this.rankerName = rankerName;
            this.post = post;
        }
    }

    class Movie extends Item {}
    class Person extends Item {}

    document.getElementById("search").addEventListener("click", () => {
        searchMovies();
    });

    async function searchMovies() {
        const query = document.getElementById('searchQuery').value;
        const type = document.querySelector('input[name="searchType"]:checked').value;
        console.log("Search Type:", type);
        const response = await fetch(`/movies/search?query=${query}&type=${type}`);
        const data = await response.json();
        console.log('Movies Data:', data);

        const resultsDiv = document.getElementById('results');
        resultsDiv.innerHTML = '';

        if (data.movies) {
            data.movies.forEach(movie => {
                console.log(`Movie: ${movie.title}`, movie.ratings);

                const movieElement = document.createElement('div');
                movieElement.innerHTML = `
                  <h3>${movie.title} (${movie.year})</h3>
                  <img src="${movie.poster}" alt="${movie.title} Poster" width="200" data-id="${movie.id}" data-title="${movie.title}" />
                  <p>Rating: ${movie.rating ? movie.rating : 'No rating yet'}</p>
                `;

                if (movie.ratings) {
                    movie.ratings.forEach(rank => {
                        const rankMovie = new Movie(movie.id, movie.title, rank.rating, rank.userEmail, "post");
                        moviesRanks.push(rankMovie);
                    });
                }

                const avgRating = movie.ratings && movie.ratings.length
                  ? Math.round(movie.ratings.reduce((sum, r) => sum + r.rating, 0) / movie.ratings.length)
                  : 'No rating yet';

                console.log(`Average Rating for ${movie.title}:`, avgRating);
                resultsDiv.appendChild(movieElement);

                const movieImg = movieElement.querySelector('img');
                movieImg.addEventListener('click', () => {
                    // Log clicked movie data from moviesRanks
                    const clickedMovie = moviesRanks.find(movieRank => movieRank.id === movie.id);
                    console.log('Clicked Movie Data:', clickedMovie);
                    rateItem('movie', movie.id, movie.title);
                });
            });
        } else if (data.people) {
            data.people.forEach(person => {
                console.log(`Person: ${person.name}`, person.ratings);

                const personElement = document.createElement('div');
                personElement.innerHTML = `
                  <h3>${person.name}</h3>
                  <img src="${person.profile}" alt="${person.name} Profile" width="200" data-id="${person.id}" data-name="${person.name}" />
                  <p>Rating: ${person.rating ? person.rating : 'No rating yet'}</p>
                `;

                if (person.ratings) {
                    person.ratings.forEach(rank => {
                        const rankPerson = new Person(person.id, person.name, rank.rating, rank.userEmail, "post");
                        peopleRanks.push(rankPerson);
                    });
                }

                const avgRating = person.ratings && person.ratings.length
                  ? Math.round(person.ratings.reduce((sum, r) => sum + r.rating, 0) / person.ratings.length)
                  : 'No rating yet';

                console.log(`Average Rating for ${person.name}:`, avgRating);
                resultsDiv.appendChild(personElement);

                const personImg = personElement.querySelector('img');
                personImg.addEventListener('click', () => {
                    // Log clicked person data from peopleRanks
                    const clickedPerson = peopleRanks.find(personRank => personRank.id === person.id);
                    console.log('Clicked Person Data:', clickedPerson);
                    rateItem('person', person.id, person.name);
                });
            });
        } else {
            alert('No results found.');
        }
        console.log("Movies Ranks Array:", moviesRanks);
        console.log("People Ranks Array:", peopleRanks);
    }

    async function rateItem(type, id, title) {
        const token = localStorage.getItem('jwt');
        const rating = prompt(`Please rate this ${type}: ${title}`);

        if (rating && !isNaN(rating) && rating >= 1 && rating <= 5) {
            try {
                const response = await fetch(`http://localhost:3000/movies/rate`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        type,      // "movie" or "person"
                        id,        // TMDB ID of the movie/person
                        title,     // Title or name of the movie/person
                        rating: parseInt(rating),  // Rating from user
                    }),
                });

                const data = await response.json();
                if (data.success) {
                    alert('Thank you for your rating!');
                } else {
                    alert('Failed to save your rating.');
                }
            } catch (error) {
                console.error('Error rating item:', error);
            }
        } else {
            alert('Invalid rating! Please provide a number between 1 and 5.');
        }
    }
});
