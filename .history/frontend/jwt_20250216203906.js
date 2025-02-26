console.log("jwt");
async function fetchMovies() {
	const token = localStorage.getItem('jwt');
	if (!token) {
		window.location.href = '/';
		return;
	}
	
	try {
		const response = await fetch('http://localhost:3000/movies/protected', {
			method: 'GET',
			headers: {
				'Authorization': `Bearer ${token}`,
				'Content-Type': 'application/json',
			},
		});
		
		if (!response.ok) return;
		
		window.userData = await response.json();
		document.dispatchEvent(new Event('userDataReady')); // Trigger event
		
	} catch (error) {
		console.error('Error during fetch:', error);
	}
}

window.onload = fetchMovies;
