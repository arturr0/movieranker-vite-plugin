document.addEventListener("DOMContentLoaded", () => {
    
    const query = document.getElementById('searchQuery').value;
    const searchContent = document.getElementById("searchContent");
    const ranksContainer = document.getElementById("ranks");
    const rankImg = document.getElementById("rankImg");
    const rankTitle = document.getElementById("title");
    const rankAvg = document.getElementById("rank");
    const rankPosts = document.getElementById("posts");
    const sendPost = document.getElementById("sendPost");
    const tooltip = document.getElementById("tooltip");
    const searchQuery = document.getElementById('searchQuery');
    const searchContainer = document.getElementById('searchContainer');
    const starsInfo = document.getElementById('starsInfo');
    const votesInfo = document.getElementById('votesInfo');

    const magnifier = document.getElementById('magnifier');
 
    magnifier.addEventListener('click', function() {
        const query = document.getElementById('searchQuery').value;
        console.log("query", query);
        if (query !== null && query.trim() !== '') {
            searchMovies();
        }
    });
// Detect if the input is focused
    searchQuery.addEventListener('focus', () => {
        console.log('Input is active (focused)');
        searchContainer.style.border = '4px solid black';
        searchContainer.style.padding = '8px';

        // Add custom styles or classes here if needed
    });

    // Detect when the input loses focus
    searchQuery.addEventListener('blur', () => {
        console.log('Input is not active (blurred)');
        searchContainer.style.border = '2px solid black'
        searchContainer.style.padding = '10px';

        // Remove custom styles or classes here if needed
    });
    document.addEventListener('keydown', function(event) {
        console.log('Event listener registered');
        const query = document.getElementById('searchQuery').value;
        console.log("query", query);
        if (event.key === 'Enter' && query !== null && query.trim() !== '') {
            console.log("enter");
            searchMovies();
        }
    });
    
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

    

    document.getElementById("sendPost").addEventListener("click", () => {
        rateItem(sendPost.getAttribute("type"), parseInt(sendPost.getAttribute("id")), sendPost.getAttribute("title"));
        
    });

    document.getElementById("cancel").addEventListener("click", () => {
        searchContent.style.display = 'block';
        ranksContainer.style.display = 'none';
        rankPosts.innerHTML = '';
        
    });

    async function searchMovies() {
        const query = document.getElementById('searchQuery').value;
        const type = document.querySelector('input[name="searchType"]:checked').value;
        console.log("Search Type:", type);
    
        const response = await fetch(`/movies/search?query=${query}&type=${type}`);
        const data = await response.json();
        console.log('Movies Data:', data);
    
        moviesRanks.length = 0;
        peopleRanks.length = 0;
    
        const resultsDiv = document.getElementById('results');
        resultsDiv.innerHTML = '';
    
        if (data.movies) {
            data.movies.forEach(movie => {
                if (!movie.poster) return;
                resultsDiv.appendChild(createItemElement(movie, 'movie'));
            });
            equalizeTitleHeights();
        } else if (data.people) {
            data.people.forEach(person => {
                if (!person.profile) return;
                resultsDiv.appendChild(createItemElement(person, 'person'));
            });
            equalizeTitleHeights();
        } else {
            alert('No results found.');
        }
    
        console.log("Movies Ranks Array:", moviesRanks);
        console.log("People Ranks Array:", peopleRanks);
    }
    
    function createItemElement(item, type) {
        const itemElement = document.createElement('div');
        itemElement.classList.add('item');
        itemElement.innerHTML = `
            <h3 class="title" data-title="${type === 'movie' ? `${item.title} (${item.year})` : item.name}">
                ${type === 'movie' ? `${item.title} (${item.year})` : item.name}
            </h3>
            <div class="img" style="background-image: url(${type === 'movie' ? item.poster : item.profile});"></div>`;
    
        if (item.ratings) {
            item.ratings.forEach(rank => {
                const rankedItem = type === 'movie' 
                    ? new Movie(item.id, item.title, rank.rating, rank.userEmail, rank.comment) 
                    : new Person(item.id, item.name, rank.rating, rank.userEmail, rank.comment);
                
                type === 'movie' ? moviesRanks.push(rankedItem) : peopleRanks.push(rankedItem);
            });
        }
    
        const voteCount = item.ratings ? item.ratings.length : 0;
        const voteText = voteCount === 1 ? '1 vote' : `${voteCount} votes`;
        const avgRating = item.ratings && item.ratings.length
            ? Math.round(item.ratings.reduce((sum, r) => sum + r.rating, 0) / item.ratings.length)
            : 'No rating yet';
    
        const votesElement = document.createElement('p');
        votesElement.classList.add('votesNo');
        votesElement.textContent = voteText;
    
        const ratingElement = createRatingElement(avgRating);
    
        itemElement.appendChild(votesElement);
        itemElement.appendChild(ratingElement);
    
        itemElement.querySelector('.img').addEventListener('click', () => handleItemClick(item, type, avgRating, voteText));
        
        return itemElement;
    }
    
    function createRatingElement(avgRating) {
        const ratingElement = document.createElement('div');
        ratingElement.classList.add('ratedStars');
    
        for (let i = 0; i < 5; i++) {
            const star = document.createElement("span");
            star.style.color = i < avgRating ? "gold" : "gray";
            star.innerHTML = "&#9733;";
            ratingElement.appendChild(star);
        }
    
        return ratingElement;
    }
    
    function handleItemClick(item, type, avgRating, voteText) {
        const rankedItems = type === 'movie' ? moviesRanks : peopleRanks;
        const clickedItem = rankedItems.filter(rank => rank.id === item.id);
        console.log(`Clicked ${type} Data:`, clickedItem);
    
        rankTitle.textContent = type === 'movie' ? item.title : item.name;
        rankAvg.textContent = avgRating;
        rankPosts.innerHTML = '';
        votesInfo.textContent = voteText;
    
        clickedItem.forEach(post => {
            const postDiv = document.createElement("div");
            postDiv.classList.add("post");
            postDiv.setAttribute("user", post.rankerName);
    
            const user = document.createElement("p");
            user.textContent = post.rankerName;
            
            const postRank = document.createElement("div");
            postRank.textContent = post.rank;
            
            const postText = document.createElement("p");
            postText.textContent = post.post;
    
            postDiv.appendChild(user);
            postDiv.appendChild(postRank);
            postDiv.appendChild(postText);
    
            rankPosts.appendChild(postDiv);
        });
    
        starsInfo.innerHTML = '';
        starsInfo.appendChild(createRatingElement(avgRating));
        searchContent.style.display = 'none';
        rankImg.src = type === 'movie' ? item.poster : item.profile;
        ranksContainer.style.display = 'block';
    
        sendPost.setAttribute("type", type);
        sendPost.setAttribute("id", item.id);
        sendPost.setAttribute("title", type === 'movie' ? item.title : item.name);
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
                        post: document.getElementById('writePost').value,
                    }),
                });

                const data = await response.json();
                if (data.success) {
                    alert('Thank you for your rating!');
                    
                    await searchMovies();  // Wait until moviesRanks is updated
                    
                    const clickedMovie = moviesRanks.filter(movieRank => movieRank.id === parseInt(sendPost.getAttribute("id")));
                    console.log(clickedMovie);
                    const avgRating = Math.round(
                        clickedMovie.reduce((sum, movie) => sum + movie.rank, 0) / clickedMovie.length
                    );
                    rankAvg.textContent = avgRating; 
                    rankPosts.innerHTML = ''; // Clear previous posts
                    clickedMovie.forEach(moviePost => {
                        const postDiv = document.createElement("div");
                        const user = document.createElement("p");
                        user.textContent = moviePost.rankerName;
                        rankPosts.appendChild(postDiv);
                        const postRank = document.createElement("div");
                        postRank.textContent = moviePost.rank;
                        postDiv.classList.add("post");
                        postDiv.setAttribute("user", moviePost.rankerName);
                        const post = document.createElement("p");
                        post.textContent = moviePost.post;
                        postDiv.appendChild(user);
                        postDiv.appendChild(postRank);
                        postDiv.appendChild(post);
                    });
                }

            } catch (error) {
                console.error('Error rating item:', error);
            }
        } else {
            alert('Invalid rating! Please provide a number between 1 and 5.');
        }
    }
    // document.getElementById('results').addEventListener('mouseover', (e) => {
    //     if (e.target.classList.contains("title")) {
    //         // Check if text overflows
    //         if (e.target.scrollWidth > e.target.clientWidth) {
    //             tooltip.textContent = e.target.getAttribute("data-title");
    //             tooltip.style.display = "block";
    //             tooltip.style.position = "absolute";
                
    //             // Update position on hover
    //             updateTooltipPosition(e);
    //         }
    //     }
    // });
    
    // document.getElementById('results').addEventListener('mousemove', (e) => {
    //     if (e.target.classList.contains("title")) {
    //         updateTooltipPosition(e);
    //     }
    // });
    
    // document.getElementById('results').addEventListener('mouseout', (e) => {
    //     if (e.target.classList.contains("title")) {
    //         tooltip.style.display = "none";
    //     }
    // });
    
    // // Function to update the tooltip position
    // function updateTooltipPosition(e) {
    //     const tooltipRect = tooltip.getBoundingClientRect();
    //     const viewportWidth = window.innerWidth;
    //     const viewportHeight = window.innerHeight;
    //     const documentScrollTop = window.scrollY;  // Get the current page scroll
    
    //     // Get the mouse position relative to the document
    //     let tooltipX = e.pageX + 10; // Offset 10px to the right of the cursor
    //     let tooltipY = e.pageY + 20; // Offset 20px below the cursor
    
    //     // Check if the tooltip would overflow horizontally (on the right side)
    //     if (tooltipX + tooltipRect.width > viewportWidth) {
    //         tooltipX = viewportWidth - tooltipRect.width - 10; // Adjust to the left if it overflows on the right
    //     }
    
    //     // Check if the tooltip would overflow vertically (on the bottom)
    //     if (tooltipY + tooltipRect.height > viewportHeight + documentScrollTop) {
    //         tooltipY = (viewportHeight + documentScrollTop) - tooltipRect.height - 10; // Adjust upwards if it overflows on the bottom
    //     }
    
    //     tooltip.style.left = `${tooltipX}px`;
    //     tooltip.style.top = `${tooltipY}px`;
    
    //     // Ensure the tooltip stays within the document boundaries even when scrolling
    //     if (tooltipY + tooltipRect.height > documentScrollTop + viewportHeight) {
    //         tooltip.style.transform = `translateY(-${tooltipRect.height + 10}px)`;
    //     } else {
    //         tooltip.style.transform = "none"; // Reset if the tooltip fits within the screen
    //     }
    // }
    function equalizeTitleHeights() {
        const titles = document.querySelectorAll('.title');
        const rows = getRows(titles);  // Group titles by their rows
    
        rows.forEach(row => {
            let maxHeight = 0;
    
            // Find the maximum height in the current row
            row.forEach(title => {
                const height = title.offsetHeight;
                if (height > maxHeight) {
                    maxHeight = height;
                }
            });
    
            // Set all titles in this row to the maximum height
            row.forEach(title => {
                title.style.height = `${maxHeight}px`;
            });
        });
    }
    
    function getRows(titles) {
        const rows = [];
        let currentRow = [];
        let lastTop = null;
    
        // Group titles based on their vertical position (top offset)
        titles.forEach(title => {
            const titleTop = title.getBoundingClientRect().top;
    
            if (lastTop === null || Math.abs(titleTop - lastTop) < 10) {
                currentRow.push(title);  // Titles in the same row
            } else {
                rows.push(currentRow);  // Move to the next row
                currentRow = [title];    // Start a new row
            }
    
            lastTop = titleTop;
        });
    
        // Push the last row into rows
        if (currentRow.length > 0) {
            rows.push(currentRow);
        }
    
        return rows;
    }
    
    // Call the function when the page loads or after any content update
    //window.addEventListener('load', equalizeTitleHeights);
    //window.addEventListener('resize', equalizeTitleHeights); // Optionally add for responsive layout changes
    
    
});
