document.addEventListener("DOMContentLoaded", () => {
    
    let lastQuerry = {};
    const movies = [];
    class Movie {
        constructor(id, title, rank, rankerName, post) {
            this.id = id;
            this.title = title;
            this.rank = rank;
            this.rankerName = rankerName;
            this.post = post;
            
        }
    }



    document.getElementById("search").addEventListener("click", () => {
        searchMovies();
    });
    

    async function searchMovies() {
        const query = document.getElementById('searchQuery').value;
        const type = document.querySelector('input[name="searchType"]:checked').value;
        console.log("Search Type:", type);  // Ensure the correct type is logged before making the request
        const response = await fetch(`/movies/search?query=${query}&type=${type}`);
        const data = await response.json();
        console.log('Movies Data:', data);  // Log the entire response from server
      
        const resultsDiv = document.getElementById('results');
        resultsDiv.innerHTML = '';
        
        if (data.movies) {
          data.movies.forEach(movie => {
            console.log(`Movie: ${movie.title}`, movie.ratings); // Log all ratings for the movie
            
            const movieElement = document.createElement('div');
            movieElement.innerHTML = `
              <h3>${movie.title} (${movie.year})</h3>
              <img src="${movie.poster}" alt="${movie.title} Poster" width="200" data-id="${movie.id}" data-title="${movie.title}" />
              <p>Rating: ${movie.rating ? movie.rating : 'No rating yet'}</p>
            `;
            
            const avgRating = movie.ratings && movie.ratings.length 
              ? Math.round(movie.ratings.reduce((sum, r) => sum + r.rating, 0) / movie.ratings.length) 
              : 'No rating yet';

            console.log(`Average Rating for ${movie.title}:`, avgRating); // Debugging avg rating
            resultsDiv.appendChild(movieElement);
            
            const movieImg = movieElement.querySelector('img');
            movieImg.addEventListener('click', () => rateItem('movie', movie.id, movie.title));
          });
        } 
        
        else if (data.people) {
          data.people.forEach(person => {
            console.log(`Person: ${person.name}`, person.ratings); // Log all ratings for the person
            
            const personElement = document.createElement('div');
            personElement.innerHTML = `
              <h3>${person.name}</h3>
              <img src="${person.profile}" alt="${person.name} Profile" width="200" data-id="${person.id}" data-name="${person.name}" />
              <p>Rating: ${person.rating ? person.rating : 'No rating yet'}</p>
            `;

            const avgRating = person.ratings && person.ratings.length 
              ? Math.round(person.ratings.reduce((sum, r) => sum + r.rating, 0) / person.ratings.length) 
              : 'No rating yet';
            
            console.log(`Average Rating for ${person.name}:`, avgRating); // Debugging avg rating
            resultsDiv.appendChild(personElement);
      
            const personImg = personElement.querySelector('img');
            personImg.addEventListener('click', () => rateItem('person', person.id, person.name));
          });
        } 
        
        else {
          alert('No results found.');
        }
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